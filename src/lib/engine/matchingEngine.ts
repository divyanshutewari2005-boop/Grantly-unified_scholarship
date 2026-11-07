/**
 * GRANTLY Rule-Based Matching Engine
 * 
 * Philosophy: Pure, explainable logic with 0 black-box scores.
 * Computes deterministic eligibility states and human-readable advice.
 */

import { Scholarship, EligibilityRule } from '../../data/mockScholarships.ts';
import { differenceInCalendarDays, parseISO, isValid } from 'date-fns';

export interface StudentProfile {
  name: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  state: string; // Domicile state, e.g. "Uttarakhand"
  domicileCertificateNumber?: string;
  educationLevel: string; // e.g. "Undergraduate (UG)"
  course: string; // e.g. "B.Tech in Computer Science"
  courseType?: 'Technical' | 'General' | 'Medical' | 'Management' | 'Vocational';
  institution?: string;
  institutionType?: 'Government' | 'Private' | 'Autonomous' | 'Aided';
  academicYear?: string; // e.g. "1st Year"
  percentage?: number; // e.g. 82.4
  board?: string; // e.g. "CBSE", "Uttarakhand Board"
  annualIncome: number; // in INR, e.g. 240000
  hasIncomeCertificate: boolean;
  category: string; // e.g. "General", "OBC (Non-Creamy Layer)", "SC", "ST", "EWS"
  disabilityStatus?: boolean;
  preferredTypes?: string[]; // e.g. ["Government", "Private", "State"]
  language?: 'en' | 'hi';
}

export type RuleResult = 'pass' | 'fail' | 'unknown';

export interface EvaluatedRuleReason {
  ruleId: string;
  label: string;
  result: RuleResult;
  detail: string;
  hint?: string;
  actualValue?: any;
  requiredValue?: any;
}

export interface EvaluatedScholarship {
  scholarship: Scholarship;
  status: 'Eligible' | 'Needs Verification' | 'Not Eligible';
  reasons: EvaluatedRuleReason[];
  failedRulesCount: number;
  unknownRulesCount: number;
  passedRulesCount: number;
  whatWouldMakeEligible?: string; // Actionable hint when 1-2 rules fail
  isExpired: boolean;
  daysRemaining: number;
}

export interface RankedScholarship extends EvaluatedScholarship {
  internalPriorityScore: number;
  whyRecommended: string;
}

export interface MatchBuckets {
  eligible: RankedScholarship[];
  needsVerification: RankedScholarship[];
  notEligible: RankedScholarship[];
  expired: RankedScholarship[];
  totalActiveMatches: number;
}

/**
 * Evaluates a single scholarship against a student's profile.
 */
export function evaluateScholarship(
  profile: StudentProfile | null | undefined,
  scholarship: Scholarship
): EvaluatedScholarship {
  const today = new Date();
  let daysRemaining = 999;
  let isExpired = false;

  try {
    const deadlineDate = parseISO(scholarship.deadline);
    if (isValid(deadlineDate)) {
      daysRemaining = differenceInCalendarDays(deadlineDate, today);
      isExpired = daysRemaining < 0;
    }
  } catch {
    daysRemaining = 0;
  }

  const rules = scholarship.eligibilityRules || [];
  const reasons: EvaluatedRuleReason[] = [];

  for (const rule of rules) {
    if (!profile) {
      reasons.push({
        ruleId: rule.id,
        label: rule.label,
        result: 'unknown',
        detail: 'Profile information not provided yet.',
        requiredValue: rule.value
      });
      continue;
    }

    // Resolve profile value with flexible aliases
    let studentVal = (profile as any)[rule.field];
    if (studentVal === undefined) {
      if (rule.field === 'minPercentage') studentVal = profile.percentage;
      else if (rule.field === 'maxIncome') studentVal = profile.annualIncome;
      else if (rule.field === 'state') studentVal = profile.state;
      else if (rule.field === 'educationLevel') studentVal = profile.educationLevel;
      else if (rule.field === 'courseType') studentVal = profile.courseType || profile.course;
      else if (rule.field === 'institutionType') studentVal = profile.institutionType;
    }

    // Missing profile field check
    if (studentVal === undefined || studentVal === null || studentVal === '') {
      reasons.push({
        ruleId: rule.id,
        label: rule.label,
        result: 'unknown',
        detail: `Profile missing "${rule.field}".`,
        hint: `Complete your profile's ${rule.field} to verify.`,
        requiredValue: rule.value
      });
      continue;
    }

    let result: RuleResult = 'fail';
    let detail = '';
    let hint: string | undefined;

    switch (rule.operator) {
      case 'gte': {
        const numStudent = Number(studentVal);
        const numReq = Number(rule.value);
        if (numStudent >= numReq) {
          result = 'pass';
          detail = `Satisfied: You have ${numStudent} (Minimum required: ${numReq}).`;
        } else {
          result = 'fail';
          detail = `Requires minimum ${numReq} (Your profile: ${numStudent}).`;
          hint = `Requires ${numReq}% or higher score in the qualifying exam.`;
        }
        break;
      }

      case 'lte': {
        const numStudent = Number(studentVal);
        const numReq = Number(rule.value);
        if (numStudent <= numReq) {
          result = 'pass';
          detail = `Satisfied: Family income ₹${numStudent.toLocaleString('en-IN')} is within ceiling ₹${numReq.toLocaleString('en-IN')}.`;
        } else {
          result = 'fail';
          detail = `Income exceeds ₹${numReq.toLocaleString('en-IN')} cap (Your profile: ₹${numStudent.toLocaleString('en-IN')}).`;
          hint = `Family income limit is ₹${(numReq / 100000).toFixed(1)} Lakh/year; yours is ₹${(numStudent / 100000).toFixed(1)} Lakh.`;
        }
        break;
      }

      case 'equals': {
        if (rule.field === 'state') {
          const isMatch = rule.value === 'All India' || String(studentVal).toLowerCase() === String(rule.value).toLowerCase();
          result = isMatch ? 'pass' : 'fail';
          detail = isMatch
            ? `Satisfied: Resident of ${studentVal}.`
            : `Only for permanent residents of ${rule.value} (Your state: ${studentVal}).`;
          if (!isMatch) {
            hint = `Requires valid permanent domicile of ${rule.value}.`;
          }
        } else {
          const isMatch = String(studentVal).toLowerCase() === String(rule.value).toLowerCase();
          result = isMatch ? 'pass' : 'fail';
          detail = isMatch
            ? `Satisfied: ${rule.label}.`
            : `Requires ${rule.value} (Your profile: ${studentVal}).`;
          if (!isMatch) {
            hint = `Open specifically for ${rule.value} students.`;
          }
        }
        break;
      }

      case 'in': {
        const allowedList: any[] = Array.isArray(rule.value) ? rule.value : [rule.value];
        const isMatch = allowedList.some(
          (item) => String(item).toLowerCase() === String(studentVal).toLowerCase()
        );
        result = isMatch ? 'pass' : 'fail';
        detail = isMatch
          ? `Satisfied: Enrolled in eligible stream (${studentVal}).`
          : `Eligible for: ${allowedList.join(', ')} (Your profile: ${studentVal}).`;
        if (!isMatch) {
          hint = `Scheme covers ${allowedList.join(', ')}.`;
        }
        break;
      }

      case 'boolean': {
        const isMatch = Boolean(studentVal) === Boolean(rule.value);
        result = isMatch ? 'pass' : 'fail';
        detail = isMatch ? 'Requirement verified.' : 'Condition not satisfied.';
        break;
      }

      default: {
        result = 'unknown';
        detail = 'Unsupported rule condition.';
      }
    }

    reasons.push({
      ruleId: rule.id,
      label: rule.label,
      result,
      detail,
      hint,
      actualValue: studentVal,
      requiredValue: rule.value
    });
  }

  const failedCount = reasons.filter((r) => r.result === 'fail').length;
  const unknownCount = reasons.filter((r) => r.result === 'unknown').length;
  const passedCount = reasons.filter((r) => r.result === 'pass').length;

  let status: 'Eligible' | 'Needs Verification' | 'Not Eligible' = 'Eligible';
  let whatWouldMakeEligible: string | undefined;

  if (failedCount > 0) {
    status = 'Not Eligible';
    // Single or dual failure hint
    const failedList = reasons.filter((r) => r.result === 'fail');
    if (failedList.length === 1 && failedList[0].hint) {
      whatWouldMakeEligible = failedList[0].hint;
    } else if (failedList.length > 1) {
      whatWouldMakeEligible = `${failedList.length} criteria unmet: ${failedList.map((f) => f.label).join('; ')}.`;
    }
  } else if (unknownCount > 0) {
    status = 'Needs Verification';
    const unknownList = reasons.filter((r) => r.result === 'unknown');
    whatWouldMakeEligible = `Missing ${unknownList.map((u) => u.label).join(', ')} in your profile.`;
  }

  return {
    scholarship,
    status,
    reasons,
    failedRulesCount: failedCount,
    unknownRulesCount: unknownCount,
    passedRulesCount: passedCount,
    whatWouldMakeEligible,
    isExpired,
    daysRemaining
  };
}

/**
 * Computes an internal ranking score and generates human-readable whyRecommended text.
 * Never displays score as a percentage!
 */
export function rankScholarships(
  profile: StudentProfile | null | undefined,
  evaluatedList: EvaluatedScholarship[],
  documentStatuses?: Record<string, 'Ready' | 'Pending' | 'Not Applicable'>
): RankedScholarship[] {
  return evaluatedList.map((item) => {
    let score = 0;

    // 1. Base eligibility weight
    if (item.status === 'Eligible') score += 10000;
    else if (item.status === 'Needs Verification') score += 4000;
    else score += 100;

    // 2. Expired penalty
    if (item.isExpired) {
      score -= 20000;
    } else {
      // 3. Deadline proximity boost (closing in 1 to 15 days is prioritized)
      if (item.daysRemaining >= 0 && item.daysRemaining <= 7) {
        score += 3000;
      } else if (item.daysRemaining <= 21) {
        score += 1500;
      }
    }

    // 4. Benefit magnitude (log-scaled)
    score += Math.min(2000, Math.round(item.scholarship.annualAmount / 100));

    // 5. Document readiness for this scholarship
    let readyDocs = 0;
    const totalDocs = item.scholarship.documents.length;
    if (documentStatuses) {
      for (const doc of item.scholarship.documents) {
        if (documentStatuses[doc.id] === 'Ready') {
          readyDocs++;
        }
      }
      score += readyDocs * 200;
    }

    // 6. User preference alignment
    if (profile?.preferredTypes?.includes(item.scholarship.type)) {
      score += 500;
    }

    // Generate concise human-readable "why recommended"
    let why = '';
    if (item.status === 'Eligible') {
      const docNote = totalDocs > 0 ? ` • you have ${readyDocs} of ${totalDocs} documents ready` : '';
      const deadlineNote = item.daysRemaining <= 7 ? ` • closes in ${item.daysRemaining} days` : '';
      why = `Eligible • ${item.scholarship.amountText}${docNote}${deadlineNote}`;
    } else if (item.status === 'Needs Verification') {
      why = `High Potential • ${item.scholarship.amountText} • update profile to verify`;
    } else {
      why = item.whatWouldMakeEligible || `Alternative opportunity • ${item.scholarship.amountText}`;
    }

    return {
      ...item,
      internalPriorityScore: score,
      whyRecommended: why
    };
  }).sort((a, b) => b.internalPriorityScore - a.internalPriorityScore);
}

/**
 * Organizes scholarships into buckets: Eligible, Needs Verification, Not Eligible, Expired.
 */
export function getMatches(
  profile: StudentProfile | null | undefined,
  scholarships: Scholarship[],
  documentStatuses?: Record<string, 'Ready' | 'Pending' | 'Not Applicable'>
): MatchBuckets {
  const evaluated = scholarships.map((s) => evaluateScholarship(profile, s));
  const ranked = rankScholarships(profile, evaluated, documentStatuses);

  const eligible: RankedScholarship[] = [];
  const needsVerification: RankedScholarship[] = [];
  const notEligible: RankedScholarship[] = [];
  const expired: RankedScholarship[] = [];

  for (const item of ranked) {
    if (item.isExpired) {
      expired.push(item);
    } else if (item.status === 'Eligible') {
      eligible.push(item);
    } else if (item.status === 'Needs Verification') {
      needsVerification.push(item);
    } else {
      notEligible.push(item);
    }
  }

  return {
    eligible,
    needsVerification,
    notEligible,
    expired,
    totalActiveMatches: eligible.length + needsVerification.length
  };
}

/**
 * Determines the Next Best Action for the student based on live state.
 */
export function getNextBestAction(
  profile: StudentProfile | null | undefined,
  matches: MatchBuckets,
  documentStatuses?: Record<string, 'Ready' | 'Pending' | 'Not Applicable'>
): {
  id: string;
  tag: string;
  title: string;
  reason: string;
  actionLabel: string;
  actionRoute: string;
} {
  // Priority 1: Unregistered or incomplete profile
  if (!profile || !profile.percentage || !profile.state) {
    return {
      id: 'action-register',
      tag: 'Get Started',
      title: 'Register Your Student Profile',
      reason: 'Enter your course, domicile state, and marks to check exact eligibility across 450+ verified schemes.',
      actionLabel: 'Register Profile →',
      actionRoute: '/onboarding'
    };
  }

  // Priority 2: Missing Income Certificate when student has eligible/matching scholarships
  const isIncomeCertMissing = !profile?.hasIncomeCertificate || documentStatuses?.['doc-income'] !== 'Ready';
  if (isIncomeCertMissing && (matches.eligible.length > 0 || matches.needsVerification.length > 0)) {
    return {
      id: 'action-income-cert',
      tag: 'High Priority',
      title: 'Add your Income Certificate',
      reason: 'Required for 3 scholarships including the Uttarakhand Merit Scholarship.',
      actionLabel: 'Add Income Certificate →',
      actionRoute: '/documents'
    };
  }

  // Priority 3: Imminent deadline within 3 days
  const urgentScholarship = matches.eligible.find((m) => m.daysRemaining >= 0 && m.daysRemaining <= 3);
  if (urgentScholarship) {
    return {
      id: `action-deadline-${urgentScholarship.scholarship.id}`,
      tag: 'Deadline Urgent',
      title: `Apply for ${urgentScholarship.scholarship.shortName}`,
      reason: `Closes in ${urgentScholarship.daysRemaining} days! Value: ${urgentScholarship.scholarship.amountText}.`,
      actionLabel: 'Prepare & Apply ->',
      actionRoute: `/explore?highlight=${urgentScholarship.scholarship.id}`
    };
  }

  // Priority 4: Domicile certificate pending
  if (documentStatuses?.['doc-domicile-uk'] !== 'Ready') {
    return {
      id: 'action-domicile',
      tag: 'Document Ready',
      title: 'Verify your State Domicile Certificate',
      reason: 'Unlocks state fee waiver programs up to ₹35,000 / year.',
      actionLabel: 'Mark as Ready ✓',
      actionRoute: '/documents'
    };
  }

  // Default: Explore newly released scholarships
  return {
    id: 'action-explore',
    tag: 'Opportunity',
    title: 'Review 6 Newly Released Scholarships',
    reason: 'Updated government central sector quotas have opened for this session.',
    actionLabel: 'Explore Matches ->',
    actionRoute: '/matches'
  };
}

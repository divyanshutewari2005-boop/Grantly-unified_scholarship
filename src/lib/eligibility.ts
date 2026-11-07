/**
 * Pure rule-based eligibility evaluation engine.
 * No arbitrary scores or fake AI match percentages.
 */

import { EligibilityRule, Scholarship } from '../data/scholarships.ts';

export interface StudentProfile {
  name?: string;
  email?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  state?: string; // Domicile state
  educationLevel?: string;
  course?: string;
  courseType?: 'Technical' | 'General' | 'Medical' | 'Management' | 'Vocational';
  percentage?: number; // e.g. 78.5
  annualIncome?: number; // in INR
  hasIncomeCertificate?: boolean;
  category?: string; // e.g. "OBC (Non-Creamy Layer)", "SC", "General"
  disabilityStatus?: boolean;
}

export type RuleStatus = 'satisfied' | 'failed' | 'needs_info';

export interface EvaluatedRule {
  ruleId: string;
  label: string;
  description: string;
  status: RuleStatus;
  reason: string;
  actualValue?: any;
  requiredValue?: any;
}

export interface EligibilityResult {
  scholarshipId: string;
  overallStatus: 'Eligible' | 'Needs Verification' | 'Not Eligible';
  headlineReason: string;
  satisfiedCount: number;
  totalRules: number;
  rules: EvaluatedRule[];
}

export function evaluateEligibility(
  profile: StudentProfile | null | undefined,
  rules: EligibilityRule[]
): Omit<EligibilityResult, 'scholarshipId'> {
  if (!rules || rules.length === 0) {
    return {
      overallStatus: 'Eligible',
      headlineReason: 'No specific restrictive eligibility criteria defined.',
      satisfiedCount: 0,
      totalRules: 0,
      rules: []
    };
  }

  if (!profile) {
    return {
      overallStatus: 'Needs Verification',
      headlineReason: 'Create or complete your profile to verify your eligibility.',
      satisfiedCount: 0,
      totalRules: rules.length,
      rules: rules.map((r) => ({
        ruleId: r.id,
        label: r.label,
        description: r.description,
        status: 'needs_info',
        reason: 'Profile data not provided yet.'
      }))
    };
  }

  const evaluatedRules: EvaluatedRule[] = [];

  for (const rule of rules) {
    const studentVal = (profile as any)[rule.field];

    if (studentVal === undefined || studentVal === null || studentVal === '') {
      evaluatedRules.push({
        ruleId: rule.id,
        label: rule.label,
        description: rule.description,
        status: 'needs_info',
        reason: `Your profile is missing "${rule.field}".`,
        requiredValue: rule.value
      });
      continue;
    }

    let isPassed = false;
    let failReason = '';

    switch (rule.operator) {
      case 'gte':
        isPassed = Number(studentVal) >= Number(rule.value);
        if (!isPassed) {
          failReason = `Requires at least ${rule.value} (you have ${studentVal}).`;
        }
        break;

      case 'lte':
        isPassed = Number(studentVal) <= Number(rule.value);
        if (!isPassed) {
          failReason = `Maximum allowed is ₹${Number(rule.value).toLocaleString('en-IN')} (your profile has ₹${Number(studentVal).toLocaleString('en-IN')}).`;
        }
        break;

      case 'equals':
        if (rule.field === 'state') {
          isPassed = rule.value === 'All India' || String(studentVal).toLowerCase() === String(rule.value).toLowerCase();
        } else {
          isPassed = String(studentVal).toLowerCase() === String(rule.value).toLowerCase();
        }
        if (!isPassed) {
          failReason = `Requires ${rule.value} (you selected ${studentVal}).`;
        }
        break;

      case 'in':
        if (Array.isArray(rule.value)) {
          isPassed = rule.value.includes(studentVal);
        } else {
          isPassed = String(rule.value).includes(String(studentVal));
        }
        if (!isPassed) {
          failReason = `Only open for: ${Array.isArray(rule.value) ? rule.value.join(', ') : rule.value}.`;
        }
        break;

      case 'boolean':
        isPassed = Boolean(studentVal) === Boolean(rule.value);
        if (!isPassed) {
          failReason = `Condition not met.`;
        }
        break;

      default:
        isPassed = false;
        failReason = 'Unsupported criteria operator.';
    }

    evaluatedRules.push({
      ruleId: rule.id,
      label: rule.label,
      description: rule.description,
      status: isPassed ? 'satisfied' : 'failed',
      reason: isPassed ? 'Requirement satisfied.' : failReason,
      actualValue: studentVal,
      requiredValue: rule.value
    });
  }

  const hasFailed = evaluatedRules.some((r) => r.status === 'failed');
  const hasNeedsInfo = evaluatedRules.some((r) => r.status === 'needs_info');
  const satisfiedCount = evaluatedRules.filter((r) => r.status === 'satisfied').length;

  let overallStatus: 'Eligible' | 'Needs Verification' | 'Not Eligible' = 'Eligible';
  let headlineReason = 'You satisfy all verified criteria for this opportunity.';

  if (hasFailed) {
    overallStatus = 'Not Eligible';
    const firstFail = evaluatedRules.find((r) => r.status === 'failed');
    headlineReason = firstFail ? firstFail.reason : 'Does not match specific profile criteria.';
  } else if (hasNeedsInfo) {
    overallStatus = 'Needs Verification';
    headlineReason = 'Missing profile fields needed to confirm 100% eligibility.';
  }

  return {
    overallStatus,
    headlineReason,
    satisfiedCount,
    totalRules: rules.length,
    rules: evaluatedRules
  };
}

/**
 * Convenience helper to evaluate a full scholarship against a profile.
 */
export function evaluateScholarship(
  profile: StudentProfile | null | undefined,
  scholarship: Scholarship
): EligibilityResult {
  const result = evaluateEligibility(profile, scholarship.eligibilityRules);
  return {
    scholarshipId: scholarship.id,
    ...result
  };
}

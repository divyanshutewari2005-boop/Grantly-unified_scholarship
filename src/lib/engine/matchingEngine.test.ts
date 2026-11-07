/**
 * Unit Tests for GRANTLY Matching Engine
 * Tests 16 distinct scenarios across rules, boundaries, and priorities.
 */

import { evaluateScholarship, rankScholarships, getMatches, StudentProfile } from './matchingEngine.ts';
import { Scholarship } from '../../data/mockScholarships.ts';

const baseScholarship: Scholarship = {
  id: "test-csss",
  name: "Central Sector Scheme for College and University Students",
  shortName: "CSSS",
  provider: "Ministry of Education",
  type: "Government",
  level: ["Undergraduate (UG)"],
  state: "All India",
  amountText: "₹12,000 / year",
  annualAmount: 12000,
  deadline: "2026-12-31",
  officialUrl: "https://scholarships.gov.in",
  source: "NSP",
  lastVerified: "2026-10-25",
  verificationStatus: "Verified",
  summary: "Test scholarship",
  benefits: ["₹12,000 allowance"],
  eligibilityRules: [
    {
      id: "r-pct",
      field: "minPercentage",
      operator: "gte",
      value: 80,
      label: "Minimum 80% marks in Class 12",
      description: "Must score 80% or higher",
      mandatory: true
    },
    {
      id: "r-inc",
      field: "maxIncome",
      operator: "lte",
      value: 450000,
      label: "Annual family income <= ₹4.5 Lakh",
      description: "Income ceiling",
      mandatory: true
    },
    {
      id: "r-lvl",
      field: "educationLevel",
      operator: "in",
      value: ["Undergraduate (UG)"],
      label: "Enrolled in UG Degree",
      description: "College student",
      mandatory: true
    }
  ],
  documents: [
    { id: "doc-aadhaar", name: "Aadhaar", mandatory: true, helpText: "Seeded" },
    { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Tehsildar" }
  ],
  applicationProcedure: ["Apply on NSP"],
  contactSupport: "nsp@gov.in",
  logo: "🏛️"
};

const baseStudent: StudentProfile = {
  name: "Divyanshu Sharma",
  state: "Uttarakhand",
  educationLevel: "Undergraduate (UG)",
  course: "B.Tech in Computer Science",
  courseType: "Technical",
  percentage: 82.4,
  annualIncome: 240000,
  hasIncomeCertificate: true,
  category: "General",
  gender: "Male"
};

export function runEngineTests() {
  const results: { name: string; passed: boolean; message?: string }[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (e: any) {
      results.push({ name, passed: false, message: e.message });
    }
  }

  function assert(condition: boolean, msg: string) {
    if (!condition) throw new Error(msg);
  }

  // Case 1: Null or empty profile returns "Needs Verification" with unknown rules
  test("1. Null profile produces Needs Verification", () => {
    const res = evaluateScholarship(null, baseScholarship);
    assert(res.status === 'Needs Verification', "Status should be Needs Verification");
    assert(res.unknownRulesCount === 3, "All 3 rules should be unknown");
  });

  // Case 2: Fully qualified student returns "Eligible"
  test("2. Fully qualifying student returns Eligible", () => {
    const res = evaluateScholarship(baseStudent, baseScholarship);
    assert(res.status === 'Eligible', `Expected Eligible, got ${res.status}`);
    assert(res.failedRulesCount === 0, "Failed count should be 0");
    assert(res.passedRulesCount === 3, "Passed count should be 3");
  });

  // Case 3: Missing marks in profile produces "Needs Verification"
  test("3. Missing single profile field produces Needs Verification", () => {
    const incompleteStudent: StudentProfile = { ...baseStudent, percentage: undefined as any };
    const res = evaluateScholarship(incompleteStudent, baseScholarship);
    assert(res.status === 'Needs Verification', "Status should be Needs Verification");
    assert(res.unknownRulesCount === 1, "Should have 1 unknown rule");
  });

  // Case 4: Percentage below threshold fails rule and marks "Not Eligible"
  test("4. Percentage below cutoff marks Not Eligible", () => {
    const lowMarksStudent: StudentProfile = { ...baseStudent, percentage: 76.5 };
    const res = evaluateScholarship(lowMarksStudent, baseScholarship);
    assert(res.status === 'Not Eligible', "Status should be Not Eligible");
    assert(res.failedRulesCount === 1, "Should have 1 failed rule");
  });

  // Case 5: Exact boundary percentage passes
  test("5. Exact boundary percentage (80%) passes", () => {
    const boundaryStudent: StudentProfile = { ...baseStudent, percentage: 80.0 };
    const res = evaluateScholarship(boundaryStudent, baseScholarship);
    assert(res.status === 'Eligible', "80% should pass gte 80");
  });

  // Case 6: Exact boundary income (450,000) passes
  test("6. Exact boundary income (₹4,50,000) passes", () => {
    const boundaryIncomeStudent: StudentProfile = { ...baseStudent, annualIncome: 450000 };
    const res = evaluateScholarship(boundaryIncomeStudent, baseScholarship);
    assert(res.status === 'Eligible', "₹4,50,000 should pass lte 450000");
  });

  // Case 7: Income 1 Rupee over limit (450,001) fails
  test("7. Income 1 rupee over ceiling fails", () => {
    const overIncomeStudent: StudentProfile = { ...baseStudent, annualIncome: 450001 };
    const res = evaluateScholarship(overIncomeStudent, baseScholarship);
    assert(res.status === 'Not Eligible', "Income over ceiling should fail");
    assert(Boolean(res.whatWouldMakeEligible?.includes("₹4.5 Lakh")), "Hint should mention ceiling");
  });

  // Case 8: State specific scholarship matches domicile
  test("8. State-specific scheme matches student with that domicile", () => {
    const stateScholarship: Scholarship = {
      ...baseScholarship,
      state: "Uttarakhand",
      eligibilityRules: [
        { id: "r-st", field: "state", operator: "equals", value: "Uttarakhand", label: "UK Domicile", description: "Resident" }
      ]
    };
    const res = evaluateScholarship(baseStudent, stateScholarship);
    assert(res.status === 'Eligible', "Uttarakhand domicile matches");
  });

  // Case 9: State specific scholarship fails student from other state
  test("9. State-specific scheme fails student from outside state", () => {
    const stateScholarship: Scholarship = {
      ...baseScholarship,
      state: "Karnataka",
      eligibilityRules: [
        { id: "r-st", field: "state", operator: "equals", value: "Karnataka", label: "Karnataka Domicile", description: "Resident" }
      ]
    };
    const res = evaluateScholarship(baseStudent, stateScholarship);
    assert(res.status === 'Not Eligible', "Uttarakhand student cannot get Karnataka state scheme");
  });

  // Case 10: Gender female rule fails male student
  test("10. Female-only scholarship fails male student with clear reason", () => {
    const girlScholarship: Scholarship = {
      ...baseScholarship,
      eligibilityRules: [
        { id: "r-gnd", field: "gender", operator: "equals", value: "Female", label: "Female Only", description: "Girl student" }
      ]
    };
    const res = evaluateScholarship(baseStudent, girlScholarship);
    assert(res.status === 'Not Eligible', "Male student not eligible for girl scholarship");
    assert(Boolean(res.whatWouldMakeEligible?.includes("Female")), "Hint should specify Female requirement");
  });

  // Case 11: Gender female rule passes female student
  test("11. Female-only scholarship passes female student", () => {
    const femaleStudent: StudentProfile = { ...baseStudent, gender: "Female" };
    const girlScholarship: Scholarship = {
      ...baseScholarship,
      eligibilityRules: [
        { id: "r-gnd", field: "gender", operator: "equals", value: "Female", label: "Female Only", description: "Girl student" }
      ]
    };
    const res = evaluateScholarship(femaleStudent, girlScholarship);
    assert(res.status === 'Eligible', "Female student qualifies");
  });

  // Case 12: Category check (SC student passes SC scholarship)
  test("12. Category matching handles reserved quota correctly", () => {
    const scStudent: StudentProfile = { ...baseStudent, category: "SC" };
    const scScholarship: Scholarship = {
      ...baseScholarship,
      eligibilityRules: [
        { id: "r-cat", field: "category", operator: "equals", value: "SC", label: "SC Only", description: "Caste" }
      ]
    };
    const res = evaluateScholarship(scStudent, scScholarship);
    assert(res.status === 'Eligible', "SC student matches SC scholarship");

    const genRes = evaluateScholarship(baseStudent, scScholarship);
    assert(genRes.status === 'Not Eligible', "General student fails SC scholarship");
  });

  // Case 13: Expired deadline detected accurately
  test("13. Expired deadline marks isExpired = true", () => {
    const expiredScholarship: Scholarship = {
      ...baseScholarship,
      deadline: "2020-01-01"
    };
    const res = evaluateScholarship(baseStudent, expiredScholarship);
    assert(res.isExpired === true, "Past deadline must be marked expired");
    assert(res.daysRemaining < 0, "Days remaining must be negative");
  });

  // Case 14: Priority ranking puts Eligible above Needs Verification
  test("14. Priority ranking orders Eligible above Needs Verification", () => {
    const evalEligible = evaluateScholarship(baseStudent, baseScholarship);
    const evalNeeds = evaluateScholarship(null, baseScholarship);
    const ranked = rankScholarships(baseStudent, [evalNeeds, evalEligible]);
    assert(ranked[0].status === 'Eligible', "Eligible should rank first");
    assert(ranked[1].status === 'Needs Verification', "Needs verification ranks second");
  });

  // Case 15: Document status readiness boosts scholarship ranking score
  test("15. Ready documents boost priority score", () => {
    const eval1 = evaluateScholarship(baseStudent, baseScholarship);
    const rankedNoDocs = rankScholarships(baseStudent, [eval1], {});
    const rankedWithDocs = rankScholarships(baseStudent, [eval1], {
      "doc-aadhaar": "Ready",
      "doc-income": "Ready"
    });
    assert(
      rankedWithDocs[0].internalPriorityScore > rankedNoDocs[0].internalPriorityScore,
      "Having documents ready must increase ranking score"
    );
  });

  // Case 16: getMatches cleanly separates eligible, needsVerification, notEligible, expired
  test("16. getMatches partitions buckets without overlap", () => {
    const expiredScholarship: Scholarship = { ...baseScholarship, id: "exp-1", deadline: "2021-01-01" };
    const ineligibleScholarship: Scholarship = {
      ...baseScholarship,
      id: "inelig-1",
      eligibilityRules: [{ id: "r-f", field: "gender", operator: "equals", value: "Female", label: "Girls", description: "Girls" }]
    };
    const buckets = getMatches(baseStudent, [baseScholarship, expiredScholarship, ineligibleScholarship]);
    assert(buckets.eligible.length === 1, "Should have 1 eligible");
    assert(buckets.notEligible.length === 1, "Should have 1 not eligible");
    assert(buckets.expired.length === 1, "Should have 1 expired");
    assert(buckets.totalActiveMatches === 1, "Total active matches should be 1");
  });

  return results;
}

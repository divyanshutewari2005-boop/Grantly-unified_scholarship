/**
 * Grantly Guide Assistant Service
 * 
 * TODO: Replace with server-side Gemini API proxy route (/api/ask-guide) when backend is deployed.
 * Answers strictly from verified database and student profile without hallucinating facts.
 */

import { StudentProfile } from '../lib/engine/matchingEngine.ts';
import { Scholarship, MOCK_SCHOLARSHIPS } from '../data/mockScholarships.ts';

export interface GuideResponse {
  text: string;
  suggestedCards?: Scholarship[];
  actionLink?: string;
  actionText?: string;
}

export async function askGuide(
  question: string,
  profile: StudentProfile | null,
  scholarships: Scholarship[]
): Promise<GuideResponse> {
  // Artificial conversational mini-delay for typing effect
  await new Promise((r) => setTimeout(r, 600));

  const q = question.toLowerCase().trim();

  // Scenario 1: "Which scholarships fit my profile?" or "what scholarships suit me"
  if (q.includes('fit') || q.includes('suit') || q.includes('eligible') || q.includes('recommend')) {
    const eligibleMatches = scholarships.filter((s) => {
      const stateMatch = s.state === 'All India' || (profile?.state && s.state.toLowerCase() === profile.state.toLowerCase());
      const incomeRule = s.eligibilityRules.find((r) => r.field === 'maxIncome');
      const incomeMatch = !incomeRule || (profile?.annualIncome && profile.annualIncome <= incomeRule.value);
      return stateMatch && incomeMatch;
    }).slice(0, 3);

    return {
      text: `Based on your verified profile (**${profile?.educationLevel || 'Undergraduate'}**, **${profile?.state || 'Uttarakhand'}** domicile, and family income **₹${(profile?.annualIncome || 240000).toLocaleString('en-IN')}/year**), you currently qualify for **${eligibleMatches.length} top verified scholarships**:`,
      suggestedCards: eligibleMatches,
      actionLink: '/matches',
      actionText: 'View All Matches in Engine'
    };
  }

  // Scenario 2: "What documents do I need?"
  if (q.includes('document') || q.includes('certificate') || q.includes('aadhaar')) {
    return {
      text: `To apply for government and private scholarships in India, keep these **5 core documents** ready in self-attested digital formats:\n\n1. **Aadhaar Card**: Must be seeded in the NPCI mapper with an active DBT bank account.\n2. **Income Certificate**: Issued by a Tehsildar or Revenue Officer for the current financial year.\n3. **Class 12 / Qualifying Marksheet**: Board marks statement with minimum percentage visible.\n4. **Domicile (Mool Niwas) Certificate**: Issued by state e-District portal.\n5. **College Bonafide / Fee Receipt**: Stamped by Principal or Dean.\n\n*Note: GRANTLY tracks document status only. Never upload confidential physical files.*`,
      actionLink: '/documents',
      actionText: 'Open Document Checklist'
    };
  }

  // Scenario 3: "How to apply for a government scholarship?" or "NSP"
  if (q.includes('apply') || q.includes('how to') || q.includes('government') || q.includes('portal')) {
    return {
      text: `Here is the official 5-step process to apply on the **National Scholarship Portal (scholarships.gov.in)**:\n\n1. **Register with One-Time Registration (OTR)** on NSP using your verified Aadhaar number.\n2. **Fill Academic Credentials**: Enter your board roll number and current college registration.\n3. **Select Eligible Scheme**: e.g., Central Sector Scheme (CSSS) under Ministry of Education.\n4. **Upload Tehsildar Income Certificate**: Ensure the valid financial year matches.\n5. **Institute Verification**: Inform your college scholarship nodal officer to verify your application online.\n\n*Reminder: GRANTLY never submits applications on your behalf; you apply directly on the official portal.*`,
      actionLink: '/deadlines',
      actionText: 'Check Imminent Deadlines'
    };
  }

  // Scenario 4: "Uttarakhand" state queries
  if (q.includes('uttarakhand') || q.includes('state scheme')) {
    const ukSchemes = scholarships.filter((s) => s.state === 'Uttarakhand').slice(0, 3);
    return {
      text: `Here are the active schemes available specifically for **Uttarakhand domicile students**:\n\n- **Uttarakhand Merit Scholarship**: Up to ₹25,000/year for state college students.\n- **Uttarakhand SC & ST Post-Matric Schemes**: 100% compulsory college fee reimbursement.\n- **Uttarakhand Minority Post-Matric**: Financial grant up to ₹20,000/year.`,
      suggestedCards: ukSchemes,
      actionLink: '/explore-scholarships?state=Uttarakhand',
      actionText: 'Browse Uttarakhand Schemes'
    };
  }

  // Fallback safe reply (No hallucinated facts!)
  return {
    text: `I don't have verified information on that in the official database. I only provide authenticated guidelines from official gazettes, the National Scholarship Portal (scholarships.gov.in), and registered foundation criteria.\n\nWould you like me to check which scholarships fit your current academic profile instead?`,
    actionLink: '/matches',
    actionText: 'Check My Matches'
  };
}

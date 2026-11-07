/**
 * Frequently asked questions for GRANTLY.
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'eligibility' | 'application' | 'privacy';
}

export const FAQS_DATA: FAQItem[] = [
  {
    id: "faq-1",
    question: "Does GRANTLY apply for scholarships on my behalf?",
    answer: "No. GRANTLY never submits applications on your behalf. We believe students must maintain direct control over their official submissions. We match you with eligible schemes, generate customized document checklists, guide you step-by-step, and provide the official portal link (e.g. scholarships.gov.in) where you submit directly.",
    category: "application"
  },
  {
    id: "faq-2",
    question: "Is GRANTLY really free for students? Are there hidden fees?",
    answer: "Yes, 100% free for all students. There are zero hidden fees, zero commission on scholarship awards, and no premium paywalls for discovering opportunities. We believe education funding should be transparent and universally accessible to every student in India.",
    category: "general"
  },
  {
    id: "faq-3",
    question: "How does GRANTLY determine if I am eligible for a scholarship?",
    answer: "We use a pure, explainable rule-based engine. We compare your profile criteria (education level, marks/CGPA, family income limit, domicile state, and caste/category) against the verified government or foundation guidelines. You will always see an itemized checklist showing exactly which rules you meet, which you don't, or what information is missing — with zero fake AI percentages.",
    category: "eligibility"
  },
  {
    id: "faq-4",
    question: "What documents do I need ready before applying?",
    answer: "Most Indian scholarships require a core set of 5 documents: Aadhaar card (seeded with an active bank account), previous qualifying exam marksheet, annual income certificate issued by a Tehsildar or Revenue Officer, domicile certificate (Mool Niwas), and a college admission receipt or Bonafide letter. On GRANTLY, each scholarship shows its specific required documents with a readiness tracker.",
    category: "application"
  },
  {
    id: "faq-5",
    question: "How are scholarships verified on GRANTLY?",
    answer: "Our team and administrative verification pipeline checks each scheme against official gazette notifications, ministry websites (like NSP, UGC, AICTE), state social welfare departments, and registered corporate CSR foundation guidelines. Every scholarship listing states its official source and the date it was last verified.",
    category: "general"
  },
  {
    id: "faq-6",
    question: "Is my personal and academic data secure?",
    answer: "Absolutely. We only collect the specific academic and financial fields strictly needed for rule-based matching. We never sell student data, we do not require you to upload your sensitive physical documents to our servers, and you can edit or clear your profile at any time.",
    category: "privacy"
  }
];

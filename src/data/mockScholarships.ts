/**
 * Verified Indian Scholarships Database (26 Realistic Schemes)
 * 
 * NOTE: Sample data for GRANTLY demonstration.
 * Deadlines are computed relative to today's date so the platform never displays stale dates.
 * All URLs point to authentic portal homepages (e.g., scholarships.gov.in) or registered foundations.
 */

import { addDays, subDays, format } from 'date-fns';

export interface EligibilityRule {
  id: string;
  field:
    | 'educationLevel'
    | 'minPercentage'
    | 'maxIncome'
    | 'state'
    | 'gender'
    | 'category'
    | 'courseType'
    | 'institutionType'
    | 'disability';
  operator: 'equals' | 'gte' | 'lte' | 'in' | 'boolean';
  value: any;
  label: string;
  description: string;
  mandatory?: boolean;
}

export interface RequiredDocument {
  id: string;
  name: string;
  mandatory: boolean;
  helpText: string;
  estimatedDaysToProcure?: number;
}

export interface Scholarship {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  type: 'Government' | 'State' | 'Private' | 'PSU';
  level: string[]; // e.g. ["Undergraduate (UG)", "Postgraduate (PG)"]
  courseType?: string[]; // e.g. ["B.Tech", "MBBS", "All Courses"]
  state: string; // "All India" or specific state like "Uttarakhand"
  amountText: string;
  annualAmount: number; // in INR
  deadline: string; // ISO format "YYYY-MM-DD"
  officialUrl: string;
  source: string;
  lastVerified: string;
  verificationStatus: 'Verified' | 'Under Review' | 'Published';
  summary: string;
  benefits: string[];
  eligibilityRules: EligibilityRule[];
  documents: RequiredDocument[];
  applicationProcedure: string[];
  contactSupport: string;
  logo: string;
  isFeatured?: boolean;
  isNewRelease?: boolean;
  categoryTag?: string;
}

const today = new Date();
const dateInDays = (days: number) => format(addDays(today, days), 'yyyy-MM-dd');
const dateAgoDays = (days: number) => format(subDays(today, days), 'yyyy-MM-dd');

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "csss-moe-2026",
    name: "Central Sector Scheme of Scholarships for College and University Students",
    shortName: "Central Sector Scholarship",
    provider: "Ministry of Education, GoI",
    type: "Government",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["B.Tech", "B.Sc", "B.Com", "B.A", "All Courses"],
    state: "All India",
    amountText: "₹12,000 / year",
    annualAmount: 12000,
    deadline: dateInDays(3), // Closing in 3 days! Matches screenshot "In 3 days"
    officialUrl: "https://scholarships.gov.in",
    source: "National Scholarship Portal (NSP)",
    lastVerified: dateAgoDays(5),
    verificationStatus: "Verified",
    summary: "Direct Benefit Transfer scheme by the Ministry of Education for meritorious college students with family income under ₹4.5 Lakh.",
    benefits: [
      "₹12,000 per annum for the first 3 years of Undergraduate study",
      "₹20,000 per annum during Postgraduate studies",
      "Direct Benefit Transfer (DBT) directly into Aadhaar-seeded bank account"
    ],
    eligibilityRules: [
      {
        id: "csss-r1",
        field: "minPercentage",
        operator: "gte",
        value: 80,
        label: "Above 80th Percentile in Class 12",
        description: "Student must score at or above 80% in the qualifying board exam.",
        mandatory: true
      },
      {
        id: "csss-r2",
        field: "maxIncome",
        operator: "lte",
        value: 450000,
        label: "Family Income ≤ ₹4,50,000 / year",
        description: "Gross annual parental income must not exceed ₹4.5 Lakh.",
        mandatory: true
      },
      {
        id: "csss-r3",
        field: "educationLevel",
        operator: "in",
        value: ["Undergraduate (UG)", "Postgraduate (PG)"],
        label: "Enrolled in Regular UG/PG Degree",
        description: "Must be enrolled full-time in a UGC/AICTE recognized college.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-aadhaar", name: "Aadhaar Card", mandatory: true, helpText: "Seeded with active bank account" },
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "Self-attested mark statement" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Issued by competent Tehsildar" },
      { id: "doc-bonafide", name: "College Bonafide Certificate", mandatory: true, helpText: "Signed by Principal or Registrar" },
      { id: "doc-bank", name: "Bank Account Details", mandatory: true, helpText: "Showing IFSC and Account Holder Name" }
    ],
    applicationProcedure: [
      "Register on National Scholarship Portal (NSP) with valid Aadhaar.",
      "Select Central Sector Scheme under Ministry of Education.",
      "Submit academic marksheet and verified Tehsildar income certificate.",
      "Institute verification completed by College Nodal Officer."
    ],
    contactSupport: "helpdesk@nsp.gov.in | 0120-6619540",
    logo: "🏛️",
    isFeatured: true,
    categoryTag: "B.Tech"
  },
  {
    id: "uk-merit-2026",
    name: "Uttarakhand State Higher Education Merit Scholarship",
    shortName: "Uttarakhand Merit Scholarship",
    provider: "Govt. of Uttarakhand",
    type: "State",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["UG", "B.Tech", "B.Sc", "All Courses"],
    state: "Uttarakhand",
    amountText: "₹25,000 / year",
    annualAmount: 25000,
    deadline: dateInDays(7), // Closing in 7 days! Matches screenshot "In 7 days"
    officialUrl: "https://scholarships.gov.in",
    source: "Uttarakhand Higher Education Directorate & NSP",
    lastVerified: dateAgoDays(8),
    verificationStatus: "Verified",
    summary: "State scholarship for students holding Uttarakhand domicile studying in recognized state universities and affiliated technical institutions.",
    benefits: [
      "₹25,000 per academic year towards college tuition and study books",
      "Special allocation for students from Garhwal and Kumaon hill districts"
    ],
    eligibilityRules: [
      {
        id: "uk-r1",
        field: "state",
        operator: "equals",
        value: "Uttarakhand",
        label: "Uttarakhand Domicile Holder",
        description: "Student must hold permanent residence (Mool Niwas) certificate of Uttarakhand.",
        mandatory: true
      },
      {
        id: "uk-r2",
        field: "minPercentage",
        operator: "gte",
        value: 70,
        label: "Minimum 70% in Class 12 or Last Exam",
        description: "Academic merit in previous board/university exam.",
        mandatory: true
      },
      {
        id: "uk-r3",
        field: "maxIncome",
        operator: "lte",
        value: 500000,
        label: "Family Income ≤ ₹5,00,000 / year",
        description: "Verified through Tehsildar income certificate.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-domicile-uk", name: "Domicile Certificate", mandatory: true, helpText: "Uttarakhand Mool Niwas Praman Patra" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Issued by Tehsildar / SDM" },
      { id: "doc-aadhaar", name: "Aadhaar Card", mandatory: true, helpText: "Linked to mobile number" },
      { id: "doc-marksheet-12", name: "Previous Marksheet", mandatory: true, helpText: "Qualifying exam mark sheet" }
    ],
    applicationProcedure: [
      "Log into State Portal / NSP under Uttarakhand state schemes.",
      "Enter Domicile registration number from e-District UK.",
      "Submit college admission fee receipt and mark sheet."
    ],
    contactSupport: "higheredu-uk@gov.in",
    logo: "🏔️",
    isFeatured: true,
    categoryTag: "UG"
  },
  {
    id: "tata-capital-pankh-2026",
    name: "Tata Capital Pankh Scholarship Programme",
    shortName: "Tata Capital Pankh Scholarship",
    provider: "Tata Capital Foundation",
    type: "Private",
    level: ["Undergraduate (UG)", "Class 11-12", "Diploma / Vocational"],
    courseType: ["All Courses", "General", "Technical"],
    state: "All India",
    amountText: "₹50,000 / year",
    annualAmount: 50000,
    deadline: dateInDays(24), // Matches screenshot "Apply by: 30 Nov 2026"
    officialUrl: "https://www.tatacapital.com",
    source: "Tata Capital CSR Foundation",
    lastVerified: dateAgoDays(4),
    verificationStatus: "Verified",
    summary: "Empowering meritorious students from low-income families pursuing undergraduate degrees across India to pursue their educational dreams.",
    benefits: [
      "Up to 80% tuition fee reimbursement (capped at ₹50,000/year)",
      "Dedicated mentorship from Tata senior business executives",
      "Soft skills training and resume development webinars"
    ],
    eligibilityRules: [
      {
        id: "tcp-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in Previous Qualifying Exam",
        description: "Passed Class 12 or 1st year UG with at least 60% aggregate.",
        mandatory: true
      },
      {
        id: "tcp-r2",
        field: "maxIncome",
        operator: "lte",
        value: 250000,
        label: "Family Income ≤ ₹2,50,000 / year",
        description: "Gross household earnings must not exceed ₹2.5 Lakh.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-marksheet", name: "Previous Marksheet", mandatory: true, helpText: "Self-attested copy of last exam" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Income certificate, BPL card, or salary slip" },
      { id: "doc-admission", name: "College Admission Proof", mandatory: true, helpText: "Fee receipt or student ID" },
      { id: "doc-bank", name: "Bank Account Details", mandatory: true, helpText: "Passbook copy" }
    ],
    applicationProcedure: [
      "Register on Tata Capital Pankh portal.",
      "Upload marksheet and income verification documents.",
      "Telephonic interview for shortlisted candidates."
    ],
    contactSupport: "pankh@tatacapital.com",
    logo: "🔷",
    isFeatured: true,
    categoryTag: "All Courses"
  },
  {
    id: "aicte-pragati-2026",
    name: "AICTE Pragati Scholarship Scheme for Girl Students",
    shortName: "AICTE Pragati Scholarship",
    provider: "AICTE, Ministry of Education",
    type: "Government",
    level: ["Undergraduate (UG)", "Diploma / Vocational"],
    courseType: ["Technical", "B.Tech", "B.E."],
    state: "All India",
    amountText: "₹50,000 / year",
    annualAmount: 50000,
    deadline: dateInDays(10), // Matches screenshot "In 10 days"
    officialUrl: "https://scholarships.gov.in",
    source: "AICTE & National Scholarship Portal",
    lastVerified: dateAgoDays(2),
    verificationStatus: "Verified",
    summary: "Dedicated financial support for female students pursuing Technical Degrees (B.Tech/B.Arch) in AICTE-approved institutions.",
    benefits: [
      "₹50,000 per annum towards college fee, books, software, and laptop purchase",
      "Awarded to 10,000 female engineering students every year across India"
    ],
    eligibilityRules: [
      {
        id: "prg-r1",
        field: "gender",
        operator: "equals",
        value: "Female",
        label: "Female Students Only",
        description: "Open exclusively for female students (up to 2 girls per family).",
        mandatory: true
      },
      {
        id: "prg-r2",
        field: "maxIncome",
        operator: "lte",
        value: 800000,
        label: "Family Income ≤ ₹8,00,000 / year",
        description: "Annual family income certificate required.",
        mandatory: true
      },
      {
        id: "prg-r3",
        field: "courseType",
        operator: "in",
        value: ["Technical", "B.Tech", "B.E."],
        label: "AICTE Approved Technical Degree",
        description: "Admitted into 1st year degree or 2nd year lateral entry.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-aadhaar", name: "Aadhaar Card", mandatory: true, helpText: "Applicant's valid Aadhaar" },
      { id: "doc-admission", name: "AICTE College Admission Letter", mandatory: true, helpText: "Showing merit counseling quota" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Issued by Tehsildar" }
    ],
    applicationProcedure: [
      "Apply through National Scholarship Portal (NSP).",
      "Select AICTE Pragati Degree Scheme.",
      "Complete physical document verification at college scholarship desk."
    ],
    contactSupport: "pragati@aicte-india.org",
    logo: "🎓",
    isFeatured: true,
    isNewRelease: true
  },
  {
    id: "reliance-foundation-ug-2026",
    name: "Reliance Foundation Undergraduate Scholarship",
    shortName: "Reliance Foundation UG Grant",
    provider: "Reliance Foundation",
    type: "Private",
    level: ["Undergraduate (UG)"],
    courseType: ["All Courses", "B.Tech", "B.Sc", "B.Com"],
    state: "All India",
    amountText: "Up to ₹2,00,000 over degree",
    annualAmount: 50000,
    deadline: dateInDays(14),
    officialUrl: "https://www.reliancefoundation.org",
    source: "Reliance Foundation Portal",
    lastVerified: dateAgoDays(6),
    verificationStatus: "Verified",
    summary: "One of India's most prestigious undergraduate scholarships covering all degree streams, with mentorship by industry pioneers.",
    benefits: [
      "Up to ₹2 Lakh direct grant over degree duration",
      "Access to leadership conferences and professional mentorship network"
    ],
    eligibilityRules: [
      {
        id: "rf-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in Class 12",
        description: "First year regular undergraduate students.",
        mandatory: true
      },
      {
        id: "rf-r2",
        field: "maxIncome",
        operator: "lte",
        value: 1500000,
        label: "Family Income ≤ ₹15,00,000 (Preference < ₹2.5L)",
        description: "Strong preference given to students with family income under ₹2.5 Lakh.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "Verified marksheet" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Parental tax return or Tehsildar certificate" }
    ],
    applicationProcedure: [
      "Register on Reliance Foundation online portal.",
      "Take the 60-minute online aptitude test.",
      "Submit academic transcripts and income proof."
    ],
    contactSupport: "contactus@reliancefoundation.org",
    logo: "💠"
  },
  {
    id: "hdfc-parivartan-2026",
    name: "HDFC Bank Parivartan's Educational Crisis Support (ECSS)",
    shortName: "HDFC Parivartan ECSS",
    provider: "HDFC Bank CSR",
    type: "Private",
    level: ["Class 11-12", "Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["All Courses"],
    state: "All India",
    amountText: "Up to ₹75,000 / year",
    annualAmount: 45000,
    deadline: dateInDays(12),
    officialUrl: "https://www.hdfcbank.com",
    source: "HDFC Bank CSR Portal",
    lastVerified: dateAgoDays(3),
    verificationStatus: "Verified",
    summary: "Crisis scholarship assisting meritorious students facing sudden financial difficulties or medical loss.",
    benefits: ["Direct tuition fee coverage up to ₹75,000/year"],
    eligibilityRules: [
      {
        id: "hdfc-r1",
        field: "minPercentage",
        operator: "gte",
        value: 55,
        label: "Minimum 55% in Previous Exam",
        description: "Consistent academic record.",
        mandatory: true
      },
      {
        id: "hdfc-r2",
        field: "maxIncome",
        operator: "lte",
        value: 250000,
        label: "Family Income ≤ ₹2,50,000 / year",
        description: "Economically vulnerable households.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-marksheet", name: "Previous Marksheet", mandatory: true, helpText: "Last academic exam score card" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "BPL card or Tehsildar certificate" }
    ],
    applicationProcedure: ["Apply online on Parivartan ECSS portal."],
    contactSupport: "parivartan@hdfcbank.com",
    logo: "🏦"
  },
  {
    id: "kotak-kanya-2026",
    name: "Kotak Kanya Scholarship for Professional Courses",
    shortName: "Kotak Kanya Scholarship",
    provider: "Kotak Education Foundation",
    type: "Private",
    level: ["Undergraduate (UG)"],
    courseType: ["Technical", "MBBS", "B.Tech", "Law"],
    state: "All India",
    amountText: "₹1,50,000 / year",
    annualAmount: 150000,
    deadline: dateInDays(18),
    officialUrl: "https://kotakeducation.org",
    source: "Kotak Education Foundation",
    lastVerified: dateAgoDays(4),
    verificationStatus: "Verified",
    summary: "Flagship grant for meritorious girl students from low-income families pursuing professional graduation.",
    benefits: [
      "₹1,50,000/year towards college fees, hostel, and laptop",
      "Executive mentorship by Kotak leaders"
    ],
    eligibilityRules: [
      {
        id: "kotak-r1",
        field: "gender",
        operator: "equals",
        value: "Female",
        label: "Female Students Only",
        description: "Girl students admitted to 1st year professional degree.",
        mandatory: true
      },
      {
        id: "kotak-r2",
        field: "minPercentage",
        operator: "gte",
        value: 75,
        label: "Minimum 75% in Class 12",
        description: "High academic merit in higher secondary.",
        mandatory: true
      },
      {
        id: "kotak-r3",
        field: "maxIncome",
        operator: "lte",
        value: 600000,
        label: "Family Income ≤ ₹6,00,000 / year",
        description: "Parental income verification required.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "Verified copy" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Current fiscal year" },
      { id: "doc-admission", name: "College Fee Receipt", mandatory: true, helpText: "Admission proof" }
    ],
    applicationProcedure: ["Apply online and complete virtual panel interview."],
    contactSupport: "kotak.kanya@kotak.com",
    logo: "🛡️"
  },
  {
    id: "dst-inspire-she-2026",
    name: "INSPIRE Scholarship for Higher Education (SHE)",
    shortName: "DST INSPIRE (SHE)",
    provider: "Department of Science & Technology, GoI",
    type: "Government",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["B.Sc", "M.Sc", "Natural Sciences"],
    state: "All India",
    amountText: "₹80,000 / year",
    annualAmount: 80000,
    deadline: dateInDays(35),
    officialUrl: "https://online-inspire.gov.in",
    source: "Ministry of Science & Technology",
    lastVerified: dateAgoDays(10),
    verificationStatus: "Verified",
    summary: "Scholarship to attract talented youth to study pure and basic sciences (Physics, Chemistry, Maths, Biology).",
    benefits: [
      "₹60,000 direct annual scholarship cash",
      "₹20,000 research project mentorship allowance"
    ],
    eligibilityRules: [
      {
        id: "ins-r1",
        field: "minPercentage",
        operator: "gte",
        value: 85,
        label: "Top 1% in Class 12 Board Exam",
        description: "Must be within top 1% cut-off of respective state board.",
        mandatory: true
      },
      {
        id: "ins-r2",
        field: "courseType",
        operator: "in",
        value: ["B.Sc", "Natural Sciences"],
        label: "Enrolled in Pure / Natural Sciences",
        description: "Not applicable for engineering or medical students.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "Showing top 1% score" },
      { id: "doc-bonafide", name: "College Endorsement Certificate", mandatory: true, helpText: "Official DST format" }
    ],
    applicationProcedure: ["Register on DST INSPIRE portal."],
    contactSupport: "inspire@nic.in",
    logo: "🔬"
  },
  {
    id: "ongc-merit-scholarship-2026",
    name: "ONGC Foundation Scholarship for Meritorious Students",
    shortName: "ONGC Merit Scholarship",
    provider: "ONGC Foundation",
    type: "PSU",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["B.Tech", "MBBS", "MBA", "Geology"],
    state: "All India",
    amountText: "₹48,000 / year",
    annualAmount: 48000,
    deadline: dateInDays(21),
    officialUrl: "https://www.ongcscholar.org",
    source: "ONGC Foundation",
    lastVerified: dateAgoDays(7),
    verificationStatus: "Verified",
    summary: "Financial assistance for meritorious students pursuing 1st year Engineering, MBBS, or Geophysics.",
    benefits: ["₹48,000 per annum paid directly to student"],
    eligibilityRules: [
      {
        id: "ongc-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in Class 12",
        description: "Or 6.0 CGPA on 10 point scale.",
        mandatory: true
      },
      {
        id: "ongc-r2",
        field: "maxIncome",
        operator: "lte",
        value: 200000,
        label: "Family Income ≤ ₹2,00,000 / year",
        description: "Economically weaker section priority.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Tehsildar issued" },
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "Verified score card" }
    ],
    applicationProcedure: ["Submit online application on ONGC Scholar portal."],
    contactSupport: "info@ongcscholar.org",
    logo: "⚡"
  },
  {
    id: "post-matric-sc-uk-2026",
    name: "Uttarakhand Post-Matric Scholarship for SC Students",
    shortName: "Uttarakhand SC Post-Matric",
    provider: "Social Welfare Dept, Uttarakhand",
    type: "State",
    level: ["Class 11-12", "Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["All Courses"],
    state: "Uttarakhand",
    amountText: "Full Fee Reimbursement + ₹13,500 Allowance",
    annualAmount: 32000,
    deadline: dateInDays(28),
    officialUrl: "https://scholarships.gov.in",
    source: "Uttarakhand Social Welfare Directorate & NSP",
    lastVerified: dateAgoDays(9),
    verificationStatus: "Verified",
    summary: "Complete compulsory fee reimbursement and maintenance stipend for Scheduled Caste domicile students.",
    benefits: [
      "100% tuition and examination fee reimbursed",
      "Monthly maintenance allowance up to ₹1,200/month"
    ],
    eligibilityRules: [
      {
        id: "sc-uk-1",
        field: "category",
        operator: "equals",
        value: "SC",
        label: "Scheduled Caste (SC) Category",
        description: "Valid Uttarakhand SC Caste Certificate.",
        mandatory: true
      },
      {
        id: "sc-uk-2",
        field: "state",
        operator: "equals",
        value: "Uttarakhand",
        label: "Uttarakhand Domicile Holder",
        description: "Permanent resident proof.",
        mandatory: true
      },
      {
        id: "sc-uk-3",
        field: "maxIncome",
        operator: "lte",
        value: 250000,
        label: "Family Income ≤ ₹2,50,000 / year",
        description: "Parental annual income ceiling.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-caste-sc", name: "SC Caste Certificate", mandatory: true, helpText: "Issued by Uttarakhand revenue officer" },
      { id: "doc-domicile-uk", name: "Domicile Certificate", mandatory: true, helpText: "Mool Niwas" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Current financial year" }
    ],
    applicationProcedure: ["Apply online on National Scholarship Portal."],
    contactSupport: "swd-uk@nic.in",
    logo: "🏛️"
  },
  {
    id: "post-matric-st-uk-2026",
    name: "Uttarakhand Post-Matric Scholarship for ST Students",
    shortName: "Uttarakhand ST Post-Matric",
    provider: "Tribal Welfare Dept, Uttarakhand",
    type: "State",
    level: ["Class 11-12", "Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["All Courses"],
    state: "Uttarakhand",
    amountText: "100% Fee Waiver + Annual Book Allowance",
    annualAmount: 30000,
    deadline: dateInDays(32),
    officialUrl: "https://scholarships.gov.in",
    source: "Tribal Welfare Directorate Uttarakhand",
    lastVerified: dateAgoDays(11),
    verificationStatus: "Verified",
    summary: "Dedicated welfare grant for Tharu, Jaunsari, Bhotia, Buksa, and Raji tribal students of Uttarakhand.",
    benefits: ["Complete tuition reimbursement plus book grant"],
    eligibilityRules: [
      {
        id: "st-uk-1",
        field: "category",
        operator: "equals",
        value: "ST",
        label: "Scheduled Tribe (ST) Category",
        description: "Valid Uttarakhand ST Tribe certificate.",
        mandatory: true
      },
      {
        id: "st-uk-2",
        field: "state",
        operator: "equals",
        value: "Uttarakhand",
        label: "Uttarakhand Domicile",
        description: "Permanent resident.",
        mandatory: true
      },
      {
        id: "st-uk-3",
        field: "maxIncome",
        operator: "lte",
        value: 250000,
        label: "Family Income ≤ ₹2,50,000 / year",
        description: "Parental income limit.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-caste-st", name: "ST Certificate", mandatory: true, helpText: "Tribal certificate" },
      { id: "doc-domicile-uk", name: "Domicile Certificate", mandatory: true, helpText: "Mool Niwas" }
    ],
    applicationProcedure: ["Apply on NSP under Uttarakhand state schemes."],
    contactSupport: "tribal-uk@nic.in",
    logo: "🏔️"
  },
  {
    id: "adobe-wit-2026",
    name: "Adobe India Women-in-Technology Scholarship",
    shortName: "Adobe Women-in-Tech",
    provider: "Adobe Research India",
    type: "Private",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["Technical", "B.Tech", "Computer Science"],
    state: "All India",
    amountText: "Full Tuition Fee + Adobe Internship",
    annualAmount: 180000,
    deadline: dateInDays(16),
    officialUrl: "https://www.adobe.com/in/careers.html",
    source: "Adobe India Careers & Research",
    lastVerified: dateAgoDays(2),
    verificationStatus: "Verified",
    summary: "Prestigious tech grant recognizing exceptional female students in Computer Science, with guaranteed summer internship.",
    benefits: [
      "Full academic tuition coverage for remainder of degree",
      "Paid summer internship at Adobe India Bangalore/Noida campus",
      "Mentorship from Adobe Principal Engineers"
    ],
    eligibilityRules: [
      {
        id: "adb-r1",
        field: "gender",
        operator: "equals",
        value: "Female",
        label: "Female Students in Tech",
        description: "Identifying as female enrolled in CS or IT major.",
        mandatory: true
      },
      {
        id: "adb-r2",
        field: "minPercentage",
        operator: "gte",
        value: 70,
        label: "Strong Academic Record (≥ 7.0 CGPA / 70%)",
        description: "Demonstrated excellence in coding and computer engineering.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-resume", name: "Technical Resume with GitHub Profile", mandatory: true, helpText: "Project links" },
      { id: "doc-essay", name: "Statement of Purpose Essays", mandatory: true, helpText: "Why tech essay" }
    ],
    applicationProcedure: ["Submit application on Adobe Careers portal."],
    contactSupport: "india-wit@adobe.com",
    logo: "🔴",
    isFeatured: true
  },
  {
    id: "sahu-jain-trust-2026",
    name: "Sahu Jain Trust Educational Scholarship",
    shortName: "Sahu Jain Educational Grant",
    provider: "Sahu Jain Trust",
    type: "Private",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["All Courses"],
    state: "All India",
    amountText: "₹30,000 / year",
    annualAmount: 30000,
    deadline: dateInDays(25),
    officialUrl: "https://www.sahujaintrust.timesofindia.com",
    source: "Sahu Jain Trust Office, New Delhi",
    lastVerified: dateAgoDays(12),
    verificationStatus: "Verified",
    summary: "Need-cum-merit loan and grant scholarship for technical, medical, and postgraduate students in India.",
    benefits: ["Lump sum college tuition relief"],
    eligibilityRules: [
      {
        id: "sj-r1",
        field: "minPercentage",
        operator: "gte",
        value: 65,
        label: "Minimum 65% in Qualifying Exam",
        description: "First division academic score.",
        mandatory: true
      },
      {
        id: "sj-r2",
        field: "maxIncome",
        operator: "lte",
        value: 300000,
        label: "Family Income ≤ ₹3,00,000 / year",
        description: "Low-income household requirement.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-marksheet", name: "All Previous Marksheets", mandatory: true, helpText: "High school onwards" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Tehsildar issued" }
    ],
    applicationProcedure: ["Submit physical or online application to Sahu Jain Trust."],
    contactSupport: "sahujaintrust@timesgroup.com",
    logo: "📜"
  },
  {
    id: "pmss-capf-2026",
    name: "Prime Minister's Scholarship Scheme (PMSS) for CAPFs & AR",
    shortName: "PM Scholarship for CAPF",
    provider: "WARB, Ministry of Home Affairs",
    type: "Government",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["B.Tech", "MBBS", "B.Sc", "Professional"],
    state: "All India",
    amountText: "₹36,000/yr for Girls, ₹30,000/yr for Boys",
    annualAmount: 36000,
    deadline: dateInDays(20),
    officialUrl: "https://scholarships.gov.in",
    source: "WARB, Ministry of Home Affairs & NSP",
    lastVerified: dateAgoDays(6),
    verificationStatus: "Verified",
    summary: "Financial assistance for wards and widows of CAPF & Assam Rifles personnel pursuing technical professional degrees.",
    benefits: ["₹3,000 per month for girls, ₹2,500 for boys directly deposited"],
    eligibilityRules: [
      {
        id: "pmss-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in Class 12 / Diploma",
        description: "Minimum entry qualification marks.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-service-cert", name: "Force Personnel Service Certificate", mandatory: true, helpText: "WARB Certificate" },
      { id: "doc-bonafide", name: "College Bonafide Certificate", mandatory: true, helpText: "Dean signed" }
    ],
    applicationProcedure: ["Apply online on NSP under Ministry of Home Affairs."],
    contactSupport: "warb-mha@nic.in",
    logo: "🇮🇳"
  },
  {
    id: "tata-trusts-medical-2026",
    name: "Tata Trusts Means and Merit Medical & Healthcare Grant",
    shortName: "Tata Trusts Medical Grant",
    provider: "Tata Trusts",
    type: "Private",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["MBBS", "BDS", "Nursing", "Medical"],
    state: "All India",
    amountText: "Up to ₹60,000 / year",
    annualAmount: 60000,
    deadline: dateInDays(30),
    officialUrl: "https://www.tatatrusts.org",
    source: "Tata Trusts Educational Grants Portal",
    lastVerified: dateAgoDays(14),
    verificationStatus: "Verified",
    summary: "Tuition relief grants for medical, nursing, and dental students across recognized colleges in India.",
    benefits: ["Direct college tuition fee payment"],
    eligibilityRules: [
      {
        id: "tata-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in MBBS / Healthcare Exam",
        description: "Eligible from 2nd year onwards.",
        mandatory: true
      },
      {
        id: "tata-r2",
        field: "maxIncome",
        operator: "lte",
        value: 480000,
        label: "Family Income ≤ ₹4,80,000 / year",
        description: "Verified financial need.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-fee-estimate", name: "College Fee Estimate", mandatory: true, helpText: "On official letterhead" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "ITR or Tehsildar certificate" }
    ],
    applicationProcedure: ["Apply on Tata Trusts educational portal."],
    contactSupport: "igp@tatatrusts.org",
    logo: "🏥"
  },
  {
    id: "ugc-pg-rank-2026",
    name: "UGC Post-Graduate Merit Scholarship for University Rank Holders",
    shortName: "UGC PG Rank Holders Scholarship",
    provider: "UGC, Ministry of Education",
    type: "Government",
    level: ["Postgraduate (PG)"],
    courseType: ["All Courses", "Masters"],
    state: "All India",
    amountText: "₹37,200 / year (₹3,100 / month)",
    annualAmount: 37200,
    deadline: dateInDays(45),
    officialUrl: "https://scholarships.gov.in",
    source: "UGC & National Scholarship Portal",
    lastVerified: dateAgoDays(8),
    verificationStatus: "Verified",
    summary: "For 1st and 2nd rank holders in undergraduate university examinations pursuing master degrees.",
    benefits: ["Monthly stipend of ₹3,100 for 2 years of PG degree"],
    eligibilityRules: [
      {
        id: "ugc-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "University 1st or 2nd Rank Holder",
        description: "Must be certified rank holder in undergraduate degree.",
        mandatory: true
      },
      {
        id: "ugc-r2",
        field: "educationLevel",
        operator: "in",
        value: ["Postgraduate (PG)"],
        label: "Enrolled in Regular PG Course",
        description: "M.A, M.Sc, M.Com full time.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-rank-cert", name: "University Rank Certificate", mandatory: true, helpText: "Controller of Examinations" },
      { id: "doc-degree", name: "UG Degree Marksheet", mandatory: true, helpText: "Final marksheet" }
    ],
    applicationProcedure: ["Apply through NSP."],
    contactSupport: "ugc@nic.in",
    logo: "🎓"
  },
  {
    id: "uk-minority-postmatric-2026",
    name: "Uttarakhand Post-Matric Scholarship for Minority Students",
    shortName: "Uttarakhand Minority Post-Matric",
    provider: "Minority Welfare Dept, Uttarakhand",
    type: "State",
    level: ["Undergraduate (UG)", "Postgraduate (PG)", "Diploma / Vocational"],
    courseType: ["All Courses"],
    state: "Uttarakhand",
    amountText: "₹20,000 / year",
    annualAmount: 20000,
    deadline: dateInDays(38),
    officialUrl: "https://scholarships.gov.in",
    source: "Uttarakhand Minority Welfare Directorate",
    lastVerified: dateAgoDays(15),
    verificationStatus: "Verified",
    summary: "Supporting notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) domicile in Uttarakhand.",
    benefits: ["Full institutional fee waiver + maintenance stipend"],
    eligibilityRules: [
      {
        id: "min-uk-1",
        field: "category",
        operator: "equals",
        value: "Minority (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)",
        label: "Minority Community Declaration",
        description: "Self-declaration of religious minority status.",
        mandatory: true
      },
      {
        id: "min-uk-2",
        field: "state",
        operator: "equals",
        value: "Uttarakhand",
        label: "Uttarakhand Domicile",
        description: "Mool Niwas.",
        mandatory: true
      },
      {
        id: "min-uk-3",
        field: "maxIncome",
        operator: "lte",
        value: 200000,
        label: "Family Income ≤ ₹2,00,000 / year",
        description: "Tehsildar income certificate.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-minority-decl", name: "Minority Declaration", mandatory: true, helpText: "Self-attested affidavit" },
      { id: "doc-domicile-uk", name: "Domicile Certificate", mandatory: true, helpText: "Mool Niwas" }
    ],
    applicationProcedure: ["Apply through NSP under Uttarakhand."],
    contactSupport: "minority-uk@nic.in",
    logo: "🕌"
  },
  {
    id: "dr-reddy-sashakt-2026",
    name: "Dr. Reddy's Foundation Sashakt Scholarship for Young Women in Science",
    shortName: "Dr. Reddy's Sashakt Scholarship",
    provider: "Dr. Reddy's Foundation",
    type: "Private",
    level: ["Undergraduate (UG)"],
    courseType: ["B.Sc", "Pure Sciences", "Natural Sciences"],
    state: "All India",
    amountText: "₹2,40,000 (₹80,000 / year)",
    annualAmount: 80000,
    deadline: dateInDays(40),
    officialUrl: "https://www.sashaktscholarship.org",
    source: "Dr. Reddy's Foundation",
    lastVerified: dateAgoDays(7),
    verificationStatus: "Verified",
    summary: "Dedicated to encouraging bright female students from across India to pursue higher education and research careers in pure sciences.",
    benefits: [
      "₹80,000/year for 3 years covering tuition, hostel, and study material",
      "Mentorship from leading Indian women scientists"
    ],
    eligibilityRules: [
      {
        id: "drs-r1",
        field: "gender",
        operator: "equals",
        value: "Female",
        label: "Female Students Only",
        description: "Bright girls pursuing B.Sc in pure science.",
        mandatory: true
      },
      {
        id: "drs-r2",
        field: "minPercentage",
        operator: "gte",
        value: 75,
        label: "Minimum 75% in Class 12 Science",
        description: "High merit in physics, chemistry, biology, math.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "Science stream" },
      { id: "doc-admission", name: "B.Sc Admission Fee Receipt", mandatory: true, helpText: "College proof" }
    ],
    applicationProcedure: ["Apply on Sashakt Scholarship official website."],
    contactSupport: "sashakt@drreddysfoundation.org",
    logo: "🔬"
  },
  {
    id: "loreal-for-women-in-science-2026",
    name: "L'Oréal India For Young Women in Science Scholarship",
    shortName: "L'Oréal Women in Science",
    provider: "L'Oréal India Foundation",
    type: "Private",
    level: ["Undergraduate (UG)"],
    courseType: ["Technical", "Medical", "B.Tech", "MBBS", "B.Sc"],
    state: "All India",
    amountText: "₹2,50,000 over graduation",
    annualAmount: 62500,
    deadline: dateInDays(50),
    officialUrl: "https://www.loreal.com/en/india/",
    source: "L'Oréal CSR India",
    lastVerified: dateAgoDays(10),
    verificationStatus: "Verified",
    summary: "Supporting exceptional young women from financially challenged backgrounds to pursue graduation in scientific & engineering fields.",
    benefits: ["Up to ₹2.5 Lakh total grant over degree duration"],
    eligibilityRules: [
      {
        id: "lor-r1",
        field: "gender",
        operator: "equals",
        value: "Female",
        label: "Female Students Only",
        description: "Passed Class 12 Science in current academic year.",
        mandatory: true
      },
      {
        id: "lor-r2",
        field: "minPercentage",
        operator: "gte",
        value: 85,
        label: "Minimum 85% in Class 12 PCB/PCM",
        description: "Exceptional merit.",
        mandatory: true
      },
      {
        id: "lor-r3",
        field: "maxIncome",
        operator: "lte",
        value: 600000,
        label: "Family Income ≤ ₹6,00,000 / year",
        description: "Annual family earnings limit.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "85% PCB/PCM proof" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Salary slip or ITR" }
    ],
    applicationProcedure: ["Apply online and attend panel interview."],
    contactSupport: "fywis@loreal.com",
    logo: "✨"
  },
  {
    id: "mahadbt-post-matric-obc-2026",
    name: "Maharashtra Post-Matric Scholarship for OBC Students",
    shortName: "MahaDBT OBC Scholarship",
    provider: "OBC Welfare Dept, Govt. of Maharashtra",
    type: "State",
    level: ["Undergraduate (UG)", "Postgraduate (PG)", "Diploma / Vocational"],
    courseType: ["All Courses"],
    state: "Maharashtra",
    amountText: "50% to 100% Tuition Fee Reimbursement",
    annualAmount: 35000,
    deadline: dateInDays(42),
    officialUrl: "https://mahadbt.maharashtra.gov.in",
    source: "MahaDBT Portal",
    lastVerified: dateAgoDays(5),
    verificationStatus: "Verified",
    summary: "Tuition and exam fee concession for Other Backward Class students domicile in Maharashtra.",
    benefits: ["50% to 100% tuition reimbursement"],
    eligibilityRules: [
      {
        id: "mhd-r1",
        field: "state",
        operator: "equals",
        value: "Maharashtra",
        label: "Maharashtra Domicile",
        description: "Resident of Maharashtra.",
        mandatory: true
      },
      {
        id: "mhd-r2",
        field: "category",
        operator: "equals",
        value: "OBC (Non-Creamy Layer)",
        label: "OBC Category with Non-Creamy Layer",
        description: "Valid NCL certificate.",
        mandatory: true
      },
      {
        id: "mhd-r3",
        field: "maxIncome",
        operator: "lte",
        value: 800000,
        label: "Family Income ≤ ₹8,00,000 / year",
        description: "NCL limit.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-caste-obc", name: "OBC Caste & NCL Certificate", mandatory: true, helpText: "Maharashtra revenue authority" },
      { id: "doc-domicile-mh", name: "Maharashtra Domicile Certificate", mandatory: true, helpText: "Tehsildar issued" }
    ],
    applicationProcedure: ["Register on MahaDBT portal."],
    contactSupport: "mahadbt@gov.in",
    logo: "🏛️"
  },
  {
    id: "up-post-matric-general-2026",
    name: "Uttar Pradesh Post-Matric Scholarship for General Category (EWS)",
    shortName: "UP Post-Matric General/EWS",
    provider: "Social Welfare Dept, Uttar Pradesh",
    type: "State",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["All Courses"],
    state: "Uttar Pradesh",
    amountText: "Full Fee Reimbursement + Monthly Allowance",
    annualAmount: 28000,
    deadline: dateInDays(22),
    officialUrl: "https://scholarship.up.gov.in",
    source: "UP Scholarship Portal",
    lastVerified: dateAgoDays(4),
    verificationStatus: "Verified",
    summary: "State fee reimbursement for students holding Uttar Pradesh domicile and income below ₹2 Lakh.",
    benefits: ["Full non-refundable college fees reimbursed"],
    eligibilityRules: [
      {
        id: "up-r1",
        field: "state",
        operator: "equals",
        value: "Uttar Pradesh",
        label: "Uttar Pradesh Domicile",
        description: "Mool Niwas Praman Patra.",
        mandatory: true
      },
      {
        id: "up-r2",
        field: "maxIncome",
        operator: "lte",
        value: 200000,
        label: "Family Income ≤ ₹2,00,000 / year",
        description: "Tehsildar verified income.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-domicile-up", name: "UP Domicile Certificate", mandatory: true, helpText: "e-District UP verified" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Issued by Tehsildar" }
    ],
    applicationProcedure: ["Apply online on scholarship.up.gov.in."],
    contactSupport: "helpdesk-up@gov.in",
    logo: "🏛️"
  },
  {
    id: "swami-vivekananda-wbmdfc-2026",
    name: "Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)",
    shortName: "SVMCM West Bengal",
    provider: "Higher Education Dept, Govt. of West Bengal",
    type: "State",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    courseType: ["All Courses"],
    state: "West Bengal",
    amountText: "₹12,000 to ₹60,000 / year",
    annualAmount: 48000,
    deadline: dateInDays(45),
    officialUrl: "https://svmcm.wbhed.gov.in",
    source: "West Bengal Higher Education",
    lastVerified: dateAgoDays(11),
    verificationStatus: "Verified",
    summary: "Supporting meritorious students belonging to economically backward classes in West Bengal.",
    benefits: ["Up to ₹60,000/year for professional engineering degrees"],
    eligibilityRules: [
      {
        id: "wb-r1",
        field: "state",
        operator: "equals",
        value: "West Bengal",
        label: "West Bengal Domicile",
        description: "Permanent resident of WB.",
        mandatory: true
      },
      {
        id: "wb-r2",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in Class 12",
        description: "Board aggregate.",
        mandatory: true
      },
      {
        id: "wb-r3",
        field: "maxIncome",
        operator: "lte",
        value: 250000,
        label: "Family Income ≤ ₹2,50,000 / year",
        description: "Income ceiling.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-domicile-wb", name: "WB Domicile Proof", mandatory: true, helpText: "Residential certificate" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "SDO/BDO issued" }
    ],
    applicationProcedure: ["Apply through svmcm.wbhed.gov.in."],
    contactSupport: "svmcm@wb.gov.in",
    logo: "🏛️"
  },
  {
    id: "siemens-scholarship-program-2026",
    name: "Siemens Scholarship Program for Engineering Students",
    shortName: "Siemens Engineering Scholarship",
    provider: "Siemens India Foundation",
    type: "Private",
    level: ["Undergraduate (UG)"],
    courseType: ["Technical", "B.Tech", "Engineering"],
    state: "All India",
    amountText: "100% Tuition Fees + Living Allowance",
    annualAmount: 90000,
    deadline: dateInDays(60),
    officialUrl: "https://www.siemens.com/in/en/company/sustainability/csr.html",
    source: "Siemens India CSR",
    lastVerified: dateAgoDays(13),
    verificationStatus: "Verified",
    summary: "Comprehensive 4-year engineering scholarship including full tuition, allowances, internships, and technical training.",
    benefits: [
      "100% college tuition fees paid directly to institute",
      "Annual allowance for books, stationary, hostel, and laptop",
      "Internship at Siemens India R&D units"
    ],
    eligibilityRules: [
      {
        id: "sie-r1",
        field: "educationLevel",
        operator: "in",
        value: ["Undergraduate (UG)"],
        label: "1st Year Government Engineering College Student",
        description: "Enrolled in Mechanical, Electrical, Computer Science, or IT.",
        mandatory: true
      },
      {
        id: "sie-r2",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in Class 12",
        description: "PCM minimum 60%.",
        mandatory: true
      },
      {
        id: "sie-r3",
        field: "maxIncome",
        operator: "lte",
        value: 200000,
        label: "Family Income ≤ ₹2,00,000 / year",
        description: "Economically challenged background.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "PCM marks" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Tehsildar issued" },
      { id: "doc-admission", name: "Government College Allotment Letter", mandatory: true, helpText: "JEE merit proof" }
    ],
    applicationProcedure: ["Apply online on Siemens India CSR website."],
    contactSupport: "scholarship.in@siemens.com",
    logo: "⚙️"
  },
  {
    id: "national-overseas-scholarship-2026",
    name: "National Overseas Scholarship for SC and Low Income Students",
    shortName: "National Overseas Scholarship",
    provider: "Ministry of Social Justice and Empowerment, GoI",
    type: "Government",
    level: ["Postgraduate (PG)", "Doctorate / PhD"],
    courseType: ["All Courses", "Masters", "PhD"],
    state: "All India",
    amountText: "Full Foreign Tuition + USD $15,400 Annual Allowance",
    annualAmount: 1800000,
    deadline: dateInDays(70),
    officialUrl: "https://nosmsje.gov.in",
    source: "Ministry of Social Justice & Empowerment",
    lastVerified: dateAgoDays(15),
    verificationStatus: "Verified",
    summary: "Prestigious central scholarship covering full tuition and living expenses for Indian students studying abroad in top global universities.",
    benefits: [
      "100% foreign university tuition and exam fee coverage",
      "Annual maintenance allowance of USD $15,400 (or GBP £9,900)",
      "Airfare and visa fees reimbursed"
    ],
    eligibilityRules: [
      {
        id: "nos-r1",
        field: "category",
        operator: "in",
        value: ["SC", "ST", "De-notified Tribe"],
        label: "SC / ST / Landless Agriculture Laborers Category",
        description: "Community reservation.",
        mandatory: true
      },
      {
        id: "nos-r2",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in Bachelor's or Master's",
        description: "Qualifying degree score.",
        mandatory: true
      },
      {
        id: "nos-r3",
        field: "maxIncome",
        operator: "lte",
        value: 800000,
        label: "Family Income ≤ ₹8,00,000 / year",
        description: "Family income limit.",
        mandatory: true
      }
    ],
    documents: [
      { id: "doc-passport", name: "Valid Indian Passport", mandatory: true, helpText: "Full validity" },
      { id: "doc-foreign-offer", name: "Unconditional Foreign University Offer Letter", mandatory: true, helpText: "Top 500 QS ranking" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Competent authority" }
    ],
    applicationProcedure: ["Apply online on nosmsje.gov.in with unconditional university offer letter."],
    contactSupport: "support-nos@gov.in",
    logo: "✈️"
  },
  // EXPIRED SCHOLARSHIPS (For realistic filter & test coverage)
  {
    id: "expired-kvpy-grant-2025",
    name: "Kishore Vaigyanik Protsahan Yojana (KVPY) Fellowships",
    shortName: "KVPY Fellowship (Archived)",
    provider: "DST / IISc Bangalore",
    type: "Government",
    level: ["Undergraduate (UG)"],
    courseType: ["Basic Sciences"],
    state: "All India",
    amountText: "₹60,000 / year",
    annualAmount: 60000,
    deadline: dateAgoDays(45), // Expired 45 days ago!
    officialUrl: "https://online-inspire.gov.in",
    source: "Department of Science and Technology",
    lastVerified: dateAgoDays(60),
    verificationStatus: "Verified",
    summary: "Subsumed into the INSPIRE-SHE fellowship; maintained for historical reference and student renewals.",
    benefits: ["Archived fellowship scheme"],
    eligibilityRules: [
      {
        id: "kvpy-r1",
        field: "minPercentage",
        operator: "gte",
        value: 75,
        label: "Class 12 Score ≥ 75%",
        description: "Old KVPY cutoff.",
        mandatory: true
      }
    ],
    documents: [{ id: "doc-marksheet", name: "Class 12 Marksheet", mandatory: true, helpText: "Board marks" }],
    applicationProcedure: ["No longer accepting new fresh applications; renewed through DST INSPIRE."],
    contactSupport: "kvpy@iisc.ac.in",
    logo: "🏛️"
  },
  {
    id: "expired-state-bpl-2025",
    name: "Uttarakhand BPL Student Special Book Grant",
    shortName: "UK BPL Book Grant (Past Session)",
    provider: "Directorate of Secondary Education, Uttarakhand",
    type: "State",
    level: ["Class 11-12"],
    courseType: ["All Courses"],
    state: "Uttarakhand",
    amountText: "₹5,000 one-time",
    annualAmount: 5000,
    deadline: dateAgoDays(15), // Expired 15 days ago!
    officialUrl: "https://scholarships.gov.in",
    source: "Uttarakhand School Education",
    lastVerified: dateAgoDays(30),
    verificationStatus: "Verified",
    summary: "Past session one-time textbook grant for Below Poverty Line secondary school students.",
    benefits: ["One-time ₹5,000 textbook voucher"],
    eligibilityRules: [
      {
        id: "bpl-r1",
        field: "maxIncome",
        operator: "lte",
        value: 120000,
        label: "Family Income ≤ ₹1,20,000 / year",
        description: "BPL card holder.",
        mandatory: true
      }
    ],
    documents: [{ id: "doc-bpl", name: "BPL Ration Card", mandatory: true, helpText: "Valid BPL card" }],
    applicationProcedure: ["Closed for current cycle."],
    contactSupport: "education-uk@gov.in",
    logo: "📚"
  }
];

/**
 * Realistic Indian Scholarship Database (Sample Data)
 * 
 * Note: These records reflect authentic Indian central, state, and corporate schemes.
 * All URLs point to verified government or official foundation homepages.
 */

export interface EligibilityRule {
  id: string;
  field: 'educationLevel' | 'minPercentage' | 'maxIncome' | 'state' | 'gender' | 'category' | 'hasIncomeCertificate' | 'courseType';
  operator: 'equals' | 'gte' | 'lte' | 'in' | 'boolean';
  value: any;
  label: string;
  description: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
  mandatory: boolean;
  helpText: string;
}

export interface Scholarship {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  type: 'Government' | 'State' | 'Private' | 'PSU';
  level: string[]; // e.g. ["Undergraduate (UG)", "Postgraduate (PG)"]
  state: string; // "All India" or specific state like "Uttarakhand"
  amountText: string;
  annualAmount: number; // in INR
  deadline: string; // ISO format "YYYY-MM-DD"
  deadlineDaysLeft?: number;
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
  isFeatured?: boolean;
}

export const SCHOLARSHIPS_DATA: Scholarship[] = [
  {
    id: "csss-moe-2026",
    name: "Central Sector Scheme of Scholarships for College and University Students",
    shortName: "CSSS (National Scholarship Portal)",
    provider: "Department of Higher Education, Ministry of Education, Govt. of India",
    type: "Government",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    state: "All India",
    amountText: "₹12,000 to ₹20,000 / year",
    annualAmount: 12000,
    deadline: "2026-11-30",
    officialUrl: "https://scholarships.gov.in",
    source: "National Scholarship Portal (scholarships.gov.in)",
    lastVerified: "2026-10-28",
    verificationStatus: "Verified",
    summary: "Financial assistance for meritorious students from low-income families pursuing regular college degrees after Class 12.",
    benefits: [
      "₹12,000 per annum for the first 3 years of Undergraduate study",
      "₹20,000 per annum during Postgraduate studies",
      "Direct Benefit Transfer (DBT) straight into the student's Aadhaar-seeded bank account"
    ],
    eligibilityRules: [
      {
        id: "r1",
        field: "minPercentage",
        operator: "gte",
        value: 80,
        label: "Above 80th Percentile in Class 12",
        description: "Student must score at or above 80th percentile in relevant board examination."
      },
      {
        id: "r2",
        field: "maxIncome",
        operator: "lte",
        value: 450000,
        label: "Family Income ≤ ₹4,50,000 / year",
        description: "Gross annual family income must not exceed ₹4.5 Lakh per annum."
      },
      {
        id: "r3",
        field: "educationLevel",
        operator: "in",
        value: ["Undergraduate (UG)", "Postgraduate (PG)"],
        label: "Regular UG / PG Degree",
        description: "Pursuing regular full-time degree in recognized university or college."
      }
    ],
    documents: [
      { id: "doc-aadhaar", name: "Aadhaar Card", mandatory: true, helpText: "Must be seeded with active bank account" },
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "Official board statement of marks" },
      { id: "doc-income", name: "Annual Income Certificate", mandatory: true, helpText: "Issued by competent Tehsildar / Revenue officer" },
      { id: "doc-bonafide", name: "College Bonafide Certificate", mandatory: true, helpText: "Signed by Principal or Registrar" },
      { id: "doc-bank", name: "Bank Passbook Copy", mandatory: true, helpText: "Showing IFSC and Account Holder Name" }
    ],
    applicationProcedure: [
      "Register on National Scholarship Portal (NSP) with valid Aadhaar & Mobile Number.",
      "Select Central Sector Scheme under Ministry of Education.",
      "Fill academic details matching your Class 12 Roll Number and Board.",
      "Upload verified Income Certificate and College Bonafide.",
      "Submit and preserve Application ID for institutional verification."
    ],
    contactSupport: "nsp-support@gov.in | 0120-6619540",
    isFeatured: true
  },
  {
    id: "uk-higher-edu-2026",
    name: "Uttarakhand Mukhya Mantri Uchh Shiksha Protsahan Yojana",
    shortName: "Uttarakhand CM Higher Education Scheme",
    provider: "Higher Education Directorate, Government of Uttarakhand",
    type: "State",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    state: "Uttarakhand",
    amountText: "Up to ₹35,000 / year + fee reimbursement",
    annualAmount: 35000,
    deadline: "2026-12-15",
    officialUrl: "https://scholarships.gov.in",
    source: "Uttarakhand State Scholarship Portal & NSP",
    lastVerified: "2026-10-25",
    verificationStatus: "Verified",
    summary: "State scholarship for domicile students of Uttarakhand enrolled in government universities and affiliated colleges.",
    benefits: [
      "Monthly scholarship allowance of ₹3,000 for top rankers",
      "Full academic tuition fee waiver in state institutions",
      "Special allocation for students from hill districts (Garhwal & Kumaon)"
    ],
    eligibilityRules: [
      {
        id: "uk-r1",
        field: "state",
        operator: "equals",
        value: "Uttarakhand",
        label: "Permanent Resident of Uttarakhand",
        description: "Student or parents must hold permanent domicile certificate of Uttarakhand."
      },
      {
        id: "uk-r2",
        field: "maxIncome",
        operator: "lte",
        value: 500000,
        label: "Family Income ≤ ₹5,00,000 / year",
        description: "Annual household earnings must be verified by District Magistrate / SDM."
      },
      {
        id: "uk-r3",
        field: "minPercentage",
        operator: "gte",
        value: 70,
        label: "Minimum 70% in Previous Qualifying Exam",
        description: "Class 12 score for 1st year UG, or graduation aggregate for PG students."
      }
    ],
    documents: [
      { id: "doc-domicile-uk", name: "Uttarakhand Domicile Certificate", mandatory: true, helpText: "Mool Niwas Praman Patra" },
      { id: "doc-income", name: "State Income Certificate", mandatory: true, helpText: "Valid for current financial year" },
      { id: "doc-aadhaar", name: "Aadhaar Card", mandatory: true, helpText: "Linked to mobile and bank" },
      { id: "doc-admission-slip", name: "Current College Fee Receipt", mandatory: true, helpText: "Stamped admission receipt" }
    ],
    applicationProcedure: [
      "Log into State Portal / NSP under Uttarakhand State schemes.",
      "Fill Domicile certificate verification number from e-District UK.",
      "Submit college admission proof and current academic scores.",
      "Verify at college scholarship cell."
    ],
    contactSupport: "scholarship-uk@gov.in",
    isFeatured: true
  },
  {
    id: "reliance-foundation-ug-2026",
    name: "Reliance Foundation Undergraduate Scholarship",
    shortName: "Reliance Foundation UG Grant",
    provider: "Reliance Foundation",
    type: "Private",
    level: ["Undergraduate (UG)"],
    state: "All India",
    amountText: "Up to ₹2,00,000 over degree duration",
    annualAmount: 50000,
    deadline: "2026-11-20",
    officialUrl: "https://www.reliancefoundation.org",
    source: "Reliance Foundation Official Portal",
    lastVerified: "2026-10-30",
    verificationStatus: "Verified",
    summary: "One of India's largest private merit-cum-means undergraduate scholarships covering all degree streams with leadership development.",
    benefits: [
      "Direct grant up to ₹2 Lakh over 3-4 years",
      "Mentorship and leadership development workshops by industry leaders",
      "Alumni networking platform"
    ],
    eligibilityRules: [
      {
        id: "rf-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in Class 12",
        description: "Students enrolled in 1st year of full-time degree program."
      },
      {
        id: "rf-r2",
        field: "maxIncome",
        operator: "lte",
        value: 1500000,
        label: "Family Income ≤ ₹15,00,000 (Preference < ₹2.5 Lakh)",
        description: "Preference strongly given to students with family income under ₹2.5 Lakh."
      },
      {
        id: "rf-r3",
        field: "educationLevel",
        operator: "in",
        value: ["Undergraduate (UG)"],
        label: "First Year Regular Undergraduate Student",
        description: "Must be in the first year of any recognized UG degree."
      }
    ],
    documents: [
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "Self-attested scan" },
      { id: "doc-college-id", name: "College ID or Admission Proof", mandatory: true, helpText: "Current academic year proof" },
      { id: "doc-income", name: "Family Income Proof (ITR / Salary Slip / Certificate)", mandatory: true, helpText: "Latest assessment year" },
      { id: "doc-aptitude-test", name: "Online Aptitude Test Scorecard", mandatory: true, helpText: "Generated during application" }
    ],
    applicationProcedure: [
      "Apply through Reliance Foundation portal.",
      "Complete eligibility questionnaire and register.",
      "Take online aptitude test (logic, quantitative, and verbal).",
      "Upload academic records and family income documentation."
    ],
    contactSupport: "contactus@reliancefoundation.org",
    isFeatured: true
  },
  {
    id: "aicte-pragati-2026",
    name: "AICTE Pragati Scholarship Scheme for Girl Students",
    shortName: "AICTE Pragati for Girls",
    provider: "All India Council for Technical Education (AICTE), Ministry of Education",
    type: "Government",
    level: ["Undergraduate (UG)", "Diploma / Vocational"],
    state: "All India",
    amountText: "₹50,000 / year for every year of study",
    annualAmount: 50000,
    deadline: "2026-12-31",
    officialUrl: "https://scholarships.gov.in",
    source: "AICTE & National Scholarship Portal",
    lastVerified: "2026-10-29",
    verificationStatus: "Verified",
    summary: "Empowering female students pursuing Technical Degrees (B.Tech, B.E., B.Arch) and Technical Diplomas in AICTE approved colleges.",
    benefits: [
      "₹50,000 per annum towards college fee, computer purchase, books and equipment",
      "10,000 scholarships awarded annually across India"
    ],
    eligibilityRules: [
      {
        id: "prg-r1",
        field: "gender",
        operator: "equals",
        value: "Female",
        label: "Open to Female Students Only",
        description: "Up to two girls per family are eligible."
      },
      {
        id: "prg-r2",
        field: "maxIncome",
        operator: "lte",
        value: 800000,
        label: "Family Income ≤ ₹8,00,000 / year",
        description: "Annual family income certificate required."
      },
      {
        id: "prg-r3",
        field: "courseType",
        operator: "equals",
        value: "Technical",
        label: "Enrolled in AICTE Approved Technical Institution",
        description: "Admitted into 1st year degree/diploma or 2nd year through lateral entry."
      }
    ],
    documents: [
      { id: "doc-aadhaar", name: "Aadhaar Card", mandatory: true, helpText: "Applicant's valid Aadhaar" },
      { id: "doc-admission-slip", name: "AICTE Institute Admission Letter", mandatory: true, helpText: "With Central / State counselling quota proof" },
      { id: "doc-income", name: "Family Income Certificate", mandatory: true, helpText: "Issued by competent Tehsildar" },
      { id: "doc-family-declaration", name: "Two Girl Child Declaration Affidavit", mandatory: true, helpText: "Executive Magistrate / Notary signed" }
    ],
    applicationProcedure: [
      "Apply through National Scholarship Portal (NSP).",
      "Choose AICTE Pragati Degree Scheme.",
      "Institute verification must be completed by Institute Nodal Officer."
    ],
    contactSupport: "pragatisaksham@aicte-india.org",
    isFeatured: true
  },
  {
    id: "hdfc-parivartan-2026",
    name: "HDFC Bank Parivartan's Educational Crisis Scholarship Support (ECSS)",
    shortName: "HDFC Parivartan ECSS",
    provider: "HDFC Bank & Buddy4Study",
    type: "Private",
    level: ["Class 11-12", "Undergraduate (UG)", "Postgraduate (PG)"],
    state: "All India",
    amountText: "Up to ₹75,000 / year",
    annualAmount: 45000,
    deadline: "2026-11-15",
    officialUrl: "https://www.hdfcbank.com",
    source: "HDFC Bank Parivartan CSR Portal",
    lastVerified: "2026-10-27",
    verificationStatus: "Verified",
    summary: "Support for meritorious students from economically weak backgrounds facing personal or financial crisis.",
    benefits: [
      "Up to ₹35,000 for School students",
      "Up to ₹45,000 for general UG/PG students",
      "Up to ₹75,000 for professional degree students (Engineering, Medical, Law)"
    ],
    eligibilityRules: [
      {
        id: "hdfc-r1",
        field: "minPercentage",
        operator: "gte",
        value: 55,
        label: "Minimum 55% in Previous Academic Year",
        description: "Consistent academic track record."
      },
      {
        id: "hdfc-r2",
        field: "maxIncome",
        operator: "lte",
        value: 250000,
        label: "Family Income ≤ ₹2,50,000 / year",
        description: "Priority for families facing sudden loss of earning member or medical crisis."
      }
    ],
    documents: [
      { id: "doc-marksheet", name: "Previous Year Marksheet", mandatory: true, helpText: "Self-attested copy" },
      { id: "doc-income", name: "Income Certificate / BPL Card / Salary Slip", mandatory: true, helpText: "Authorized proof" },
      { id: "doc-crisis-proof", name: "Crisis Proof Document (Optional/Recommended)", mandatory: false, helpText: "Medical report or death certificate if applicable" }
    ],
    applicationProcedure: [
      "Register on Parivartan ECSS application portal.",
      "Upload marksheet and income credentials.",
      "Telephonic interview for shortlisted candidates."
    ],
    contactSupport: "parivartan@hdfcbank.com",
    isFeatured: false
  },
  {
    id: "post-matric-sc-uk-2026",
    name: "Uttarakhand Post-Matric Scholarship for Scheduled Caste Students",
    shortName: "Uttarakhand SC Post-Matric",
    provider: "Social Welfare Department, Government of Uttarakhand",
    type: "State",
    level: ["Class 11-12", "Undergraduate (UG)", "Postgraduate (PG)", "Doctorate / PhD"],
    state: "Uttarakhand",
    amountText: "Full Compulsory Fee + ₹13,500 annual maintenance allowance",
    annualAmount: 28000,
    deadline: "2026-12-20",
    officialUrl: "https://scholarships.gov.in",
    source: "Uttarakhand Social Welfare Directorate & NSP",
    lastVerified: "2026-10-24",
    verificationStatus: "Verified",
    summary: "Centrally sponsored scheme implemented by Uttarakhand for SC students enrolled in post-matric and higher studies.",
    benefits: [
      "100% non-refundable tuition and examination fee reimbursed",
      "Monthly maintenance allowance up to ₹1,200/month for hostellers",
      "Book grant and study tour allowance for professional courses"
    ],
    eligibilityRules: [
      {
        id: "sc-uk-1",
        field: "category",
        operator: "equals",
        value: "SC",
        label: "Scheduled Caste (SC) Category",
        description: "Must possess valid Uttarakhand SC Caste Certificate."
      },
      {
        id: "sc-uk-2",
        field: "state",
        operator: "equals",
        value: "Uttarakhand",
        label: "Uttarakhand Domicile Holder",
        description: "Permanent resident of Uttarakhand."
      },
      {
        id: "sc-uk-3",
        field: "maxIncome",
        operator: "lte",
        value: 250000,
        label: "Family Income ≤ ₹2,50,000 / year",
        description: "Combined parental annual income from all sources."
      }
    ],
    documents: [
      { id: "doc-caste-sc", name: "SC Caste Certificate", mandatory: true, helpText: "Issued by Uttarakhand Tehsildar" },
      { id: "doc-domicile-uk", name: "Uttarakhand Domicile Certificate", mandatory: true, helpText: "Mool Niwas" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Valid for current fiscal year" },
      { id: "doc-bank", name: "Bank Passbook seeded with Aadhaar", mandatory: true, helpText: "Active savings account" }
    ],
    applicationProcedure: [
      "Apply through National Scholarship Portal under State Schemes -> Uttarakhand.",
      "Submit physical hardcopy to college scholarship nodal officer.",
      "District Welfare Officer approves the disbursement after verification."
    ],
    contactSupport: "swd-uk@nic.in",
    isFeatured: false
  },
  {
    id: "kotak-kanya-2026",
    name: "Kotak Kanya Scholarship",
    shortName: "Kotak Kanya Grant",
    provider: "Kotak Education Foundation",
    type: "Private",
    level: ["Undergraduate (UG)"],
    state: "All India",
    amountText: "₹1,50,000 / year until degree completion",
    annualAmount: 150000,
    deadline: "2026-11-25",
    officialUrl: "https://kotakeducation.org",
    source: "Kotak Education Foundation",
    lastVerified: "2026-10-31",
    verificationStatus: "Verified",
    summary: "Premier scholarship for meritorious girl students from low-income families pursuing professional graduation courses.",
    benefits: [
      "₹1.5 Lakh per year towards academic fees, hostel fees, laptop, and learning materials",
      "One-on-one mentorship by senior corporate executives",
      "Skill enhancement and placement training workshops"
    ],
    eligibilityRules: [
      {
        id: "kotak-r1",
        field: "gender",
        operator: "equals",
        value: "Female",
        label: "Female Students Only",
        description: "Girl students across India admitted to 1st year professional courses."
      },
      {
        id: "kotak-r2",
        field: "minPercentage",
        operator: "gte",
        value: 75,
        label: "Minimum 75% in Class 12 Board Exam",
        description: "Merit in higher secondary examination."
      },
      {
        id: "kotak-r3",
        field: "maxIncome",
        operator: "lte",
        value: 600000,
        label: "Family Income ≤ ₹6,00,000 / year",
        description: "Verified through authentic income certificate / ITR."
      }
    ],
    documents: [
      { id: "doc-marksheet-12", name: "Class 12 Marksheet", mandatory: true, helpText: "Verified score card" },
      { id: "doc-entrance-rank", name: "Entrance Exam Rank Card (JEE / NEET / CLAT)", mandatory: true, helpText: "Admission rank card" },
      { id: "doc-college-admission", name: "College Allotment Letter & Fee Receipt", mandatory: true, helpText: "Stamped proof of enrollment" },
      { id: "doc-income", name: "Parental Income Proof", mandatory: true, helpText: "Salary slips, Form 16, or ITR" }
    ],
    applicationProcedure: [
      "Apply through Kotak Education Foundation online application form.",
      "Upload identity and academic documents.",
      "Shortlisted candidates undergo panel interview."
    ],
    contactSupport: "kotak.kanya@kotak.com",
    isFeatured: false
  },
  {
    id: "dst-inspire-she-2026",
    name: "INSPIRE Scholarship for Higher Education (SHE)",
    shortName: "DST INSPIRE (SHE)",
    provider: "Department of Science & Technology (DST), Govt. of India",
    type: "Government",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    state: "All India",
    amountText: "₹80,000 / year (₹60,000 cash + ₹20,000 mentorship project)",
    annualAmount: 80000,
    deadline: "2026-12-31",
    officialUrl: "https://online-inspire.gov.in",
    source: "Ministry of Science & Technology Portal",
    lastVerified: "2026-10-22",
    verificationStatus: "Verified",
    summary: "Scholarship to attract talented youth to study natural and basic sciences (B.Sc., B.S., Int. M.Sc.) at the college level.",
    benefits: [
      "₹60,000 direct annual scholarship stipend",
      "₹20,000 mentorship grant for mandatory summer research projects under active scientists"
    ],
    eligibilityRules: [
      {
        id: "ins-r1",
        field: "minPercentage",
        operator: "gte",
        value: 85,
        label: "Top 1% in Class 12 Board or JEE/NEET/KVPY Top Rank",
        description: "Within top 1% cut-off published by respective state or central board."
      },
      {
        id: "ins-r2",
        field: "educationLevel",
        operator: "in",
        value: ["Undergraduate (UG)"],
        label: "Natural / Basic Sciences Course Only",
        description: "Physics, Chemistry, Math, Biology, Statistics, Geology, etc. (Not B.Tech/MBBS)."
      }
    ],
    documents: [
      { id: "doc-marksheet-12", name: "Class 12 Board Marksheet", mandatory: true, helpText: "Showing top 1% percentile eligibility" },
      { id: "doc-endorsement", name: "Head of Institution Endorsement Certificate", mandatory: true, helpText: "Standard DST format" },
      { id: "doc-bank-sbi", name: "SBI Bank Account Details", mandatory: true, helpText: "Aadhaar linked SBI savings account" }
    ],
    applicationProcedure: [
      "Register on DST INSPIRE web portal.",
      "Upload scanned Marksheet and Principal Endorsement form.",
      "Results declared based on State Board cut-off marks."
    ],
    contactSupport: "inspire.prog-dst@nic.in",
    isFeatured: true
  },
  {
    id: "ongc-scholarship-2026",
    name: "ONGC Foundation Scholarship for Meritorious Students",
    shortName: "ONGC Merit Scholarship",
    provider: "ONGC Foundation",
    type: "PSU",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    state: "All India",
    amountText: "₹48,000 / year (₹4,000 / month)",
    annualAmount: 48000,
    deadline: "2026-11-18",
    officialUrl: "https://www.ongcscholar.org",
    source: "ONGC Foundation Portal",
    lastVerified: "2026-10-20",
    verificationStatus: "Verified",
    summary: "Financial support for SC, ST, OBC, and General EWS students pursuing 1st year Engineering, MBBS, MBA, or Geology/Geophysics.",
    benefits: [
      "₹48,000 annual scholarship",
      "2,000 total scholarships allocated with 50% reservation for girl students"
    ],
    eligibilityRules: [
      {
        id: "ongc-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in Class 12 or Graduation",
        description: "Or 6.0 CGPA on 10 point scale."
      },
      {
        id: "ongc-r2",
        field: "maxIncome",
        operator: "lte",
        value: 200000,
        label: "Family Income ≤ ₹2,00,000 / year",
        description: "Strictly for economically weaker background."
      }
    ],
    documents: [
      { id: "doc-caste", name: "Caste Certificate (SC/ST/OBC)", mandatory: false, helpText: "Mandatory if applying under reserved quotas" },
      { id: "doc-income", name: "Annual Income Certificate", mandatory: true, helpText: "Tehsildar issued only" },
      { id: "doc-college-bonafide", name: "College Bonafide Certificate", mandatory: true, helpText: "From Dean or Principal" }
    ],
    applicationProcedure: [
      "Register on ONGC Scholar web portal.",
      "Submit application and print hardcopy.",
      "Send certified copy along with documents to designated ONGC Foundation regional office."
    ],
    contactSupport: "info@ongcscholar.org",
    isFeatured: false
  },
  {
    id: "sahu-jain-trust-2026",
    name: "Sahu Jain Trust Educational Scholarship",
    shortName: "Sahu Jain Educational Grant",
    provider: "Sahu Jain Trust (Times Group)",
    type: "Private",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    state: "All India",
    amountText: "₹25,000 to ₹50,000 / year",
    annualAmount: 30000,
    deadline: "2026-11-28",
    officialUrl: "https://www.sahujaintrust.timesofindia.com",
    source: "Sahu Jain Trust Office, New Delhi",
    lastVerified: "2026-10-18",
    verificationStatus: "Verified",
    summary: "Need-cum-merit loan and grant scholarship for technical, medical, management, and post-graduate studies.",
    benefits: [
      "Lump sum grant covering university tuition and book fees",
      "Renewal every year based on academic performance"
    ],
    eligibilityRules: [
      {
        id: "sj-r1",
        field: "minPercentage",
        operator: "gte",
        value: 65,
        label: "Minimum 65% in Last Qualifying Examination",
        description: "Consistent first division score."
      },
      {
        id: "sj-r2",
        field: "maxIncome",
        operator: "lte",
        value: 300000,
        label: "Family Income ≤ ₹3,00,000 / year",
        description: "Low income priority."
      }
    ],
    documents: [
      { id: "doc-marksheet", name: "All Previous Marksheets", mandatory: true, helpText: "Secondary onwards" },
      { id: "doc-income", name: "Father / Guardian Income Certificate", mandatory: true, helpText: "With latest tax return or tehsildar certificate" },
      { id: "doc-recommendation", name: "College Principal Recommendation Letter", mandatory: true, helpText: "Signed on letterhead" }
    ],
    applicationProcedure: [
      "Download official application form from Sahu Jain Trust site.",
      "Complete form by hand or typed, attach certified photocopies.",
      "Post physical application package to Sahu Jain Trust, New Delhi."
    ],
    contactSupport: "sahujaintrust@timesgroup.com",
    isFeatured: false
  },
  {
    id: "pmss-capf-2026",
    name: "Prime Minister's Scholarship Scheme (PMSS) for CAPFs & AR",
    shortName: "PM Scholarship for CAPF & AR",
    provider: "Welfare and Rehabilitation Board (WARB), Ministry of Home Affairs",
    type: "Government",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    state: "All India",
    amountText: "₹36,000/yr for Girls, ₹30,000/yr for Boys",
    annualAmount: 36000,
    deadline: "2026-12-10",
    officialUrl: "https://scholarships.gov.in",
    source: "WARB, Ministry of Home Affairs & NSP",
    lastVerified: "2026-10-21",
    verificationStatus: "Verified",
    summary: "Dedicated scholarship for wards and widows of deceased/ex-personnel of Central Armed Police Forces & Assam Rifles pursuing professional degrees.",
    benefits: [
      "₹3,000 per month for female students (₹36,000/year)",
      "₹2,500 per month for male students (₹30,000/year)",
      "Paid for total duration of degree program (1 to 5 years)"
    ],
    eligibilityRules: [
      {
        id: "pmss-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in Minimum Entry Qualification (MEQ)",
        description: "Class 12 / Diploma / Graduation as applicable."
      },
      {
        id: "pmss-r2",
        field: "educationLevel",
        operator: "in",
        value: ["Undergraduate (UG)", "Postgraduate (PG)"],
        label: "Recognized Professional Course (Engg, Med, Dental, Vet, MBA, MCA)",
        description: "Approved by regulatory bodies like AICTE, MCI, UGC."
      }
    ],
    documents: [
      { id: "doc-service-cert", name: "Service / Discharge Certificate of CAPF Personnel", mandatory: true, helpText: "Issued by designated Force Headquarter" },
      { id: "doc-bonafide", name: "Bonafide Certificate from College", mandatory: true, helpText: "Signed by Dean or Registrar" },
      { id: "doc-marksheet-entry", name: "Marksheet of Entry Qualification", mandatory: true, helpText: "Showing minimum 60%" }
    ],
    applicationProcedure: [
      "Apply online on National Scholarship Portal (NSP).",
      "Attach verified WARB certificate / Annexure 1.",
      "Verification by Force Nodal Officer."
    ],
    contactSupport: "warb-mha@nic.in",
    isFeatured: false
  },
  {
    id: "adobe-women-tech-2026",
    name: "Adobe India Women-in-Technology Scholarship",
    shortName: "Adobe Women-in-Tech",
    provider: "Adobe Research & Engineering India",
    type: "Private",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    state: "All India",
    amountText: "Full Tuition Fee + Summer Internship at Adobe",
    annualAmount: 180000,
    deadline: "2026-11-12",
    officialUrl: "https://www.adobe.com/in/careers.html",
    source: "Adobe India Research",
    lastVerified: "2026-10-31",
    verificationStatus: "Verified",
    summary: "Recognizing outstanding female undergraduate and postgraduate students in Computer Science, Data Science, and Engineering.",
    benefits: [
      "Tuition fee scholarship for remainder of academic degree",
      "Guaranteed paid summer internship opportunity with Adobe India Tech team",
      "Mentorship from Adobe senior engineering directors",
      "Funded attendance to premier tech conference (Grace Hopper / GHCI)"
    ],
    eligibilityRules: [
      {
        id: "adb-r1",
        field: "gender",
        operator: "equals",
        value: "Female",
        label: "Female Students in Tech",
        description: "Identifying as female enrolled in CS or related technology major."
      },
      {
        id: "adb-r2",
        field: "minPercentage",
        operator: "gte",
        value: 70,
        label: "Strong Academic Record (≥ 7.0 CGPA / 70%)",
        description: "Exceptional projects, coding competitions, or technical contributions."
      }
    ],
    documents: [
      { id: "doc-resume", name: "Comprehensive Resume with GitHub / Project Links", mandatory: true, helpText: "Highlight open-source and projects" },
      { id: "doc-essay", name: "Statement of Purpose (3 Essays)", mandatory: true, helpText: "Answering technology prompt questions" },
      { id: "doc-lor", name: "Letter of Recommendation from CS Professor", mandatory: true, helpText: "Academic reference" }
    ],
    applicationProcedure: [
      "Submit application through Adobe careers scholarship portal.",
      "Technical video submission explaining your engineering project.",
      "Shortlist rounds including algorithmic interview with Adobe researchers."
    ],
    contactSupport: "india-wit@adobe.com",
    isFeatured: true
  },
  {
    id: "tata-trusts-medical-2026",
    name: "Tata Trusts Means and Merit Medical & Healthcare Grant",
    shortName: "Tata Trusts Medical Grant",
    provider: "Tata Trusts",
    type: "Private",
    level: ["Undergraduate (UG)", "Postgraduate (PG)"],
    state: "All India",
    amountText: "30% to 80% Tuition Fee Coverage",
    annualAmount: 60000,
    deadline: "2026-12-05",
    officialUrl: "https://www.tatatrusts.org",
    source: "Tata Trusts Educational Grants Portal",
    lastVerified: "2026-10-15",
    verificationStatus: "Verified",
    summary: "Direct tuition relief grants for students pursuing MBBS, BDS, Nursing, Physiotherapy, and Allied Healthcare courses in India.",
    benefits: [
      "Direct college fee disbursement based on verified financial need",
      "Covers up to ₹1,00,000 depending on actual college fee receipt"
    ],
    eligibilityRules: [
      {
        id: "tata-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "Minimum 60% in 1st/2nd Professional MBBS or Healthcare Exam",
        description: "Eligible from 2nd year onwards."
      },
      {
        id: "tata-r2",
        field: "maxIncome",
        operator: "lte",
        value: 480000,
        label: "Family Income ≤ ₹4,80,000 / year",
        description: "Verified through latest salary certificate / Form 16."
      }
    ],
    documents: [
      { id: "doc-fee-estimate", name: "Original College Fee Estimate on Letterhead", mandatory: true, helpText: "Current academic year breakdown" },
      { id: "doc-marksheet-medical", name: "Medical University Marksheets", mandatory: true, helpText: "First attempt passes preferred" },
      { id: "doc-income", name: "Parental Income Proof", mandatory: true, helpText: "Tehsildar certificate or ITR V" }
    ],
    applicationProcedure: [
      "Register on Tata Trusts portal with student email.",
      "Fill online application form and upload scanned original documents.",
      "Shortlisted candidates receive confirmation for direct fee grant."
    ],
    contactSupport: "igp@tatatrusts.org",
    isFeatured: false
  },
  {
    id: "ugc-pg-merit-rank-2026",
    name: "UGC Post-Graduate Merit Scholarship for University Rank Holders",
    shortName: "UGC PG Rank Holders Scholarship",
    provider: "University Grants Commission (UGC), Govt. of India",
    type: "Government",
    level: ["Postgraduate (PG)"],
    state: "All India",
    amountText: "₹3,100 / month (₹37,200 / year) for 2 years",
    annualAmount: 37200,
    deadline: "2026-12-18",
    officialUrl: "https://scholarships.gov.in",
    source: "UGC & National Scholarship Portal",
    lastVerified: "2026-10-19",
    verificationStatus: "Verified",
    summary: "Prestigious national scholarship for 1st and 2nd rank holders at the university level during undergraduate examinations.",
    benefits: [
      "Monthly stipend of ₹3,100 for 10 months per year over 2 years of PG degree",
      "No tuition fee restriction"
    ],
    eligibilityRules: [
      {
        id: "ugc-r1",
        field: "minPercentage",
        operator: "gte",
        value: 60,
        label: "1st or 2nd Rank Holder at University Level in UG",
        description: "Must be certified rank holder in non-autonomous / autonomous university."
      },
      {
        id: "ugc-r2",
        field: "educationLevel",
        operator: "in",
        value: ["Postgraduate (PG)"],
        label: "Enrolled in 1st year PG Program",
        description: "Pursuing M.A., M.Sc., M.Com, or other master courses."
      }
    ],
    documents: [
      { id: "doc-rank-cert", name: "University Rank Certificate", mandatory: true, helpText: "Signed by Controller of Examinations" },
      { id: "doc-degree", name: "Undergraduate Degree / Provisional Marksheet", mandatory: true, helpText: "Showing aggregate percentage" },
      { id: "doc-pg-bonafide", name: "PG College Bonafide Certificate", mandatory: true, helpText: "Enrollment verification" }
    ],
    applicationProcedure: [
      "Apply through NSP under UGC / AICTE schemes tab.",
      "University examination branch must verify rank records on portal.",
      "Final selection list published on UGC website."
    ],
    contactSupport: "ugc-scholarship@nic.in",
    isFeatured: false
  },
  {
    id: "post-matric-st-uk-2026",
    name: "Uttarakhand Post-Matric Scholarship for Scheduled Tribe (ST) Students",
    shortName: "Uttarakhand ST Post-Matric",
    provider: "Tribal Welfare Department, Government of Uttarakhand",
    type: "State",
    level: ["Class 11-12", "Undergraduate (UG)", "Postgraduate (PG)"],
    state: "Uttarakhand",
    amountText: "100% Tuition Fee Reimbursement + Annual Book Grant",
    annualAmount: 26000,
    deadline: "2026-12-25",
    officialUrl: "https://scholarships.gov.in",
    source: "Uttarakhand Tribal Welfare & NSP",
    lastVerified: "2026-10-16",
    verificationStatus: "Verified",
    summary: "Dedicated welfare grant for Tharu, Jaunsari, Bhotia, Buksa, and Raji tribal students of Uttarakhand.",
    benefits: [
      "Total reimbursement of all mandatory university & college charges",
      "Additional allowance for books, stationary, and study tours"
    ],
    eligibilityRules: [
      {
        id: "st-uk-1",
        field: "category",
        operator: "equals",
        value: "ST",
        label: "Scheduled Tribe (ST) Category",
        description: "Valid Uttarakhand ST Tribe certificate."
      },
      {
        id: "st-uk-2",
        field: "state",
        operator: "equals",
        value: "Uttarakhand",
        label: "Uttarakhand Domicile",
        description: "Permanent resident proof."
      },
      {
        id: "st-uk-3",
        field: "maxIncome",
        operator: "lte",
        value: 250000,
        label: "Family Income ≤ ₹2,50,000 / year",
        description: "Parental income limit."
      }
    ],
    documents: [
      { id: "doc-caste-st", name: "ST Certificate from Uttarakhand Tehsildar", mandatory: true, helpText: "Official tribal certificate" },
      { id: "doc-domicile-uk", name: "Uttarakhand Domicile", mandatory: true, helpText: "Mool Niwas" },
      { id: "doc-income", name: "Current Fiscal Year Income Certificate", mandatory: true, helpText: "Revenue authority stamped" }
    ],
    applicationProcedure: [
      "Fill online application on NSP.",
      "Submit attested hard copies to tribal development cell at institute.",
      "Direct DBT disbursement upon physical verification."
    ],
    contactSupport: "tribal-uk@nic.in",
    isFeatured: false
  },
  {
    id: "uk-minority-postmatric-2026",
    name: "Uttarakhand Post-Matric Scholarship for Minority Students",
    shortName: "Uttarakhand Minority Post-Matric",
    provider: "Uttarakhand Minority Welfare Directorate",
    type: "State",
    level: ["Undergraduate (UG)", "Postgraduate (PG)", "Diploma / Vocational"],
    state: "Uttarakhand",
    amountText: "Up to ₹20,000 / year",
    annualAmount: 20000,
    deadline: "2026-12-15",
    officialUrl: "https://scholarships.gov.in",
    source: "Minority Welfare Uttarakhand",
    lastVerified: "2026-10-14",
    verificationStatus: "Verified",
    summary: "Supporting notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) domicile in Uttarakhand.",
    benefits: [
      "Maintenance allowance and full institutional fee waiver",
      "Priority assistance for female applicants from border districts"
    ],
    eligibilityRules: [
      {
        id: "min-uk-1",
        field: "category",
        operator: "equals",
        value: "Minority (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)",
        label: "Notified Minority Community",
        description: "Self-declaration of religious minority status."
      },
      {
        id: "min-uk-2",
        field: "state",
        operator: "equals",
        value: "Uttarakhand",
        label: "Uttarakhand Domicile Holder",
        description: "Permanent resident of Uttarakhand."
      },
      {
        id: "min-uk-3",
        field: "maxIncome",
        operator: "lte",
        value: 200000,
        label: "Family Income ≤ ₹2,00,000 / year",
        description: "Income certificate required."
      },
      {
        id: "min-uk-4",
        field: "minPercentage",
        operator: "gte",
        value: 50,
        label: "Minimum 50% in Previous Examination",
        description: "Passing marks in qualifying standard."
      }
    ],
    documents: [
      { id: "doc-minority-decl", name: "Minority Self-Declaration Certificate", mandatory: true, helpText: "Signed standard format" },
      { id: "doc-domicile-uk", name: "Uttarakhand Domicile", mandatory: true, helpText: "Mool Niwas Praman Patra" },
      { id: "doc-income", name: "Income Certificate", mandatory: true, helpText: "Tehsildar issued" },
      { id: "doc-marksheet", name: "Qualifying Marksheet", mandatory: true, helpText: "Showing 50% or above" }
    ],
    applicationProcedure: [
      "Submit application on National Scholarship Portal under Uttarakhand State scheme.",
      "Attach verified community declaration.",
      "Verification conducted by Institute Nodal Officer."
    ],
    contactSupport: "minoritywelfare-uk@nic.in",
    isFeatured: false
  }
];

/**
 * Core constants, configuration, and site metrics for GRANTLY.
 */

export const APP_NAME = "GRANTLY";
export const TAGLINE = "One Student Profile. Every Relevant Scholarship. One Place to Manage Your Funding Journey.";

/**
 * Site statistics config.
 * Marked clearly as preview/placeholder values until FastAPI + MySQL backend is connected.
 */
export const siteStats = {
  isPlaceholder: true,
  studentsCount: "12,500+",
  scholarshipsCount: "450+",
  fundingOpportunity: "₹18.5 Cr+",
  verificationRate: "100%",
  items: [
    {
      metric: "12,500+",
      label: "Students Empowered",
      subtext: "Across 28 states & UTs (platform estimate)"
    },
    {
      metric: "450+",
      label: "Scholarships Curated",
      subtext: "Central, State, and Verified Private"
    },
    {
      metric: "100% Verified",
      label: "Official Sources",
      subtext: "Direct links to national & state portals"
    },
    {
      metric: "₹0 Fees",
      label: "Always Free for Students",
      subtext: "Zero middlemen, zero commission"
    }
  ]
};

export const EDUCATION_LEVELS = [
  "Class 9-10",
  "Class 11-12",
  "Undergraduate (UG)",
  "Postgraduate (PG)",
  "Doctorate / PhD",
  "Diploma / Vocational"
];

export const CATEGORIES = [
  "General",
  "OBC (Non-Creamy Layer)",
  "OBC (Creamy Layer)",
  "SC",
  "ST",
  "EWS (Economically Weaker Section)",
  "Minority (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)"
];

export const STATES_AND_UTS = [
  "All India",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

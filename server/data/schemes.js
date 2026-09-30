// export const REAL_GOVT_SCHEMES = [
//   // Central & State Schemes for No Formal Education / Manual Laborers
//   {
//     id: "pm-svanidhi",
//     title: "PM SVANidhi (Street Vendor's AtmaNirbhar Nidhi)",
//     category: "Business & Self-Employment",
//     state: "All India (Central)",
//     educationRequired: "None / No Formal Education",
//     incomeLimit: 300000,
//     benefit: "Collateral-free working capital micro-loan up to ₹50,000 with 7% interest subsidy.",
//     eligibility: "Street vendors, hawkers, and informal micro-entrepreneurs across urban/rural areas.",
//     documents: ["Aadhaar Card", "Voter ID / Certificate of Vending", "Bank Passbook"],
//     officialUrl: "https://pmsvanidhi.mohua.gov.in/"
//   },
//   {
//     id: "pm-vishwakarma",
//     title: "PM Vishwakarma Scheme",
//     category: "Skill & Artisans",
//     state: "All India (Central)",
//     educationRequired: "None / No Formal Education",
//     incomeLimit: 250000,
//     benefit: "₹15,000 e-voucher for toolkits, skill training stipend, and loans up to ₹3 Lakhs at 5% interest.",
//     eligibility: "Traditional artisans and craftspeople (Carpenters, Blacksmiths, Tailors, Cobblers, Locksmiths, etc.).",
//     documents: ["Aadhaar Card", "Bank Account Details", "Mobile Number linked with Aadhaar"],
//     officialUrl: "https://pmvishwakarma.gov.in/"
//   },
//   {
//     id: "lakshmir-bhandar",
//     title: "Lakshmir Bhandar Prakalpa",
//     category: "Financial Assistance",
//     state: "West Bengal",
//     educationRequired: "None / No Formal Education",
//     incomeLimit: 200000,
//     benefit: "Direct Benefit Transfer (DBT) of ₹1,000/month (General) or ₹1,200/month (SC/ST).",
//     eligibility: "Resident women of West Bengal aged 25–60 years not in regular government employment.",
//     documents: ["Aadhaar Card", "Swasthya Sathi Card", "SC/ST Certificate (if applicable)", "Bank Passbook"],
//     officialUrl: "https://socialsecurity.wb.gov.in/"
//   },
//   {
//     id: "mgnrega",
//     title: "Mahatma Gandhi NREGA (100 Days Work)",
//     category: "Employment & Wage",
//     state: "All India (Central)",
//     educationRequired: "None / No Formal Education",
//     incomeLimit: 150000,
//     benefit: "Guaranteed 100 days of unskilled manual wage employment per household per year.",
//     eligibility: "Adult members of rural households willing to do unskilled manual labor.",
//     documents: ["Job Card", "Aadhaar Card", "Bank Account Details"],
//     officialUrl: "https://nrega.nic.in/"
//   },

//   // Students & Education Schemes
//   {
//     id: "kanyashree",
//     title: "Kanyashree Prakalpa (K1, K2 & K3)",
//     category: "Education",
//     state: "West Bengal",
//     educationRequired: "School / College Student",
//     incomeLimit: 150000,
//     benefit: "Annual scholarship of ₹1,000 (K1) and one-time grant of ₹25,000 upon turning 18 (K2).",
//     eligibility: "Unmarried female students aged 13–19 enrolled in recognized schools/colleges in WB.",
//     documents: ["Student ID", "Age Proof Certificate", "Income Certificate", "Bank Account Details"],
//     officialUrl: "https://wbkanyashree.gov.in/"
//   },
//   {
//     id: "wb-student-credit-card",
//     title: "West Bengal Student Credit Card",
//     category: "Higher Education Loan",
//     state: "West Bengal",
//     educationRequired: "Higher Education",
//     incomeLimit: 1000000,
//     benefit: "Education loan up to ₹10 Lakhs at 4% simple interest rate with long repayment tenure.",
//     eligibility: "Students residing in West Bengal for at least 10 years enrolled in Indian or foreign institutes.",
//     documents: ["Aadhaar Card", "Class 10th/12th Marksheet", "Admission Receipt", "Co-borrower PAN Card"],
//     officialUrl: "https://wbscc.wb.gov.in/"
//   },

//   // Farmers & Healthcare
//   {
//     id: "pm-kisan",
//     title: "PM-KISAN Samman Nidhi",
//     category: "Agriculture",
//     state: "All India (Central)",
//     educationRequired: "None / No Formal Education",
//     incomeLimit: 400000,
//     benefit: "Financial assistance of ₹6,000/year transferred directly into bank accounts in 3 equal installments.",
//     eligibility: "Small and marginal landholding farmer families across India.",
//     documents: ["Land Ownership Records", "Aadhaar Card", "Bank Passbook"],
//     officialUrl: "https://pmkisan.gov.in/"
//   },
//   {
//     id: "ayushman-bharat",
//     title: "Ayushman Bharat (PM-JAY)",
//     category: "Healthcare",
//     state: "All India (Central)",
//     educationRequired: "None / No Formal Education",
//     incomeLimit: 300000,
//     benefit: "Free health cover up to ₹5 Lakhs per family per year for secondary and tertiary hospitalization.",
//     eligibility: "Low-income families listed under SECC database & all senior citizens aged 70 and above.",
//     documents: ["Aadhaar Card", "Ration Card / Ayushman Card"],
//     officialUrl: "https://pmjay.gov.in/"
//   }
// ];


const schemes = [
  {
    name: "PM-KISAN",
    slug: "pm-kisan",
    category: "Agriculture",
    level: "Central",
    state: "All",
    description:
      "Income support scheme for eligible landholding farmer families.",
    eligibility:
      "Eligible farmer families owning cultivable land, subject to applicable exclusions.",
    benefits: [
      "Direct income support",
      "Benefit transferred to eligible farmer accounts",
    ],
    officialUrl:
      "https://pmkisan.gov.in/",
    rules: [
      {
        field: "occupation",
        operator: "EQUALS",
        value: "Farmer",
      },
      {
        field: "state",
        operator: "NOT_EQUALS",
        value: "Not Eligible",
      },
    ],
    isActive: true,
  },

  {
    name: "PMAY-G",
    slug: "pmay-g",
    category: "Housing",
    level: "Central",
    state: "All",
    description:
      "Housing assistance for eligible rural households.",
    eligibility:
      "Eligibility depends on rural housing deprivation and applicable government criteria.",
    benefits: [
      "Financial assistance for rural housing",
    ],
    officialUrl:
      "https://pmayg.nic.in/",
    rules: [
      {
        field: "income",
        operator: "LESS_THAN_EQUAL",
        value: 300000,
      },
    ],
    isActive: true,
  },

  {
    name: "National Scholarship Portal",
    slug: "national-scholarship-portal",
    category: "Education",
    level: "Central",
    state: "All",
    description:
      "Central platform for multiple scholarship schemes.",
    eligibility:
      "Eligibility varies according to the individual scholarship scheme.",
    benefits: [
      "Scholarship opportunities",
      "Online application facility",
    ],
    officialUrl:
      "https://scholarships.gov.in/",
    rules: [
      {
        field: "education",
        operator: "NOT_EQUALS",
        value: "None",
      },
    ],
    isActive: true,
  },

  {
    name: "PM Mudra Yojana",
    slug: "pm-mudra-yojana",
    category: "Business",
    level: "Central",
    state: "All",
    description:
      "Credit support for eligible micro and small business activities.",
    eligibility:
      "Eligibility and loan conditions depend on the applicable lending institution and scheme category.",
    benefits: [
      "Business credit support",
      "Multiple loan categories",
    ],
    officialUrl:
      "https://www.mudra.org.in/",
    rules: [
      {
        field: "occupation",
        operator: "NOT_EQUALS",
        value: "None",
      },
    ],
    isActive: true,
  },
];

module.exports = schemes;
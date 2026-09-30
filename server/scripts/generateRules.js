require("dotenv").config();

const connectDB = require("../config/db");
const Scheme = require("../models/Scheme");

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function addRule(rules, field, operator, value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return;
  }

  const exists = rules.some(
    (rule) =>
      rule.field === field &&
      rule.operator === operator &&
      JSON.stringify(rule.value) === JSON.stringify(value)
  );

  if (!exists) {
    rules.push({
      field,
      operator,
      value,
    });
  }
}

// --------------------------------------------------
// AGE RULES
// --------------------------------------------------

function extractAgeRules(text, rules) {
  let match;

  // above 18 / over 18 / minimum age 18
  match = text.match(
    /(?:above|over|minimum(?:\s+age)?(?:\s+of)?)\s*(\d{1,3})\s*(?:years?|yrs?)/i
  );

  if (match) {
    addRule(
      rules,
      "age",
      "GREATER_THAN",
      Number(match[1])
    );
  }

  // below 60 / under 60 / maximum age 60
  match = text.match(
    /(?:below|under|maximum(?:\s+age)?(?:\s+of)?)\s*(\d{1,3})\s*(?:years?|yrs?)/i
  );

  if (match) {
    addRule(
      rules,
      "age",
      "LESS_THAN",
      Number(match[1])
    );
  }

  // age between 18 and 60
  match = text.match(
    /(?:age|aged)\s*(?:between|from)\s*(\d{1,3})\s*(?:to|and|-)\s*(\d{1,3})/i
  );

  if (match) {
    addRule(
      rules,
      "age",
      "GREATER_THAN_EQUAL",
      Number(match[1])
    );

    addRule(
      rules,
      "age",
      "LESS_THAN_EQUAL",
      Number(match[2])
    );
  }
}

// --------------------------------------------------
// INCOME RULES
// --------------------------------------------------

function extractIncomeRules(text, rules) {
  let match;

  // below / less than / up to ₹2.5 lakh
  match = text.match(
    /(?:annual|yearly|family)?\s*(?:income)[^.\n]{0,80}?(?:below|under|less than|up to|not exceeding|does not exceed|maximum(?: of)?)\s*(?:rs\.?|₹|inr)?\s*([\d,.]+)\s*(lakh|lakhs|lacs|lac)?/i
  );

  if (match) {
    let amount = Number(match[1].replace(/,/g, ""));

    if (match[2]) {
      amount *= 100000;
    }

    addRule(
      rules,
      "income",
      "LESS_THAN_EQUAL",
      amount
    );
  }

  // ₹2.5 lakh or less
  match = text.match(
    /(?:income)[^.\n]{0,80}?(?:rs\.?|₹|inr)?\s*([\d,.]+)\s*(lakh|lakhs|lacs|lac)?\s*(?:or\s+less|and\s+below)/i
  );

  if (match) {
    let amount = Number(match[1].replace(/,/g, ""));

    if (match[2]) {
      amount *= 100000;
    }

    addRule(
      rules,
      "income",
      "LESS_THAN_EQUAL",
      amount
    );
  }

  // more than ₹x
  match = text.match(
    /(?:annual|yearly|family)?\s*(?:income)[^.\n]{0,80}?(?:above|over|more than|greater than)\s*(?:rs\.?|₹|inr)?\s*([\d,.]+)\s*(lakh|lakhs|lacs|lac)?/i
  );

  if (match) {
    let amount = Number(match[1].replace(/,/g, ""));

    if (match[2]) {
      amount *= 100000;
    }

    addRule(
      rules,
      "income",
      "GREATER_THAN",
      amount
    );
  }
}

// --------------------------------------------------
// GENDER RULES
// --------------------------------------------------

function extractGenderRules(text, rules) {
  const lower = text.toLowerCase();

  if (
    /\b(?:only\s+)?women\b|\bfemales?\s+only\b|\bfor\s+women\b/.test(
      lower
    )
  ) {
    addRule(
      rules,
      "gender",
      "EQUALS",
      "Female"
    );
  }

  if (
    /\b(?:only\s+)?men\b|\bmales?\s+only\b|\bfor\s+men\b/.test(
      lower
    )
  ) {
    addRule(
      rules,
      "gender",
      "EQUALS",
      "Male"
    );
  }
}

// --------------------------------------------------
// CATEGORY RULES
// --------------------------------------------------

function extractCategoryRules(text, rules) {
  const lower = text.toLowerCase();

  const categories = [];

  if (
    /\bsc\b|\bscheduled caste\b/.test(lower)
  ) {
    categories.push("SC");
  }

  if (
    /\bst\b|\bscheduled tribe\b/.test(lower)
  ) {
    categories.push("ST");
  }

  if (
    /\bobc\b|\bother backward class\b/.test(lower)
  ) {
    categories.push("OBC");
  }

  if (
    /\bews\b|\beconomically weaker section\b/.test(
      lower
    )
  ) {
    categories.push("EWS");
  }

  if (
    /\bminority\b|\bminorities\b/.test(lower)
  ) {
    categories.push("Minority");
  }

  if (categories.length === 1) {
    addRule(
      rules,
      "category",
      "EQUALS",
      categories[0]
    );
  }

  if (categories.length > 1) {
    addRule(
      rules,
      "category",
      "IN",
      [...new Set(categories)]
    );
  }
}

// --------------------------------------------------
// OCCUPATION RULES
// --------------------------------------------------

function extractOccupationRules(text, rules) {
  const lower = text.toLowerCase();

  const occupations = [];

  if (
    /\bfarmers?\b|\bagricultur(?:e|al)\s+(?:worker|workers|activity|activities)\b/.test(
      lower
    )
  ) {
    occupations.push("Farmer");
  }

  if (/\bstudents?\b/.test(lower)) {
    occupations.push("Student");
  }

  if (
    /\bunemployed\b|\bunemployment\b/.test(lower)
  ) {
    occupations.push("Unemployed");
  }

  if (
    /\bself[-\s]?employed\b/.test(lower)
  ) {
    occupations.push("Self Employed");
  }

  if (
    /\bdaily wage\b|\bwage worker\b|\bcasual worker\b/.test(
      lower
    )
  ) {
    occupations.push("Daily Wage Worker");
  }

  if (
    /\b(?:business|entrepreneur|entrepreneurs)\b/.test(
      lower
    )
  ) {
    occupations.push("Business Owner");
  }

  if (occupations.length === 1) {
    addRule(
      rules,
      "occupation",
      "EQUALS",
      occupations[0]
    );
  }

  if (occupations.length > 1) {
    addRule(
      rules,
      "occupation",
      "IN",
      [...new Set(occupations)]
    );
  }
}

// --------------------------------------------------
// EDUCATION RULES
// --------------------------------------------------

function extractEducationRules(text, rules) {
  const lower = text.toLowerCase();

  if (
    /\bgraduate\b|\bgraduation\b|\bdegree\b/.test(
      lower
    )
  ) {
    addRule(
      rules,
      "education",
      "EQUALS",
      "Graduate"
    );
  }

  if (
    /\bpost[-\s]?graduate\b|\bpost graduation\b|\bmasters?\b/.test(
      lower
    )
  ) {
    addRule(
      rules,
      "education",
      "EQUALS",
      "Post Graduate"
    );
  }

  if (/\bdiploma\b/.test(lower)) {
    addRule(
      rules,
      "education",
      "EQUALS",
      "Diploma"
    );
  }

  if (
    /\bhigher secondary\b|\b12th\b|\bclass xii\b|\bclass 12\b/.test(
      lower
    )
  ) {
    addRule(
      rules,
      "education",
      "EQUALS",
      "Higher Secondary"
    );
  }
}

// --------------------------------------------------
// MAIN RULE GENERATOR
// --------------------------------------------------

function generateRules(scheme) {
  const rules = [];

  const eligibilityText = normalizeText(
    Array.isArray(scheme.eligibility)
      ? scheme.eligibility.join(" ")
      : scheme.eligibility
  );

  const text = `${eligibilityText} ${scheme.description || ""}`;

  // State
  if (
    scheme.state &&
    scheme.state !== "All" &&
    scheme.state !== "All India"
  ) {
    addRule(
      rules,
      "state",
      "EQUALS",
      scheme.state
    );
  }

  extractAgeRules(text, rules);
  extractIncomeRules(text, rules);
  extractGenderRules(text, rules);
  extractCategoryRules(text, rules);
  extractOccupationRules(text, rules);
  extractEducationRules(text, rules);

  return rules;
}

// --------------------------------------------------
// DATABASE UPDATE
// --------------------------------------------------

async function main() {
  try {
    await connectDB();

    console.log("--------------------------------");
    console.log("GENERATING ELIGIBILITY RULES");
    console.log("--------------------------------");

    const schemes = await Scheme.find({
      isActive: true,
    });

    console.log(
      `Active schemes found: ${schemes.length}`
    );

    let updated = 0;
    let withRules = 0;
    let withoutRules = 0;

    for (const scheme of schemes) {
      const rules = generateRules(scheme);

      scheme.rules = rules;

      await scheme.save();

      updated++;

      if (rules.length > 0) {
        withRules++;
      } else {
        withoutRules++;
      }
    }

    console.log("--------------------------------");
    console.log("RULE GENERATION COMPLETED");
    console.log("--------------------------------");

    console.log(
      `Updated schemes : ${updated}`
    );

    console.log(
      `WITH RULES      : ${withRules}`
    );

    console.log(
      `WITHOUT RULES   : ${withoutRules}`
    );

    console.log("--------------------------------");

    // Show samples
    const samples = await Scheme.find({
      "rules.0": { $exists: true },
    })
      .select(
        "name state rules eligibility"
      )
      .limit(5)
      .lean();

    console.log("SAMPLE GENERATED RULES:");

    for (const scheme of samples) {
      console.log("--------------------------------");
      console.log("Name:", scheme.name);
      console.log("State:", scheme.state);
      console.log(
        "Rules:",
        JSON.stringify(
          scheme.rules,
          null,
          2
        )
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("--------------------------------");
    console.error("RULE GENERATION FAILED");
    console.error("--------------------------------");
    console.error(error);

    process.exit(1);
  }
}

main();
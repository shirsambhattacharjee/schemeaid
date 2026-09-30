/**
 * Deterministic Government Scheme Eligibility Engine
 *
 * Evaluates a user profile against scheme rules.
 *
 * Supported operators:
 * EQUALS
 * NOT_EQUALS
 * GREATER_THAN
 * GREATER_THAN_EQUAL
 * LESS_THAN
 * LESS_THAN_EQUAL
 * IN
 * NOT_IN
 */

function normalizeString(value) {
  if (value === undefined || value === null) return "";

  return String(value).trim().toLowerCase();
}

function compareValues(userValue, requiredValue) {
  return normalizeString(userValue) === normalizeString(requiredValue);
}

function evaluateRule(userProfile, rule) {
  const {
    field,
    operator,
    value,
  } = rule;

  const userValue = userProfile[field];

  // Missing required user information = rule fails
  if (
    userValue === undefined ||
    userValue === null ||
    userValue === ""
  ) {
    return false;
  }

  switch (operator) {
    case "EQUALS":
      return compareValues(userValue, value);

    case "NOT_EQUALS":
      return !compareValues(userValue, value);

    case "GREATER_THAN":
      return Number(userValue) > Number(value);

    case "GREATER_THAN_EQUAL":
      return Number(userValue) >= Number(value);

    case "LESS_THAN":
      return Number(userValue) < Number(value);

    case "LESS_THAN_EQUAL":
      return Number(userValue) <= Number(value);

    case "IN":
      if (!Array.isArray(value)) return false;

      return value.some((item) =>
        compareValues(userValue, item)
      );

    case "NOT_IN":
      if (!Array.isArray(value)) return false;

      return !value.some((item) =>
        compareValues(userValue, item)
      );

    default:
      return false;
  }
}

function evaluateEligibility(userProfile, schemeRules) {
  /*
   * IMPORTANT:
   * A scheme without rules must NOT automatically become eligible.
   *
   * This prevents every scheme from appearing as 100% eligible.
   */

  if (
    !Array.isArray(schemeRules) ||
    schemeRules.length === 0
  ) {
    return {
      status: "Unknown",
      matchPercentage: 0,
      criteriaResults: [],
      hasRules: false,
    };
  }

  let passedRules = 0;

  const criteriaResults = schemeRules.map((rule) => {
    const passed = evaluateRule(userProfile, rule);

    if (passed) {
      passedRules++;
    }

    return {
      field: rule.field,
      operator: rule.operator,
      requiredValue: rule.value,
      userValue:
        userProfile[rule.field] !== undefined
          ? userProfile[rule.field]
          : null,
      passed,
    };
  });

  const totalRules = schemeRules.length;

  const matchPercentage = Math.round(
    (passedRules / totalRules) * 100
  );

  let status = "Ineligible";

  if (matchPercentage === 100) {
    status = "Eligible";
  } else if (matchPercentage > 0) {
    status = "Partially Eligible";
  }

  return {
    status,
    matchPercentage,
    criteriaResults,
    hasRules: true,
  };
}

module.exports = {
  evaluateEligibility,
};
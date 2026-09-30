const Scheme = require("../models/Scheme");
const {
  evaluateEligibility,
} = require("../services/eligibilityEngine");

exports.checkEligibility = async (req, res) => {
  try {
    const userProfile =
      req.body.profile || req.user?.profile;

    if (!userProfile) {
      return res.status(400).json({
        success: false,
        message:
          "Profile information is required for eligibility check.",
      });
    }

    /*
     * Normalize incoming profile values
     */
    const profile = {
      ...userProfile,

      state: userProfile.state?.trim() || "",
      gender: userProfile.gender?.trim() || "",
      category: userProfile.category?.trim() || "",
      education: userProfile.education?.trim() || "",
      occupation: userProfile.occupation?.trim() || "",

      income:
        userProfile.income !== undefined &&
        userProfile.income !== ""
          ? Number(userProfile.income)
          : null,

      familyMembers:
        userProfile.familyMembers !== undefined &&
        userProfile.familyMembers !== ""
          ? Number(userProfile.familyMembers)
          : null,
    };

    /*
     * Basic validation
     */
    if (!profile.state) {
      return res.status(400).json({
        success: false,
        message: "State is required.",
      });
    }

    if (!profile.gender) {
      return res.status(400).json({
        success: false,
        message: "Gender is required.",
      });
    }

    if (
      profile.income === null ||
      Number.isNaN(profile.income)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid annual income is required.",
      });
    }

    /*
     * Get active schemes
     */
    const schemes = await Scheme.find({
      isActive: true,
    }).lean();

    /*
     * Evaluate every scheme
     */
    const evaluatedResults = schemes.map((scheme) => {
      const evaluation = evaluateEligibility(
        profile,
        scheme.rules
      );

      return {
        scheme,
        evaluation,
      };
    });

    /*
     * VERY IMPORTANT
     *
     * Do NOT show schemes having no rules.
     * Do NOT show completely failed schemes.
     *
     * Only schemes with at least one matching criterion
     * are returned.
     */
    const results = evaluatedResults
      .filter((item) => {
        return (
          item.evaluation.hasRules &&
          item.evaluation.matchPercentage > 0
        );
      })
      .sort(
        (a, b) =>
          b.evaluation.matchPercentage -
          a.evaluation.matchPercentage
      );

    /*
     * Count fully eligible schemes
     */
    const eligibleCount = results.filter(
      (item) =>
        item.evaluation.status === "Eligible"
    ).length;

    /*
     * Count partial matches
     */
    const partialCount = results.filter(
      (item) =>
        item.evaluation.status ===
        "Partially Eligible"
    ).length;

    return res.json({
      success: true,

      count: results.length,

      eligibleCount,

      partialCount,

      profile: {
        state: profile.state,
        gender: profile.gender,
        category: profile.category,
        income: profile.income,
        education: profile.education,
        occupation: profile.occupation,
        familyMembers: profile.familyMembers,
      },

      data: results,
    });
  } catch (error) {
    console.error(
      "Eligibility Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to check eligibility.",
    });
  }
};
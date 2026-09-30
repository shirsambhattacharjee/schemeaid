const Scheme = require("../models/Scheme");

// GET /api/schemes
exports.getAllSchemes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 24,
      search = "",
      state = "All",
      category = "All",
      level = "All",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const query = {
      isActive: true,
    };

    // -----------------------------
    // SEARCH
    // -----------------------------
    if (search.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      query.$or = [
        { name: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { state: searchRegex },
        { ministry: searchRegex },
        { department: searchRegex },
        { slug: searchRegex },
        { tags: searchRegex },
      ];
    }

    // -----------------------------
    // STATE FILTER
    // -----------------------------
    if (state && state !== "All") {
      query.$and = query.$and || [];

      query.$and.push({
        $or: [
          { state: state },
          { state: "All" },
          { state: { $in: [state] } },
        ],
      });
    }

    // -----------------------------
    // CATEGORY FILTER
    // -----------------------------
    if (category && category !== "All") {
      query.category = category;
    }

    // -----------------------------
    // LEVEL FILTER
    // -----------------------------
    if (level && level !== "All") {
      query.level = level;
    }

    const total = await Scheme.countDocuments(query);

    const schemes = await Scheme.find(query)
      .sort({
        name: 1,
      })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    const pages = Math.ceil(total / limitNumber) || 1;

    return res.json({
      success: true,
      count: schemes.length,
      total,
      page: pageNumber,
      limit: limitNumber,
      pages,
      data: schemes,
    });
  } catch (error) {
    console.error("Get schemes error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET /api/schemes/filters
exports.getSchemeFilters = async (req, res) => {
  try {
    const states = await Scheme.distinct("state", {
      isActive: true,
    });

    const categories = await Scheme.distinct("category", {
      isActive: true,
    });

    const levels = await Scheme.distinct("level", {
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        states: states
          .filter(Boolean)
          .sort(),

        categories: categories
          .filter(Boolean)
          .sort(),

        levels: levels
          .filter(Boolean)
          .sort(),
      },
    });
  } catch (error) {
    console.error("Filter error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET /api/schemes/:slug
exports.getSchemeBySlug = async (req, res) => {
  try {
    const scheme = await Scheme.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    console.error("Get scheme error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
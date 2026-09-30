const express = require("express");

const router = express.Router();

const {
  getAllSchemes,
  getSchemeFilters,
  getSchemeBySlug,
} = require("../controllers/schemeController");

// GET all schemes
router.get("/", getAllSchemes);

// GET filters
router.get("/filters", getSchemeFilters);

// GET single scheme
router.get("/:slug", getSchemeBySlug);

module.exports = router;
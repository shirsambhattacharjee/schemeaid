require("dotenv").config();

const fs = require("fs");
const path = require("path");

const connectDB = require("../config/db");
const Scheme = require("../models/Scheme");

const DATA_FILE = path.join(
  __dirname,
  "../data/schemes.json"
);

function toArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((x) => x.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[,|;\n]/)
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
}

function text(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function normalize(item, index) {
  const name =
    text(item.name) ||
    text(item["Scheme Name"]) ||
    text(item.title) ||
    `Government Scheme ${index + 1}`;

  const slug =
    text(item.slug) ||
    text(item["Scheme Slug"]) ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const state =
    text(item.state) ||
    text(item["State"]) ||
    text(item["State / UT / Ministry"]) ||
    "All";

  const tags = toArray(
    item.tags ||
      item["Tags / Categories"] ||
      item.category
  );

  let category =
    text(item.category) || "General";

  if (
    category === "General" &&
    tags.length
  ) {
    category = tags[0];
  }

  return {
    id:
      text(item.id) ||
      slug,

    slug,

    name,

    title:
      text(item.title) || name,

    description:
      text(item.description) ||
      text(item["Description"]),

    category,

    level:
      text(item.level) ||
      text(item["Level"]) ||
      "Government",

    state,

    ministry:
      text(item.ministry) ||
      text(item["Ministry"]),

    department:
      text(item.department) ||
      text(item["Department"]),

    benefits: toArray(
      item.benefits ||
        item["Benefits"]
    ),

    eligibility: toArray(
      item.eligibility ||
        item["Eligibility"] ||
        item["Eligibility Criteria"]
    ),

    documents: toArray(
      item.documents ||
        item["Documents Required"]
    ),

    applicationProcess: toArray(
      item.applicationProcess ||
        item["Application Process"]
    ),

    officialUrl:
      text(item.officialUrl) ||
      text(item["Official Link"]),

    applicationUrl:
      text(item.applicationUrl) ||
      text(item["Application Link"]) ||
      text(item["Official Link"]),

    helpline:
      text(item.helpline),

    tags,

    rules: Array.isArray(item.rules)
      ? item.rules
      : [],

    isActive:
      item.isActive !== false,
  };
}

async function importSchemes() {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    if (!fs.existsSync(DATA_FILE)) {
      throw new Error(
        `File not found: ${DATA_FILE}`
      );
    }

    console.log("Reading dataset...");

    const raw = fs.readFileSync(
      DATA_FILE,
      "utf8"
    );

    const parsed = JSON.parse(raw);

    let records;

    if (Array.isArray(parsed)) {
      records = parsed;
    } else if (Array.isArray(parsed.data)) {
      records = parsed.data;
    } else if (
      Array.isArray(parsed.schemes)
    ) {
      records = parsed.schemes;
    } else {
      throw new Error(
        "Could not find scheme array in JSON."
      );
    }

    console.log(
      `Found ${records.length} records.`
    );

    const normalized = records.map(
      normalize
    );

    const unique = new Map();

    for (const scheme of normalized) {
      if (!unique.has(scheme.slug)) {
        unique.set(
          scheme.slug,
          scheme
        );
      }
    }

    const schemes = [
      ...unique.values(),
    ];

    console.log(
      `Unique schemes: ${schemes.length}`
    );

    let inserted = 0;
    let updated = 0;

    const operations = schemes.map(
      (scheme) => ({
        updateOne: {
          filter: {
            slug: scheme.slug,
          },

          update: {
            $set: scheme,
          },

          upsert: true,
        },
      })
    );

    const result =
      await Scheme.bulkWrite(
        operations,
        {
          ordered: false,
        }
      );

    inserted =
      result.upsertedCount || 0;

    updated =
      result.modifiedCount || 0;

    const total =
      await Scheme.countDocuments();

    console.log(
      "--------------------------------"
    );

    console.log(
      "IMPORT COMPLETED"
    );

    console.log(
      "--------------------------------"
    );

    console.log(
      `Dataset records : ${records.length}`
    );

    console.log(
      `Unique schemes  : ${schemes.length}`
    );

    console.log(
      `Inserted        : ${inserted}`
    );

    console.log(
      `Updated         : ${updated}`
    );

    console.log(
      `Total MongoDB   : ${total}`
    );

    console.log(
      "--------------------------------"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "IMPORT FAILED:"
    );

    console.error(error);

    process.exit(1);
  }
}

importSchemes();
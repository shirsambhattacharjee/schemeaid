const mongoose = require("mongoose");

const RuleSchema = new mongoose.Schema(
  {
    field: String,
    operator: String,
    value: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const SchemeSchema = new mongoose.Schema(
  {
    id: { type: String, index: true },
    slug: { type: String, required: true, unique: true, index: true },

    name: { type: String, required: true, index: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },

    category: { type: String, default: "General", index: true },
    level: { type: String, default: "Government", index: true },
    state: { type: String, default: "All", index: true },

    ministry: { type: String, default: "" },
    department: { type: String, default: "" },

    benefits: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    applicationProcess: { type: [String], default: [] },

    officialUrl: { type: String, default: "" },
    applicationUrl: { type: String, default: "" },
    helpline: { type: String, default: "" },

    tags: { type: [String], default: [] },
    rules: { type: [RuleSchema], default: [] },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SchemeSchema.index({
  name: "text",
  title: "text",
  description: "text",
  tags: "text",
  category: "text",
});

module.exports = mongoose.model("Scheme", SchemeSchema);
require("dotenv").config();

const mongoose = require("mongoose");
const Scheme = require("./models/Scheme");

async function checkRules() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const total = await Scheme.countDocuments();

    const withRules = await Scheme.countDocuments({
      "rules.0": { $exists: true },
    });

    const withoutRules = await Scheme.countDocuments({
      $or: [
        { rules: { $exists: false } },
        { rules: { $size: 0 } },
      ],
    });

    const sample = await Scheme.findOne().lean();

    console.log("--------------------------------");
    console.log("TOTAL SCHEMES :", total);
    console.log("WITH RULES    :", withRules);
    console.log("WITHOUT RULES :", withoutRules);
    console.log("--------------------------------");

    console.log("SAMPLE SCHEME:");
    console.log("Name:", sample?.name);
    console.log("State:", sample?.state);
    console.log("Rules:", sample?.rules);
    console.log("Eligibility:", sample?.eligibility);

    await mongoose.disconnect();
  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  }
}

checkRules();
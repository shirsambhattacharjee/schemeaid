require("dotenv").config();

const connectDB = require("./config/db");
const Scheme = require("./models/Scheme");
const schemes = require("./data/schemes");

const seed = async () => {
  try {
    await connectDB();

    await Scheme.deleteMany({});

    await Scheme.insertMany(schemes);

    console.log(
      `Inserted ${schemes.length} schemes successfully.`
    );

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
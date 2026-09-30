require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const app = express();

// --------------------------------------------------
// Database
// --------------------------------------------------
connectDB();

// --------------------------------------------------
// Security
// --------------------------------------------------
app.use(helmet());

// --------------------------------------------------
// CORS
// --------------------------------------------------
const allowedOrigins = [
  "https://schemeaid.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
    credentials: true,
  })
);

// --------------------------------------------------
// Body parser
// --------------------------------------------------
app.use(
  express.json({
    limit: "10kb",
  })
);

// --------------------------------------------------
// Rate limiter
// --------------------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message:
      "Too many requests, please try again later.",
  },
});

app.use("/api/", limiter);

// --------------------------------------------------
// Routes
// --------------------------------------------------
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/schemes",
  require("./routes/schemeRoutes")
);

app.use(
  "/api/eligibility",
  require("./routes/eligibilityRoutes")
);

app.use(
  "/api/assistant",
  require("./routes/assistantRoutes")
);

// --------------------------------------------------
// Health check
// --------------------------------------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "AI Government Scheme Assistant API Engine is Active.",
  });
});

// --------------------------------------------------
// Error handler
// --------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// --------------------------------------------------
// Start server
// --------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
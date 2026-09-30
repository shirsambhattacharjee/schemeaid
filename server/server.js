// // require('dotenv').config();
// // const express = require('express');
// // const cors = require('cors');
// // const helmet = require('helmet');
// // const rateLimit = require('express-rate-limit');
// // const connectDB = require('./config/db');

// // const app = express();

// // connectDB();

// // app.use(helmet());
// // app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
// // app.use(express.json({ limit: '10kb' }));

// // const limiter = rateLimit({
// //   windowMs: 15 * 60 * 1000,
// //   max: 100,
// //   message: { success: false, message: 'Too many requests, please try again later.' }
// // });
// // app.use('/api/', limiter);

// // // Mount API Routes
// // app.use('/api/auth', require('./routes/authRoutes'));
// // app.use('/api/schemes', require('./routes/schemeRoutes'));
// // app.use('/api/eligibility', require('./routes/eligibilityRoutes'));
// // app.use('/api/assistant', require('./routes/assistantRoutes'));

// // app.get('/', (req, res) => {
// //   res.send('AI Government Scheme Assistant API Engine is Active.');
// // });

// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(err.status || 500).json({
// //     success: false,
// //     message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
// //   });
// // });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
// // });


// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");

// const connectDB = require("./config/db");

// const app = express();

// connectDB();

// app.use(helmet());

// app.use(
//   cors({
//     origin:
//       process.env.CLIENT_URL ||
//       "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use(
//   express.json({
//     limit: "10kb",
//   })
// );

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: {
//     success: false,
//     message:
//       "Too many requests, please try again later.",
//   },
// });

// app.use("/api/", limiter);

// app.use(
//   "/api/auth",
//   require("./routes/authRoutes")
// );

// app.use(
//   "/api/schemes",
//   require("./routes/schemeRoutes")
// );

// app.use(
//   "/api/eligibility",
//   require("./routes/eligibilityRoutes")
// );

// app.use(
//   "/api/assistant",
//   require("./routes/assistantRoutes")
// );

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message:
//       "AI Government Scheme Assistant API Engine is Active.",
//   });
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);

//   res.status(err.status || 500).json({
//     success: false,
//     message:
//       process.env.NODE_ENV === "production"
//         ? "Internal Server Error"
//         : err.message,
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(
//     `Server running in ${
//       process.env.NODE_ENV || "development"
//     } mode on port ${PORT}`
//   );
// });


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const app = express();


// Database
connectDB();


// Security
app.use(helmet());


// CORS
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);


// Body parser
app.use(
  express.json({
    limit: "10kb",
  })
);


// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api/", limiter);


// Routes
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


// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "AI Government Scheme Assistant API Engine is Active.",
  });
});


// Error handler
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
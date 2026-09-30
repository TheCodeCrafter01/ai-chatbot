const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();


// 1. Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// 2. Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));

// 3. 404 handler (saare routes ke baad)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// 4. Global error handler (sabse last)
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (statusCode === 500) {
    console.error(err);
    if (process.env.NODE_ENV === "production") {
      message = "Internal server error";
    }
  }

  res.status(statusCode).json({ success: false, message });
});

module.exports = app;
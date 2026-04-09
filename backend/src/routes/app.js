const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============== AUTH ==============
const login = require("../controllers/auth/login");
const register = require("../controllers/auth/register");
const checkEmail = require("../controllers/auth/check_email");

app.use("/api/auth/login", login);
app.use("/api/auth/register", register);
app.use("/api/auth/check-email", checkEmail);




// 404 - Route không tồn tại
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route không tồn tại",
  });
});

// 500 - Lỗi server
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Lỗi server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;

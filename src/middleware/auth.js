const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { jwtSecret } = require("../config/env");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Not authenticated", 401);
  }

  const token = header.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("User no longer exists", 401);

  req.user = user;
  next();
});

module.exports = { protect };
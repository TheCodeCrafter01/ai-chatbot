const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/token");

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already registered", 409);

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    token: signToken(user._id),
    user: userResponse(user),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password has select:false, so we must ask for it
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  res.status(200).json({
    success: true,
    token: signToken(user._id),
    user: userResponse(user),
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: userResponse(req.user) });
});
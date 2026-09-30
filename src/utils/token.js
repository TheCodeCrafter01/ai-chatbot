const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

const signToken = (userId) =>
  jwt.sign({ id: userId }, jwtSecret, { expiresIn: "7d" });

module.exports = { signToken };
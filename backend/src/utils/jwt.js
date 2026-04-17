const jwt = require("jsonwebtoken");

function signToken(payload, secret, expiresIn) {
  if (!secret) throw new Error("JWT_SECRET is required");
  return jwt.sign(payload, secret, { expiresIn: expiresIn || "7d" });
}

module.exports = { signToken };


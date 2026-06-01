const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateTokens = require("../utils/generateTokens");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.findOne({ email }))
    return res.status(409).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const tokens = generateTokens({ id: user._id, role: user.role });

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid email or password" });

  const tokens = generateTokens({ id: user._id, role: user.role });
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  });
});

// POST /api/auth/refresh
exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const tokens = generateTokens({ id: user._id, role: user.role });
    res.json(tokens);
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Refresh token expired, please login again" : "Invalid refresh token";
    res.status(401).json({ message });
  }
});

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// PUT /api/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const update = {};

  if (name)     update.name  = name;
  if (email)    update.email = email;
  if (password) update.password = await bcrypt.hash(password, 10);

  // Check email uniqueness if changing email
  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existing) return res.status(409).json({ message: "Email already in use" });
  }

  const user = await User.findByIdAndUpdate(req.user.id, update, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json(user);
});

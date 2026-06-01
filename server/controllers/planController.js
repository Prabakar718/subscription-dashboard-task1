const Plan = require("../models/Plan");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/plans
exports.getPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find().sort({ price: 1 });
  res.json(plans);
});

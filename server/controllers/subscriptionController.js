const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const asyncHandler = require("../utils/asyncHandler");

const expireOldSubscriptions = async (userId) => {
  await Subscription.updateMany(
    { user_id: userId, status: "active", end_date: { $lt: new Date() } },
    { status: "expired" }
  );
};
exports.subscribe = asyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.planId);
  if (!plan) return res.status(404).json({ message: "Plan not found" });

  await Subscription.updateMany(
    { user_id: req.user.id, status: "active" },
    { status: "cancelled" }
  );

  const start_date = new Date();
  const end_date = new Date(start_date.getTime() + plan.duration * 24 * 60 * 60 * 1000);

  const subscription = await Subscription.create({
    user_id: req.user.id,
    plan_id: plan._id,
    start_date,
    end_date,
    status: "active",
  });

  await subscription.populate([
    { path: "user_id", select: "name email role" },
    { path: "plan_id", select: "name price features duration" },
  ]);

  res.status(201).json(subscription);
});

exports.getMySubscription = asyncHandler(async (req, res) => {
  await expireOldSubscriptions(req.user.id);

  const subscription = await Subscription.findOne({
    user_id: req.user.id,
    status: "active",
  }).populate("plan_id", "name price features duration");

  res.json(subscription || null);
});


exports.getAllSubscriptions = asyncHandler(async (req, res) => {
  // Auto-expire all overdue subscriptions
  await Subscription.updateMany(
    { status: "active", end_date: { $lt: new Date() } },
    { status: "expired" }
  );

  const { status, search } = req.query;

  const filter = {};
  if (status && status !== "all") filter.status = status;

  let subscriptions = await Subscription.find(filter)
    .populate("user_id", "name email role")
    .populate("plan_id", "name price duration")
    .sort({ createdAt: -1 });

  
  if (search) {
    const q = search.toLowerCase();
    subscriptions = subscriptions.filter(
      (s) =>
        s.user_id?.name?.toLowerCase().includes(q) ||
        s.user_id?.email?.toLowerCase().includes(q) ||
        s.plan_id?.name?.toLowerCase().includes(q)
    );
  }

  res.json(subscriptions);
});

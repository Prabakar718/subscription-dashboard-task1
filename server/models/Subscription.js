const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user_id:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan_id:    { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    start_date: { type: Date, default: Date.now },
    end_date:   { type: Date, required: true },
    status:     { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
  },
  { timestamps: true }
);

subscriptionSchema.index({ user_id: 1, status: 1 });

module.exports = mongoose.model("Subscription", subscriptionSchema);

const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    price:    { type: Number, required: true, min: 0 },
    features: [{ type: String }],
    duration: { type: Number, required: true, min: 1 }, // in days
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);

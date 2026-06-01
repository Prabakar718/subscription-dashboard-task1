require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Plan = require("../models/Plan");
const User = require("../models/User");

const plans = [
  {
    name: "Starter",
    price: 9.99,
    features: ["5 Projects", "10 GB Storage", "Email Support", "API Access"],
    duration: 30,
  },
  {
    name: "Pro",
    price: 29.99,
    features: [
      "Unlimited Projects",
      "100 GB Storage",
      "Priority Support",
      "API Access",
      "Analytics Dashboard",
    ],
    duration: 30,
  },
  {
    name: "Business",
    price: 79.99,
    features: [
      "Unlimited Projects",
      "1 TB Storage",
      "24/7 Support",
      "API Access",
      "Advanced Analytics",
      "Custom Integrations",
    ],
    duration: 30,
  },
  {
    name: "Enterprise",
    price: 199.99,
    features: [
      "Everything in Business",
      "Dedicated Account Manager",
      "SLA Guarantee",
      "On-premise Option",
      "SSO & SAML",
      "Custom Contracts",
    ],
    duration: 365,
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  // Seed plans
  await Plan.deleteMany();
  const seededPlans = await Plan.insertMany(plans);
  console.log(`✅ ${seededPlans.length} plans seeded`);

  // Seed demo admin user (skip if already exists)
  const adminEmail = "admin@demo.com";
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin User",
      email: adminEmail,
      password: hashed,
      role: "admin",
    });
    console.log("✅ Demo admin created  →  email: admin@demo.com  |  password: admin123");
  } else {
    console.log("ℹ️  Admin user already exists, skipping");
  }

  const userEmail = "user@demo.com";
  const existingUser = await User.findOne({ email: userEmail });
  if (!existingUser) {
    const hashed = await bcrypt.hash("user1234", 10);
    await User.create({
      name: "Demo User",
      email: userEmail,
      password: hashed,
      role: "user",
    });
    console.log("✅ Demo user created   →  email: user@demo.com   |  password: user1234");
  } else {
    console.log("ℹ️  Demo user already exists, skipping");
  }

  console.log("\n🎉 Seeding complete!");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});

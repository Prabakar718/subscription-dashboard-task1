require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors({ origin: "http://127.0.0.1:5173", credentials: true }));
app.use(express.json());

// ── Routes 
app.use("/api/auth",    require("./routes/authRoutes"));
app.use("/api/plans",   require("./routes/planRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

// Subscription routes 
const subRouter = require("./routes/subscriptionRoutes");
app.use("/api/my-subscription",      (req, res, next) => { req.url = "/my-subscription"; subRouter(req, res, next); });
app.use("/api/admin/subscriptions",  (req, res, next) => { req.url = "/admin/all";       subRouter(req, res, next); });
app.use("/api/subscribe",            subRouter);

//  404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

//  Error handler
app.use(errorMiddleware);

//  Start 
const PORT = process.env.PORT || 5000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
);

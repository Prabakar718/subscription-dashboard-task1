const router = require("express").Router();
const { subscribe, getMySubscription, getAllSubscriptions } = require("../controllers/subscriptionController");
const protect = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");


router.post("/:planId", protect, subscribe);


router.get("/my-subscription", protect, getMySubscription);


router.get("/admin/all", protect, role("admin"), getAllSubscriptions);

module.exports = router;

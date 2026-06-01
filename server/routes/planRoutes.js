const router = require("express").Router();
const { getPlans } = require("../controllers/planController");

router.get("/", getPlans);

module.exports = router;

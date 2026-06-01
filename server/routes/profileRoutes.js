const router = require("express").Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { updateProfileSchema } = require("../validators/profileValidation");


router.get("/", protect, getProfile);

router.put("/", protect, validate(updateProfileSchema), updateProfile);

module.exports = router;

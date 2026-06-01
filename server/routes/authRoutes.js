const router = require("express").Router();
const { register, login, refresh } = require("../controllers/authController");
const validate = require("../middleware/validateMiddleware");
const { registerSchema, loginSchema, refreshSchema } = require("../validators/authValidation");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);

module.exports = router;

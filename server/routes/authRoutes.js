const router = require("express").Router();
const { register, login, me, forgotPassword, resetPassword } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", auth, me);

module.exports = router;

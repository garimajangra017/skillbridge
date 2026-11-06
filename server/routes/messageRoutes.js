const router = require("express").Router();
const controller = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");
router.get("/", auth, controller.getMessages);
router.get("/:userId", auth, controller.getMessages);
router.post("/", auth, controller.sendMessage);
module.exports = router;

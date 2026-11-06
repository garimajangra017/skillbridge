const router = require("express").Router();
const controller = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");
router.get("/", auth, controller.getNotifications);
router.put("/read-all", auth, controller.markAllRead);
router.put("/:id/read", auth, controller.markRead);
module.exports = router;

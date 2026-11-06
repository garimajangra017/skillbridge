const router = require("express").Router();
const controller = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
router.get("/", controller.getUsers);
router.get("/me", auth, controller.getMyProfile);
router.put("/me", auth, controller.updateMyProfile);
router.get("/:id", controller.getUserById);
router.delete("/:id", auth, controller.deleteUser);
module.exports = router;

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
getProfile,
updateProfile,
searchStudents,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/students", authMiddleware, searchStudents);
router.get("/:id", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

module.exports = router;

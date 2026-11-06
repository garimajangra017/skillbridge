import express from "express";
import {
getAdminStats,
getAdminUsers,
updateUserRole,
getAdminProjects,
deleteAdminProject
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);
router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.patch("/users/:id/role", updateUserRole);
router.get("/projects", getAdminProjects);
router.delete("/projects/:id", deleteAdminProject);

export default router;

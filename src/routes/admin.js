import { Router } from "express";
import { adminController } from "../controllers/index.js";
import { authenticate, adminOnly } from "../middlewares/index.js";

const router = Router();

/**
 * Admin Routes
 * All routes require admin role
 * Base path: /admin
 */

router.use(authenticate, adminOnly);

// Stack Management
router.post("/stacks", adminController.createStack);
router.put("/stacks/:id", adminController.updateStack);
router.delete("/stacks/:id", adminController.deleteStack);

// Topic Management
router.get("/topics", adminController.getAllTopics);
router.post("/topics", adminController.createTopic);
router.put("/topics/:id", adminController.updateTopic);
router.delete("/topics/:id", adminController.deleteTopic);

// Video Management
router.get("/videos", adminController.getAllVideos);
router.post("/videos", adminController.createVideo);
router.put("/videos/:id", adminController.updateVideo);
router.delete("/videos/:id", adminController.deleteVideo);

// Submission Management
router.get("/submissions", adminController.getAllSubmissions);
router.put("/submissions/:id", adminController.gradeSubmission);

// User Management
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);

export default router;

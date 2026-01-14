import { Router } from "express";
import { studentController } from "../controllers/index.js";
import { authenticate, authenticated } from "../middlewares/index.js";

const router = Router();

/**
 * Student Routes
 * All routes require authentication
 */

router.use(authenticate, authenticated);

router.get("/dashboard", studentController.getDashboard);
router.post("/progress", studentController.toggleProgress);
router.post("/submissions", studentController.submitChallenge);
router.get("/submissions", studentController.getMySubmissions);

export default router;

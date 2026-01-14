import { Router } from "express";
import { authController } from "../controllers/index.js";
import { authenticate } from "../middlewares/index.js";

const router = Router();

/**
 * Auth Routes
 * Base path: /auth
 */

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.getMe);

export default router;

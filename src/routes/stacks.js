import { Router } from "express";
import { curriculumController } from "../controllers/index.js";
import jwt from "jsonwebtoken";
import { authService } from "../services/index.js";

const router = Router();

/**
 * Optional auth middleware for stack routes
 * Attaches user if token is valid, but doesn't block
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await authService.getUserById(decoded.userId);
            if (user) req.user = user;
        }
    } catch {
        // Ignore errors, continue without user
    }
    next();
};

/**
 * Stack Routes
 * Base path: /stacks
 */

router.get("/", curriculumController.getAllStacks);
router.get("/:slug", optionalAuth, curriculumController.getStackBySlug);

export default router;

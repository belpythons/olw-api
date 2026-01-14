import { forbidden } from "../utils/apiResponse.js";

/**
 * Admin Middleware
 * Checks if authenticated user has ADMIN role
 */
export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return forbidden(res, "Authentication required.");
    }

    if (req.user.role !== "ADMIN") {
        return forbidden(res, "Admin access required.");
    }

    next();
};

/**
 * Student or Admin Middleware
 * Allows both roles
 */
export const authenticated = (req, res, next) => {
    if (!req.user) {
        return forbidden(res, "Authentication required.");
    }
    next();
};

export default adminOnly;

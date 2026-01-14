import jwt from "jsonwebtoken";
import { authService } from "../services/index.js";
import { unauthorized } from "../utils/apiResponse.js";

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return unauthorized(res, "Access denied. No token provided.");
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await authService.getUserById(decoded.userId);

        if (!user) {
            return unauthorized(res, "User not found. Token may be invalid.");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return unauthorized(res, "Invalid token.");
        }
        if (error.name === "TokenExpiredError") {
            return unauthorized(res, "Token has expired.");
        }
        next(error);
    }
};

export default authenticate;

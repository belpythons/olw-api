import { authService } from "../services/index.js";
import { success, created, validationError } from "../utils/apiResponse.js";

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */

/**
 * Register a new user
 * POST /auth/register
 */
export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password) {
            return validationError(res, "Email and password are required");
        }

        if (password.length < 6) {
            return validationError(res, "Password must be at least 6 characters");
        }

        const result = await authService.register({ email, password, name });
        return created(res, result, "User registered successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return validationError(res, "Email and password are required");
        }

        const result = await authService.login({ email, password });
        return success(res, result, "Login successful");
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /auth/me
 */
export const getMe = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.user.id);
        return success(res, { user });
    } catch (error) {
        next(error);
    }
};

export default { register, login, getMe };

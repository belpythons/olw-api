import { stackService } from "../services/index.js";
import { success } from "../utils/apiResponse.js";

/**
 * Curriculum Controller
 * Handles HTTP requests for stacks (public access)
 */

/**
 * Get all stacks
 * GET /stacks
 */
export const getAllStacks = async (req, res, next) => {
    try {
        const stacks = await stackService.findAll();
        return success(res, stacks);
    } catch (error) {
        next(error);
    }
};

/**
 * Get stack by slug with full nested content
 * GET /stacks/:slug
 */
export const getStackBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;

        // If user is authenticated, include their progress
        if (req.user) {
            const stack = await stackService.findBySlugWithProgress(slug, req.user.id);
            return success(res, stack);
        }

        const stack = await stackService.findBySlug(slug);
        return success(res, stack);
    } catch (error) {
        next(error);
    }
};

export default { getAllStacks, getStackBySlug };

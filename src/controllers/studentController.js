import { progressService, submissionService } from "../services/index.js";
import { success, created, validationError } from "../utils/apiResponse.js";

/**
 * Student Controller
 * Handles HTTP requests for student features
 */

/**
 * Get student dashboard
 * GET /dashboard
 */
export const getDashboard = async (req, res, next) => {
    try {
        const dashboard = await progressService.getDashboard(req.user.id);
        return success(res, dashboard);
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle video progress
 * POST /progress
 */
export const toggleProgress = async (req, res, next) => {
    try {
        const { videoId, isCompleted } = req.body;

        if (!videoId) {
            return validationError(res, "videoId is required");
        }

        const progress = await progressService.toggle(
            req.user.id,
            parseInt(videoId),
            isCompleted !== undefined ? Boolean(isCompleted) : true
        );

        return success(
            res,
            progress,
            progress.isCompleted ? "Video marked as completed" : "Video marked as uncompleted"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Submit a challenge
 * POST /submissions
 */
export const submitChallenge = async (req, res, next) => {
    try {
        const { stackId, repoLink } = req.body;

        if (!stackId || !repoLink) {
            return validationError(res, "stackId and repoLink are required");
        }

        const submission = await submissionService.create(
            req.user.id,
            parseInt(stackId),
            repoLink
        );

        return created(res, submission, "Challenge submitted successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's submissions
 * GET /submissions
 */
export const getMySubmissions = async (req, res, next) => {
    try {
        const submissions = await submissionService.findByUser(req.user.id);
        return success(res, submissions);
    } catch (error) {
        next(error);
    }
};

export default { getDashboard, toggleProgress, submitChallenge, getMySubmissions };

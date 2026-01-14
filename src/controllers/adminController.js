import { adminService, submissionService } from "../services/index.js";
import { success, created, validationError } from "../utils/apiResponse.js";

/**
 * Admin Controller
 * Handles HTTP requests for admin features
 */

// ============================================
// Stack Operations
// ============================================

export const createStack = async (req, res, next) => {
    try {
        const { slug, title, description, thumbnail, sortOrder } = req.body;

        if (!slug || !title) {
            return validationError(res, "slug and title are required");
        }

        const stack = await adminService.createStack({ slug, title, description, thumbnail, sortOrder });
        return created(res, stack, "Stack created successfully");
    } catch (error) {
        next(error);
    }
};

export const updateStack = async (req, res, next) => {
    try {
        const { id } = req.params;
        const stack = await adminService.updateStack(parseInt(id), req.body);
        return success(res, stack, "Stack updated successfully");
    } catch (error) {
        next(error);
    }
};

export const deleteStack = async (req, res, next) => {
    try {
        const { id } = req.params;
        await adminService.deleteStack(parseInt(id));
        return success(res, null, "Stack deleted successfully");
    } catch (error) {
        next(error);
    }
};

// ============================================
// Topic Operations
// ============================================

export const getAllTopics = async (req, res, next) => {
    try {
        const topics = await adminService.getAllTopics();
        return success(res, topics);
    } catch (error) {
        next(error);
    }
};

export const createTopic = async (req, res, next) => {
    try {
        const { title, sortOrder, stackId } = req.body;

        if (!title || !stackId) {
            return validationError(res, "title and stackId are required");
        }

        const topic = await adminService.createTopic({ title, sortOrder, stackId: parseInt(stackId) });
        return created(res, topic, "Topic created successfully");
    } catch (error) {
        next(error);
    }
};

export const updateTopic = async (req, res, next) => {
    try {
        const { id } = req.params;
        const topic = await adminService.updateTopic(parseInt(id), req.body);
        return success(res, topic, "Topic updated successfully");
    } catch (error) {
        next(error);
    }
};

export const deleteTopic = async (req, res, next) => {
    try {
        const { id } = req.params;
        await adminService.deleteTopic(parseInt(id));
        return success(res, null, "Topic deleted successfully");
    } catch (error) {
        next(error);
    }
};

// ============================================
// Video Operations
// ============================================

export const getAllVideos = async (req, res, next) => {
    try {
        const videos = await adminService.getAllVideos();
        return success(res, videos);
    } catch (error) {
        next(error);
    }
};

export const createVideo = async (req, res, next) => {
    try {
        const { title, youtubeId, duration, sortOrder, topicId } = req.body;

        if (!title || !youtubeId || !topicId) {
            return validationError(res, "title, youtubeId, and topicId are required");
        }

        const video = await adminService.createVideo({
            title,
            youtubeId,
            duration: duration ? parseInt(duration) : 0,
            sortOrder: sortOrder ? parseInt(sortOrder) : 0,
            topicId: parseInt(topicId),
        });
        return created(res, video, "Video created successfully");
    } catch (error) {
        next(error);
    }
};

export const updateVideo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const video = await adminService.updateVideo(parseInt(id), req.body);
        return success(res, video, "Video updated successfully");
    } catch (error) {
        next(error);
    }
};

export const deleteVideo = async (req, res, next) => {
    try {
        const { id } = req.params;
        await adminService.deleteVideo(parseInt(id));
        return success(res, null, "Video deleted successfully");
    } catch (error) {
        next(error);
    }
};

// ============================================
// Submission Operations (Grading)
// ============================================

export const getAllSubmissions = async (req, res, next) => {
    try {
        const { status } = req.query;
        const submissions = await submissionService.findAll(status);
        const counts = await submissionService.getCounts();
        return success(res, { submissions, counts });
    } catch (error) {
        next(error);
    }
};

export const gradeSubmission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, feedback } = req.body;

        if (!status || !["PASS", "FAIL"].includes(status)) {
            return validationError(res, "status must be 'PASS' or 'FAIL'");
        }

        const submission = await submissionService.grade(parseInt(id), status, feedback);
        return success(res, submission, `Submission marked as ${status}`);
    } catch (error) {
        next(error);
    }
};

// ============================================
// User Operations
// ============================================

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await adminService.getAllUsers();
        return success(res, users);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (parseInt(id) === req.user.id) {
            return validationError(res, "You cannot delete your own account");
        }

        await adminService.deleteUser(parseInt(id));
        return success(res, null, "User deleted successfully");
    } catch (error) {
        next(error);
    }
};

export default {
    createStack,
    updateStack,
    deleteStack,
    getAllTopics,
    createTopic,
    updateTopic,
    deleteTopic,
    getAllVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    getAllSubmissions,
    gradeSubmission,
    getAllUsers,
    deleteUser,
};

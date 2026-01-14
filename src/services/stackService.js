import prisma from "../lib/prisma.js";

/**
 * Stack Service
 * Handles curriculum-related business logic
 */

/**
 * Get all stacks with topic/video counts
 * @returns {Promise<Array>}
 */
export async function findAll() {
    const stacks = await prisma.stack.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
            _count: {
                select: {
                    topics: true,
                },
            },
        },
    });

    // Add video count for each stack
    const stacksWithCounts = await Promise.all(
        stacks.map(async (stack) => {
            const videoCount = await prisma.video.count({
                where: {
                    topic: {
                        stackId: stack.id,
                    },
                },
            });

            return {
                ...stack,
                topicCount: stack._count.topics,
                videoCount,
            };
        })
    );

    return stacksWithCounts;
}

/**
 * Get stack by slug with full nested content
 * @param {string} slug - Stack slug
 * @returns {Promise<Object>}
 */
export async function findBySlug(slug) {
    const stack = await prisma.stack.findUnique({
        where: { slug },
        include: {
            topics: {
                orderBy: { sortOrder: "asc" },
                include: {
                    videos: {
                        orderBy: { sortOrder: "asc" },
                    },
                },
            },
        },
    });

    if (!stack) {
        throw { status: 404, message: "Stack not found" };
    }

    // Calculate totals
    const totalVideos = stack.topics.reduce((sum, topic) => sum + topic.videos.length, 0);
    const totalDuration = stack.topics.reduce(
        (sum, topic) => sum + topic.videos.reduce((vSum, video) => vSum + video.duration, 0),
        0
    );

    return {
        ...stack,
        totalVideos,
        totalDuration,
    };
}

/**
 * Get stack by slug with user progress
 * @param {string} slug - Stack slug
 * @param {number} userId - User ID
 * @returns {Promise<Object>}
 */
export async function findBySlugWithProgress(slug, userId) {
    const stack = await findBySlug(slug);

    // Get user's completed video IDs
    const completedProgress = await prisma.progress.findMany({
        where: {
            userId,
            isCompleted: true,
            video: {
                topic: {
                    stackId: stack.id,
                },
            },
        },
        select: { videoId: true },
    });

    const completedIds = new Set(completedProgress.map((p) => p.videoId));

    // Mark videos as completed
    const topicsWithProgress = stack.topics.map((topic) => ({
        ...topic,
        videos: topic.videos.map((video) => ({
            ...video,
            isCompleted: completedIds.has(video.id),
        })),
    }));

    // Calculate progress
    const completedCount = completedIds.size;
    const progressPercent =
        stack.totalVideos > 0 ? Math.round((completedCount / stack.totalVideos) * 100) : 0;

    return {
        ...stack,
        topics: topicsWithProgress,
        progress: {
            completed: completedCount,
            total: stack.totalVideos,
            percent: progressPercent,
        },
    };
}

/**
 * Get stack by ID
 * @param {number} id - Stack ID
 * @returns {Promise<Object>}
 */
export async function findById(id) {
    const stack = await prisma.stack.findUnique({
        where: { id },
    });

    if (!stack) {
        throw { status: 404, message: "Stack not found" };
    }

    return stack;
}

export default {
    findAll,
    findBySlug,
    findBySlugWithProgress,
    findById,
};

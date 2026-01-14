import prisma from "../lib/prisma.js";

/**
 * Progress Service
 * Handles video progress tracking and dashboard
 */

/**
 * Get dashboard data for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>}
 */
export async function getDashboard(userId) {
    // Get all stacks with progress
    const stacks = await prisma.stack.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
            topics: {
                include: {
                    videos: true,
                },
            },
        },
    });

    // Get user's completed videos
    const completedProgress = await prisma.progress.findMany({
        where: { userId, isCompleted: true },
        select: { videoId: true },
    });

    const completedIds = new Set(completedProgress.map((p) => p.videoId));

    // Calculate progress per stack
    const stackProgress = stacks.map((stack) => {
        const totalVideos = stack.topics.reduce((sum, topic) => sum + topic.videos.length, 0);
        const completedVideos = stack.topics.reduce(
            (sum, topic) => sum + topic.videos.filter((v) => completedIds.has(v.id)).length,
            0
        );

        return {
            id: stack.id,
            slug: stack.slug,
            title: stack.title,
            thumbnail: stack.thumbnail,
            totalVideos,
            completedVideos,
            progressPercent: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
        };
    });

    // Get user's submissions
    const submissions = await prisma.submission.findMany({
        where: { userId },
        include: {
            stack: {
                select: { id: true, title: true, slug: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // Overall stats
    const totalVideos = stackProgress.reduce((sum, s) => sum + s.totalVideos, 0);
    const totalCompleted = stackProgress.reduce((sum, s) => sum + s.completedVideos, 0);

    return {
        overview: {
            totalVideos,
            totalCompleted,
            overallProgress: totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0,
        },
        stacks: stackProgress,
        submissions,
        completedVideoIds: Array.from(completedIds),
    };
}

/**
 * Toggle video progress
 * @param {number} userId - User ID
 * @param {number} videoId - Video ID
 * @param {boolean} isCompleted - Completion status
 * @returns {Promise<Object>}
 */
export async function toggle(userId, videoId, isCompleted = true) {
    // Verify video exists
    const video = await prisma.video.findUnique({
        where: { id: videoId },
    });

    if (!video) {
        throw { status: 404, message: "Video not found" };
    }

    // Upsert progress
    const progress = await prisma.progress.upsert({
        where: {
            userId_videoId: { userId, videoId },
        },
        update: {
            isCompleted,
            completedAt: isCompleted ? new Date() : null,
        },
        create: {
            userId,
            videoId,
            isCompleted,
            completedAt: isCompleted ? new Date() : null,
        },
    });

    return progress;
}

/**
 * Get completed video IDs for a user
 * @param {number} userId - User ID
 * @returns {Promise<number[]>}
 */
export async function getCompletedIds(userId) {
    const progress = await prisma.progress.findMany({
        where: { userId, isCompleted: true },
        select: { videoId: true },
    });

    return progress.map((p) => p.videoId);
}

export default {
    getDashboard,
    toggle,
    getCompletedIds,
};

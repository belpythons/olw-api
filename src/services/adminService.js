import prisma from "../lib/prisma.js";

/**
 * Admin Service
 * Handles admin CRUD operations for curriculum management
 */

// ============================================
// Stack Operations
// ============================================

export async function createStack({ slug, title, description, thumbnail, sortOrder }) {
    // Check if slug exists
    const existing = await prisma.stack.findUnique({ where: { slug } });
    if (existing) {
        throw { status: 400, message: "Stack with this slug already exists" };
    }

    return prisma.stack.create({
        data: { slug, title, description, thumbnail, sortOrder: sortOrder || 0 },
    });
}

export async function updateStack(id, { slug, title, description, thumbnail, sortOrder }) {
    // Verify exists
    const stack = await prisma.stack.findUnique({ where: { id } });
    if (!stack) {
        throw { status: 404, message: "Stack not found" };
    }

    // Check slug uniqueness if changing
    if (slug && slug !== stack.slug) {
        const existing = await prisma.stack.findUnique({ where: { slug } });
        if (existing) {
            throw { status: 400, message: "Stack with this slug already exists" };
        }
    }

    return prisma.stack.update({
        where: { id },
        data: { slug, title, description, thumbnail, sortOrder },
    });
}

export async function deleteStack(id) {
    const stack = await prisma.stack.findUnique({ where: { id } });
    if (!stack) {
        throw { status: 404, message: "Stack not found" };
    }

    await prisma.stack.delete({ where: { id } });
    return { message: "Stack deleted successfully" };
}

// ============================================
// Topic Operations
// ============================================

export async function createTopic({ title, sortOrder, stackId }) {
    // Verify stack exists
    const stack = await prisma.stack.findUnique({ where: { id: stackId } });
    if (!stack) {
        throw { status: 404, message: "Stack not found" };
    }

    return prisma.topic.create({
        data: { title, sortOrder: sortOrder || 0, stackId },
    });
}

export async function updateTopic(id, { title, sortOrder }) {
    const topic = await prisma.topic.findUnique({ where: { id } });
    if (!topic) {
        throw { status: 404, message: "Topic not found" };
    }

    return prisma.topic.update({
        where: { id },
        data: { title, sortOrder },
    });
}

export async function deleteTopic(id) {
    const topic = await prisma.topic.findUnique({ where: { id } });
    if (!topic) {
        throw { status: 404, message: "Topic not found" };
    }

    await prisma.topic.delete({ where: { id } });
    return { message: "Topic deleted successfully" };
}

export async function getAllTopics() {
    return prisma.topic.findMany({
        include: {
            stack: { select: { id: true, title: true, slug: true } },
            _count: { select: { videos: true } },
        },
        orderBy: [{ stackId: "asc" }, { sortOrder: "asc" }],
    });
}

// ============================================
// Video Operations
// ============================================

export async function createVideo({ title, youtubeId, duration, sortOrder, topicId }) {
    // Verify topic exists
    const topic = await prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) {
        throw { status: 404, message: "Topic not found" };
    }

    return prisma.video.create({
        data: {
            title,
            youtubeId,
            duration: duration || 0,
            sortOrder: sortOrder || 0,
            topicId,
        },
    });
}

export async function updateVideo(id, { title, youtubeId, duration, sortOrder }) {
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
        throw { status: 404, message: "Video not found" };
    }

    return prisma.video.update({
        where: { id },
        data: { title, youtubeId, duration, sortOrder },
    });
}

export async function deleteVideo(id) {
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
        throw { status: 404, message: "Video not found" };
    }

    await prisma.video.delete({ where: { id } });
    return { message: "Video deleted successfully" };
}

export async function getAllVideos() {
    return prisma.video.findMany({
        include: {
            topic: {
                select: {
                    id: true,
                    title: true,
                    stack: { select: { id: true, title: true, slug: true } },
                },
            },
        },
        orderBy: [{ topicId: "asc" }, { sortOrder: "asc" }],
    });
}

// ============================================
// User Operations (Admin)
// ============================================

export async function getAllUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            _count: {
                select: { submissions: true, progress: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function deleteUser(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw { status: 404, message: "User not found" };
    }

    await prisma.user.delete({ where: { id } });
    return { message: "User deleted successfully" };
}

export default {
    // Stacks
    createStack,
    updateStack,
    deleteStack,
    // Topics
    createTopic,
    updateTopic,
    deleteTopic,
    getAllTopics,
    // Videos
    createVideo,
    updateVideo,
    deleteVideo,
    getAllVideos,
    // Users
    getAllUsers,
    deleteUser,
};

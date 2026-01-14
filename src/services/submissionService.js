import prisma from "../lib/prisma.js";

/**
 * Submission Service
 * Handles challenge submissions
 */

/**
 * Create or update submission for a stack
 * @param {number} userId - User ID
 * @param {number} stackId - Stack ID
 * @param {string} repoLink - Repository URL
 * @returns {Promise<Object>}
 */
export async function create(userId, stackId, repoLink) {
    // Verify stack exists
    const stack = await prisma.stack.findUnique({
        where: { id: stackId },
    });

    if (!stack) {
        throw { status: 404, message: "Stack not found" };
    }

    // Check if submission already exists
    const existing = await prisma.submission.findFirst({
        where: { userId, stackId },
    });

    if (existing) {
        // Update existing (resubmit)
        return prisma.submission.update({
            where: { id: existing.id },
            data: {
                repoLink,
                status: "PENDING",
                feedback: null,
            },
            include: {
                stack: {
                    select: { id: true, title: true, slug: true },
                },
            },
        });
    }

    // Create new submission
    return prisma.submission.create({
        data: {
            userId,
            stackId,
            repoLink,
        },
        include: {
            stack: {
                select: { id: true, title: true, slug: true },
            },
        },
    });
}

/**
 * Get submissions by user
 * @param {number} userId - User ID
 * @returns {Promise<Array>}
 */
export async function findByUser(userId) {
    return prisma.submission.findMany({
        where: { userId },
        include: {
            stack: {
                select: { id: true, title: true, slug: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

/**
 * Get all submissions (admin)
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>}
 */
export async function findAll(status = null) {
    const where = status ? { status } : {};

    return prisma.submission.findMany({
        where,
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
            stack: {
                select: { id: true, title: true, slug: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

/**
 * Get submission by ID
 * @param {number} id - Submission ID
 * @returns {Promise<Object>}
 */
export async function findById(id) {
    const submission = await prisma.submission.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
            stack: {
                select: { id: true, title: true, slug: true },
            },
        },
    });

    if (!submission) {
        throw { status: 404, message: "Submission not found" };
    }

    return submission;
}

/**
 * Grade a submission (admin)
 * @param {number} id - Submission ID
 * @param {string} status - 'PASS' or 'FAIL'
 * @param {string} feedback - Optional feedback text
 * @returns {Promise<Object>}
 */
export async function grade(id, status, feedback = null) {
    // Verify submission exists
    await findById(id);

    return prisma.submission.update({
        where: { id },
        data: {
            status,
            feedback,
        },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
            stack: {
                select: { id: true, title: true, slug: true },
            },
        },
    });
}

/**
 * Get submission counts by status
 * @returns {Promise<Object>}
 */
export async function getCounts() {
    const [total, pending, passed, failed] = await Promise.all([
        prisma.submission.count(),
        prisma.submission.count({ where: { status: "PENDING" } }),
        prisma.submission.count({ where: { status: "PASS" } }),
        prisma.submission.count({ where: { status: "FAIL" } }),
    ]);

    return { total, pending, passed, failed };
}

export default {
    create,
    findByUser,
    findAll,
    findById,
    grade,
    getCounts,
};

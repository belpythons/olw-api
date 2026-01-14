import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

/**
 * Auth Service
 * Handles authentication business logic
 */

/**
 * Register a new user
 * @param {Object} data - User registration data
 * @returns {Promise<{user: Object, token: string}>}
 */
export async function register({ email, password, name }) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw { status: 400, message: "Email already registered" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: "STUDENT",
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
        },
    });

    // Generate token
    const token = generateToken(user.id);

    return { user, token };
}

/**
 * Login user
 * @param {Object} data - Login credentials
 * @returns {Promise<{user: Object, token: string}>}
 */
export async function login({ email, password }) {
    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw { status: 401, message: "Invalid email or password" };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw { status: 401, message: "Invalid email or password" };
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
}

/**
 * Get user profile by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>}
 */
export async function getProfile(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw { status: 404, message: "User not found" };
    }

    return user;
}

/**
 * Get user by ID (for auth middleware)
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>}
 */
export async function getUserById(userId) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },
    });
}

/**
 * Generate JWT token
 * @param {number} userId - User ID
 * @returns {string}
 */
function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}

export default {
    register,
    login,
    getProfile,
    getUserById,
};

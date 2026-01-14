import { PrismaClient } from "@prisma/client";

/**
 * PrismaClient Singleton
 * Prevents multiple instances in development due to hot reloading
 */

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;

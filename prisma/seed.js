import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Clean existing data
    await prisma.progress.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.video.deleteMany();
    await prisma.topic.deleteMany();
    await prisma.stack.deleteMany();
    await prisma.user.deleteMany();

    // ============================================
    // Create Users
    // ============================================
    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await prisma.user.create({
        data: {
            email: "admin@olw.com",
            password: hashedPassword,
            name: "Admin User",
            role: "ADMIN",
        },
    });

    const student = await prisma.user.create({
        data: {
            email: "student@olw.com",
            password: hashedPassword,
            name: "John Student",
            role: "STUDENT",
        },
    });

    console.log("✅ Users created");

    // ============================================
    // Create Stacks
    // ============================================
    const mernStack = await prisma.stack.create({
        data: {
            slug: "mern",
            title: "MERN Stack",
            description:
                "Master the MERN Stack: MongoDB, Express.js, React, and Node.js. Build full-stack JavaScript applications from scratch.",
            thumbnail: "https://cdn-icons-png.flaticon.com/512/1183/1183672.png",
            sortOrder: 1,
        },
    });

    const viltStack = await prisma.stack.create({
        data: {
            slug: "vilt",
            title: "VILT Stack",
            description:
                "Learn the VILT Stack: Vue.js, Inertia.js, Laravel, and Tailwind CSS. Build modern monolithic applications.",
            thumbnail: "https://cdn-icons-png.flaticon.com/512/5968/5968332.png",
            sortOrder: 2,
        },
    });

    console.log("✅ Stacks created");

    // ============================================
    // Create Topics & Videos for MERN
    // ============================================
    const jsTopic = await prisma.topic.create({
        data: {
            title: "JavaScript Fundamentals",
            sortOrder: 1,
            stackId: mernStack.id,
            videos: {
                create: [
                    {
                        title: "Introduction to JavaScript",
                        youtubeId: "W6NZfCO5SIk",
                        duration: 2700, // 45 min
                        sortOrder: 1,
                    },
                    {
                        title: "Variables, Data Types & Operators",
                        youtubeId: "edlFjlzxkSI",
                        duration: 3600, // 60 min
                        sortOrder: 2,
                    },
                ],
            },
        },
    });

    const reactTopic = await prisma.topic.create({
        data: {
            title: "React Basics",
            sortOrder: 2,
            stackId: mernStack.id,
            videos: {
                create: [
                    {
                        title: "What is React?",
                        youtubeId: "Tn6-PIqc4UM",
                        duration: 1800, // 30 min
                        sortOrder: 1,
                    },
                    {
                        title: "Components and Props",
                        youtubeId: "Y2hgEGPzTZY",
                        duration: 3300, // 55 min
                        sortOrder: 2,
                    },
                ],
            },
        },
    });

    // ============================================
    // Create Topics & Videos for VILT
    // ============================================
    const laravelTopic = await prisma.topic.create({
        data: {
            title: "Laravel Fundamentals",
            sortOrder: 1,
            stackId: viltStack.id,
            videos: {
                create: [
                    {
                        title: "Laravel Installation & Setup",
                        youtubeId: "ImtZ5yENzgE",
                        duration: 2100, // 35 min
                        sortOrder: 1,
                    },
                    {
                        title: "Routing & Controllers",
                        youtubeId: "1qM_lB-qLnE",
                        duration: 3000, // 50 min
                        sortOrder: 2,
                    },
                ],
            },
        },
    });

    const vueTopic = await prisma.topic.create({
        data: {
            title: "Vue.js Essentials",
            sortOrder: 2,
            stackId: viltStack.id,
            videos: {
                create: [
                    {
                        title: "Vue.js 3 Introduction",
                        youtubeId: "YrxBCBibVo0",
                        duration: 2400, // 40 min
                        sortOrder: 1,
                    },
                    {
                        title: "Reactive Data & Computed Properties",
                        youtubeId: "TO6akRGXhx8",
                        duration: 2700, // 45 min
                        sortOrder: 2,
                    },
                ],
            },
        },
    });

    console.log("✅ Topics & Videos created");

    // ============================================
    // Create Sample Progress
    // ============================================
    const videos = await prisma.video.findMany({ take: 3 });

    await prisma.progress.createMany({
        data: [
            { userId: student.id, videoId: videos[0].id, isCompleted: true, completedAt: new Date() },
            { userId: student.id, videoId: videos[1].id, isCompleted: true, completedAt: new Date() },
            { userId: student.id, videoId: videos[2].id, isCompleted: false },
        ],
    });

    console.log("✅ Progress created");

    // ============================================
    // Create Sample Submission
    // ============================================
    await prisma.submission.create({
        data: {
            userId: student.id,
            stackId: mernStack.id,
            repoLink: "https://github.com/johnstudent/mern-todo-app",
            status: "PENDING",
        },
    });

    console.log("✅ Submission created");
    console.log("🎉 Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

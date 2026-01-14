import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";

// Load environment variables
dotenv.config();

// Import middlewares
import { errorHandler, notFoundHandler } from "./src/middlewares/index.js";

// Import routes
import {
    authRouter,
    stacksRouter,
    studentRouter,
    adminRouter,
} from "./src/routes/index.js";

// Initialize Express app
const app = express();

// ============================================
// Middleware Configuration
// ============================================

// CORS configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// API Routes
// ============================================

// Health check
app.get("/api/health", (_, res) => {
    res.json({
        success: true,
        message: "OLW API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

// Mount routes
app.use("/auth", authRouter);
app.use("/stacks", stacksRouter);
app.use("/", studentRouter);
app.use("/admin", adminRouter);

// ============================================
// Error Handling
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// Server Startup (Development)
// ============================================

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 OLW API Server (Prisma + Clean Architecture)          ║
║                                                            ║
║   📍 Local:    http://localhost:${PORT}                       ║
║   🏥 Health:   http://localhost:${PORT}/api/health            ║
║                                                            ║
║   📚 Available Routes:                                     ║
║   ─────────────────────────────────────────────────────    ║
║   Auth:                                                    ║
║   • POST   /auth/register                                  ║
║   • POST   /auth/login                                     ║
║   • GET    /auth/me                                        ║
║   ─────────────────────────────────────────────────────    ║
║   Curriculum (Public):                                     ║
║   • GET    /stacks                                         ║
║   • GET    /stacks/:slug                                   ║
║   ─────────────────────────────────────────────────────    ║
║   Student (Private):                                       ║
║   • GET    /dashboard                                      ║
║   • POST   /progress                                       ║
║   • POST   /submissions                                    ║
║   ─────────────────────────────────────────────────────    ║
║   Admin (Private):                                         ║
║   • /admin/stacks, /admin/topics, /admin/videos            ║
║   • /admin/submissions, /admin/users                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
    });
}

// ============================================
// Serverless Export (for Vercel)
// ============================================

export const handler = serverless(app);
export default app;

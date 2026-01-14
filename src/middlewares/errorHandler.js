import { serverError } from "../utils/apiResponse.js";

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
    // Log error in development
    if (process.env.NODE_ENV === "development") {
        console.error("Error:", err);
    }

    // Handle known service errors
    if (err.status && err.message) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
        });
    }

    // Handle Prisma errors
    if (err.code) {
        switch (err.code) {
            case "P2002":
                return res.status(409).json({
                    success: false,
                    message: "A record with this value already exists.",
                });
            case "P2025":
                return res.status(404).json({
                    success: false,
                    message: "Record not found.",
                });
            case "P2003":
                return res.status(400).json({
                    success: false,
                    message: "Related record not found.",
                });
        }
    }

    // Handle JSON parsing errors
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON in request body.",
        });
    }

    // Default server error
    return serverError(res, process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message);
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
};

export default errorHandler;

/**
 * Standardized API Response Helpers
 */

/**
 * Success response
 * @param {Object} res - Express response object
 * @param {Object} data - Data to return
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const success = (res, data = null, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

/**
 * Created response (201)
 * @param {Object} res - Express response object
 * @param {Object} data - Created resource data
 * @param {string} message - Success message
 */
export const created = (res, data, message = "Created successfully") => {
    return success(res, data, message, 201);
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Object} errors - Additional error details
 */
export const error = (res, message = "Error", statusCode = 400, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
    });
};

/**
 * Not found response (404)
 */
export const notFound = (res, message = "Resource not found") => {
    return error(res, message, 404);
};

/**
 * Unauthorized response (401)
 */
export const unauthorized = (res, message = "Unauthorized") => {
    return error(res, message, 401);
};

/**
 * Forbidden response (403)
 */
export const forbidden = (res, message = "Forbidden") => {
    return error(res, message, 403);
};

/**
 * Validation error response (422)
 */
export const validationError = (res, message = "Validation failed", errors = null) => {
    return error(res, message, 422, errors);
};

/**
 * Server error response (500)
 */
export const serverError = (res, message = "Internal server error") => {
    return error(res, message, 500);
};

export default {
    success,
    created,
    error,
    notFound,
    unauthorized,
    forbidden,
    validationError,
    serverError,
};

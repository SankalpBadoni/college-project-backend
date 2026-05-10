/**
 * Async Error Handler Wrapper
 * Wraps async route handlers to catch errors and pass to error middleware
 */

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * API Response Formatter
 * Standardizes all API responses
 */

export const sendSuccess = (res, data, message = "", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res,
  message = "An error occurred",
  statusCode = 400,
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Validation Error Formatter
 */

export const formatValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    return errors.map((err) => ({
      field: err.field || err.path,
      message: err.message,
    }));
  }

  if (typeof errors === "object") {
    return Object.entries(errors).map(([field, message]) => ({
      field,
      message: typeof message === "object" ? message.message : message,
    }));
  }

  return [{ message: String(errors) }];
};

/**
 * Custom Error Class
 */

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found Error
 */

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * Unauthorized Error
 */

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

/**
 * Forbidden Error
 */

export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403);
  }
}

/**
 * Validation Error
 */

export class ValidationError extends AppError {
  constructor(message = "Validation failed", errors = null) {
    super(message, 400);
    this.errors = errors;
  }
}

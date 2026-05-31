export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const uploadErrorCodes = new Set(["LIMIT_FILE_SIZE", "LIMIT_UNEXPECTED_FILE"]);
  const hasUploadErrorCode = err?.code && uploadErrorCodes.has(err.code);
  const isValidationUploadError = hasUploadErrorCode || err?.message?.includes("Unsupported file type");

  const statusCode =
    err.statusCode ||
    err.status ||
    (res.statusCode === 200
      ? isValidationUploadError
        ? 400
        : 500
      : res.statusCode);

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

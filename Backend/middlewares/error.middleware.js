const mongoose = require("mongoose");

/**
 * Centralized Error Handling Middleware
 *
 * Catches errors forwarded via next(err) and returns a clean JSON response.
 * Must be registered LAST in app.js: app.use(errorHandler)
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";
  let errors = undefined;

  // ── Mongoose Validation Error ─────────────────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ── Mongoose Duplicate Key Error ─────────────────────────────────────────
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `Duplicate value: '${value}' already exists for field '${field}'`;
  }

  // ── Mongoose Cast Error (invalid ObjectId) ───────────────────────────────
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value '${err.value}' for field '${err.path}'`;
  }

  // ── JWT Errors ────────────────────────────────────────────────────────────
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please log in again.";
  }

  // ── Mongoose Connection Error ─────────────────────────────────────────────
  else if (err.name === "MongoNetworkError" || err.name === "MongoServerError") {
    statusCode = 503;
    message = "Database connection error. Please try again later.";
  }

  // Log in development mode
  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${statusCode}: ${message}`);
    if (err.stack) console.error(err.stack);
  }

  const response = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  return res.status(statusCode).json(response);
};

/**
 * notFound — 404 handler for unknown routes.
 * Register BEFORE errorHandler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };

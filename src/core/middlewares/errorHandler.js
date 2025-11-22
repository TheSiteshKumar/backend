import { ErrorHandler } from "../utils/ErrorHandler.js";

// Mongoose: invalid ObjectId
const handleCastErrorDB = (err) => {
  const message = `Resource not found. Invalid ${err.path}: ${err.value}`;
  return new ErrorHandler(message, 400);
};

// Mongoose: duplicate key
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg
    ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    : Object.keys(err.keyValue)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ErrorHandler(message, 400);
};

// Mongoose: validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ErrorHandler(message, 400);
};

// JWT: invalid
const handleJWTError = () =>
  new ErrorHandler("Invalid token. Please log in again!", 401);

// JWT: expired
const handleJWTExpiredError = () =>
  new ErrorHandler("Your token has expired! Please log in again.", 401);

// Development mode: show full debug info
const sendErrorDev = (err, req, res) => {
  console.error("ERROR 💥", err);

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err,
    stack: err.stack,
    timestamp: err.timestamp,
    path: req.originalUrl,
    method: req.method,
  });
};

// Production mode: show safe message
const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      timestamp: err.timestamp,
    });
  }

  console.error("ERROR 💥", err);

  return res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
};

// Main middleware
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  let error = { ...err };
  error.message = err.message;

  // Known error types
  if (err.name === "CastError") error = handleCastErrorDB(error);
  if (err.code === 11000) error = handleDuplicateFieldsDB(error);
  if (err.name === "ValidationError") error = handleValidationErrorDB(error);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  // Mode-based response
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

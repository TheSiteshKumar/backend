import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/ErrorHandler.js";

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from Authorization header
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) {
            throw new ErrorHandler("Not authorized to access this route", 401);
        }

        try {
            // Verify token
            const secret = process.env.JWT_SECRET || "supersecretkey";
            if (!secret) {
                throw new ErrorHandler("JWT secret missing", 500);
            }

            const decoded = jwt.verify(token, secret);

            // Attach user info to request object
            req.user = {
                id: decoded.id,
                role: decoded.role,
            };

            next();
        } catch (err) {
            if (err.name === "JsonWebTokenError") {
                throw new ErrorHandler("Invalid token", 401);
            }
            if (err.name === "TokenExpiredError") {
                throw new ErrorHandler("Token expired", 401);
            }
            throw err;
        }
    } catch (err) {
        next(err);
    }
};

/**
 * Role-based authorization middleware
 * Must be used after protect middleware
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'user')
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new ErrorHandler("Authentication required", 401);
            }

            if (!roles.includes(req.user.role)) {
                throw new ErrorHandler(
                    `User role '${req.user.role}' is not authorized to access this route`,
                    403
                );
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't throw error if missing
 */
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        const secret = process.env.JWT_SECRET || "supersecretkey";

        if (token && secret) {
            try {
                const decoded = jwt.verify(token, secret);
                req.user = {
                    id: decoded.id,
                    role: decoded.role,
                };
            } catch (err) {
                // Ignore token errors for optional auth
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};
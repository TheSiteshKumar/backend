import { register, login, logout, changePassword, forgotPassword, resetPassword } from "./auth.service.js";
import { asyncHandler } from "../../core/middlewares/asyncHandler.js";

export const registerController = asyncHandler(async (req, res, next) => {
    await register(req, res, next);
});

export const loginController = asyncHandler(async (req, res, next) => {
    await login(req, res, next);
});

export const logoutController = asyncHandler(async (req, res, next) => {
    await logout(req, res, next);
});

export const changePasswordController = asyncHandler(async (req, res, next) => {
    await changePassword(req, res, next);
});

export const forgotPasswordController = asyncHandler(async (req, res, next) => {
    await forgotPassword(req, res, next);
});

export const resetPasswordController = asyncHandler(async (req, res, next) => {
    await resetPassword(req, res, next);
});



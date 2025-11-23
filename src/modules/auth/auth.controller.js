import { register, login, logout } from "./auth.service.js";
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

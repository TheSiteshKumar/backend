import express from "express";
import { registerController, loginController, logoutController, forgotPasswordController, resetPasswordController, changePasswordController } from "./auth.controller.js";
import { protect } from "../../core/middlewares/auth.js";

const router = express.Router();

// public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/reset-password", resetPasswordController);
router.post("/forgot-password", forgotPasswordController);

// protected routes
router.use(protect);

router.post("/logout", logoutController);
router.post("/change-password", changePasswordController);

export default router;

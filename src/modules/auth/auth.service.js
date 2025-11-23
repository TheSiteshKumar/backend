import jwt from "jsonwebtoken";
import Auth from "./auth.model.js";
import { asyncHandler } from "../../core/middlewares/asyncHandler.js";
import crypto from "crypto";
import { sendForgotPasswordEmail } from "../../core/services/mail.service.js";

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "SuperSecretKey",
        { expiresIn: "1d" }
    );
};

export const register = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new Auth({ email, password });
    await newUser.save();

    const token = generateToken(newUser);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
        message: "User registered successfully",
        token,
        user: { id: newUser._id, email: newUser.email },
    });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await Auth.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Incorrect email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: "Incorrect email or password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.json({
        message: "Login successful",
        token,
        user: { id: user._id, email: user.email },
    });
});

export const logout = asyncHandler(async (req, res, next) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

export const changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Old password and new password are required" });
    }

    // req.user is available because this route is protected
    const user = await Auth.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
        return res.status(400).json({ message: "Incorrect old password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await Auth.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate Token (secure random string)
    const token = crypto.randomBytes(32).toString("hex");

    // Set expiry (default 60 minutes)
    const expiryMinutes = parseInt(process.env.RESET_PASSWORD_EXPIRY_MINUTES) || 60;
    const expiry = new Date(Date.now() + expiryMinutes * 60 * 1000);

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = expiry;
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiry = expiry;

    await user.save();

    // Send email
    const emailResult = await sendForgotPasswordEmail(user.email, otp, token);

    if (!emailResult.success) {
        return res.status(500).json({
            message: "Failed to send email",
            error: emailResult.error.message || emailResult.error
        });
    }

    res.json({ message: "Password reset email sent" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, token, newPassword } = req.body;

    if (!email || !newPassword || (!otp && !token)) {
        return res.status(400).json({ message: "Email, newPassword, and either OTP or Token are required" });
    }

    const user = await Auth.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    let isValid = false;

    // Verify OTP
    if (otp) {
        if (user.resetPasswordOTP === otp && user.resetPasswordOTPExpiry > Date.now()) {
            isValid = true;
        }
    }

    // Verify Token
    if (token && !isValid) {
        if (user.resetPasswordToken === token && user.resetPasswordTokenExpiry > Date.now()) {
            isValid = true;
        }
    }

    if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP/Token" });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
});

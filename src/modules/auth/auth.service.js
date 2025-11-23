import jwt from "jsonwebtoken";
import Auth from "./auth.model.js";
import { asyncHandler } from "../../core/middlewares/asyncHandler.js";

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

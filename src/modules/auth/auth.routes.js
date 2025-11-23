import express from "express";
import { registerController, loginController, logoutController } from "./auth.controller.js";

import { protect } from "../../core/middlewares/auth.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", protect, (req, res) => {
    res.json(req.user);
});

export default router;

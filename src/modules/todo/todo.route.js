import express from "express";
import { createTodoController, deleteTodoController, getTodoController, getTodosController, updateTodoController, getAllTodosAdminController } from "./todo.controller.js";
import { protect, authorize } from "../../core/middlewares/auth.js";
import { upload } from "../../core/utils/upload.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin route
router.get("/admin/all", authorize("admin"), getAllTodosAdminController);

const uploadFields = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "files", maxCount: 5 },
]);

router.post("/", uploadFields, createTodoController);
router.get("/", getTodosController);
router.put("/:id", uploadFields, updateTodoController);
router.delete("/:id", deleteTodoController);
router.get("/:id", getTodoController);

export default router;
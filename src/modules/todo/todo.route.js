import express from "express";
import { createTodoController, deleteTodoController, getTodoController, getTodosController, updateTodoController, getAllTodosAdminController } from "./todo.controller.js";
import { protect, authorize } from "../../core/middlewares/auth.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin route
router.get("/admin/all", authorize("admin"), getAllTodosAdminController);

router.post("/", createTodoController);
router.get("/", getTodosController);
router.put("/:id", updateTodoController);
router.delete("/:id", deleteTodoController);
router.get("/:id", getTodoController);

export default router;
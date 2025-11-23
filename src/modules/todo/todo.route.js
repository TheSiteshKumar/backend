import express from "express";
import { createTodoController, deleteTodoController, getTodoController, getTodosController, updateTodoController } from "./todo.controller.js";

const router = express.Router();

router.post("/", createTodoController);
router.get("/", getTodosController);
router.put("/:id", updateTodoController);
router.delete("/:id", deleteTodoController);
router.get("/:id", getTodoController);

export default router;
import express from "express";
import { createTodoController, getTodosController } from "./todo.controller.js";

const router = express.Router();

router.post("/", createTodoController);
router.get("/", getTodosController);

export default router;
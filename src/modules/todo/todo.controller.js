import { createTodo, getTodos } from "./todo.service.js";
import { asyncHandler } from "../../core/middlewares/asyncHandler.js";

export const createTodoController = asyncHandler(async (req, res, next) => {
    await createTodo(req, res, next);
});

export const getTodosController = asyncHandler(async (req, res, next) => {
    await getTodos(req, res, next);
});

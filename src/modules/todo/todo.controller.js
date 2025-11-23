import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from "./todo.service.js";
import { asyncHandler } from "../../core/middlewares/asyncHandler.js";

export const createTodoController = asyncHandler(async (req, res, next) => {
    await createTodo(req, res, next);
});

export const getTodoController = asyncHandler(async (req, res, next) => {
    await getTodo(req, res, next);
});


export const getTodosController = asyncHandler(async (req, res, next) => {
    await getTodos(req, res, next);
});

export const updateTodoController = asyncHandler(async (req, res, next) => {
    await updateTodo(req, res, next);
});

export const deleteTodoController = asyncHandler(async (req, res, next) => {
    await deleteTodo(req, res, next);
});


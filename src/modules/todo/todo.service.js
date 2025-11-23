import Todo from "./todo.model.js";
import { asyncHandler } from "../../core/middlewares/asyncHandler.js";
import validate from "./todo.validator.js";

export const createTodo = asyncHandler(async (req, res, next) => {
    const data = await validate.parseAsync(req.body);

    const todo = await Todo.create(data);

    return res.status(201).json({
        success: true,
        data: todo,
    });
});

export const getTodo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    return res.status(200).json({
        success: true,
        data: todo,
    });
});

export const getTodos = asyncHandler(async (req, res, next) => {
    const todos = await Todo.find();
    return res.status(200).json({
        success: true,
        data: todos,
    });
});

export const updateTodo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = await validate.parseAsync(req.body);

    const todo = await Todo.findByIdAndUpdate(id, data, { new: true });

    return res.status(200).json({
        success: true,
        data: todo,
    });
});

export const deleteTodo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    return res.status(200).json({
        success: true,
        data: todo,
    });
});


import Todo from "./todo.model.js";
import { asyncHandler } from "../../core/middlewares/asyncHandler.js";
import validate from "./todo.validator.js";

import { uploadOnCloudinary, deleteFromCloudinary } from "../../core/utils/upload.js";


export const createTodo = asyncHandler(async (req, res, next) => {
    const data = await validate.parseAsync(req.body);

    let image = null;
    let files = [];

    // Handle Image Upload
    if (req.files && req.files.image && req.files.image.length > 0) {
        const imgResponse = await uploadOnCloudinary(req.files.image[0].path);
        if (imgResponse) {
            image = {
                public_id: imgResponse.public_id,
                secure_url: imgResponse.secure_url,
            };
        }
    }

    // Handle Files Upload
    if (req.files && req.files.files && req.files.files.length > 0) {
        for (const file of req.files.files) {
            const fileResponse = await uploadOnCloudinary(file.path);
            if (fileResponse) {
                files.push({
                    public_id: fileResponse.public_id,
                    secure_url: fileResponse.secure_url,
                });
            }
        }
    }

    const todo = await Todo.create({ ...data, image, files, createdBy: req.user.id });

    return res.status(201).json({
        success: true,
        data: todo,
        message: "Todo created successfully",
    });
});

export const getTodo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    return res.status(200).json({
        success: true,
        data: todo,
        message: "Todo fetched successfully",
    });
});

export const getTodos = asyncHandler(async (req, res, next) => {
    const todos = await Todo.find({ createdBy: req.user.id });
    return res.status(200).json({
        success: true,
        data: todos,
        message: "Todos fetched successfully",
    });
});

export const updateTodo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = await validate.parseAsync(req.body);

    const todo = await Todo.findById(id);
    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }

    // Handle Image Replacement
    if (req.files && req.files.image && req.files.image.length > 0) {
        // Delete old image
        if (todo.image && todo.image.public_id) {
            await deleteFromCloudinary(todo.image.public_id);
        }
        // Upload new image
        const imgResponse = await uploadOnCloudinary(req.files.image[0].path);
        if (imgResponse) {
            data.image = {
                public_id: imgResponse.public_id,
                secure_url: imgResponse.secure_url,
            };
        }
    }

    // Handle Files Update (Replace all strategy for simplicity, or append?)
    // Let's assume we append new files if uploaded.
    if (req.files && req.files.files && req.files.files.length > 0) {
        const newFiles = [];
        for (const file of req.files.files) {
            const fileResponse = await uploadOnCloudinary(file.path);
            if (fileResponse) {
                newFiles.push({
                    public_id: fileResponse.public_id,
                    secure_url: fileResponse.secure_url,
                });
            }
        }
        // Append new files to existing ones
        data.files = [...(todo.files || []), ...newFiles];
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, data, { new: true });

    return res.status(200).json({
        success: true,
        data: updatedTodo,
        message: "Todo updated successfully",
    });
});

export const deleteTodo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }

    // Delete image from Cloudinary
    if (todo.image && todo.image.public_id) {
        await deleteFromCloudinary(todo.image.public_id);
    }

    // Delete files from Cloudinary
    if (todo.files && todo.files.length > 0) {
        for (const file of todo.files) {
            if (file.public_id) {
                await deleteFromCloudinary(file.public_id);
            }
        }
    }

    await Todo.findByIdAndDelete(id);

    return res.status(200).json({
        success: true,
        data: todo,
        message: "Todo deleted successfully",
    });
});

export const getAllTodosAdmin = asyncHandler(async (req, res, next) => {
    const todos = await Todo.find();
    return res.status(200).json({
        success: true,
        data: todos,
        message: "All todos fetched successfully (Admin)",
    });
});


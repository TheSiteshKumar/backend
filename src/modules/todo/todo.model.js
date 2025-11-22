import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {  versionKey: false }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
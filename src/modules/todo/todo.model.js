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
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
        },
    },
    // { timestamps: true, versionKey: false }
    { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
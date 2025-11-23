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
        image: {
            public_id: String,
            secure_url: String,
        },
        files: [
            {
                public_id: String,
                secure_url: String,
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    // { timestamps: true, versionKey: false }
    { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("⚠️ MONGO_URI missing");
        return;
    }

    const connect = async () => {
        try {
            await mongoose.connect(uri);
            console.log("Database   → Connected");
        } catch (err) {
            console.error("Database   → Failed");
        }
    };

    await connect();
};

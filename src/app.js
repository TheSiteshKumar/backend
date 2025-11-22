import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./core/middlewares/errorHandler.js";

// import Routes
import todoRoutes from "./modules/todo/todo.route.js";


const app = express();

// Middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/todo", todoRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

// Global Error Handler
app.use(errorHandler);

export default app;
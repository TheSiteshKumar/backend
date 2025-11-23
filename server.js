import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/core/config/db.js";

const PORT = process.env.PORT || 5555;

// Connect DB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server     → http://localhost:${PORT}`);
});

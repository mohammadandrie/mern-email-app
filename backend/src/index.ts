import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import contactRoutes from "./routes/contacts";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://0.0.0.0:5173"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mern_email_app")
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

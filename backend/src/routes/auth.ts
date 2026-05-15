import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// Register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Record login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, lastLoginAt: user.lastLoginAt },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Logout
router.post("/logout", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Record logout timestamp
    user.lastLogoutAt = new Date();
    await user.save();

    res.json({ message: "Logout successful", lastLogoutAt: user.lastLogoutAt });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get current user
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;

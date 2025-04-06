import express, { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = express.Router();

// Register route
router.post("/register", (async (req: Request, res: Response) => {
  try {
    const { fullName, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // Create new user
    const user = new User({ fullName, phoneNumber });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });

    res.status(201).json({ user, token });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(400).json({ error: "Error creating user" });
  }
}) as RequestHandler);

// Login route
router.post("/login", (async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    // Find user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        error: "Your account has been banned",
        isBanned: true,
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "", { expiresIn: "24h" });

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: "Error logging in" });
  }
}) as RequestHandler);

export default router;

import express, { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = express.Router();

// Register route
router.post("/register", (async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate email domain
    if (!email.endsWith("@gatech.edu")) {
      return res.status(400).json({ error: "Only @gatech.edu email addresses are allowed" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    const user = new User({ email, password });
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
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
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

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "", { expiresIn: "24h" });

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: "Error logging in" });
  }
}) as RequestHandler);

export default router;

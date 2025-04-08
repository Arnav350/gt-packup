import express, { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { sendVerificationCode, verifyCode } from "../utils/twilio";

const router = express.Router();

// Start registration route
router.post("/register", (async (req: Request, res: Response) => {
  try {
    const { phone, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // Send verification code via SMS using Twilio
    await sendVerificationCode(phone);

    res.status(200).json({ message: "Verification code sent" });
  } catch (error: any) {
    res.status(400).json({ error: "Error starting registration" });
  }
}) as RequestHandler);

// Complete registration and verify code route
router.post("/verify", (async (req: Request, res: Response) => {
  try {
    const { phone, code, fullName, isRegistration } = req.body;

    // Verify the code using Twilio
    const isValid = await verifyCode(phone, code);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    if (isRegistration) {
      // Double-check if user was created while verifying
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ error: "Phone number already registered" });
      }

      // Create new user after successful verification
      const user = new User({
        phone,
        fullName,
      });
      await user.save();

      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "", { expiresIn: "24h" });

      res.json({ user, token });
    } else {
      // Handle login verification
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "", { expiresIn: "24h" });

      res.json({ user, token });
    }
  } catch (error) {
    res.status(400).json({ error: "Error verifying code" });
  }
}) as RequestHandler);

// Login route
router.post("/login", (async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        error: "Your account has been banned",
        isBanned: true,
      });
    }

    // Send verification code via SMS using Twilio
    await sendVerificationCode(phone);

    res.json({ message: "Verification code sent" });
  } catch (error) {
    res.status(400).json({ error: "Error logging in" });
  }
}) as RequestHandler);

export default router;

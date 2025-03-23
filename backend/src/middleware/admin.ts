import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const admin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.isAdmin) {
      res.status(403).json({ error: "Not authorized as admin" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

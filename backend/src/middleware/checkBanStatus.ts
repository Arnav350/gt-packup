import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const checkBanStatus = (req: AuthRequest, res: Response, next: NextFunction) => {
  const checkBan = async () => {
    try {
      if (!req.user || !req.user.userId) {
        return next();
      }

      // Check if userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
        return next();
      }

      const user = await User.findById(req.user.userId);

      if (user && user.isBanned) {
        return res.status(403).json({
          error: "Your account has been banned",
          isBanned: true,
        });
      }

      next();
    } catch (error) {
      // If there's an error checking ban status, we'll let the request proceed
      // but log the error for monitoring
      console.error("Error checking ban status:", error);
      next();
    }
  };

  checkBan();
};

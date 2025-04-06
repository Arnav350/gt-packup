import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  fullName: string;
  phoneNumber: string;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: Date;
}

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model<IUser>("User", userSchema);

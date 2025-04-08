import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  phone: string;
  fullName: string;
  isAdmin: boolean;
  isBanned: boolean;
}

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          // Basic phone number validation - can be enhanced
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: "Please enter a valid phone number",
      },
    },
    fullName: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("user", userSchema);

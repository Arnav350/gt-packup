import mongoose, { Document } from "mongoose";

export interface IService extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  package: string;
  status: string;
  address: string;
  address_extra?: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    package: {
      type: String,
      required: true,
      enum: ["PackUp", "Secure Store", "Full Move", "Custom Plan"],
    },
    status: {
      type: String,
      required: true,
      default: "Created",
      enum: ["Created", "Checked", "Confirmed", "Completed"],
    },
    address: {
      type: String,
      required: true,
    },
    address_extra: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>("service", serviceSchema);

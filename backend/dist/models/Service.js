"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const serviceSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.Service = mongoose_1.default.model("service", serviceSchema);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const twilio_1 = require("../utils/twilio");
const router = express_1.default.Router();
// Start registration route
router.post("/register", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, fullName } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ error: "Phone number already registered" });
        }
        // Send verification code via SMS using Twilio
        yield (0, twilio_1.sendVerificationCode)(phone);
        res.status(200).json({ message: "Verification code sent" });
    }
    catch (error) {
        res.status(400).json({ error: "Error starting registration" });
    }
})));
// Complete registration and verify code route
router.post("/verify", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, code, fullName, isRegistration } = req.body;
        // Verify the code using Twilio
        const isValid = yield (0, twilio_1.verifyCode)(phone, code);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid verification code" });
        }
        if (isRegistration) {
            // Double-check if user was created while verifying
            const existingUser = yield User_1.User.findOne({ phone });
            if (existingUser) {
                return res.status(400).json({ error: "Phone number already registered" });
            }
            // Create new user after successful verification
            const user = new User_1.User({
                phone,
                fullName,
            });
            yield user.save();
            // Generate token
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "", { expiresIn: "24h" });
            res.json({ user, token });
        }
        else {
            // Handle login verification
            const user = yield User_1.User.findOne({ phone });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            // Generate token
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "", { expiresIn: "24h" });
            res.json({ user, token });
        }
    }
    catch (error) {
        res.status(400).json({ error: "Error verifying code" });
    }
})));
// Login route
router.post("/login", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = req.body;
        // Find user
        const user = yield User_1.User.findOne({ phone });
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
        yield (0, twilio_1.sendVerificationCode)(phone);
        res.json({ message: "Verification code sent" });
    }
    catch (error) {
        res.status(400).json({ error: "Error logging in" });
    }
})));
exports.default = router;

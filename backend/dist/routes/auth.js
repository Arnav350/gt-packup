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
const router = express_1.default.Router();
// Register route
router.post("/register", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate email domain
        if (!email.endsWith("@gatech.edu")) {
            return res.status(400).json({ error: "Only @gatech.edu email addresses are allowed" });
        }
        // Check if user already exists
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }
        // Create new user
        const user = new User_1.User({ email, password });
        yield user.save();
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
        res.status(201).json({ user, token });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        res.status(400).json({ error: "Error creating user" });
    }
})));
// Login route
router.post("/login", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const user = yield User_1.User.findOne({ email });
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
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "", { expiresIn: "24h" });
        res.json({ user, token });
    }
    catch (error) {
        res.status(400).json({ error: "Error logging in" });
    }
})));
exports.default = router;

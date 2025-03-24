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
exports.admin = void 0;
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const admin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        // Check if userId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(req.user.userId)) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }
        const user = yield User_1.User.findById(req.user.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (!user.isAdmin) {
            res.status(403).json({ error: "Not authorized as admin" });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.admin = admin;

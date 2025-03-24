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
exports.checkBanStatus = void 0;
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const checkBanStatus = (req, res, next) => {
    const checkBan = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user || !req.user.userId) {
                return next();
            }
            // Check if userId is a valid ObjectId
            if (!mongoose_1.default.Types.ObjectId.isValid(req.user.userId)) {
                return next();
            }
            const user = yield User_1.User.findById(req.user.userId);
            if (user && user.isBanned) {
                return res.status(403).json({
                    error: "Your account has been banned",
                    isBanned: true,
                });
            }
            next();
        }
        catch (error) {
            // If there's an error checking ban status, we'll let the request proceed
            // but log the error for monitoring
            console.error("Error checking ban status:", error);
            next();
        }
    });
    checkBan();
};
exports.checkBanStatus = checkBanStatus;

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
const User_1 = require("../models/User");
const Service_1 = require("../models/Service");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const router = express_1.default.Router();
// Protect all admin routes with auth and admin middleware
router.use(auth_1.auth);
router.use(admin_1.admin);
// Get all users
router.get("/users", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
})));
// Get all services
router.get("/services", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield Service_1.Service.find().sort({ createdAt: -1 }).populate("user_id", "email");
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching services" });
    }
})));
// Update service
router.put("/services/:id", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { package: packageName, status, address, address_extra, phone } = req.body;
        const service = yield Service_1.Service.findById(id);
        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }
        const updatedService = yield Service_1.Service.findByIdAndUpdate(id, {
            package: packageName,
            status,
            address,
            address_extra,
            phone,
        }, { new: true }).populate("user_id", "email");
        res.json(updatedService);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating service" });
    }
})));
// Delete service
router.delete("/services/:id", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const service = yield Service_1.Service.findById(id);
        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }
        yield Service_1.Service.findByIdAndDelete(id);
        res.json({ message: "Service deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting service" });
    }
})));
// Ban/unban user
router.put("/users/:id/ban", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isBanned } = req.body;
        const user = yield User_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Don't allow banning of admin users
        if (user.isAdmin) {
            return res.status(400).json({ error: "Cannot ban an admin user" });
        }
        const updatedUser = yield User_1.User.findByIdAndUpdate(id, { isBanned }, { new: true }).select("-password");
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating user ban status" });
    }
})));
exports.default = router;

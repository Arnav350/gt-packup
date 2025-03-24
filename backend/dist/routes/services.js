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
const auth_1 = require("../middleware/auth");
const Service_1 = require("../models/Service");
const router = express_1.default.Router();
// Create a new service booking
router.post("/", auth_1.auth, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { package: packageType, address, address_extra, phone } = req.body;
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Authentication required" });
        }
        // Check if user already has an active service
        const activeServices = yield Service_1.Service.find({
            user_id: req.user.userId,
            status: { $in: ["Created", "Checked", "Confirmed"] },
        });
        if (activeServices.length > 0) {
            return res.status(400).json({
                error: "You already have an active service request",
                activeService: activeServices[0],
            });
        }
        // Validate package type
        const validPackages = ["PackUp", "Secure Store", "Full Move", "Custom Plan"];
        if (!validPackages.includes(packageType)) {
            return res.status(400).json({ error: "Invalid package type" });
        }
        // Create new service
        const service = new Service_1.Service({
            user_id: req.user.userId,
            package: packageType,
            status: "Created",
            address,
            address_extra: address_extra || null,
            phone,
        });
        yield service.save();
        res.status(201).json({ service });
    }
    catch (error) {
        console.error("Error creating service:", error);
        res.status(400).json({ error: "Error creating service booking" });
    }
})));
// Get user's services
router.get("/", auth_1.auth, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Authentication required" });
        }
        const services = yield Service_1.Service.find({ user_id: req.user.userId }).sort({ createdAt: -1 });
        res.json({ services });
    }
    catch (error) {
        console.error("Error fetching services:", error);
        res.status(400).json({ error: "Error fetching services" });
    }
})));
// Get user's active service
router.get("/active", auth_1.auth, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Authentication required" });
        }
        const activeService = yield Service_1.Service.findOne({
            user_id: req.user.userId,
            status: { $in: ["Created", "Checked", "Confirmed"] },
        });
        if (!activeService) {
            return res.status(404).json({ error: "No active service found" });
        }
        res.json({ service: activeService });
    }
    catch (error) {
        console.error("Error fetching active service:", error);
        res.status(400).json({ error: "Error fetching active service" });
    }
})));
// Cancel a service
router.delete("/:serviceId", auth_1.auth, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceId } = req.params;
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Authentication required" });
        }
        // Check if service exists and belongs to the user
        const service = yield Service_1.Service.findOne({
            _id: serviceId,
            user_id: req.user.userId,
            status: { $in: ["Created", "Checked", "Confirmed"] },
        });
        if (!service) {
            return res.status(404).json({ error: "Service not found or already completed" });
        }
        // Delete the service
        yield Service_1.Service.deleteOne({ _id: serviceId });
        res.status(200).json({ message: "Service successfully cancelled" });
    }
    catch (error) {
        console.error("Error cancelling service:", error);
        res.status(400).json({ error: "Error cancelling service" });
    }
})));
exports.default = router;

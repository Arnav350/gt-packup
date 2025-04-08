import express, { Request, Response, RequestHandler } from "express";
import { auth } from "../middleware/auth";
import { Service } from "../models/Service";
import { User } from "../models/User";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: { userId: string };
}

const router = express.Router();

// Create a new service booking
router.post("/", auth, (async (req: AuthRequest, res: Response) => {
  try {
    const { package: packageType, address, address_extra } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Get user's phone number
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user already has an active service
    const activeServices = await Service.find({
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
    const service = new Service({
      user_id: req.user.userId,
      package: packageType,
      status: "Created",
      address,
      address_extra: address_extra || null,
    });

    await service.save();

    res.status(201).json({ service });
  } catch (error: any) {
    console.error("Error creating service:", error);
    res.status(400).json({ error: "Error creating service booking" });
  }
}) as RequestHandler);

// Get user's services
router.get("/", auth, (async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const services = await Service.find({ user_id: req.user.userId }).sort({ createdAt: -1 });
    res.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(400).json({ error: "Error fetching services" });
  }
}) as RequestHandler);

// Get user's active service
router.get("/active", auth, (async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const activeService = await Service.findOne({
      user_id: req.user.userId,
      status: { $in: ["Created", "Checked", "Confirmed"] },
    });

    if (!activeService) {
      return res.status(404).json({ error: "No active service found" });
    }

    res.json({ service: activeService });
  } catch (error) {
    console.error("Error fetching active service:", error);
    res.status(400).json({ error: "Error fetching active service" });
  }
}) as RequestHandler);

// Cancel a service
router.delete("/:serviceId", auth, (async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId } = req.params;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check if service exists and belongs to the user
    const service = await Service.findOne({
      _id: serviceId,
      user_id: req.user.userId,
      status: { $in: ["Created", "Checked", "Confirmed"] },
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found or already completed" });
    }

    // Delete the service
    await Service.deleteOne({ _id: serviceId });

    res.status(200).json({ message: "Service successfully cancelled" });
  } catch (error) {
    console.error("Error cancelling service:", error);
    res.status(400).json({ error: "Error cancelling service" });
  }
}) as RequestHandler);

export default router;

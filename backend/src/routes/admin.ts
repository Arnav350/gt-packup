import express, { Request, Response, RequestHandler } from "express";
import { User } from "../models/User";
import { Service } from "../models/Service";
import { auth } from "../middleware/auth";
import { admin } from "../middleware/admin";

const router = express.Router();

// Protect all admin routes with auth and admin middleware
router.use(auth);
router.use(admin);

// Get all users
router.get("/users", (async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
}) as RequestHandler);

// Get all services
router.get("/services", (async (req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }).populate("user_id", "email");
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error fetching services" });
  }
}) as RequestHandler);

// Update service
router.put("/services/:id", (async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { package: packageName, status, address, address_extra, phone } = req.body;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        package: packageName,
        status,
        address,
        address_extra,
        phone,
      },
      { new: true }
    ).populate("user_id", "email");

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: "Error updating service" });
  }
}) as RequestHandler);

// Delete service
router.delete("/services/:id", (async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    await Service.findByIdAndDelete(id);

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting service" });
  }
}) as RequestHandler);

// Ban/unban user
router.put("/users/:id/ban", (async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't allow banning of admin users
    if (user.isAdmin) {
      return res.status(400).json({ error: "Cannot ban an admin user" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { isBanned }, { new: true }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user ban status" });
  }
}) as RequestHandler);

export default router;

import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import serviceRoutes from "./routes/services";
import adminRoutes from "./routes/admin";
import { auth } from "./middleware/auth";
import { checkBanStatus } from "./middleware/checkBanStatus";

// Extended request interface with user property
interface AuthRequest extends Request {
  user?: any;
}

dotenv.config();

const app = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGODB_URI || "";

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", auth, checkBanStatus, serviceRoutes);
app.use("/api/admin", auth, adminRoutes);

// Protected route example
app.get("/api/protected", auth, checkBanStatus, (req: AuthRequest, res: Response) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

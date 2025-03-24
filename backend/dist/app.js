"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const services_1 = __importDefault(require("./routes/services"));
const admin_1 = __importDefault(require("./routes/admin"));
const auth_2 = require("./middleware/auth");
const checkBanStatus_1 = require("./middleware/checkBanStatus");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const mongoUri = process.env.MONGODB_URI || "";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default
    .connect(mongoUri)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.error("MongoDB connection error:", error);
});
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/services", auth_2.auth, checkBanStatus_1.checkBanStatus, services_1.default);
app.use("/api/admin", auth_2.auth, admin_1.default);
// Protected route example
app.get("/api/protected", auth_2.auth, checkBanStatus_1.checkBanStatus, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Express!");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

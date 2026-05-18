import cors from "cors";
import express from "express";
import morgan from "morgan";
import adminRoutes from "./routes/adminRoutes.js";
import approvalRoutes from "./routes/approvalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "goal-portal" }));
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/check-ins", checkInRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

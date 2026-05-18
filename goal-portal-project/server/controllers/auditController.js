import asyncHandler from "express-async-handler";
import AuditLog from "../models/AuditLog.js";

export const listAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find()
    .populate("actor", "name email role")
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 100);
  res.json(logs);
});

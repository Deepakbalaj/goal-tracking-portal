import asyncHandler from "express-async-handler";
import Goal from "../models/Goal.js";
import GoalSheet from "../models/GoalSheet.js";
import { logAudit } from "../services/auditService.js";

export const listPendingApprovals = asyncHandler(async (req, res) => {
  const sheets = await GoalSheet.find({ manager: req.user._id, status: { $in: ["submitted", "rework"] } })
    .populate("employee", "name email department")
    .populate("cycle", "name fiscalYear")
    .sort({ submittedAt: 1 });
  res.json(sheets);
});

export const decideGoalSheet = asyncHandler(async (req, res) => {
  const sheet = await GoalSheet.findById(req.params.sheetId);
  if (!sheet) throw new Error("Goal sheet not found.");
  if (!sheet.manager.equals(req.user._id) && req.user.role !== "admin") throw new Error("Cannot review this sheet.");

  const oldValue = sheet.toObject();
  if (req.body.decision === "approve") {
    sheet.status = "approved";
    sheet.approvedAt = new Date();
    sheet.approvedBy = req.user._id;
    await Goal.updateMany({ sheet: sheet._id }, { locked: true });
  } else if (req.body.decision === "rework") {
    sheet.status = "rework";
    await Goal.updateMany({ sheet: sheet._id }, { locked: false });
  } else {
    sheet.status = "rejected";
  }

  await sheet.save();
  await logAudit({
    req,
    action: `GOAL_SHEET_${sheet.status.toUpperCase()}`,
    entity: "GoalSheet",
    entityId: sheet._id,
    oldValue,
    newValue: { sheet, comment: req.body.comment },
  });
  res.json(sheet);
});

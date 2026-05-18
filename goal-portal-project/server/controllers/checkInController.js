import asyncHandler from "express-async-handler";
import CheckIn from "../models/CheckIn.js";
import Cycle from "../models/Cycle.js";
import Goal from "../models/Goal.js";
import { logAudit } from "../services/auditService.js";
import { calculateProgress } from "../utils/progress.js";

export const listCheckIns = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.goal) filter.goal = req.query.goal;
  if (req.query.quarter) filter.quarter = req.query.quarter;
  if (req.user.role === "employee") filter.employee = req.user._id;

  const checkIns = await CheckIn.find(filter)
    .populate("goal", "title target weightage measurementType deadline")
    .populate("employee", "name email department")
    .sort({ updatedAt: -1 });
  res.json(checkIns);
});

export const upsertCheckIn = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.goalId);
  if (!goal) throw new Error("Goal not found.");
  if (!goal.employee.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Cannot update this check-in.");
  }

  const cycle = await Cycle.findById(goal.cycle);
  const activeWindow = cycle?.windows.find((window) => window.name === req.params.quarter);
  const now = new Date();
  if (req.user.role !== "admin" && (!activeWindow || now < activeWindow.opensAt || now > activeWindow.closesAt)) {
    res.status(403);
    throw new Error(`${req.params.quarter.toUpperCase()} achievement updates are outside the active window.`);
  }

  const oldValue = await CheckIn.findOne({ goal: goal._id, quarter: req.params.quarter });
  const progress = calculateProgress(goal, Number(req.body.actual), req.body.completedAt);
  const checkIn = await CheckIn.findOneAndUpdate(
    { goal: goal._id, quarter: req.params.quarter },
    {
      goal: goal._id,
      employee: goal.employee,
      cycle: goal.cycle,
      actual: req.body.actual,
      progress,
      status: req.body.status,
      completedAt: req.body.completedAt,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  goal.status = req.body.status || goal.status;
  await goal.save();

  if (goal.isShared && goal.isPrimaryOwner) {
    const siblings = await Goal.find({ sharedGoal: goal.sharedGoal, _id: { $ne: goal._id } });
    await Promise.all(
      siblings.map((sibling) =>
        CheckIn.findOneAndUpdate(
          { goal: sibling._id, quarter: req.params.quarter },
          {
            goal: sibling._id,
            employee: sibling.employee,
            cycle: sibling.cycle,
            actual: req.body.actual,
            progress,
            status: req.body.status,
            completedAt: req.body.completedAt,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );
  }

  await logAudit({
    req,
    action: "CHECKIN_UPDATED",
    entity: "CheckIn",
    entityId: checkIn._id,
    oldValue,
    newValue: checkIn,
  });
  res.json(checkIn);
});

export const addManagerComment = asyncHandler(async (req, res) => {
  const checkIn = await CheckIn.findById(req.params.id);
  if (!checkIn) throw new Error("Check-in not found.");
  checkIn.comments.push({
    author: req.user._id,
    comment: req.body.comment,
    sentiment: req.body.sentiment || "support",
  });
  await checkIn.save();
  await logAudit({
    req,
    action: "CHECKIN_COMMENT_ADDED",
    entity: "CheckIn",
    entityId: checkIn._id,
    newValue: req.body,
  });
  res.json(checkIn);
});

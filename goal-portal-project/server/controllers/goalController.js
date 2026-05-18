import asyncHandler from "express-async-handler";
import Cycle from "../models/Cycle.js";
import Goal from "../models/Goal.js";
import GoalSheet from "../models/GoalSheet.js";
import SharedGoal from "../models/SharedGoal.js";
import User from "../models/User.js";
import { logAudit } from "../services/auditService.js";

async function ensureSheet(employee, cycle) {
  const user = await User.findById(employee);
  if (!user?.manager) throw new Error("Employee must have a manager before creating goals.");
  return GoalSheet.findOneAndUpdate(
    { employee, cycle },
    { $setOnInsert: { employee, manager: user.manager, cycle, status: "draft" } },
    { new: true, upsert: true }
  );
}

async function validateSheetWeightage(employee, cycle, ignoreGoalId) {
  const goals = await Goal.find({ employee, cycle, _id: { $ne: ignoreGoalId } });
  const total = goals.reduce((sum, goal) => sum + goal.weightage, 0);
  return { goals, total };
}

export const listGoals = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "employee") filter.employee = req.user._id;
  if (req.query.employee) filter.employee = req.query.employee;
  if (req.query.cycle) filter.cycle = req.query.cycle;

  if (req.user.role === "manager" && !req.query.employee) {
    const team = await User.find({ manager: req.user._id }).select("_id");
    filter.employee = { $in: team.map((member) => member._id) };
  }

  const goals = await Goal.find(filter)
    .populate("employee", "name email department")
    .populate("cycle", "name fiscalYear")
    .sort({ createdAt: -1 });
  res.json(goals);
});

export const createGoal = asyncHandler(async (req, res) => {
  const employee = req.user.role === "employee" ? req.user._id : req.body.employee;
  const cycle = await Cycle.findById(req.body.cycle);
  const goalSettingWindow = cycle?.windows.find((window) => window.name === "goal_setting");
  const now = new Date();
  if (req.user.role === "employee" && (!goalSettingWindow || now < goalSettingWindow.opensAt || now > goalSettingWindow.closesAt)) {
    res.status(403);
    throw new Error("Goal creation is outside the active goal-setting window.");
  }
  const sheet = await ensureSheet(employee, req.body.cycle);
  if (!["draft", "rework"].includes(sheet.status)) {
    res.status(400);
    throw new Error("Approved or submitted goal sheets cannot be edited.");
  }

  const { goals, total } = await validateSheetWeightage(employee, req.body.cycle);
  if (goals.length >= 8) throw new Error("Maximum 8 goals are allowed per employee.");
  if (Number(req.body.weightage) < 10) throw new Error("Minimum weightage per goal is 10%.");
  if (total + Number(req.body.weightage) > 100) throw new Error("Total goal weightage cannot exceed 100%.");

  const goal = await Goal.create({ ...req.body, employee, sheet: sheet._id });
  await logAudit({ req, action: "GOAL_CREATED", entity: "Goal", entityId: goal._id, newValue: goal });
  res.status(201).json(goal);
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) throw new Error("Goal not found.");
  if (goal.locked && req.user.role !== "admin") throw new Error("Locked goals can only be changed by admin.");
  if (goal.isShared && req.user.role === "employee") {
    req.body = { weightage: req.body.weightage, status: req.body.status };
  }

  const oldValue = goal.toObject();
  if (req.body.weightage) {
    const { total } = await validateSheetWeightage(goal.employee, goal.cycle, goal._id);
    if (Number(req.body.weightage) < 10) throw new Error("Minimum weightage per goal is 10%.");
    if (total + Number(req.body.weightage) > 100) throw new Error("Total goal weightage cannot exceed 100%.");
  }

  Object.assign(goal, req.body);
  await goal.save();
  await logAudit({ req, action: "GOAL_UPDATED", entity: "Goal", entityId: goal._id, oldValue, newValue: goal });
  res.json(goal);
});

export const submitGoalSheet = asyncHandler(async (req, res) => {
  const sheet = await GoalSheet.findById(req.params.sheetId);
  if (!sheet) throw new Error("Goal sheet not found.");
  if (!sheet.employee.equals(req.user._id) && req.user.role !== "admin") throw new Error("Cannot submit this sheet.");

  const goals = await Goal.find({ sheet: sheet._id });
  const total = goals.reduce((sum, goal) => sum + goal.weightage, 0);
  if (goals.length === 0) throw new Error("Add at least one goal before submission.");
  if (total !== 100) throw new Error("Total goal weightage must equal 100% before submission.");

  const oldValue = sheet.toObject();
  sheet.status = "submitted";
  sheet.submittedAt = new Date();
  await sheet.save();
  await logAudit({ req, action: "GOAL_SHEET_SUBMITTED", entity: "GoalSheet", entityId: sheet._id, oldValue, newValue: sheet });
  res.json(sheet);
});

export const myGoalSheet = asyncHandler(async (req, res) => {
  const cycle = req.query.cycle;
  const sheet = await ensureSheet(req.user._id, cycle);
  const goals = await Goal.find({ sheet: sheet._id });
  res.json({ sheet, goals });
});

export const unlockGoalSheet = asyncHandler(async (req, res) => {
  const sheet = await GoalSheet.findById(req.params.sheetId);
  if (!sheet) throw new Error("Goal sheet not found.");
  const oldValue = sheet.toObject();
  sheet.status = "rework";
  sheet.unlockedUntil = req.body.unlockedUntil;
  await sheet.save();
  await Goal.updateMany({ sheet: sheet._id }, { locked: false });
  await logAudit({ req, action: "GOAL_SHEET_UNLOCKED", entity: "GoalSheet", entityId: sheet._id, oldValue, newValue: sheet });
  res.json(sheet);
});

export const assignSharedGoal = asyncHandler(async (req, res) => {
  const shared = await SharedGoal.create({ ...req.body, assignedBy: req.user._id });
  const created = [];
  for (const employee of req.body.employees) {
    const sheet = await ensureSheet(employee, req.body.cycle);
    created.push(
      await Goal.create({
        sheet: sheet._id,
        employee,
        cycle: req.body.cycle,
        sharedGoal: shared._id,
        isShared: true,
        isPrimaryOwner: String(employee) === String(req.body.primaryOwner),
        thrustArea: shared.thrustArea,
        title: shared.title,
        description: shared.description,
        uomType: shared.uomType,
        measurementType: shared.measurementType,
        target: shared.target,
        deadline: shared.deadline,
        weightage: req.body.weightageByEmployee?.[employee] || 10,
      })
    );
  }
  await logAudit({ req, action: "SHARED_GOAL_ASSIGNED", entity: "SharedGoal", entityId: shared._id, newValue: shared });
  res.status(201).json({ shared, goals: created });
});

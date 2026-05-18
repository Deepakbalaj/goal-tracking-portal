import asyncHandler from "express-async-handler";
import Cycle from "../models/Cycle.js";
import { logAudit } from "../services/auditService.js";

export const listCycles = asyncHandler(async (req, res) => {
  const cycles = await Cycle.find().sort({ createdAt: -1 });
  res.json(cycles);
});

export const createCycle = asyncHandler(async (req, res) => {
  const cycle = await Cycle.create(req.body);
  await logAudit({ req, action: "CYCLE_CREATED", entity: "Cycle", entityId: cycle._id, newValue: cycle });
  res.status(201).json(cycle);
});

export const updateCycle = asyncHandler(async (req, res) => {
  const cycle = await Cycle.findById(req.params.id);
  if (!cycle) {
    res.status(404);
    throw new Error("Cycle not found.");
  }

  const oldValue = cycle.toObject();
  Object.assign(cycle, req.body);
  await cycle.save();
  await logAudit({ req, action: "CYCLE_UPDATED", entity: "Cycle", entityId: cycle._id, oldValue, newValue: cycle });
  res.json(cycle);
});

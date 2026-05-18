import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { logAudit } from "../services/auditService.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate("manager", "name email").sort({ role: 1, name: 1 });
  res.json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  await logAudit({ req, action: "USER_CREATED", entity: "User", entityId: user._id, newValue: user });
  res.status(201).json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const oldValue = user.toObject();
  Object.assign(user, req.body);
  await user.save();
  await logAudit({ req, action: "USER_UPDATED", entity: "User", entityId: user._id, oldValue, newValue: user });
  res.json(user);
});

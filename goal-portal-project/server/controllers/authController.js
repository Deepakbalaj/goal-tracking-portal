import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  designation: user.designation,
  manager: user.manager,
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  res.json({ token: signToken(user), user: sanitizeUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export const entraLogin = asyncHandler(async (req, res) => {
  res.status(501).json({
    message:
      "Microsoft Entra ID login hook is prepared for production configuration. Add MSAL token validation and map entraId to a user.",
  });
});

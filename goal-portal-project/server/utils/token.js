import jwt from "jsonwebtoken";

export function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET || "dev-secret-change-me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import AuditLog from "../models/AuditLog.js";
import CheckIn from "../models/CheckIn.js";
import Cycle from "../models/Cycle.js";
import Goal from "../models/Goal.js";
import GoalSheet from "../models/GoalSheet.js";
import Notification from "../models/Notification.js";
import SharedGoal from "../models/SharedGoal.js";
import User from "../models/User.js";
import { calculateProgress } from "../utils/progress.js";

dotenv.config();

const password = "Password@123";

async function run() {
  await connectDB();
  await Promise.all([
    AuditLog.deleteMany(),
    CheckIn.deleteMany(),
    Goal.deleteMany(),
    GoalSheet.deleteMany(),
    Notification.deleteMany(),
    SharedGoal.deleteMany(),
    Cycle.deleteMany(),
    User.deleteMany(),
  ]);

  const admin = await User.create({
    name: "Aarav HR Admin",
    email: "admin@goalportal.com",
    password,
    role: "admin",
    department: "Human Resources",
    designation: "HRBP",
  });
  const manager = await User.create({
    name: "Meera Manager",
    email: "manager@goalportal.com",
    password,
    role: "manager",
    department: "Sales",
    designation: "Regional Sales Manager",
  });
  const employee = await User.create({
    name: "Rohan Employee",
    email: "employee@goalportal.com",
    password,
    role: "employee",
    department: "Sales",
    designation: "Account Executive",
    manager: manager._id,
  });
  const analyst = await User.create({
    name: "Isha Analyst",
    email: "isha@goalportal.com",
    password,
    role: "employee",
    department: "Sales",
    designation: "Sales Analyst",
    manager: manager._id,
  });

  const cycle = await Cycle.create({
    name: "FY26 Performance Cycle",
    fiscalYear: "2026",
    status: "active",
    windows: [
      { name: "goal_setting", opensAt: "2026-05-01", closesAt: "2026-06-15" },
      { name: "q1", opensAt: "2026-07-01", closesAt: "2026-07-31" },
      { name: "q2", opensAt: "2026-10-01", closesAt: "2026-10-31" },
      { name: "q3", opensAt: "2027-01-01", closesAt: "2027-01-31" },
      { name: "q4", opensAt: "2027-03-01", closesAt: "2027-04-30" },
    ],
  });

  const sheet = await GoalSheet.create({
    employee: employee._id,
    manager: manager._id,
    cycle: cycle._id,
    status: "approved",
    submittedAt: new Date("2026-05-05"),
    approvedAt: new Date("2026-05-08"),
    approvedBy: manager._id,
  });

  const goals = await Goal.insertMany([
    {
      sheet: sheet._id,
      employee: employee._id,
      cycle: cycle._id,
      thrustArea: "Revenue Growth",
      title: "Close new enterprise revenue",
      description: "Build qualified pipeline and close strategic enterprise accounts.",
      uomType: "numeric",
      measurementType: "min",
      target: 100,
      weightage: 40,
      deadline: "2027-03-31",
      status: "on_track",
      locked: true,
    },
    {
      sheet: sheet._id,
      employee: employee._id,
      cycle: cycle._id,
      thrustArea: "Operational Excellence",
      title: "Reduce proposal turnaround time",
      description: "Improve cycle time for customer proposal responses.",
      uomType: "numeric",
      measurementType: "max",
      target: 3,
      weightage: 30,
      deadline: "2026-12-31",
      status: "on_track",
      locked: true,
    },
    {
      sheet: sheet._id,
      employee: employee._id,
      cycle: cycle._id,
      thrustArea: "Compliance",
      title: "Complete mandatory certifications",
      description: "Finish all mandatory sales and data handling certifications.",
      uomType: "zero_based",
      measurementType: "zero_based",
      target: 0,
      weightage: 30,
      deadline: "2026-09-30",
      status: "completed",
      locked: true,
    },
  ]);

  await CheckIn.insertMany(
    goals.map((goal, index) => {
      const actual = [80, 4, 0][index];
      return {
        goal: goal._id,
        employee: employee._id,
        cycle: cycle._id,
        quarter: "q1",
        actual,
        progress: calculateProgress(goal, actual),
        status: index === 2 ? "completed" : "on_track",
        comments: [{ author: manager._id, comment: "Good first-quarter progress.", sentiment: "support" }],
      };
    })
  );

  await Notification.create({
    user: employee._id,
    title: "Goal sheet approved",
    message: "Your FY26 goal sheet is locked and ready for quarterly check-ins.",
    type: "success",
  });

  await AuditLog.create({
    actor: admin._id,
    action: "SEED_DATA_CREATED",
    entity: "Cycle",
    entityId: cycle._id,
    newValue: { users: 4, goals: goals.length },
  });

  console.log("Seed complete");
  console.log("admin@goalportal.com / Password@123");
  console.log("manager@goalportal.com / Password@123");
  console.log("employee@goalportal.com / Password@123");
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

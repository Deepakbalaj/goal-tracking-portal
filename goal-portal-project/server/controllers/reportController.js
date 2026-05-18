import asyncHandler from "express-async-handler";
import XLSX from "xlsx";
import CheckIn from "../models/CheckIn.js";
import Goal from "../models/Goal.js";
import GoalSheet from "../models/GoalSheet.js";
import User from "../models/User.js";

async function reportRows(query = {}) {
  const checkIns = await CheckIn.find(query)
    .populate("employee", "name email department")
    .populate("goal", "title target weightage")
    .sort({ quarter: 1 });

  return checkIns.map((item) => ({
    Employee: item.employee?.name,
    Email: item.employee?.email,
    Department: item.employee?.department,
    Goal: item.goal?.title,
    Quarter: item.quarter.toUpperCase(),
    Target: item.goal?.target,
    "Actual achievement": item.actual,
    Progress: `${Math.round(item.progress)}%`,
    Status: item.status.replace("_", " "),
  }));
}

export const achievementReport = asyncHandler(async (req, res) => {
  const rows = await reportRows(req.query.cycle ? { cycle: req.query.cycle } : {});
  if (req.query.format === "xlsx") {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Achievement Report");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Disposition", "attachment; filename=achievement-report.xlsx");
    res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").send(buffer);
    return;
  }

  const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(rows));
  res.setHeader("Content-Disposition", "attachment; filename=achievement-report.csv");
  res.type("text/csv").send(csv);
});

export const dashboardAnalytics = asyncHandler(async (req, res) => {
  const employeeFilter = {};
  if (req.user.role === "employee") employeeFilter.employee = req.user._id;
  if (req.user.role === "manager") {
    const team = await User.find({ manager: req.user._id }).select("_id");
    employeeFilter.employee = { $in: team.map((user) => user._id) };
  }

  const [goals, sheets, checkIns, employees] = await Promise.all([
    Goal.find(employeeFilter),
    GoalSheet.find(employeeFilter),
    CheckIn.find(employeeFilter),
    User.find(req.user.role === "manager" ? { manager: req.user._id } : {}),
  ]);

  const completedCheckIns = checkIns.filter((item) => item.status === "completed").length;
  const expectedCheckIns = goals.length * 4;
  const teamCompletion = expectedCheckIns ? Math.round((completedCheckIns / expectedCheckIns) * 100) : 0;

  const statusBuckets = goals.reduce(
    (acc, goal) => ({ ...acc, [goal.status]: (acc[goal.status] || 0) + 1 }),
    { not_started: 0, on_track: 0, completed: 0 }
  );

  const trend = ["q1", "q2", "q3", "q4"].map((quarter) => {
    const quarterItems = checkIns.filter((item) => item.quarter === quarter);
    const average =
      quarterItems.reduce((sum, item) => sum + item.progress, 0) / Math.max(quarterItems.length, 1);
    return { quarter: quarter.toUpperCase(), progress: Math.round(average) };
  });

  res.json({
    totals: {
      goals: goals.length,
      employees: employees.length,
      submittedSheets: sheets.filter((sheet) => sheet.status === "submitted").length,
      approvedSheets: sheets.filter((sheet) => sheet.status === "approved").length,
      pendingCheckIns: Math.max(expectedCheckIns - checkIns.length, 0),
      completedCheckIns,
      teamCompletion,
    },
    statusBuckets,
    trend,
  });
});

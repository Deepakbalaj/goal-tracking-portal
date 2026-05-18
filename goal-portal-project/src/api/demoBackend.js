const demoUsers = [
  {
    id: "admin-demo",
    _id: "admin-demo",
    name: "Aarav HR Admin",
    email: "admin@goalportal.com",
    password: "Password@123",
    role: "admin",
    department: "Human Resources",
    designation: "HRBP",
  },
  {
    id: "manager-demo",
    _id: "manager-demo",
    name: "Meera Manager",
    email: "manager@goalportal.com",
    password: "Password@123",
    role: "manager",
    department: "Sales",
    designation: "Regional Sales Manager",
  },
  {
    id: "employee-demo",
    _id: "employee-demo",
    name: "Rohan Employee",
    email: "employee@goalportal.com",
    password: "Password@123",
    role: "employee",
    department: "Sales",
    designation: "Account Executive",
    manager: "manager-demo",
  },
];

const cycle = {
  _id: "cycle-demo",
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
};

let goals = [
  {
    _id: "goal-1",
    employee: { _id: "employee-demo", name: "Rohan Employee", email: "employee@goalportal.com", department: "Sales" },
    cycle,
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
    _id: "goal-2",
    employee: { _id: "employee-demo", name: "Rohan Employee", email: "employee@goalportal.com", department: "Sales" },
    cycle,
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
    _id: "goal-3",
    employee: { _id: "employee-demo", name: "Rohan Employee", email: "employee@goalportal.com", department: "Sales" },
    cycle,
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
];

let checkIns = [
  { _id: "check-1", goal: goals[0], employee: goals[0].employee, quarter: "q1", actual: 80, progress: 80, status: "on_track" },
  { _id: "check-2", goal: goals[1], employee: goals[1].employee, quarter: "q1", actual: 4, progress: 75, status: "on_track" },
  { _id: "check-3", goal: goals[2], employee: goals[2].employee, quarter: "q1", actual: 0, progress: 100, status: "completed" },
];

const auditLogs = [
  {
    _id: "audit-1",
    actor: demoUsers[0],
    action: "DEMO_DATA_LOADED",
    entity: "Cycle",
    createdAt: new Date().toISOString(),
  },
];

function currentUser() {
  const token = localStorage.getItem("goal_portal_token") || "";
  const email = token.replace("demo-token:", "");
  return demoUsers.find((user) => user.email === email);
}

function dashboard() {
  const completedCheckIns = checkIns.filter((item) => item.status === "completed").length;
  return {
    totals: {
      goals: goals.length,
      employees: demoUsers.filter((user) => user.role === "employee").length,
      submittedSheets: 0,
      approvedSheets: 1,
      pendingCheckIns: goals.length * 4 - checkIns.length,
      completedCheckIns,
      teamCompletion: Math.round((completedCheckIns / (goals.length * 4)) * 100),
    },
    statusBuckets: {
      not_started: goals.filter((goal) => goal.status === "not_started").length,
      on_track: goals.filter((goal) => goal.status === "on_track").length,
      completed: goals.filter((goal) => goal.status === "completed").length,
    },
    trend: [
      { quarter: "Q1", progress: 85 },
      { quarter: "Q2", progress: 0 },
      { quarter: "Q3", progress: 0 },
      { quarter: "Q4", progress: 0 },
    ],
  };
}

export async function demoApi(path, options = {}) {
  const method = options.method || "GET";

  if (path === "/auth/login" && method === "POST") {
    const { email, password } = JSON.parse(options.body || "{}");
    const user = demoUsers.find((item) => item.email === email && item.password === password);
    if (!user) throw new Error("Invalid email or password.");
    return { token: `demo-token:${user.email}`, user };
  }

  if (path === "/auth/me") return { user: currentUser() };
  if (path === "/reports/dashboard") return dashboard();
  if (path === "/goals") return goals;
  if (path === "/admin/cycles") return [cycle];
  if (path === "/admin/users") return demoUsers;
  if (path === "/admin/audit-logs") return auditLogs;
  if (path === "/approvals/pending") return [];
  if (path === "/check-ins") return checkIns;

  if (path === "/goals" && method === "POST") {
    const body = JSON.parse(options.body || "{}");
    const goal = {
      ...body,
      _id: `goal-${Date.now()}`,
      employee: demoUsers[2],
      cycle,
      locked: false,
      status: "not_started",
    };
    goals = [goal, ...goals];
    return goal;
  }

  if (path.startsWith("/check-ins/") && method === "PUT") {
    const [, , goalId, quarter] = path.split("/");
    const goal = goals.find((item) => item._id === goalId);
    const body = JSON.parse(options.body || "{}");
    const progress = goal?.target ? Math.min((Number(body.actual) / goal.target) * 100, 100) : 100;
    const checkIn = {
      _id: `check-${Date.now()}`,
      goal,
      employee: goal?.employee,
      quarter,
      actual: Number(body.actual),
      progress,
      status: body.status,
    };
    checkIns = [checkIn, ...checkIns.filter((item) => !(item.goal?._id === goalId && item.quarter === quarter))];
    return checkIn;
  }

  if (path.includes("/reports/achievements")) {
    return new Blob(["Employee,Goal,Target,Actual achievement,Progress\nRohan Employee,Close new enterprise revenue,100,80,80%"], {
      type: "text/csv",
    });
  }

  return {};
}

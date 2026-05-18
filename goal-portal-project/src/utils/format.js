export const roleLabel = {
  employee: "Employee",
  manager: "Manager",
  admin: "Admin / HR",
};

export const statusLabel = {
  not_started: "Not Started",
  on_track: "On Track",
  completed: "Completed",
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rework: "Rework",
  rejected: "Rejected",
};

export function pct(value) {
  return `${Math.round(value || 0)}%`;
}

export function calculateProgress(goal, actual, completedAt) {
  if (!goal) return 0;

  if (goal.measurementType === "zero_based") {
    return Number(actual) === 0 ? 100 : 0;
  }

  if (goal.measurementType === "timeline") {
    if (!completedAt || !goal.deadline) return 0;
    return new Date(completedAt) <= new Date(goal.deadline) ? 100 : 0;
  }

  if (goal.measurementType === "max") {
    return actual > 0 ? Math.min((goal.target / actual) * 100, 100) : 0;
  }

  return goal.target > 0 ? Math.min((actual / goal.target) * 100, 100) : 0;
}

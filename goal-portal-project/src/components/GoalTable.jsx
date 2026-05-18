import { statusLabel } from "../utils/format";

export default function GoalTable({ goals, onEdit }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Goal</th>
              <th className="px-4 py-3">Thrust Area</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Weightage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Locked</th>
              {onEdit && <th className="px-4 py-3">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {goals.map((goal) => (
              <tr key={goal._id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{goal.title}</p>
                  <p className="text-xs text-slate-500">{goal.description}</p>
                </td>
                <td className="px-4 py-3">{goal.thrustArea}</td>
                <td className="px-4 py-3">{goal.target}</td>
                <td className="px-4 py-3">{goal.weightage}%</td>
                <td className="px-4 py-3">{statusLabel[goal.status]}</td>
                <td className="px-4 py-3">{goal.locked ? "Yes" : "No"}</td>
                {onEdit && (
                  <td className="px-4 py-3">
                    <button onClick={() => onEdit(goal)} className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {goals.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={7}>
                  No goals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";
import { pct, statusLabel } from "../utils/format";

export default function CheckIns() {
  const [goals, setGoals] = useState([]);
  const [checkIns, setCheckIns] = useState([]);

  function load() {
    api("/goals").then(setGoals);
    api("/check-ins").then(setCheckIns);
  }

  useEffect(load, []);

  async function update(goal, quarter, form) {
    try {
      await api(`/check-ins/${goal._id}/${quarter}`, {
        method: "PUT",
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      toast.success("Check-in updated");
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-bold">Quarterly Achievement Updates</h3>
        <div className="mt-4 grid gap-4">
          {goals.map((goal) => (
            <form
              key={goal._id}
              onSubmit={(event) => {
                event.preventDefault();
                update(goal, event.currentTarget.quarter.value, event.currentTarget);
              }}
              className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-[1fr_120px_140px_150px_110px]"
            >
              <div>
                <p className="font-semibold">{goal.title}</p>
                <p className="text-sm text-slate-500">Target {goal.target} - {goal.weightage}%</p>
              </div>
              <select name="quarter" className="rounded-lg border px-3 py-2">
                <option value="q1">Q1</option>
                <option value="q2">Q2</option>
                <option value="q3">Q3</option>
                <option value="q4">Q4</option>
              </select>
              <input name="actual" type="number" step="0.01" placeholder="Actual" className="rounded-lg border px-3 py-2" />
              <select name="status" className="rounded-lg border px-3 py-2">
                <option value="not_started">Not Started</option>
                <option value="on_track">On Track</option>
                <option value="completed">Completed</option>
              </select>
              <button className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white">Save</button>
            </form>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-bold">Recent Check-ins</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {checkIns.map((item) => (
                <tr key={item._id}>
                  <td className="py-3 font-semibold">{item.goal?.title}</td>
                  <td>{item.quarter.toUpperCase()}</td>
                  <td>{item.actual}</td>
                  <td>{pct(item.progress)}</td>
                  <td>{statusLabel[item.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

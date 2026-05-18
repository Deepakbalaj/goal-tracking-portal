import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";
import GoalTable from "../components/GoalTable";
import { useAuth } from "../context/AuthContext";

const emptyGoal = {
  thrustArea: "",
  title: "",
  description: "",
  uomType: "numeric",
  measurementType: "min",
  target: 100,
  weightage: 10,
  deadline: "2027-03-31",
};

export default function Goals({ team = false }) {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [draft, setDraft] = useState(emptyGoal);

  const activeCycle = cycles[0]?._id;

  function load() {
    api("/goals").then(setGoals);
    api("/admin/cycles").then(setCycles);
  }

  useEffect(load, []);

  async function createGoal(event) {
    event.preventDefault();
    try {
      await api("/goals", { method: "POST", body: JSON.stringify({ ...draft, cycle: activeCycle }) });
      toast.success("Goal saved");
      setDraft(emptyGoal);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function submitSheet() {
    try {
      const data = await api(`/goals/sheet/me?cycle=${activeCycle}`);
      await api(`/goals/sheet/${data.sheet._id}/submit`, { method: "POST" });
      toast.success("Goal sheet submitted");
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-5">
      {!team && user.role === "employee" && (
        <form onSubmit={createGoal} className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <input placeholder="Thrust Area" className="rounded-lg border px-3 py-2" value={draft.thrustArea} onChange={(e) => setDraft({ ...draft, thrustArea: e.target.value })} required />
            <input placeholder="Goal Title" className="rounded-lg border px-3 py-2" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
            <input placeholder="Description" className="rounded-lg border px-3 py-2" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} required />
            <select className="rounded-lg border px-3 py-2" value={draft.uomType} onChange={(e) => setDraft({ ...draft, uomType: e.target.value })}>
              <option value="numeric">Numeric</option>
              <option value="percentage">Percentage</option>
              <option value="timeline">Timeline</option>
              <option value="zero_based">Zero-based</option>
            </select>
            <select className="rounded-lg border px-3 py-2" value={draft.measurementType} onChange={(e) => setDraft({ ...draft, measurementType: e.target.value })}>
              <option value="min">Min Type</option>
              <option value="max">Max Type</option>
              <option value="timeline">Timeline</option>
              <option value="zero_based">Zero-based</option>
            </select>
            <input type="number" placeholder="Target" className="rounded-lg border px-3 py-2" value={draft.target} onChange={(e) => setDraft({ ...draft, target: Number(e.target.value) })} />
            <input type="number" min="10" max="100" placeholder="Weightage" className="rounded-lg border px-3 py-2" value={draft.weightage} onChange={(e) => setDraft({ ...draft, weightage: Number(e.target.value) })} />
            <input type="date" className="rounded-lg border px-3 py-2" value={draft.deadline} onChange={(e) => setDraft({ ...draft, deadline: e.target.value })} />
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white">Save Goal</button>
            <button type="button" onClick={submitSheet} className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white">
              Submit Goal Sheet
            </button>
          </div>
        </form>
      )}
      <GoalTable goals={goals} />
    </div>
  );
}

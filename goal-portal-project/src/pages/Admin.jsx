import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";

export function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api("/admin/users").then(setUsers); }, []);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold">User Management</h3>
      <div className="mt-4 grid gap-3">
        {users.map((user) => (
          <div key={user._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div><p className="font-semibold">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p></div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase">{user.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Cycles() {
  const [cycles, setCycles] = useState([]);
  useEffect(() => { api("/admin/cycles").then(setCycles); }, []);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold">Quarterly Cycles</h3>
      <div className="mt-4 grid gap-3">
        {cycles.map((cycle) => (
          <div key={cycle._id} className="rounded-lg border border-slate-200 p-3">
            <p className="font-semibold">{cycle.name}</p>
            <p className="text-sm text-slate-500">{cycle.fiscalYear} - {cycle.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SharedGoals() {
  const [users, setUsers] = useState([]);
  const [cycles, setCycles] = useState([]);
  useEffect(() => {
    api("/admin/users").then(setUsers);
    api("/admin/cycles").then(setCycles);
  }, []);

  async function submit(event) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const employees = users.filter((user) => user.role === "employee").map((user) => user._id);
    try {
      await api("/goals/shared", {
        method: "POST",
        body: JSON.stringify({
          title: fd.get("title"),
          thrustArea: fd.get("thrustArea"),
          description: fd.get("description"),
          uomType: "numeric",
          measurementType: fd.get("measurementType"),
          target: Number(fd.get("target")),
          deadline: fd.get("deadline"),
          cycle: cycles[0]?._id,
          primaryOwner: employees[0],
          employees,
        }),
      });
      toast.success("Shared goal pushed to employees");
      event.currentTarget.reset();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold">Push Shared KPI</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <input name="title" placeholder="Goal title" className="rounded-lg border px-3 py-2" required />
        <input name="thrustArea" placeholder="Thrust area" className="rounded-lg border px-3 py-2" required />
        <input name="description" placeholder="Description" className="rounded-lg border px-3 py-2" required />
        <select name="measurementType" className="rounded-lg border px-3 py-2"><option value="min">Higher is better</option><option value="max">Lower is better</option></select>
        <input name="target" type="number" placeholder="Target" className="rounded-lg border px-3 py-2" required />
        <input name="deadline" type="date" className="rounded-lg border px-3 py-2" required />
      </div>
      <button className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white">Assign to Employees</button>
    </form>
  );
}

export function AuditLogs() {
  const [logs, setLogs] = useState([]);
  useEffect(() => { api("/admin/audit-logs").then(setLogs); }, []);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold">Audit Trail</h3>
      <div className="mt-4 space-y-3">
        {logs.map((log) => (
          <div key={log._id} className="rounded-lg border border-slate-200 p-3">
            <p className="font-semibold">{log.action}</p>
            <p className="text-sm text-slate-500">{log.actor?.name} - {new Date(log.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

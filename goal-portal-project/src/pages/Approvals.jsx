import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";

export default function Approvals() {
  const [sheets, setSheets] = useState([]);

  function load() {
    api("/approvals/pending").then(setSheets);
  }

  useEffect(load, []);

  async function decide(sheetId, decision) {
    try {
      await api(`/approvals/${sheetId}/decision`, {
        method: "POST",
        body: JSON.stringify({ decision, comment: `${decision} by manager` }),
      });
      toast.success(`Sheet ${decision}`);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="grid gap-4">
      {sheets.map((sheet) => (
        <section key={sheet._id} className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold">{sheet.employee?.name}</h3>
              <p className="text-sm text-slate-500">{sheet.cycle?.name} - {sheet.status}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => decide(sheet._id, "approve")} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Approve</button>
              <button onClick={() => decide(sheet._id, "rework")} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Return</button>
              <button onClick={() => decide(sheet._id, "reject")} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Reject</button>
            </div>
          </div>
        </section>
      ))}
      {sheets.length === 0 && <p className="rounded-lg bg-white p-8 text-center text-slate-500">No pending approval sheets.</p>}
    </div>
  );
}

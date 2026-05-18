import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api/client";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api("/reports/dashboard").then(setData);
  }, []);

  if (!data) return <p className="text-slate-500">Loading dashboard...</p>;

  const statusData = Object.entries(data.statusBuckets).map(([name, value]) => ({ name: name.replace("_", " "), value }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Goals" value={data.totals.goals} />
        <StatCard label="Pending Check-ins" value={data.totals.pendingCheckIns} tone="amber" />
        <StatCard label="Completed Check-ins" value={data.totals.completedCheckIns} tone="sky" />
        <StatCard label="Team Completion" value={`${data.totals.teamCompletion}%`} tone="rose" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold">Goal Status</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#047857" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold">QoQ Progress Trend</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="progress" stroke="#0369a1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

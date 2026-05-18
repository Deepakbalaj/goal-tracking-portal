import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const samples = [
  ["Admin", "admin@goalportal.com"],
  ["Manager", "manager@goalportal.com"],
  ["Employee", "employee@goalportal.com"],
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@goalportal.com");
  const [password, setPassword] = useState("Password@123");

  async function submit(event) {
    event.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">HRMS Performance</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight">In-House Goal Setting & Tracking Portal</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Create weighted goals, route approvals, lock final sheets, run quarterly check-ins, and track completion with audit-ready reporting.
          </p>
        </section>
        <form onSubmit={submit} className="rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <label className="mt-5 block text-sm font-semibold">Email</label>
          <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="mt-4 block text-sm font-semibold">Password</label>
          <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="mt-6 w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white">Login</button>
          <div className="mt-5 grid gap-2">
            {samples.map(([label, value]) => (
              <button key={value} type="button" onClick={() => setEmail(value)} className="rounded-md bg-slate-100 px-3 py-2 text-left text-sm font-medium">
                {label}: {value}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}

import { useAuth } from "../context/AuthContext";
import { roleLabel } from "../utils/format";

const menus = {
  employee: ["Dashboard", "My Goals", "Check-ins"],
  manager: ["Dashboard", "Team Goals", "Approvals", "Check-ins", "Reports"],
  admin: ["Dashboard", "Users", "Cycles", "Shared Goals", "Reports", "Audit Logs"],
};

export default function Layout({ view, setView, children }) {
  const { user, logout } = useAuth();
  const items = menus[user.role] || [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">In-House</p>
          <h1 className="mt-2 text-xl font-bold leading-tight">Goal Setting & Tracking Portal</h1>
        </div>
        <nav className="space-y-1 px-3 py-5">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                view === item ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">{roleLabel[user.role]}</p>
              <h2 className="text-2xl font-bold">{view}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <button onClick={logout} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Logout
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {items.map((item) => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold ${
                  view === item ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6">{children}</div>
      </main>
    </div>
  );
}

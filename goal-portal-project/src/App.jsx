import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuditLogs, Cycles, SharedGoals, Users } from "./pages/Admin";
import Approvals from "./pages/Approvals";
import CheckIns from "./pages/CheckIns";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Login from "./pages/Login";
import Reports from "./pages/Reports";

function Portal() {
  const { user, loading } = useAuth();
  const [view, setView] = useState("Dashboard");

  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-100 text-slate-600">Loading portal...</div>;
  if (!user) return <Login />;

  const screens = {
    Dashboard: <Dashboard />,
    "My Goals": <Goals />,
    "Team Goals": <Goals team />,
    Approvals: <Approvals />,
    "Check-ins": <CheckIns />,
    Reports: <Reports />,
    Users: <Users />,
    Cycles: <Cycles />,
    "Shared Goals": <SharedGoals />,
    "Audit Logs": <AuditLogs />,
  };

  return (
    <Layout view={view} setView={setView}>
      {screens[view] || <Dashboard />}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Portal />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

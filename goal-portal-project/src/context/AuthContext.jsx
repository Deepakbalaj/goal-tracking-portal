import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("goal_portal_token")));

  useEffect(() => {
    if (!localStorage.getItem("goal_portal_token")) return;
    api("/auth/me")
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => localStorage.removeItem("goal_portal_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("goal_portal_token", data.token);
    setUser(data.user);
    toast.success(`Welcome, ${data.user.name}`);
  }

  function logout() {
    localStorage.removeItem("goal_portal_token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

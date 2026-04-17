import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("sos_user");
    const token = localStorage.getItem("sos_token");
    if (raw && token) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem("sos_user");
        localStorage.removeItem("sos_token");
      }
    }
    setLoading(false);
  }, []);

  async function loginWarden(name, password) {
    const { data } = await api.post("/api/auth/warden/login", { name, password });
    localStorage.setItem("sos_token", data.token);
    localStorage.setItem("sos_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function registerWarden(payload) {
    const { data } = await api.post("/api/auth/warden/register", payload);
    localStorage.setItem("sos_token", data.token);
    localStorage.setItem("sos_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function loginStudent(payload) {
    const { data } = await api.post("/api/auth/student/login", payload);
    localStorage.setItem("sos_token", data.token);
    localStorage.setItem("sos_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("sos_token");
    localStorage.removeItem("sos_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, loginWarden, registerWarden, loginStudent, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


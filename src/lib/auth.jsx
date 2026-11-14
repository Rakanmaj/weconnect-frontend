import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AuthContext = createContext(null);

async function authRequest(path, body, signal) {
  let response;
  try {
    response = await fetch(`/api/auth/${path}`, {
      method: body === undefined ? "GET" : "POST",
      credentials: "same-origin",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Cannot reach the sign-in service. Please try again shortly.");
  }
  if (response.status === 204) return null;
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || "Sign-in is temporarily unavailable. Please try again.");
    error.status = response.status;
    throw error;
  }
  return result;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const authVersion = useRef(0);
  useEffect(() => {
    const controller = new AbortController();
    const version = authVersion.current;
    authRequest("me", undefined, controller.signal)
      .then(result => { if (authVersion.current === version) setUser(result.user); })
      .catch(error => {
        if (authVersion.current === version && error.name !== "AbortError" && error.status !== 401) setSessionError(error.message);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  async function authenticate(path, data) {
    authVersion.current++;
    const result = await authRequest(path, data);
    setUser(result.user);
    setSessionError("");
    return result.user;
  }
  async function logout() {
    authVersion.current++;
    await authRequest("logout", {});
    setUser(null);
    setSessionError("");
  }
  async function refreshUser() {
    const version = ++authVersion.current;
    const result = await authRequest('me');
    if (authVersion.current === version) setUser(result.user);
    return result.user;
  }
  useEffect(() => {
    if (!user) return;
    async function checkAccess() {
      const version = ++authVersion.current;
      try { const result = await authRequest('me'); if (authVersion.current === version) setUser(result.user); }
      catch (error) { if (authVersion.current === version && [401, 403].includes(error.status)) { setUser(null); setSessionError(error.message); } }
    }
    window.addEventListener('focus', checkAccess);
    return () => window.removeEventListener('focus', checkAccess);
  }, [user?.id]);
  return <AuthContext.Provider value={{ user, loading, sessionError, refreshUser, login: data => authenticate("login", data), register: data => authenticate("register", data), logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider is missing.");
  return context;
}

export function RequireAuth({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-surface" role="status" aria-label="Checking your session"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) {
    const login = role === "admin" ? "/admin/login" : "/login";
    return <Navigate to={`${login}?next=${encodeURIComponent(location.pathname + location.search + location.hash)}`} replace />;
  }
  if (user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return children;
}

export function AuthError({ message }) {
  if (!message) return null;
  return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{message}</div>;
}

export function loginDestination(next, role) {
  if (typeof next === "string") {
    try {
      const url = new URL(next, window.location.origin);
      if (url.origin === window.location.origin && url.pathname.startsWith(`/${role}/`)) return url.pathname + url.search + url.hash;
    } catch { /* Use this account's own portal. */ }
  }
  return `/${role}/dashboard`;
}

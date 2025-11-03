
const TOKEN_KEY_PRIMARY = "token";        
const TOKEN_KEY_ALT     = "access_token";  
const USER_KEY          = "user";          
const IDLE_KEY          = "last_activity_at";





export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); }
  catch { return null; }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY_PRIMARY);
  localStorage.removeItem(TOKEN_KEY_ALT);
  localStorage.removeItem(USER_KEY);
};

// ---------- jwt utils ----------
const b64urlToStr = (b64url) => {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/")
                    .padEnd(Math.ceil(b64url.length / 4) * 4, "=");
  return atob(b64);
};

const parseJwt = (token) => {
  try {
    const [, payload] = token.split(".");
    return payload ? JSON.parse(b64urlToStr(payload)) : null;
  } catch { return null; }
};




// -------- fixed redirect that avoids /login loops --------
export const redirectToLogin = (nextPath) => {
  const here = `${window.location.pathname}${window.location.search || ""}`;
  const atLogin = window.location.pathname.startsWith("/login");

  // determine desired "next"
  const url = new URL(window.location.href);
  const existingNext = url.searchParams.get("next");
  const desiredNext = nextPath || existingNext || "/";

  // never loop back to /login
  const safeNext = desiredNext.startsWith("/login") ? "/" : desiredNext;

  if (atLogin) {
    // we're already at /login — don't stack next params
    const currentNext = new URLSearchParams(window.location.search).get("next");
    if (currentNext === safeNext) return;
    const newUrl = `/login?next=${encodeURIComponent(safeNext)}`;
    if (here !== newUrl) window.history.replaceState(null, "", newUrl);
    return;
  }

  window.location.href = `/login?next=${encodeURIComponent(safeNext)}`;
};

export const touchActivity = () => localStorage.setItem(IDLE_KEY, String(Date.now()));
export const lastActivityAt = () => Number(localStorage.getItem(IDLE_KEY) || 0);
// utils/auth.js
export const saveAuth = ({ token, user }) => {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
};

export const getAuth = () => ({
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "{}"),
});


export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");

// Optional: handle expiry
export const isTokenExpired = () => {
  const exp = localStorage.getItem("token_exp");
  if (!exp) return false;
  return Date.now() > Number(exp);
};

// Check if logged in
export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired();
};

// Role-based helper
export const hasRole = (role) => {
  if (!isAuthenticated()) return false;
  const stored = getRole();
  return stored === role;
};

// Logout utility
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("token_exp");
};

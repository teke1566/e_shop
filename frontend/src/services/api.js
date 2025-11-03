import axios from "axios";
import { getToken, isTokenExpired, clearAuth, redirectToLogin } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:9191",
  withCredentials: false, // you can enable if you later move to httpOnly cookies
});

// Attach Authorization header if present
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // Hard-fail fast if token is already expired
    if (isTokenExpired(token)) {
      clearAuth();
      redirectToLogin();
      // Cancel the request:
      const err = new axios.Cancel("Token expired");
      throw err;
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handler —kicks you to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isCancel(error)) throw error;
    const status = error?.response?.status;
    if (status === 401) {
      clearAuth();
      redirectToLogin();
    }
    throw error;
  }
);

export default api;

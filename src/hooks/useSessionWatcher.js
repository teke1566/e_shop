import { useEffect, useRef } from "react";
import { getToken, isTokenExpired, clearAuth, redirectToLogin, touchActivity } from "../utils/auth";

/**
 * - maxIdleMs: sign out if no activity for this duration 
 * - checkEveryMs: interval to poll expiry/idle
 * - skewSeconds: buffer on token expiry
 */
export default function useSessionWatcher({
  maxIdleMs = 30 * 60 * 1000,
  checkEveryMs = 15 * 1000,
  skewSeconds = 30,
} = {}) {
  const timerRef = useRef(null);

  useEffect(() => {
    const resetActivity = () => touchActivity();
    // mark first activity on mount
    resetActivity();

    // user activity listeners
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetActivity, { passive: true }));

    // periodic check
    timerRef.current = setInterval(() => {
      const token = getToken();

      // 1) Hard expiry check
      if (!token || isTokenExpired(token, skewSeconds)) {
        clearAuth();
        redirectToLogin();
        return;
      }

      // 2) Idle timeout check
      const last = Number(localStorage.getItem("last_activity_at") || 0);
      if (Date.now() - last > maxIdleMs) {
        clearAuth();
        redirectToLogin();
        return;
      }
    }, checkEveryMs);

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetActivity));
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [maxIdleMs, checkEveryMs, skewSeconds]);
}

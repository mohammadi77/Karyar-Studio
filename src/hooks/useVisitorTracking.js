import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { apiRequest } from "../utils/apiRequest";

const SESSION_KEY = "karyar_visitor_session";
const HEARTBEAT_INTERVAL_MS = 20000;
// طولانی‌تر از ۳ ثانیه‌ی صفحه‌ی لودینگ بین ناوبری‌ها (usePageLoading) چون آن
// باعث unmount/remount کامل MainLayout و در نتیجه اجرای دوباره‌ی این افکت
// برای همان مسیر می‌شود
const VIEW_DEDUP_WINDOW_MS = 5000;

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// این‌ها عمداً بیرون از هوک و در سطح ماژول نگه داشته می‌شوند (نه useRef) چون
// این هوک فقط یک‌بار در کل اپ (داخل MainLayout) استفاده می‌شود و باید در برابر
// اجرای دوباره‌ی افکت توسط React StrictMode در حالت توسعه مقاوم باشد؛ useRef
// برای این منظور کافی نیست چون خود مقداردهی اولیه هم می‌تواند دوباره اجرا شود.
let lastTrackedView = { path: null, at: 0 };
let cachedSessionRecordId = null;
let pendingSessionRecord = null;

// یک رکورد «حضور زنده» برای این session پیدا یا می‌سازد؛ اگر چند فراخوانی
// هم‌زمان اتفاق بیفتد (مثلاً به‌خاطر StrictMode)، همه در یک عملیات مشترک
// نتیجه را به اشتراک می‌گذارند تا رکورد تکراری ساخته نشود.
function ensureSessionRecordId(sessionId, path) {
  if (cachedSessionRecordId) return Promise.resolve(cachedSessionRecordId);
  if (pendingSessionRecord) return pendingSessionRecord;

  pendingSessionRecord = (async () => {
    try {
      const existing = await apiRequest(
        `/activeSessions?sessionId=${encodeURIComponent(sessionId)}`,
      );
      if (existing && existing.length > 0) {
        cachedSessionRecordId = existing[0].id;
        return cachedSessionRecordId;
      }
      const created = await apiRequest("/activeSessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, path, lastSeen: Date.now() }),
      });
      cachedSessionRecordId = created?.id ?? null;
      return cachedSessionRecordId;
    } finally {
      pendingSessionRecord = null;
    }
  })();

  return pendingSessionRecord;
}

// ثبت بازدید صفحه + نگه‌داشتن یک رکورد «حضور زنده» برای همین session با heartbeat دوره‌ای.
// خطاهای شبکه/سرور اینجا عمداً بی‌صدا نادیده گرفته می‌شوند تا آنالیتیکس هرگز
// تجربه‌ی بازدیدکننده‌ی واقعی سایت را مختل نکند.
export function useVisitorTracking() {
  const location = useLocation();

  useEffect(() => {
    const sessionId = getSessionId();
    const path = location.pathname;

    const isDuplicateView =
      lastTrackedView.path === path &&
      Date.now() - lastTrackedView.at < VIEW_DEDUP_WINDOW_MS;
    if (!isDuplicateView) {
      lastTrackedView = { path, at: Date.now() };
      apiRequest("/pageViews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, timestamp: Date.now() }),
      }).catch(() => {});
    }

    const sendHeartbeat = async () => {
      try {
        const recordId = await ensureSessionRecordId(sessionId, path);
        if (!recordId) return;
        await apiRequest(`/activeSessions/${recordId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path, lastSeen: Date.now() }),
        });
      } catch {
        // نادیده گرفته می‌شود؛ heartbeat بعدی دوباره تلاش می‌کند
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [location.pathname]);
}

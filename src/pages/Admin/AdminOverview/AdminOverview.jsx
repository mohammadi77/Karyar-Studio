import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiEye,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";
import { useAppData } from "../../../hooks/useAppData";
import { apiRequest } from "../../../utils/apiRequest";
import "./AdminOverview.css";

const ACTIVE_WINDOW_MS = 60 * 1000;
const POLL_INTERVAL_MS = 15000;
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function resolvePageName(path, pages) {
  const slug = path === "/" ? "" : path.replace(/^\//, "");
  const page = pages.find((p) => p.slug === slug);
  if (page) return page.name;
  return path === "/" ? "صفحه اصلی" : path;
}

function groupCounts(items, getKey) {
  const counts = new Map();
  items.forEach((item) => {
    const key = getKey(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function BarList({ items, emptyText, live }) {
  if (items.length === 0) {
    return <p className="overview-empty">{emptyText}</p>;
  }
  const max = items[0][1] || 1;
  return (
    <ul className="overview-bar-list">
      {items.map(([name, count]) => (
        <li key={name}>
          <div className="overview-bar-row">
            <span className="overview-bar-label">{name}</span>
            <span className="overview-bar-count">{count}</span>
          </div>
          <div className="overview-bar-track">
            <div
              className={`overview-bar-fill ${live ? "live" : ""}`}
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function AdminOverview() {
  const { data } = useAppData();
  const pages = useMemo(() => data.pages || [], [data.pages]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [pageViews, setPageViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [sessions, views] = await Promise.all([
          apiRequest("/activeSessions"),
          apiRequest("/pageViews"),
        ]);
        if (cancelled) return;
        setActiveSessions(sessions || []);
        setPageViews(views || []);
        setNow(Date.now());
      } catch {
        // نادیده گرفته می‌شود؛ poll بعدی دوباره تلاش می‌کند
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const activeNow = useMemo(
    () => activeSessions.filter((s) => now - s.lastSeen < ACTIVE_WINDOW_MS),
    [activeSessions, now],
  );

  const activeByPage = useMemo(
    () => groupCounts(activeNow, (s) => resolvePageName(s.path, pages)),
    [activeNow, pages],
  );

  const todayStart = startOfToday();
  const weekStart = now - 7 * DAY_MS;
  const monthStart = now - 30 * DAY_MS;

  const viewsToday = useMemo(
    () => pageViews.filter((v) => v.timestamp >= todayStart).length,
    [pageViews, todayStart],
  );
  const viewsWeek = useMemo(
    () => pageViews.filter((v) => v.timestamp >= weekStart).length,
    [pageViews, weekStart],
  );
  const viewsMonth = useMemo(
    () => pageViews.filter((v) => v.timestamp >= monthStart).length,
    [pageViews, monthStart],
  );

  const topPages = useMemo(() => {
    const recent = pageViews.filter((v) => v.timestamp >= monthStart);
    return groupCounts(recent, (v) => resolvePageName(v.path, pages)).slice(0, 6);
  }, [pageViews, pages, monthStart]);

  return (
    <div className="admin-overview">
      <div className="overview-header">
        <div>
          <h1>داشبورد</h1>
          <p>نمای کلی و زنده از وضعیت بازدید سایت</p>
        </div>
        <span className="overview-live-badge">
          <span className="overview-live-dot" />
          به‌روزرسانی زنده
        </span>
      </div>

      {loading ? (
        <p className="overview-empty">در حال بارگذاری آمار...</p>
      ) : (
        <>
          <div className="overview-stats-grid">
            <div className="overview-stat-card accent-live">
              <div className="overview-stat-icon">
                <FiActivity />
              </div>
              <div className="overview-stat-body">
                <span className="overview-stat-value">{activeNow.length}</span>
                <span className="overview-stat-label">کاربر آنلاین الان</span>
              </div>
            </div>
            <div className="overview-stat-card accent-orange">
              <div className="overview-stat-icon">
                <FiEye />
              </div>
              <div className="overview-stat-body">
                <span className="overview-stat-value">{viewsToday}</span>
                <span className="overview-stat-label">بازدید امروز</span>
              </div>
            </div>
            <div className="overview-stat-card accent-blue">
              <div className="overview-stat-icon">
                <FiCalendar />
              </div>
              <div className="overview-stat-body">
                <span className="overview-stat-value">{viewsWeek}</span>
                <span className="overview-stat-label">بازدید هفت روز اخیر</span>
              </div>
            </div>
            <div className="overview-stat-card accent-green">
              <div className="overview-stat-icon">
                <FiTrendingUp />
              </div>
              <div className="overview-stat-body">
                <span className="overview-stat-value">{viewsMonth}</span>
                <span className="overview-stat-label">بازدید سی روز اخیر</span>
              </div>
            </div>
          </div>

          <div className="overview-panels">
            <div className="overview-panel">
              <h2>
                <FiUsers /> کاربران آنلاین به تفکیک صفحه
              </h2>
              <BarList
                items={activeByPage}
                emptyText="در حال حاضر کسی روی سایت نیست"
                live
              />
            </div>

            <div className="overview-panel">
              <h2>
                <FiBarChart2 /> پربازدیدترین صفحات (سی روز اخیر)
              </h2>
              <BarList items={topPages} emptyText="هنوز بازدیدی ثبت نشده" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminOverview;

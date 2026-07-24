import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { customIcons } from "../../components/CustomIcons/CustomIcons";
import { useAuth } from "../../hooks/useAuth";
import { useAppData } from "../../hooks/useAppData";
import "./AdminLayout.css";

const LogoIcon = customIcons.Logo;

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { data } = useAppData();
  const admin = data.admin || {};

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <div className="admin-topbar-right">
          <button
            type="button"
            className={`admin-hamburger ${sidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="باز و بسته کردن منو"
            aria-expanded={sidebarOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link to="/" className="admin-logo-link" title="مشاهده سایت">
            {LogoIcon && <LogoIcon />}
            <span>کاریار استودیو</span>
          </Link>
        </div>

        <Link to="/admin/settings/profile" className="admin-topbar-user">
          <span className="admin-topbar-username">
            {admin.name || "پنل مدیریت"}
          </span>
          {admin.avatar ? (
            <img src={admin.avatar} alt="" className="admin-topbar-avatar" />
          ) : (
            <span className="admin-topbar-avatar admin-topbar-avatar-placeholder">
              {admin.name?.trim()?.[0] || "?"}
            </span>
          )}
        </Link>
      </header>

      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={closeSidebar} />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          {LogoIcon && <LogoIcon />}
          <span>پنل مدیریت</span>
        </div>

        <nav className="admin-sidebar-nav">
          <NavLink
            to="/admin"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            داشبورد
          </NavLink>
          <NavLink
            to="/admin/pages"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            مدیریت صفحات
          </NavLink>
          <NavLink
            to="/admin/team"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            افراد تیم
          </NavLink>
          <NavLink
            to="/admin/sections"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            مدیریت سکشن‌ها
          </NavLink>

          <span className="admin-sidebar-section-title">تنظیمات سایت</span>

          <NavLink
            to="/admin/settings/navbar"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            ناوبری و لوگو
          </NavLink>
          <NavLink
            to="/admin/settings/icons"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            کتابخانه آیکون
          </NavLink>
          <NavLink
            to="/admin/settings/profile"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            پروفایل ادمین
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link
            to="/"
            className="admin-sidebar-view-site"
            onClick={closeSidebar}
          >
            مشاهده سایت
          </Link>
          <button
            type="button"
            className="admin-sidebar-logout"
            onClick={logout}
          >
            خروج از حساب
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

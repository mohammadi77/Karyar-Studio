import { useEffect, useState, useMemo, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { getIconComponent } from "../../utils/iconResolver";
import { useSectionData } from "../../hooks/useSectionData";
import { useAppData } from "../../hooks/useAppData";
import "./Navbar.css";

// ===== داده‌های پیش‌فرض (فقط برندینگ؛ آیتم‌های منو از روی صفحات ساخته می‌شوند) =====
const defaultNavbar = {
  logoName: "Logo",
  title: "کاریار استودیو",
  colors: {
    title: "#2F4858",
    item: "#5C6A63",
    active: "#2F4858",
    hover: "#EDF2F3",
  },
};

// ===== کامپوننت اصلی =====
function Navbar() {
  const { data: navbarDataFromServer } = useSectionData("navbar", {});
  const { data } = useAppData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  // ===== ادغام داده‌ی دریافتی با داده‌های پیش‌فرض =====
  const navbarData = useMemo(
    () => ({
      ...defaultNavbar,
      ...navbarDataFromServer,
      colors: {
        ...defaultNavbar.colors,
        ...(navbarDataFromServer.colors || {}),
      },
      // آیتم‌های منو مستقیماً از صفحات فعال ساخته می‌شوند تا با ساخت/غیرفعال‌سازی صفحه هم‌گام باشند
      menuItems: (data.pages || [])
        .filter((page) => page.enabled !== false)
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((page) => ({
          id: page.id,
          label: page.name,
          path: page.slug ? `/${page.slug}` : "/",
        })),
    }),
    [navbarDataFromServer, data.pages],
  );

  // ===== بستن منو و به‌روزرسانی حالت موبایل/دسکتاپ با تغییر سایز صفحه =====
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobileView(mobile);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===== محاسبه کامپوننت لوگو با useMemo (جلوگیری از محاسبه مجدد) =====
  const LogoIconComponent = useMemo(() => {
    const { logoName } = navbarData;
    return logoName && getIconComponent(logoName)
      ? getIconComponent(logoName)
      : null;
  }, [navbarData.logoName]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // ===== تابع رندر آیتم‌های منو (استفاده از useCallback برای بهینه‌سازی) =====
  const renderMenuItems = useCallback(
    () =>
      navbarData.menuItems.map((item) => (
        <li key={item.id}>
          <NavLink
            to={item.path}
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "navbar-item active" : "navbar-item"
            }
          >
            {item.label}
          </NavLink>
        </li>
      )),
    [navbarData.menuItems, closeMenu],
  );

  const { title, colors } = navbarData;

  // ===== استایل‌های داینامیک =====
  const styleVariables = {
    "--title-color": colors.title || "#2F4858",
    "--item-color": colors.item || "#5C6A63",
    "--active-color": colors.active || "#2F4858",
    "--hover-color": colors.hover || "#EDF2F3",
  };

  // ===== آستانه همبرگری: در موبایل بیشتر از ۴ آیتم، در دسکتاپ بیشتر از ۷ آیتم =====
  const hamburgerThreshold = isMobileView ? 4 : 7;
  const isForcedHamburger = navbarData.menuItems.length > hamburgerThreshold;

  return (
    <nav
      className={`navbar ${isForcedHamburger ? "navbar-force-hamburger" : ""}`}
      style={styleVariables}
    >
      <div className="navbar-brand">
        {LogoIconComponent && (
          <LogoIconComponent className="navbar-logo" width={40} height={40} />
        )}
        <h2 className="navbar-title">{title}</h2>
      </div>

      {/* دکمه همبرگری - فقط در حالت overflow نمایش داده می‌شود */}
      <button
        type="button"
        className={`navbar-toggle ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label="باز و بسته کردن منو"
        aria-expanded={isMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
        {renderMenuItems()}
      </ul>

      {/* پس‌زمینه تیره پشت منوی موبایل هنگام باز بودن */}
      {isMenuOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}

export default Navbar;

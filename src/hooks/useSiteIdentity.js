import { useEffect } from "react";
import { useAppData } from "./useAppData";

/**
 * هر بار که داده‌ی siteSettings تغییر کند، عنوان تب مرورگر
 * (document.title) و آیکون فاویکون (link[rel="icon"]) را به‌روز می‌کند.
 */
export function useSiteIdentity() {
  const { data } = useAppData();
  const settings = data.siteSettings;

  useEffect(() => {
    if (!settings) return;

    // ── به‌روزرسانی عنوان تب مرورگر ──
    if (settings.title) {
      document.title = settings.title;
    }

    // ── به‌روزرسانی فاویکون ──
    if (settings.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      const isSvg = /\.svg(\?|#|$)/i.test(settings.favicon);
      link.type = isSvg ? "image/svg+xml" : "image/png";
      link.href = settings.favicon;
    }
  }, [settings]);
}

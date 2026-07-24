import { createElement, useEffect, useState } from "react";
import { customIcons } from "../components/CustomIcons/CustomIcons";
import { libraryIcons } from "../config/libraryIcons";

const IMAGE_LIKE_PATTERN = /^(https?:\/\/|\/|data:)/;
const SVG_URL_PATTERN = /\.svg(\?|#|$)/i;

export function isImageIconValue(name) {
  return typeof name === "string" && IMAGE_LIKE_PATTERN.test(name);
}

// آیکون‌های آپلودی برخلاف آیکون‌های خود پروژه، رنگ ثابت خودشون رو از فایل دارن.
// برای اینکه فیلدهای رنگ (iconColor و ...) روشون هم اثر بذاره، قبل از تزریق inline
// هم پاک‌سازی امنیتی می‌شن (اسکریپت/event handler حذف می‌شه) و هم fill/stroke ثابتشون
// به currentColor تبدیل می‌شه تا از رنگ CSS اطراف پیروی کنن.
function sanitizeAndColorizeSvg(raw) {
  let svg = raw;
  svg = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
  svg = svg.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "");
  svg = svg.replace(/\son\w+\s*=\s*"(?:[^"\\]|\\.)*"/gi, "");
  svg = svg.replace(/\son\w+\s*=\s*'(?:[^'\\]|\\.)*'/gi, "");
  svg = svg.replace(/((?:xlink:)?href\s*=\s*")javascript:[^"]*(")/gi, "$1#$2");
  svg = svg.replace(/((?:xlink:)?href\s*=\s*')javascript:[^']*(')/gi, "$1#$2");
  svg = svg.replace(/\b(fill|stroke)\s*=\s*"(?!none\b)[^"]*"/gi, '$1="currentColor"');
  svg = svg.replace(/\b(fill|stroke)\s*=\s*'(?!none\b)[^']*'/gi, "$1='currentColor'");
  return svg;
}

function InlineSvgIcon({ url, className, style, ...rest }) {
  const [markup, setMarkup] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setMarkup(null);
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) setMarkup(sanitizeAndColorizeSvg(text));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url]);

  return createElement("span", {
    className: className ? `icon-inline-svg ${className}` : "icon-inline-svg",
    style,
    ...(markup ? { dangerouslySetInnerHTML: { __html: markup } } : {}),
    ...rest,
  });
}

export function getIconComponent(name) {
  if (!name) return null;
  if (customIcons[name]) return customIcons[name];
  if (libraryIcons[name]) return libraryIcons[name];
  // آیکون سفارشی آپلودشده: مقدار به‌جای نام، مسیر/URL تصویر است
  if (isImageIconValue(name)) {
    if (SVG_URL_PATTERN.test(name)) {
      return function IconFromSvgUrl(props) {
        return createElement(InlineSvgIcon, { url: name, ...props });
      };
    }
    return function CustomImageIcon({ className, ...rest }) {
      // بدون سایز پیش‌فرض، تصویر آپلودی با ابعاد واقعی خودش رندر می‌شد و می‌توانست
      // چیدمان صفحه را به‌هم بریزد. کلاس icon-fallback-img (با specificity صفر از
      // طریق :where در global.css) فقط وقتی اعمال می‌شود که سایز دیگری صراحتاً
      // ست نشده باشد، پس هیچ استایل یا کلاس موجودی را override نمی‌کند.
      return createElement("img", {
        src: name,
        alt: "",
        className: className ? `icon-fallback-img ${className}` : "icon-fallback-img",
        ...rest,
      });
    };
  }
  return null;
}

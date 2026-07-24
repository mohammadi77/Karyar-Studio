// کلیدهایی که مقدارشان "نام یک آیکون" است (نه رنگ، نه مسیر تصویر)
export const ICON_NAME_KEYS = new Set([
  "iconName",
  "icon",
  "iconUp",
  "iconDown",
  "ArrowLeft",
  "ArrowRight",
  "prevIconId",
  "nextIconId",
  "firstIconName",
  "secondIconName",
  "iconPhone",
  "iconEmail",
  "iconAddres",
  "logoName",
  "quoteIcon",
]);

// کلیدهایی که مقدارشان رنگ است ولی چون شامل رشته "color" نیستند
// با تشخیص خودکار (heuristic) قابل شناسایی نبودند
export const EXTRA_COLOR_KEYS = new Set([
  "iconBg",
  "iconBoxBg",
  "iconPhonebg",
  "iconEmailbg",
  "iconAddresbg",
  "background",
  "cardBackground",
  "imagesBg",
  "activeIcon",
  "inactiveIcon",
  "activeBg",
  "inactiveBg",
  "activeBorder",
  "inactiveBorder",
  "activeDot",
  "dot",
]);

// کلیدهایی که مقدارشان مسیر/آدرس تصویر است ولی شامل کلمات معمول
// (image, logo, img) نیستند
export const EXTRA_IMAGE_KEYS = new Set(["src"]);

export function isIconNameField(key) {
  return ICON_NAME_KEYS.has(key);
}

export function isColorField(key) {
  const lowerKey = key.toLowerCase();
  return lowerKey.includes("color") || EXTRA_COLOR_KEYS.has(key);
}

export function isImageField(key) {
  const lowerKey = key.toLowerCase();
  return (
    lowerKey.includes("image") ||
    lowerKey.includes("logo") ||
    lowerKey === "img" ||
    EXTRA_IMAGE_KEYS.has(key)
  );
}

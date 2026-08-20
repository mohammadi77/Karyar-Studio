// در محیط تولید (production) همه‌چیز روی همان منشأ (origin) سرو می‌شود،
// پس API روی "/api" و آپلود روی همان ریشه‌ی "/upload" در دسترس است.
// در محیط توسعه، VITE_API_URL و VITE_UPLOAD_URL می‌توانند روی localhost تنظیم شوند.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
export const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_URL || "";

export const RESOURCE_KEYS = ["pages", "navbar", "notFound", "admin", "teamMembers", "iconLibrary", "teamSettings", "siteSettings"];

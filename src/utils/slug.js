export const RESERVED_SLUGS = new Set(["admin"]);

export function slugify(value) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
}

export function validateSlug(slug, pages, { ignoreId } = {}) {
  if (!slug) {
    return "اسلاگ معتبر وارد کنید (فقط حروف انگلیسی/عدد/خط تیره)";
  }
  if (RESERVED_SLUGS.has(slug.toLowerCase())) {
    return "این اسلاگ رزرو شده است، اسلاگ دیگری انتخاب کنید";
  }
  if (pages.some((p) => p.slug === slug && p.id !== ignoreId)) {
    return "صفحه‌ای با این اسلاگ از قبل وجود دارد";
  }
  return null;
}

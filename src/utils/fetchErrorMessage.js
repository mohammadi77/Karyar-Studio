export function getFetchErrorMessage(status) {
  if (status === 404) return "اطلاعات مورد نظر یافت نشد (404)";
  if (status === 301 || status === 302) return "آدرس منبع منتقل شده است (301)";
  if (status === 401 || status === 403) return "دسترسی به اطلاعات مجاز نیست (401/403)";
  if (status >= 500) return `خطای سرور (${status})`;
  if (status) return `خطا در دریافت اطلاعات (${status})`;
  return "ارتباط با سرور برقرار نشد";
}

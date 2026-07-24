import { sectionRegistry } from "../../config/sectionRegistry";
import { useAppData } from "../../hooks/useAppData";

// آیتم‌هایی که از داخل جدول ویرایش هر سکشن غیرفعال شده‌اند (enabled: false)
// نباید توی سایت واقعی نمایش داده بشوند؛ چون این فیلتر یک‌جا این‌جا انجام می‌شود،
// خود کامپوننت‌های سکشن نیازی به دونستن مفهوم enabled ندارند
function stripDisabledItems(value) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => !(item !== null && typeof item === "object" && item.enabled === false))
      .map(stripDisabledItems);
  }
  if (value !== null && typeof value === "object") {
    const result = {};
    Object.keys(value).forEach((key) => {
      result[key] = stripDisabledItems(value[key]);
    });
    return result;
  }
  return value;
}

// اگر سکشن در حالت «مشابه صفحه دیگر» باشد، دیتای همان سکشن مرجع را برمی‌گرداند
// (فقط یک سطح دنبال می‌شود تا از حلقه‌ی رفرنس به رفرنس جلوگیری شود)
// فیلدهای موجود در overrides روی دیتای مرجع اعمال می‌شوند تا بشود بخشی از
// محتوا (مثلاً تایتل) را برای همین صفحه جدا از صفحه‌ی مرجع تنظیم کرد
function resolveSectionData(section, pages) {
  if (section.mode === "reference") {
    if (!section.refPageId || !section.refSectionId) return null;
    const refPage = pages.find((p) => p.id === section.refPageId);
    const refSection = refPage?.sections?.find(
      (s) => s.id === section.refSectionId,
    );
    if (refSection && refSection.type === section.type && refSection.mode !== "reference") {
      return { ...refSection.data, ...section.overrides };
    }
    return null;
  }
  return section.data;
}

function PageRender({ sections }) {
  const { data } = useAppData();
  const pages = data.pages || [];

  if (!sections || sections.length === 0) return null;

  return sections.map((section) => {
    if (section.enabled === false) return null;
    const entry = sectionRegistry[section.type];
    if (!entry) return null;
    const { Component } = entry;
    const resolvedData = resolveSectionData(section, pages);
    if (!resolvedData) return null;
    return <Component key={section.id} data={stripDisabledItems(resolvedData)} />;
  });
}

export default PageRender;

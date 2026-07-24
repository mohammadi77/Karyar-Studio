import Card1 from "../../Cards/Card1/Card1";
import Button1 from "../../Button/Button1/Button1";
import "./SectionServices.css";

// ===== داده‌های پیش‌فرض (در صورت عدم دریافت از سرور) =====
const defaultSection = {
  title: "کاریار استودیو",
  titleColor: "#2F4858",
  cardTitleColor: "#2F4858",
  cardDescriptionColor: "#5C6A63",
  cardShadowColor: "#01B87A29",
  cardBgColor: "#FFFFFF",
  services: [],
};

// ===== کامپوننت اصلی =====
const SectionServices = ({ data: fetchedData = {} }) => {
  const section = {
    ...defaultSection,
    ...fetchedData,
    button: {
      ...defaultSection.button,
      ...(fetchedData.button || {}),
    },
    services: fetchedData.services || [],
  };

  // ===== داده‌های نهایی =====
  // رنگ عنوان، توضیحات و پس‌زمینه‌ی کارت‌ها یکجا در سطح سکشن تعریف می‌شوند
  // تا برای همه‌ی کارت‌ها یکسان باشند؛ رنگ سایه و آیکون برای هر کارت جداست
  // (cardShadowColor فقط به‌عنوان مقدار پیش‌فرض برای آیتم‌هایی که shadowColor ندارند استفاده می‌شود)
  const {
    title,
    titleColor,
    cardTitleColor,
    cardDescriptionColor,
    cardShadowColor,
    cardBgColor,
    services,
  } = section;

  return (
    <section className="SectionServices">
      <div className="ServicesHeader">
        <h2 style={{ color: titleColor || "#2F4858" }}>
          {title || "عنوان پیش‌فرض"}
        </h2>
      </div>

      <div className="ServicesCards">
        {services && services.length > 0 ? (
          services.map((item) => (
            <Card1
              key={item.id}
              iconName={item.icon}
              title={item.title}
              description={item.description}
              iconBgColor={item.iconBgColor}
              iconColor={item.iconColor}
              titleColor={cardTitleColor}
              descriptionColor={cardDescriptionColor}
              shadowColor={item.shadowColor || cardShadowColor}
              cardBgColor={cardBgColor}
            />
          ))
        ) : (
          <p>هیچ سرویسی یافت نشد.</p>
        )}
      </div>

      <div className="ServicesButton">
        <Button1 {...section.button} />
      </div>
    </section>
  );
};

export default SectionServices;

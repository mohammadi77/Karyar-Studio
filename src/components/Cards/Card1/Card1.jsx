import React, { useMemo } from "react";
import { getIconComponent } from "../../../utils/iconResolver";
import "./Card1.css";

const Card1 = ({
  iconName,
  iconColor = "#1EA965",
  title = "عنوان سرویس",
  description = "توضیحات سرویس در این قسمت نمایش داده می‌شود.",
  shadowColor = "#FB7A0129",
  iconBgColor = "#E2F2EA",
  titleColor = "#2F4858",
  descriptionColor = "#5C6A63",
  cardBgColor = "#FFFFFF",
  defaultIcon = "pen_line",
}) => {
  // ===== محاسبه نام نهایی آیکون با useMemo =====
  const finalIconName = useMemo(() => {
    return iconName && getIconComponent(iconName) ? iconName : defaultIcon;
  }, [iconName, defaultIcon]);

  // ===== دریافت کامپوننت آیکون با useMemo =====
  const IconComponent = useMemo(() => {
    const component = getIconComponent(finalIconName);
    if (!component) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`آیکون "${finalIconName}" در customIcons پیدا نشد.`);
      }
      return null;
    }
    return component;
  }, [finalIconName]);

  // ===== اگر آیکون وجود نداشت، null برگردان =====
  if (!IconComponent) {
    return null;
  }

  // ===== استایل‌های داینامیک (فقط مقادیر متغیر) =====
  const cardStyle = {
    boxShadow: `0 0 12px 0 ${shadowColor}`,
    backgroundColor: cardBgColor,
  };

  const iconWrapperStyle = {
    backgroundColor: iconBgColor,
  };

  const iconStyle = {
    color: iconColor,
  };

  const titleStyle = {
    color: titleColor,
  };

  const descriptionStyle = {
    color: descriptionColor,
  };

  return (
    <div className="service-card" style={cardStyle}>
      <div className="service-card__icon-wrapper" style={iconWrapperStyle}>
        <IconComponent className="service-card__icon" style={iconStyle} />
      </div>

      <div className="service-card__content">
        <h3 className="service-card__title" style={titleStyle}>
          {title}
        </h3>
        <p className="service-card__description" style={descriptionStyle}>
          {description}
        </p>
      </div>
    </div>
  );
};

// ===== استفاده از React.memo برای جلوگیری از رندر مجدد غیرضروری =====
export default React.memo(Card1);

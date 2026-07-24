// card6.jsx
import React from "react";
import { getIconComponent } from "../../../utils/iconResolver";
import "./Card6.css";

// ===== تابع دریافت آیکون =====
const getIcon = (iconName, defaultIcon) => {
  const finalIconName =
    iconName && getIconComponent(iconName) ? iconName : defaultIcon;
  const IconComponent = getIconComponent(finalIconName);
  if (!IconComponent) {
    console.warn(`آیکون "${finalIconName}" در customIcons پیدا نشد.`);
    return null;
  }
  return IconComponent;
};

const card6 = ({ data, shadow, cardBgColor, colorSet }) => {
  const d = data;

  const BadgeIcon = getIcon(d.badge?.iconName, "pen");
  const FirstIcon = getIcon(colorSet?.firstIconName, "pen");
  const SecondIcon = getIcon(colorSet?.secondIconName, "pen");

  const images = [d.images?.image1, d.images?.image2, d.images?.image3].filter(
    Boolean,
  );

  const showTestimonial = d.testimonial?.enabled !== false;

  return (
    <section
      dir="rtl"
      className="sse-root"
      style={{
        ...(shadow ? { boxShadow: shadow } : null),
        ...(cardBgColor ? { background: cardBgColor } : null),
      }}
    >
      {/* ردیف ۱ */}
      <div className="sse-header">
        <div className="sse-header-left">
          <div
            className="sse-badge"
            style={{ background: d.badge?.iconBg || "#FFF1E9" }}
          >
            {BadgeIcon && (
              <BadgeIcon
                className="sse-badge-icon"
                style={{ color: d.badge?.iconColor || "#FF7A45" }}
              />
            )}
          </div>

          <h3
            className="sse-title"
            style={{ color: d.title?.color || "#2F4858" }}
          >
            {d.title?.text || "عنوان"}
          </h3>
        </div>

        {d.logo && (
          <div className="sse-logo-wrapper">
            <img src={d.logo} alt="" className="sse-logo-img" />
          </div>
        )}
      </div>

      {/* ردیف ۲ */}
      <p
        className="sse-description"
        style={{ color: d.description?.color || "#5C6A63" }}
      >
        {d.description?.text || "توضیحات"}
      </p>

      {/* ردیف ۳ */}
      {images.length > 0 && (
        <div
          className="sse-images-row"
          style={d.imagesBg ? { background: d.imagesBg } : undefined}
        >
          {images.map((src, i) => (
            <div key={i} className="sse-image-item">
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      )}

      {/* ردیف ۴ */}
      {showTestimonial && (
        <div
          className="sse-testimonial"
          style={{ background: d.testimonial?.cardBackground || "#1EA96505" }}
        >
          {d.testimonial?.authorName && (
            <span
              className="sse-testimonial-author"
              style={{ color: colorSet?.authorColor || "#2F4858" }}
            >
              {d.testimonial.authorName}
            </span>
          )}

          {d.testimonial?.roleText && (
            <span
              className="sse-testimonial-role"
              style={{ color: colorSet?.roleColor || "#5C6A63" }}
            >
              {d.testimonial?.authorName ? "، " : ""}
              {d.testimonial.roleText}
            </span>
          )}

          {FirstIcon && (
            <FirstIcon
              className="sse-testimonial-icon"
              style={{ color: colorSet?.firstIconColor || "#2ECC71" }}
            />
          )}

          {d.testimonial?.description && (
            <span
              className="sse-testimonial-bottom-text"
              style={{ color: colorSet?.descriptionColor || "#5C6A63" }}
            >
              {d.testimonial.description}
            </span>
          )}

          {SecondIcon && (
            <SecondIcon
              className="sse-testimonial-icon"
              style={{ color: colorSet?.secondIconColor || "#2ECC71" }}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default card6;

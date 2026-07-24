import React from "react";
import "./Card7.css";
import { getIconComponent } from "../../../utils/iconResolver";

const DEFAULT_ICON_NAME = "default";

const Card7 = ({
  number = "",
  title = "بدون عنوان",
  text = "توضیحی وجود ندارد",
  iconName = DEFAULT_ICON_NAME,
  iconBoxBg = "#f5f5f5",
  iconBg = "#e0e0e0",
  iconColor = "#333",
  numberGradient = undefined,
  titleColor = "#2F4858",
  textColor = "#5C6A63",
}) => {
  // انتخاب آیکون
  const finalIconName =
    iconName && getIconComponent(iconName) ? iconName : DEFAULT_ICON_NAME;
  const IconComponent = getIconComponent(finalIconName);

  return (
    <div className="card7">
      {/* عدد بزرگ پشت زمینه */}
      <span
        className="card7-number-bg"
        style={numberGradient ? { backgroundImage: numberGradient } : undefined}
        aria-hidden="true"
      >
        {number}
      </span>

      {/* باکس آیکون */}
      <div className="card7-icon-box" style={{ background: iconBg }}>
        <div className="card7-icon" style={{ color: iconColor || "#fff" }}>
          {IconComponent ? (
            <IconComponent />
          ) : (
            <div className="fallback-icon" />
          )}
        </div>
      </div>

      {/* محتوا */}
      <div className="card7-content">
        <h3 className="card7-title" style={{ color: titleColor }}>
          {title}
        </h3>
        <p className="card7-text" style={{ color: textColor }}>
          {text}
        </p>
      </div>
    </div>
  );
};

export default Card7;

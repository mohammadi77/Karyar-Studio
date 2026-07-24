import React from "react";
import "./Card11.css"; // import فایل CSS جداگانه

const Card11 = ({
  bgColor = "transparent",
  iconBgColor = "#f0f4ff",
  iconColor = "#3b82f6",
  numberColor = "#1e293b",
  numberGradient, // گرادیانت اختیاری؛ در صورت وجود به‌جای numberColor روی متن عدد اعمال می‌شود
  titleColor = "#0f172a",
  textColor = "#475569",
  icon, // المان JSX یا SVG
  number,
  title,
  text,
}) => {
  const hasNumberGradient =
    typeof numberGradient === "string" && numberGradient.trim() !== "";

  const numberStyle = hasNumberGradient
    ? {
        backgroundImage: numberGradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }
    : { color: numberColor };

  return (
    <div
      className="Card11"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className="Card11-top-row">
        <div
          className="Card11-icon-container"
          style={{ backgroundColor: iconBgColor }}
        >
          <div className="Card11-icon" style={{ color: iconColor }}>
            {icon}
          </div>
        </div>
        <div className="Card11-number" style={numberStyle}>
          {number}
        </div>
      </div>
      <div className="Card11-title" style={{ color: titleColor }}>
        {title}
      </div>
      <div className="Card11-text" style={{ color: textColor }}>
        {text}
      </div>
    </div>
  );
};

export default Card11;

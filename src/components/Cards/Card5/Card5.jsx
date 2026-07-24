import React from "react";
import "./Card5.css";
import { getIconComponent } from "../../../utils/iconResolver";

import Quote from "../../../assets/icons/kama.svg"; // یا quote.png

const Card5 = ({ data }) => {
  // استخراج مقادیر از شیء data
  const {
    image,
    name,
    job,
    text,
    cardBgColor = "",
    textColor = "",
    jobColor = "",
    nameColor = "",
    quoteIcon = "",
    quoteIconColor = "",
  } = data;

  const QuoteIcon = quoteIcon ? getIconComponent(quoteIcon) : null;
  const quoteStyle = quoteIconColor
    ? { "--quote-icon-color": quoteIconColor }
    : undefined;

  return (
    <div className="card5" style={{ backgroundColor: cardBgColor }}>
      {/* Header */}
      <div className="card5-header">
        <div className="card5-right">
          <img src={image} alt={name} className="card5-image" />
          <h3 className="card5-name" style={{ color: nameColor }}>
            {name}
          </h3>
        </div>

        <span className="card5-job" style={{ color: jobColor }}>
          {job}
        </span>
      </div>

      {/* Content */}
      <div className="card5-content">
        {QuoteIcon ? (
          <QuoteIcon className="quote" style={quoteStyle} />
        ) : (
          <img src={Quote} alt="quote" className="quote" style={quoteStyle} />
        )}

        <p style={{ color: textColor }}>{text}</p>
      </div>
    </div>
  );
};

export default Card5;

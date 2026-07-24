import React from "react";
import "./Card3.css";

const Card3 = ({ logo, title, value, description, width = "247.37px" }) => {
  return (
    <div className="stats-card" style={{ "--card-width": width }}>
      <div className="stats-card__top">
        <div className="stats-card__info">
          <div className="stats-card__logo-wrapper">
            <img className="stats-card__logo" src={logo} alt={title} />
          </div>

          <span className="stats-card__title">{title}</span>
        </div>

        <div className="stats-card__value">{value}</div>
      </div>

      <div className="stats-card__description">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Card3;

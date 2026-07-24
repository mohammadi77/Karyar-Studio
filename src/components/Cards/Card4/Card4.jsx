import React from "react";
import "./Card4.css";

const Card4 = ({
  image,
  name,
  role,
  bgColor = "#F8D8D8",
  roleColor,
  nameColor,
}) => {
  return (
    <div className="card4">
      <div className="card4-imageBox">
        <div
          className="card4-imageBox-background"
          style={{ backgroundColor: bgColor }}
        ></div>

        <img src={image} alt={name} />
      </div>

      <div className="card4-textBox">
        <h2 style={{ color: nameColor }}>{name}</h2>
        <p style={{ color: roleColor }}>{role}</p>
      </div>
    </div>
  );
};

export default Card4;

// Card9.jsx
import "./Card9.css";

function Card9({
  title = "عنوان کارت",
  titleColor = "#000000",
  description = "متن توضیحات",
  descriptionColor = "#333333",
  backColor = "#ffffff",
  shadowColor = "rgba(0,0,0,0.1)",
  borderColor = "transparent",
}) {
  const cardStyle = {
    backgroundColor: backColor,
    boxShadow: `0 4px 12px ${shadowColor}`,
    border: `1px solid ${borderColor}`,
  };

  return (
    <div className="cart9" style={cardStyle}>
      <h2 style={{ color: titleColor }}>{title}</h2>
      <p style={{ color: descriptionColor }}>{description}</p>
    </div>
  );
}

export default Card9;

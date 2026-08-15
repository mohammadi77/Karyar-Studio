import defaultProfile from "../../../assets/images/profile.png";
import { useAppData } from "../../../hooks/useAppData";
import "./Card10.css";

const Card10 = ({
  image,
  name = "نام نامشخص",
  role = "سمت نامشخص",
  bgColor,
  nameColor,
  roleColor,
}) => {
  const { data } = useAppData();
  const fallbackImage = data.teamSettings?.defaultImage || defaultProfile;

  return (
    <div className="Card10">
      <div className="imageBox">
        <div
          className="imageBox-background"
          style={{ backgroundColor: bgColor }}
        />

        <img
          className="imageBox-photo"
          src={image || fallbackImage}
          alt={name}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />

        <div className="imageBox-overlay" />

        <div className="textBox">
          <h2 style={{ color: nameColor }}>{name}</h2>
          <p style={{ color: roleColor }}>{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Card10;

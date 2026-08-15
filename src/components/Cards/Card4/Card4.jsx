import defaultProfile from "../../../assets/images/profile.png";
import { useAppData } from "../../../hooks/useAppData";
import "./Card4.css";

const Card4 = ({
  image,
  name,
  role,
  bgColor = "#F8D8D8",
  roleColor,
  nameColor,
}) => {
  const { data } = useAppData();
  const fallbackImage = data.teamSettings?.defaultImage || defaultProfile;

  return (
    <div className="card4">
      <div className="card4-imageBox">
        <div
          className="card4-imageBox-background"
          style={{ backgroundColor: bgColor }}
        ></div>

        <img
          src={image || fallbackImage}
          alt={name}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
      </div>

      <div className="card4-textBox">
        <h2 style={{ color: nameColor }}>{name}</h2>
        <p style={{ color: roleColor }}>{role}</p>
      </div>
    </div>
  );
};

export default Card4;

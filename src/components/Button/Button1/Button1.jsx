import "./Button1.css";
import { getIconComponent } from "../../../utils/iconResolver";
import { Link } from "react-router-dom"; // یا useNavigate
const Button1 = ({
  iconName, // ← نام آیکون از دیتابیس (رشته)
  text = "شروع همکاری",
  bgColor = "#2DB36C",
  textColor = "#FFFFFF",
  iconColor = "#FFFFFF",
  link,
  defaultIcon = "Dot", // ← آیکون پیش‌فرض
}) => {
  // انتخاب آیکون: اگر iconName وجود داشت و در customIcons موجود بود، از آن استفاده کن
  const finalIconName =
    iconName && getIconComponent(iconName) ? iconName : defaultIcon;
  const IconComponent = getIconComponent(finalIconName);

  // اگر حتی defaultIcon هم در customIcons نبود، فقط متن را نمایش بده
  if (!IconComponent) {
    console.warn(`آیکون "${finalIconName}" در customIcons پیدا نشد.`);
    return (
      <button
        className="custom-btn"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <span>{text}</span>
      </button>
    );
  }

  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <button
        className="custom-btn"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <span>{text}</span>
        <IconComponent
          className="custom-btn__icon"
          style={{
            color: iconColor,
            width: "24px",
            height: "24px",
          }}
        />
      </button>
    </Link>
  );
};

export default Button1;

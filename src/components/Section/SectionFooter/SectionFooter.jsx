import { getIconComponent } from "../../../utils/iconResolver";
import "./SectionFooter.css";

function SectionFooter({ data }) {
  const { info = {}, socialLinks = [] } = data || {};

  const getIcon = (iconName, fallbackText = "•") => {
    const IconComponent = getIconComponent(iconName);
    if (IconComponent) {
      return <IconComponent />;
    }
    return <span>{fallbackText}</span>;
  };

  return (
    <footer className="footer">
      <div className="topSection">
        <div className="logoContainer">
          <span className="logoBox">{getIcon(info.iconName, "K")}</span>
          <a
            href={info.link || "/"}
            className="logoText"
            style={{ color: info.titleColor || "#12213a" }}
          >
            {info.title || "کاریار استودیو"}
          </a>
        </div>

        <div className="socialLinks">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="socialLink"
              style={{ color: s.iconColor || "#555" }}
            >
              {getIcon(s.iconName, s.label.charAt(0))}
            </a>
          ))}
        </div>
      </div>

      <div
        className="divider"
        style={{
          borderTop: `solid ${info.lineColor || "#d8d8d8"}`,
          borderWidth: "2px",
        }}
      />

      <div className="bottomSection">
        {info.text && (
          <p className="infoText" style={{ color: info.textColor || "#5C6A63" }}>
            {info.text}
          </p>
        )}
      </div>
    </footer>
  );
}

export default SectionFooter;

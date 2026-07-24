import "./SectionServicesConstruction.css";
import Card11 from "../../Cards/Card11/Card11";
import { getIconComponent } from "../../../utils/iconResolver";

const SectionServicesConstruction = ({ data: sectionData }) => {
  const data = Array.isArray(sectionData)
    ? sectionData
    : sectionData
      ? [sectionData]
      : [];

  if (data.length === 0) return null;

  // از اولین آیتم استفاده می‌کنیم
  const item = data[0];
  const cards = item.cards || [];

  return (
    <section className="section-servis-construction" dir="rtl">
      <div className="construction">
        <h2
          className="construction-title"
          style={{ color: item.titleColor || "#2F4858" }}
        >
          {item.title || "عنوان"}
        </h2>
        <p
          className="construction-subtitle"
          style={{ color: item.subtitleColor || "#2F4858" }}
        >
          {item.subtitle || "توضیح"}
        </p>

        <div className="construction-cards">
          {cards.map((card, index) => {
            const IconComponent = getIconComponent(card.iconName);
            return (
              <Card11
                key={index}
                bgColor={item.cardBgColor}
                icon={IconComponent ? <IconComponent /> : null}
                iconColor={card.iconColor}
                iconBgColor={card.iconBg}
                number={card.number}
                numberColor={card.numberColor}
                numberGradient={card.numberGradient}
                title={card.title}
                titleColor={item.cardTitleColor}
                text={card.text}
                textColor={item.cardTextColor}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SectionServicesConstruction;

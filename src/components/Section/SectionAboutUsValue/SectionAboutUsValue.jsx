import "./SectionAboutUsValue.css";
import Card9 from "../../Cards/Card9/Card9";

const SectionAboutUsValue = ({ data: sectionData }) => {
  const data = sectionData ? [sectionData] : [];

  if (data.length === 0) return null;

  const item = data[0]; // شیء اصلی
  const cards = item.cards || [];

  return (
    <section className="section-about-us-value" dir="rtl">
      <div className="div-value">
        <div className="title">
          <h2 style={{ color: item.titleColor || "#2F4858" }}>
            {item.title || "عنوان بخش"}
          </h2>
        </div>

        <div className="value-waper">
          <div
            className="value-icon"
            style={{ backgroundColor: item.iconColor || "#E2F2EA" }}
          />
          {cards.length === 0 ? (
            <p>هیچ کارتی وجود ندارد</p>
          ) : (
            cards.map((card, index) => (
              <Card9
                key={index}
                title={card.title}
                titleColor={item.cardTitleColor}
                description={card.description}
                descriptionColor={item.cardDescriptionColor}
                backColor={item.cardBgColor}
                shadowColor={item.cardShadowColor}
                borderColor={item.cardBorderColor}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionAboutUsValue;

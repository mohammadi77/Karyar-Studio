// SectionServicesExperience.jsx
import Card6 from "../../Cards/Card6/Card6";
import "./SectionServicesExperience.css";

// یکی‌درمیون بین دو ست رنگ تعریف‌شده در سطح سکشن سوییچ می‌کند
// (همان الگوی firstCardColor/secondCardColor موجود در SectionPeople)
function resolveColorSet(sets, index) {
  if (!Array.isArray(sets) || sets.length === 0) return undefined;
  if (sets.length === 1) return sets[0];
  return sets[index % 2] || sets[0];
}

function SectionServicesExperience({ data }) {
  const isLegacyArray = Array.isArray(data);
  const title = isLegacyArray ? "" : data?.title || "";
  const titleColor = isLegacyArray ? "" : data?.titleColor || "";
  const shadow = isLegacyArray ? "" : data?.shadow || "";
  const cardBgColor = isLegacyArray ? "" : data?.cardBgColor || "";
  const cardData = isLegacyArray ? data : data?.cards;
  const cards = Array.isArray(cardData) ? cardData : cardData ? [cardData] : [];

  if (cards.length === 0) return null;

  return (
    <div dir="rtl">
      {title && (
        <h2
          className="sse-section-title"
          style={{ color: titleColor || undefined }}
        >
          {title}
        </h2>
      )}
      <div
        className="cards-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          padding: "2rem",
        }}
      >
        {cards.map((card, index) => (
          <Card6
            key={index}
            data={card}
            shadow={shadow}
            cardBgColor={cardBgColor}
            colorSet={resolveColorSet(data?.testimonialColorSets, index)}
          />
        ))}
      </div>
    </div>
  );
}

export default SectionServicesExperience;

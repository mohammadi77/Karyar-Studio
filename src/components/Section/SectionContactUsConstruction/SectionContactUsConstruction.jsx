import "./SectionContactUsConstruction.css";
import Card7 from "../../Cards/Card7/Card7";

const SectionContactUsConstruction = ({ data: sectionData }) => {
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
    <section className="section-contact-us-construction" dir="rtl">
      <div className="construction">
        <h2
          className="construction-title"
          style={{ color: item.titleColor || "#2F4858" }}
        >
          {item.title || "عنوان"}
        </h2>

        <div className="construction-cards">
          {cards.map((card, index) => (
            <Card7 key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionContactUsConstruction;

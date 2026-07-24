// src/components/SectionQuestions/SectionQuestions.jsx
import Card8 from "../../Cards/Card8/Card8";
import "./SectionQuestions.css";

const defaultSection = {
  title: "",
  titleColor: "",
  beforeColor: "#E2F2EA",
  iconColorUp: "#059669",
  iconColorDown: "#059669",
  iconColorBg: "#ECFDF5",
  iconUp: "ChevronUp",
  iconDown: "ChevronDown",
  Questions: [],
};

function SectionQuestions({ data: sectionData = {} }) {
  const {
    title,
    titleColor,
    beforeColor,
    iconColorUp,
    iconColorDown,
    iconColorBg,
    iconUp,
    iconDown,
    Questions,
  } = {
    ...defaultSection,
    ...sectionData,
    Questions: sectionData.Questions || [],
  };

  // ===== رندر اصلی =====
  return (
    <section className="section-questions" dir="rtl">
      <div className="questions-container">
        {/* عنوان */}
        <div className="title-wrapper">
          <h2 className="title" style={{ color: titleColor || "#0f172a" }}>
            {title || "سوالاتی که کمک می‌کنند تصمیم بهتری بگیرید"}
          </h2>
        </div>

        {/* لیست سوالات */}
        <div className="list-wrapper">
          {/* المان پس‌زمینه */}
          <div
            className="list-background"
            style={{ backgroundColor: beforeColor || "#E2F2EA" }}
          />

          {/* لیست کارت‌ها */}
          <div className="list-items">
            {Questions.map((item, index) => (
              <Card8
                key={item.id || index}
                title={item.title}
                text={item.text}
                titleColor={item.titleColor || titleColor}
                textColor={item.textColor || "#64748B"}
                iconColorUp={iconColorUp}
                iconColorDown={iconColorDown}
                iconColorBg={iconColorBg}
                iconUp={iconUp}
                iconDown={iconDown}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionQuestions;

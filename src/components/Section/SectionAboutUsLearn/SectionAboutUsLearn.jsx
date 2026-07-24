import React from "react";
import "./SectionAboutUsLearn.css";

const SectionAboutUsLearn = ({ data: sectionData }) => {
  const data = Array.isArray(sectionData)
    ? sectionData
    : sectionData
      ? [sectionData]
      : [];

  if (data.length === 0) return null;

  // از اولین آیتم استفاده می‌کنیم
  const item = data[0];

  // تبدیل توضیحات با حفظ خطوط جدید (شامل خط‌های بولت‌دار)
  const descriptionWithBreaks = item.description?.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < item.description.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <section className="section-about-us-learn" dir="rtl">
      <div className="learn">
        {/* عکس + دایو رنگ */}
        <div className="learn-media">
          <div
            className="learn-media-color"
            style={{ backgroundColor: item.iconColor || "#E2F2EA" }}
          />
          <img
            className="learn-media-image"
            src={item.image || "/default-image.jpg"}
            alt={item.title}
          />
        </div>

        {/* متن */}
        <div className="learn-wrapper">
          <h2
            className="learn-title"
            style={{ color: item.titleColor || "#2F4858" }}
          >
            {item.title || "عنوان"}
          </h2>
          <p
            className="learn-description"
            style={{ color: item.descriptionColor || "#5C6A63" }}
          >
            {descriptionWithBreaks}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SectionAboutUsLearn;

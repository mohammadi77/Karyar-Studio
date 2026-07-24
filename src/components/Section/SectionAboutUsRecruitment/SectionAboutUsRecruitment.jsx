import React from "react";
import "./SectionAboutUsRecruitment.css";

const SectionAboutUsRecruitment = ({ data: sectionData }) => {
  const data = Array.isArray(sectionData)
    ? sectionData
    : sectionData
      ? [sectionData]
      : [];

  if (data.length === 0) return null;

  // از اولین آیتم استفاده می‌کنیم (در صورت نیاز می‌توان اسلایدر پیاده‌سازی کرد)
  const item = data[0];

  // تبدیل توضیحات با حفظ خطوط جدید
  const descriptionWithBreaks = item.description?.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < item.description.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <section className="section-about-us-recruitment">
      <div className="recruitment">
        {/* سمت راست: عکس */}
        <div className="recruitment-img">
          <img src={item.Image || "/default-image.jpg"} alt={item.title} />
        </div>

        {/* سمت چپ: متن */}
        <div className="recruitment-wrapper">
          <h2 style={{ color: item.titleColor || "#2F4858" }}>
            {item.title || "عنوان"}
          </h2>
          <p style={{ color: item.textColor || "#5C6A63" }}>
            {descriptionWithBreaks}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SectionAboutUsRecruitment;

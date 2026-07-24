import React from "react";
import "./SectionAboutUsStart.css";
import Button1 from "../../Button/Button1/Button1";

const SectionAboutUsStart = ({ data: sectionData }) => {
  const data = Array.isArray(sectionData)
    ? sectionData
    : sectionData
      ? [sectionData]
      : [];

  if (data.length === 0) return null;

  // از اولین آیتم استفاده می‌کنیم
  const item = data[0];
  const button = item.button || {};

  // تبدیل توضیحات با حفظ خطوط جدید
  const descriptionWithBreaks = item.description?.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < item.description.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <section className="section-about-us-start" dir="rtl">
      <div className="start-content">
        <h2
          className="start-title"
          style={{ color: item["title:color"] || item.titleColor || "#2F4858" }}
        >
          {item.title || "عنوان"}
        </h2>

        <p
          className="start-description"
          style={{ color: item.descriptionColor || "#5C6A63" }}
        >
          {descriptionWithBreaks}
        </p>

        <div className="start-button">
          <Button1
            text={button.text}
            iconName={button.iconName}
            bgColor={button.bgColor}
            textColor={button.textColor}
            iconColor={button.iconColor}
            link={button.link}
          />
        </div>
      </div>
    </section>
  );
};

export default SectionAboutUsStart;

import "./SectionAboutUsSlider.css"; // ایمپورت فایل CSS

const SectionAboutUsSlider = ({ data: sectionData }) => {
  const data = Array.isArray(sectionData)
    ? sectionData
    : sectionData
      ? [sectionData]
      : [];

  if (data.length === 0) return null;

  return (
    <section className="section-about-us-slider" dir="rtl">
      <div className="slider-container">
        {data.map((item, index) => (
          <div className="slide" key={item.id || index}>
            <div className="text-wrapper">
              <h2 className="title" style={{ color: item.titleColor }}>
                {item.title}
              </h2>
              <p className="description" style={{ color: item.textColor }}>
                {item.description}
              </p>
            </div>

            <div className="image-wrapper-back">
              <div className="image-wrapper">
                <img
                  className="before-image"
                  src={item.beforeImage}
                  alt="قبل"
                  loading="lazy"
                />
                <img
                  className="main-image"
                  src={item.mainImage}
                  alt={item.title}
                  loading="lazy"
                />
                <img
                  className="after-image"
                  src={item.afterImage}
                  alt="بعد"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionAboutUsSlider;

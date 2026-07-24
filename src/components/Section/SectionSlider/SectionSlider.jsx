import Button1 from "../../Button/Button1/Button1";
import "./SectionSlider.css";

// ===== داده‌های پیش‌فرض =====
const defaultData = {
  title: "تایتلی در دیتابیس موجود نیست",
  description: "توضیحی در دیتابیس موجود نیست",
  image: "/images/default.png",
  titleColor: "#2F4858",
  textColor: "#5C6A63",
  bgShapeColor: "#FCEDDE",
  button: {
    text: "دکمه پیش‌فرض",
    link: "/",
  },
};

const SectionSlider = ({ data: sectionData }) => {
  // اگر آرایه بود، اولین آیتم را می‌گیریم، در غیر این صورت خود شیء را استفاده می‌کنیم
  const data = Array.isArray(sectionData) ? sectionData[0] : sectionData;

  // ===== اگر داده وجود ندارد (که نباید باشد چون پیش‌فرض داریم) =====
  const currentData = data || defaultData;

  // ===== استخراج مقادیر =====
  const {
    title,
    description,
    image,
    titleColor,
    textColor,
    bgShapeColor,
    button,
  } = currentData;

  return (
    <section className="section-slider">
      <div className="section-slider__right">
        <h2 className="section-slider__title" style={{ color: titleColor }}>
          {title}
        </h2>

        <p className="section-slider__description" style={{ color: textColor }}>
          {description}
        </p>

        {/* پاس دادن پراپس‌های دکمه به‌صورت جداگانه یا با spread در صورت وجود */}
        <Button1 {...button} />
      </div>

      <div className="section-slider__left">
        <div
          className="section-slider__shape"
          style={{ background: bgShapeColor }}
        />

        <img src={image} alt={title} className="section-slider__image" />
      </div>
    </section>
  );
};

export default SectionSlider;

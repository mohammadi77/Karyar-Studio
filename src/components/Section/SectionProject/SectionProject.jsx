import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { getIconComponent } from "../../../utils/iconResolver";

import "swiper/css";
import "swiper/css/navigation";

import Card2 from "../../Cards/Card2/Card2";
import "./SectionProject.css";

// آیکون‌های پیش‌فرض برای دکمه‌های قبلی/بعدی (در صورت عدم وجود در داده)
const DEFAULT_ARROW_LEFT = "arrow_circle_left";
const DEFAULT_ARROW_RIGHT = "arrow_circle_right";

export default function SectionProject({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  if (!data) return null;

  const colors = {
    title: data?.titleColor || "#2F4858",
    // رنگ عنوان کارت‌ها عمداً از رنگ عنوان کل بخش (بالا) جدا است
    // تا تغییر رنگ تایتل بخش روی تک‌تک کارت‌ها اثر نگذارد
    cardTitle: data?.cardTitleColor || "#2F4858",
    text: data?.textColor || "#5C5C5C",
    icon: data?.iconColor || "#1EA965",
    navBg: data?.navBgColor || "#F6F6F6",
    dot: data?.dotColor || "#EDEDED",
    activeDot: data?.activeDotColor || "#1EA965",
    cardBg: data?.cardBgColor || "#FFFFFF",
  };

  const beforeImage = data?.beforeImage || "/images/Ellipse.png";
  const afterImage = data?.afterImage || "/images/Dot.png";

  // دریافت نام آیکون‌های Arrow از داده یا استفاده از پیش‌فرض
  const arrowLeftName = data?.ArrowLeft || DEFAULT_ARROW_LEFT;
  const arrowRightName = data?.ArrowRight || DEFAULT_ARROW_RIGHT;

  // دریافت کامپوننت آیکون‌ها از customIcons (در صورت وجود)
  const ArrowLeftIcon = getIconComponent(arrowLeftName) || null;
  const ArrowRightIcon = getIconComponent(arrowRightName) || null;

  // اگر آیکون در customIcons نبود، می‌توانید از یک تصویر placeholder استفاده کنید
  const renderArrow = (Icon, alt) => {
    if (Icon) {
      return (
        <Icon style={{ color: colors.icon, width: "32px", height: "32px" }} />
      );
    }
    // در غیر این صورت می‌توانید از یک img با src دلخواه استفاده کنید
    return <img src={`/images/${alt}.png`} alt={alt} />;
  };

  return (
    <section className="SectionProject">
      <div className="DivProject">
        <h2 className="ProjectTitle" style={{ color: colors.title }}>
          {data.title}
        </h2>

        <div className="SliderWrapper">
          <img className="BeforeDesktop" src={beforeImage} alt="" />

          <button
            className="project-prev desktopOnly"
            style={{ background: colors.navBg }}
          >
            {renderArrow(ArrowLeftIcon, "prev")}
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".project-prev",
              nextEl: ".project-next",
            }}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            spaceBetween={20}
            breakpoints={{
              0: {
                slidesPerView: "auto",
                centeredSlides: false,
                slidesOffsetBefore: 32,
                slidesOffsetAfter: 32,
              },
              768: {
                slidesPerView: 1,
                centeredSlides: false,
                slidesOffsetBefore: 0,
                slidesOffsetAfter: 0,
              },
            }}
          >
            {data.projects.map((item) => (
              <SwiperSlide key={item.id}>
                <Card2
                  image={item.image}
                  logo={item.logo}
                  title={item.title}
                  paragraph={item.paragraph}
                  titleColor={colors.cardTitle}
                  paragraphColor={colors.text}
                  background={colors.cardBg}
                />
              </SwiperSlide>
            ))}

            {/* پجینیشن سفارشی: برخلاف پجینیشن داخلی Swiper، تعداد نقطه‌ها همیشه دقیقاً برابر تعداد آیتم‌هاست
                (پجینیشن پیش‌فرض در حالت slidesPerView: "auto" به همراه slidesOffset، بر اساس snapGrid داخلی
                محاسبه می‌شود که می‌تواند یک نقطه اضافه‌ی نامرتبط با تعداد واقعی آیتم‌ها تولید کند) */}
            <div className="ProjectPagination">
              {data.projects.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`ProjectDot${
                    index === activeIndex ? " active" : ""
                  }`}
                  style={{
                    background:
                      index === activeIndex ? colors.activeDot : colors.dot,
                  }}
                  aria-label={`اسلاید ${index + 1}`}
                  onClick={() => swiperInstance?.slideTo(index)}
                />
              ))}
            </div>
          </Swiper>

          <button
            className="project-next desktopOnly"
            style={{ background: colors.navBg }}
          >
            {renderArrow(ArrowRightIcon, "next")}
          </button>

          <img className="AfterDesktop" src={afterImage} alt="" />
        </div>
      </div>
    </section>
  );
}

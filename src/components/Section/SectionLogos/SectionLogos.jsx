import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "./SectionLogos.css";

// اگر همه‌ی لوگوها هم‌زمان در صفحه جا بشن (چیزی برای اسکرول کردن نباشه)، اتوپلی رو خاموش می‌کنیم
const syncAutoplay = (swiper) => {
  if (!swiper || !swiper.autoplay) return;
  if (swiper.isLocked) {
    swiper.autoplay.stop();
  } else {
    swiper.autoplay.start();
  }
};

const SectionLogos = ({ data: logos = [] }) => {
  if (logos.length === 0) {
    return null;
  }

  return (
    <section className="SectionLogos">
      <div className="LogoWrapper">
        <Swiper
          modules={[Autoplay]}
          loop
          watchOverflow
          slidesPerView="auto"
          spaceBetween={96}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          onSwiper={syncAutoplay}
          onResize={syncAutoplay}
          speed={800}
          grabCursor
          breakpoints={{
            0: {
              spaceBetween: 42,
            },
            480: {
              spaceBetween: 42,
            },
            768: {
              spaceBetween: 50,
            },
            992: {
              spaceBetween: 96,
            },
          }}
        >
          {logos.map((logo) =>
            logo.link ? (
              <SwiperSlide key={logo.id} className="LogoItem">
                <a
                  className="LogoItem-link"
                  href={logo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo.image} alt={logo.title} />
                </a>
              </SwiperSlide>
            ) : (
              <SwiperSlide key={logo.id} className="LogoItem">
                <img src={logo.image} alt={logo.title} />
              </SwiperSlide>
            ),
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default SectionLogos;

import Card4 from "../../Cards/Card4/Card4";
import { useAppData } from "../../../hooks/useAppData";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "./SectionPeople.css";

const defaultSection = {
  title: "",
  subtitle: "",
  titleColor: "#2F4858",
  subtitleColor: "#5C6A63",
  firstCardColor: "#F8D8D8",
  secondCardColor: "#E2F2EA",
  items: [],
};

const SectionPeople = ({ data = {} }) => {
  const section = { ...defaultSection, ...data };
  const { data: appData } = useAppData();
  const teamMembers = appData.teamMembers || [];

  const people = section.items
    .map((entry) => {
      const member = teamMembers.find(
        (m) => String(m.id) === String(entry.memberId),
      );
      if (!member || member.active === false) return null;
      return {
        id: member.id,
        image: member.image,
        name: member.name,
        role: member.role,
        bgColor: entry.bgColor,
      };
    })
    .filter(Boolean);

  return (
    <section className="SectionPeople">
      <div className="DivPeople">
        <h2
          className="SectionPeopleTitle"
          style={{ color: section.titleColor }}
        >
          {section.title}
        </h2>

        <p
          className="SectionPeopleText"
          style={{ color: section.subtitleColor }}
        >
          {section.subtitle}
        </p>

        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          slidesPerGroup={1}
          spaceBetween={32}
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            renderBullet: (index, className) => {
              if (index < 5) {
                return `<span class="${className}"></span>`;
              }
              return "";
            },
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.5,
              slidesPerGroup: 1,
              spaceBetween: 1,
            },
            340: {
              slidesPerView: 2,
              slidesPerGroup: 1,
              spaceBetween: 8,
            },
            420: {
              slidesPerView: 2.5,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            500: {
              slidesPerView: 3,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            600: {
              slidesPerView: 4,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            950: {
              slidesPerView: 4,
              slidesPerGroup: 1,
              spaceBetween: 20,
            },

            1000: {
              slidesPerView: 4.5,
              slidesPerGroup: 1,
              spaceBetween: 18,
            },
            1200: {
              slidesPerView: 5.5,
              slidesPerGroup: 1,
              spaceBetween: 18,
            },
          }}
        >
          {people.map((person, index) => (
            <SwiperSlide key={person.id}>
              <Card4
                {...person}
                bgColor={
                  person.bgColor ||
                  (index % 2 === 0
                    ? section.firstCardColor
                    : section.secondCardColor)
                }
                nameColor={section.nameColor}
                roleColor={section.roleColor}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SectionPeople;

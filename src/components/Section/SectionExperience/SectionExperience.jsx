import { useRef, useState, useCallback, useLayoutEffect } from "react";
import Card5 from "../../Cards/Card5/Card5";
import { getIconComponent as resolveIconComponent } from "../../../utils/iconResolver";
import "./SectionExperience.css";

const defaultData = {
  title: "تجربه همکاری از نگاه مشتریان",
  subtitle: "بخشی از تجربه کسانی که مسیر ساخت محصولشان را با ما شروع کردند.",
  titleColor: "#2F4858",
  subtitleColor: "#5C6A63",
  highlightColor: "#DCEEE3",
  backImage: "",
  backImageCol: "#5C6A63",
  cardBgColor: "",
  textColor: "",
  jobColor: "",
  nameColor: "",
  quoteIcon: "kama",
  quoteIconColor: "#FCEDDE",
  arrows: {
    activeBg: "#FFFFFF",
    inactiveBg: "#FFFFFF",
    activeIcon: "#5C6A63",
    inactiveIcon: "#BDBEBF",
    activeBorder: "#5C6A63",
    inactiveBorder: "#BDBEBF",
    prevIconId: "",
    nextIconId: "",
  },
  cards: [],
};

function SectionExperience({ data: jsonData = {} }) {
  const data = {
    ...defaultData,
    ...jsonData,
    arrows: {
      ...defaultData.arrows,
      ...(jsonData.arrows || {}),
    },
  };

  const {
    title,
    subtitle,
    titleColor,
    subtitleColor,
    backImage,
    highlightColor,
    cardBgColor,
    textColor,
    jobColor,
    nameColor,
    quoteIcon,
    quoteIconColor,
    arrows,
    cards,
  } = data;

  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0.5) {
      setAtStart(true);
      setAtEnd(true);
      return;
    }

    const currentPos = Math.abs(scrollLeft);
    setAtStart(currentPos < 0.5);
    setAtEnd(currentPos > maxScroll - 0.5);
  }, []);

  useLayoutEffect(() => {
    updateEdges();

    const el = trackRef.current;
    if (!el) return;

    const handleUpdate = () => {
      requestAnimationFrame(updateEdges);
    };

    el.addEventListener("scroll", handleUpdate);
    window.addEventListener("resize", handleUpdate);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateEdges);
    });
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
      observer.disconnect();
    };
  }, [updateEdges, cards.length]);

  const getStep = () => {
    const el = trackRef.current;
    if (!el) return 320;
    const first = el.querySelector(".se-slide");
    if (!first) return 320;
    return first.getBoundingClientRect().width + 20;
  };

  const goPrev = () => {
    const el = trackRef.current;
    if (!el || atStart) return;
    el.scrollBy({ left: getStep(), behavior: "smooth" });
  };

  const goNext = () => {
    const el = trackRef.current;
    if (!el || atEnd) return;
    el.scrollBy({ left: -getStep(), behavior: "smooth" });
  };

  const arrowStyle = (disabled) => ({
    background: disabled ? arrows.inactiveBg : arrows.activeBg,
    color: disabled ? arrows.inactiveIcon : arrows.activeIcon,
    borderColor: disabled ? arrows.inactiveBorder : arrows.activeBorder,
  });

  const getIconColor = (disabled) => {
    return disabled ? arrows.inactiveIcon : arrows.activeIcon;
  };

  const getIconComponent = (iconId, defaultId) => {
    const finalId = iconId || defaultId;
    return resolveIconComponent(finalId) || null;
  };

  return (
    <section className="se-wrapper" dir="rtl">
      <div className="se-inner">
        <div className="se-header">
          <div className="se-title-wrap">
            <span
              className="se-title-highlight"
              style={{ background: highlightColor }}
            />
            <h2 className="se-title" style={{ color: titleColor }}>
              {title}
            </h2>
            <p className="se-subtitle" style={{ color: subtitleColor }}>
              {subtitle}
            </p>
          </div>

          <div className="se-arrows">
            <button
              type="button"
              className="se-arrow-btn"
              style={arrowStyle(atStart)}
              onClick={goPrev}
              disabled={atStart}
              aria-label="قبلی"
            >
              {(() => {
                const IconComp = getIconComponent(
                  arrows.prevIconId,
                  "arrow_circle_left",
                );
                return IconComp ? (
                  <IconComp size={24} color={getIconColor(atStart)} />
                ) : null;
              })()}
            </button>

            <button
              type="button"
              className="se-arrow-btn"
              style={arrowStyle(atEnd)}
              onClick={goNext}
              disabled={atEnd}
              aria-label="بعدی"
            >
              {(() => {
                const IconComp = getIconComponent(
                  arrows.nextIconId,
                  "arrow_circle_right",
                );
                return IconComp ? (
                  <IconComp size={24} color={getIconColor(atEnd)} />
                ) : null;
              })()}
            </button>
          </div>
        </div>
        <div className="se-track-wrap">
          <div className="se-dots">
            <img src={backImage} alt="" />
          </div>
          <div className="se-track" ref={trackRef}>
            {cards.map((card, i) => (
              <div className="se-slide" key={card.id ?? i}>
                <Card5
                  data={{
                    ...card,
                    cardBgColor,
                    textColor,
                    jobColor,
                    nameColor,
                    quoteIcon,
                    quoteIconColor,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionExperience;

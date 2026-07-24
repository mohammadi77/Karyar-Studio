import "./SectionConversionProcess.css";

import Button1 from "../../Button/Button1/Button1";
import Card7 from "../../Cards/Card7/Card7";
import DecorativeLine from "../../DecorativeLine/DecorativeLine";

const defaultData = {
  title: "روند تبدیل ایده به محصول",
  titleColor: "#2F4858",

  subtitle:
    "مسیر ما از فهم مسئله شروع می‌شود و با ساخت محصولی کاربردی و قابل اعتماد به پایان می‌رسد.",
  subtitleColor: "#5C6A63",

  button: {},

  lines: {
    color: "#FB7A01",
    opacity: 0.16,
    shadowColor: "rgba(90, 44, 1, 0.12)",
    desktop: [],
    mobile: [],
  },

  cards: [],
};

const SectionConversionProcess = ({ data: res = {} }) => {
  const data = {
    ...defaultData,
    ...res,
    button: {
      ...defaultData.button,
      ...(res.button || {}),
    },
    lines: {
      ...defaultData.lines,
      ...(res.lines || {}),
      desktop: res.lines?.desktop || [],
      mobile: res.lines?.mobile || [],
    },
    cards: res.cards || [],
  };

  const { lines } = data;

  return (
    <section className="conversion-process">
      <div className="conversion-process__header">
        <h2
          className="conversion-process__title"
          style={{ color: data.titleColor }}
        >
          {data.title}
        </h2>

        <p
          className="conversion-process__subtitle"
          style={{ color: data.subtitleColor }}
        >
          {data.subtitle}
        </p>

        <Button1 {...data.button} />
      </div>

      <div className="conversion-process__body">
        {/* Desktop-only static lines */}
        <div className="conversion-process__lines conversion-process__lines--desktop">
          {lines.desktop.map((line) => (
            <DecorativeLine
              key={line.id}
              variant="desktop"
              color={lines.color}
              opacity={lines.opacity}
              shadowColor={lines.shadowColor}
              {...line}
            />
          ))}
        </div>

        {/* Mobile-only static lines */}
        <div className="conversion-process__lines conversion-process__lines--mobile">
          {lines.mobile.map((line) => (
            <DecorativeLine
              key={line.id}
              variant="mobile"
              color={lines.color}
              opacity={lines.opacity}
              shadowColor={lines.shadowColor}
              {...line}
            />
          ))}
        </div>

        <div className="conversion-process__cards">
          {data.cards.map((item, index) => (
            <Card7 key={item.id || index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionConversionProcess;

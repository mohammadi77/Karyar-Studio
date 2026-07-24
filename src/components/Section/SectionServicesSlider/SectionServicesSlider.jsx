import "./SectionServicesSlider.css";
import { getIconComponent } from "../../../utils/iconResolver";

const defaultData = {
  image: "/images/30379629a2c70b5b9b576e2703cff59787ccaf2d.png",
  dotImage: "/icon/Dot.png",
  title: "خدماتی که ایده را به محصول واقعی تبدیل می‌کند",
  titleColor: "#2F4858",
  description:
    "ما در کاربار استودیو، با ترکیب طراحی محصول و طراحی وب‌سایت، به کسب‌وکارها کمک می‌کنیم مسیر رشدشان را شفاف، سریع و قابل اجرا بسازند.",
  descriptionColor: "#5C6A63",
  items: [],
};

const SectionServicesSlider = ({ data: resData = {} }) => {
  const data = { ...defaultData, ...resData };

  // تابع کمکی برای رندر آیکون
  const renderIcon = (iconName, iconBg, iconColor) => {
    if (!iconName) return null;

    // اگر iconName در customIcons موجود باشد، کامپوننت آن را دریافت می‌کنیم
    const IconComponent = getIconComponent(iconName);

    if (IconComponent) {
      // اگر کامپوننت آیکون موجود است، آن را با رنگ و پس‌زمینه مناسب رندر می‌کنیم
      return (
        <div
          className="services_slider_icon"
          style={{
            background: iconBg || "#E2F2EA",
            color: iconColor || "#49B87A", // ممکن است برخی آیکون‌ها از color استفاده کنند
          }}
        >
          <IconComponent />
        </div>
      );
    }

    // در صورت نبود آیکون در customIcons، می‌توانید یک تصویر جایگزین نمایش دهید
    console.warn(`آیکون "${iconName}" در customIcons یافت نشد.`);
    return (
      <div
        className="services_slider_icon"
        style={{
          background: iconBg || "#E2F2EA",
        }}
      >
        <img src="/images/placeholder-icon.png" alt="آیکون" />
      </div>
    );
  };

  return (
    <section className="section_services_slider">
      <div className="section_services_slider_container">
        {/* تصویر اصلی با نقطه‌چین‌های پس‌زمینه */}
        <div className="services_slider_image">
          <img src={data.dotImage} alt={data.title} className="image_befor" />{" "}
          <img src={data.image} alt={data.title} className="slider_image" />
        </div>

        {/* محتوای متنی */}
        <div className="services_slider_content">
          <h2
            className="services_slider_title"
            style={{
              color: data.titleColor,
            }}
          >
            {data.title}
          </h2>

          <p
            className="services_slider_description"
            style={{
              color: data.descriptionColor,
            }}
          >
            {data.description}
          </p>

          <div className="services_slider_items">
            {data.items.map((item, index) => (
              <div className="services_slider_item" key={index}>
                {/* رندر آیکون با استفاده از customIcons */}
                {renderIcon(item.icon, item.iconBg, item.iconColor)}

                <div className="services_slider_text">
                  <h3
                    className="services_slider_item_title"
                    style={{
                      color: item.titleColor || "#2F4858",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="services_slider_item_description"
                    style={{
                      color: item.descriptionColor || "#5C6A63",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionServicesSlider;

import "./SectionContactUsContact.css";
import { getIconComponent } from "../../../utils/iconResolver";

// شماره را به فرمت بین‌المللی (با کد کشور ایران) برای Dialer آماده می‌کند
// مثال: "0912 345 67 89" -> "+989123456789"
const formatPhoneHref = (rawNumber) => {
  if (!rawNumber) return "#";
  const digits = rawNumber.replace(/[^0-9]/g, "");
  if (!digits) return "#";
  if (digits.startsWith("0")) return `tel:+98${digits.slice(1)}`;
  if (digits.startsWith("98")) return `tel:+${digits}`;
  return `tel:+98${digits}`;
};

const SectionContactUsContact = ({ data: sectionData }) => {
  const data = Array.isArray(sectionData)
    ? sectionData
    : sectionData
      ? [sectionData]
      : [];

  if (data.length === 0) return null;

  // از اولین آیتم استفاده می‌کنیم
  const item = data[0];

  const PhoneIcon = getIconComponent(item.iconPhone);
  const EmailIcon = getIconComponent(item.iconEmail);
  const AddresIcon = getIconComponent(item.iconAddres);

  return (
    <section className="section-contact-us-contact" dir="rtl">
      <div className="contact">
        {/* عکس + دایو رنگ */}
        <div className="contact-media">
          <div
            className="contact-media-before"
            style={{ backgroundColor: item.iconColor || "#E2F2EA" }}
          />
          <img
            className="contact-media-image"
            src={item.image || "/default-image.jpg"}
            alt={item.title}
          />
        </div>

        {/* متن و راه‌های ارتباطی */}
        <div className="contact-wrapper">
          <h2
            className="contact-title"
            style={{ color: item.titleColor || "#2F4858" }}
          >
            {item.title || "عنوان"}
          </h2>

          {/* شماره تلفن */}
          <a className="contact-row" href={formatPhoneHref(item.phonNumber)}>
            <span
              className="contact-icon-circle"
              style={{ backgroundColor: item.iconPhonebg }}
            >
              {PhoneIcon && (
                <PhoneIcon
                  className="contact-icon"
                  color={item.iconPhoneColor}
                />
              )}
            </span>
            <span
              className="contact-text contact-phone"
              style={{ color: item.phonNumberColor }}
              dir="ltr" // ← اضافه کنید
            >
              {item.phonNumber}
            </span>
          </a>

          {/* ایمیل */}
          <a
            className="contact-row"
            href={item.email ? `mailto:${item.email}` : "#"}
          >
            <span
              className="contact-icon-circle"
              style={{ backgroundColor: item.iconEmailbg }}
            >
              {EmailIcon && (
                <EmailIcon
                  className="contact-icon"
                  color={item.iconEmailColor}
                />
              )}
            </span>
            <span
              className="contact-text contact-email"
              style={{ color: item.emailColor }}
            >
              {item.email}
            </span>
          </a>

          {/* آدرس */}
          <div className="contact-row">
            <span
              className="contact-icon-circle"
              style={{ backgroundColor: item.iconAddresbg }}
            >
              {AddresIcon && (
                <AddresIcon
                  className="contact-icon"
                  color={item.iconAddresColor}
                />
              )}
            </span>
            <span
              className="contact-text contact-address"
              style={{ color: item.addresColor }}
            >
              {item.addres}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionContactUsContact;

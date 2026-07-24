import React, { useState, useEffect } from "react";
import "./SectionContactUsContact.css";
import { customIcons } from "../../CustomIcons/CustomIcons";

const SectionContactUsContact = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/SectionContactUsContact")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        // داده اصلی را استخراج می‌کنیم
        const sectionData = json.SectionContactUsContact || json;
        // اگر آرایه نبود، به آرایه تبدیل می‌کنیم
        const dataArray = Array.isArray(sectionData)
          ? sectionData
          : [sectionData];
        setData(dataArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ خطا در دریافت داده:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        ⏳ در حال بارگذاری...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        ❌ خطا در دریافت اطلاعات: {error}
      </div>
    );

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        🚫 داده‌ای برای نمایش وجود ندارد.
      </div>
    );
  }

  // از اولین آیتم استفاده می‌کنیم
  const item = data[0];

  const PhoneIcon = customIcons[item.iconPhone];
  const EmailIcon = customIcons[item.iconEmail];
  const AddresIcon = customIcons[item.iconAddres];

  return <section className="section-contact-us-contact" dir="rtl"></section>;
};

export default SectionContactUsContact;

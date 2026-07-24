import React from "react";
import "./Timeline.css";

const steps = [
  {
    number: "۱",
    icon: "👥",
    title: "تشکیل تیم",
    text: "در ابتدا با توجه به نیاز پروژه تیمی متناسب با اهداف شما تشکیل می‌دهیم. سپس تیم مدیریت پروژه در کنار شما قرار می‌گیرد.",
  },
  {
    number: "۲",
    icon: "↻",
    title: "چرخه‌های هفتگی",
    text: "کار در قالب اسپرینت‌های هفتگی پیش می‌رود. در پایان هر چرخه خروجی‌ها بررسی و بازخوردها اعمال می‌شوند.",
  },
  {
    number: "۳",
    icon: "⚙",
    title: "ادامه مسیر",
    text: "پس از ارائه محصول براساس بازخورد کاربران مسیر توسعه و بهبود ادامه پیدا می‌کند.",
  },
];

export default function Timeline() {
  return (
    <section className="timeline">
      <img src="/src/assets/images/Group2125014906.png" alt="title" />
    </section>
  );
}

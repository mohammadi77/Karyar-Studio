// Card8.jsx
import { useState, useMemo } from "react";
import { getIconComponent } from "../../../utils/iconResolver";
import "./Card8.css";

const DEFAULT_ICON = "Dot";

function cart8({
  iconColorUp,
  iconColorDown,
  iconColorBg,
  iconUp,
  iconDown,
  title,
  titleColor,
  text,
  textColor,
  defaultOpen = false,
  controlled = false,
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
}) {
  // ===== State داخلی (در حالت غیر controllable) =====
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = controlled ? externalIsOpen : internalIsOpen;

  // ===== هندلر کلیک =====
  const handleToggle = () => {
    if (controlled) {
      externalOnToggle?.();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  // ===== انتخاب آیکون با useMemo برای بهینه‌سازی =====
  const { IconComponent, finalIconName } = useMemo(() => {
    const rawIconName = isOpen ? iconDown : iconUp;

    // ۱. اگر نام خام در customIcons موجود باشد، از آن استفاده کن
    if (rawIconName && getIconComponent(rawIconName)) {
      return {
        IconComponent: getIconComponent(rawIconName),
        finalIconName: rawIconName,
      };
    }

    // ۲. در غیر این صورت، fallback
    let fallbackName;
    if (isOpen && !iconDown) {
      fallbackName = "arrow_circle_down";
      console.warn(
        "⚠️ iconDown undefined است! از 'arrow_circle_down' به‌عنوان پیش‌فرض استفاده شد.",
      );
    } else {
      fallbackName = DEFAULT_ICON;
      console.warn(
        `⚠️ آیکون "${rawIconName}" در customIcons پیدا نشد. از "${DEFAULT_ICON}" استفاده شد.`,
      );
    }

    const Icon = getIconComponent(fallbackName);
    if (!Icon) {
      console.error(`❌ حتی "${fallbackName}" نیز در customIcons وجود ندارد!`);
    }

    return {
      IconComponent: Icon || null,
      finalIconName: fallbackName,
    };
  }, [isOpen, iconUp, iconDown]);

  // ===== کلاس‌های شرطی =====
  const containerClass = `card8-container ${isOpen ? "open" : "closed"}`;
  const bodyClass = `card8-body ${isOpen ? "open" : ""}`;
  const iconClass = `card8-icon`; // rotated حذف شده (اما کلاس در CSS باقی می‌ماند)

  // ===== رنگ‌های آیکون =====
  const iconBgColor = iconColorBg || "#ECFDF5";
  const iconColor = isOpen ? iconColorUp : iconColorDown;

  return (
    <div className={containerClass}>
      <button onClick={handleToggle} className="card8-button" dir="rtl">
        {/* عنوان در سمت راست (چون راست‌چین است) */}
        <span className="card8-title" style={{ color: titleColor }}>
          {title}
        </span>

        {/* دایره آیکون */}
        <span
          className="card8-icon-wrapper"
          style={{ backgroundColor: iconBgColor }}
        >
          {IconComponent && (
            <IconComponent
              size={16}
              strokeWidth={2.5}
              className={iconClass}
              style={{ color: iconColor }}
            />
          )}
        </span>
      </button>

      {/* محتوای بازشونده */}
      <div className={bodyClass}>
        <p className="card8-text" style={{ color: textColor }}>
          {text}
        </p>
      </div>
    </div>
  );
}

export default cart8;

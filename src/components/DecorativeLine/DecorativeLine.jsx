import "./DecorativeLine.css";

/**
 * DecorativeLine
 * Static background ornament used behind the conversion-process cards.
 * Two shapes are available, chosen per-segment via `shape` (falls back to
 * `variant` for old data that doesn't set it): "hook" renders the original
 * filled SVG path; "capsule" renders a thin bordered div rotated to read as
 * a curve (border-radius / border-width only, no fill). Desktop layouts mix
 * both shapes across the segments that connect the cards.
 *
 * Color and shadow are fully customizable via props (sourced from conversionProcess.json).
 */
const DecorativeLine = ({
  variant = "desktop", // "desktop" | "mobile"
  shape, // "hook" | "capsule" - اگر ست نشه بر اساس variant پیش‌فرض تعیین می‌شه
  width,
  height,
  top,
  left,
  rotate = 0,
  color = "#FB7A01",
  opacity = 0.16,
  shadowColor = "rgba(90, 44, 1, 0.12)",
  borderRadius = 40,
  borderWidth = 6,
}) => {
  const positionStyle = {
    top: top != null ? `${top}px` : undefined,
    left: left != null ? `${left}px` : undefined,
    width: `${width}px`,
    height: `${height}px`,
    transform: `rotate(${rotate}deg)`,
  };

  const resolvedShape = shape || (variant === "mobile" ? "capsule" : "hook");

  if (resolvedShape === "capsule") {
    return (
      <div
        className="decorative-line decorative-line--capsule"
        style={{
          ...positionStyle,
          borderColor: color,
          borderWidth: `${borderWidth}px`,
          borderRadius: `${borderRadius}px`,
          opacity,
        }}
      />
    );
  }

  return (
    <svg
      className="decorative-line decorative-line--hook"
      style={{
        ...positionStyle,
        filter: `drop-shadow(0px 16px 12px ${shadowColor})`,
      }}
      viewBox="0 0 93 179"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M56.9789 108V40.2158C56.9789 21.319 72.716 6 92.1284 6V0C69.3118 0 50.8152 18.0053 50.8152 40.2158V108C50.8152 128.435 33.7977 145 12.8056 145H12V151H12.8056C37.2019 151 56.9789 131.748 56.9789 108Z"
        fill={color}
        fillOpacity={opacity}
      />
    </svg>
  );
};

export default DecorativeLine;

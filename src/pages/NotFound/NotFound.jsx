import { useSectionData } from "../../hooks/useSectionData";
import "./NotFound.css";

function NotFound() {
  const { data: sectionData } = useSectionData("notFound");
  const dataArray = Array.isArray(sectionData)
    ? sectionData
    : sectionData
      ? [sectionData]
      : [];
  const data = dataArray[0];

  // If data is not available, show a fallback
  if (!data) {
    return <div className="fallback">صفحه مورد نظر پیدا نشد!</div>;
  }

  // Use data from the API
  const { img, title, titlrColor } = data; // "titlrColor" matches the JSON key

  return (
    <div className="UndefinedWrapper">
      <div className="Undefined">
        <img src={img} alt={title || "صفحه پیدا نشد"} />
        <p style={{ color: titlrColor || "#E2F2EA" }}>{title}</p>
      </div>
    </div>
  );
}

export default NotFound;

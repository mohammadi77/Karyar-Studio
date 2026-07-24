import { useState } from "react";
import { useUpload } from "../../../hooks/useUpload";
import "./ImageField.css";

function ImageField({ value, onChange }) {
  const { uploadFile } = useUpload();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    const url = await uploadFile(file);
    setUploading(false);
    if (url) onChange(url);
  };

  return (
    <div className="image-field">
      <div className="image-field-preview">
        {value ? (
          <img src={value} alt="" />
        ) : (
          <span className="image-field-empty">بدون تصویر</span>
        )}
      </div>
      <div className="image-field-controls">
        <input
          type="text"
          dir="ltr"
          className="field-input"
          placeholder="/images/example.png"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className={`image-field-upload ${uploading ? "disabled" : ""}`}>
          {uploading ? "در حال آپلود..." : "آپلود تصویر از دستگاه"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            hidden
          />
        </label>
      </div>
    </div>
  );
}

export default ImageField;

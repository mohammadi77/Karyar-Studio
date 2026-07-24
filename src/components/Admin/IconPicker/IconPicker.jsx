import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { customIcons } from "../../CustomIcons/CustomIcons";
import { libraryIcons } from "../../../config/libraryIcons";
import { getIconComponent } from "../../../utils/iconResolver";
import { useUpload } from "../../../hooks/useUpload";
import { useAppData } from "../../../hooks/useAppData";
import "./IconPicker.css";

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useUpload();
  const { data } = useAppData();
  const uploadedIcons = data.iconLibrary || [];
  const CurrentIcon = useMemo(() => getIconComponent(value), [value]);

  const handleSelect = (name) => {
    onChange(name);
    setOpen(false);
  };

  const handleCustomUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    const url = await uploadFile(file);
    setUploading(false);
    if (url) handleSelect(url);
  };

  return (
    <div className="icon-picker">
      <button
        type="button"
        className="icon-picker-trigger"
        onClick={() => setOpen(true)}
      >
        <span className="icon-picker-value">{value || "انتخاب آیکون"}</span>
        <span className="icon-picker-preview">
          {CurrentIcon ? <CurrentIcon /> : <span className="icon-picker-empty">؟</span>}
        </span>
      </button>

      {open &&
        createPortal(
          <div className="icon-picker-overlay" onClick={() => setOpen(false)}>
            <div
              className="icon-picker-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="icon-picker-header">
                <h3>انتخاب آیکون</h3>
                <button
                  type="button"
                  className="icon-picker-close"
                  onClick={() => setOpen(false)}
                  aria-label="بستن"
                >
                  ×
                </button>
              </div>

              <div className="icon-picker-body">
                <div className="icon-picker-section">
                  <h4>آیکون سفارشی (آپلود از دستگاه)</h4>
                  <label
                    className={`icon-picker-upload ${uploading ? "disabled" : ""}`}
                  >
                    {uploading ? "در حال آپلود..." : "+ آپلود آیکون سفارشی"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomUpload}
                      disabled={uploading}
                      hidden
                    />
                  </label>
                </div>

                <div className="icon-picker-section">
                  <div className="icon-picker-section-head">
                    <h4>کتابخانه آیکون (آپلودشده)</h4>
                    <a
                      href="/admin/settings/icons"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-picker-manage-link"
                    >
                      مدیریت کتابخانه ↗
                    </a>
                  </div>
                  {uploadedIcons.length > 0 ? (
                    <div className="icon-picker-grid">
                      {uploadedIcons.map((icon) => (
                        <button
                          type="button"
                          key={icon.id}
                          className={`icon-picker-item ${value === icon.url ? "selected" : ""}`}
                          onClick={() => handleSelect(icon.url)}
                          title={icon.name}
                        >
                          <img src={icon.url} alt="" />
                          <span>{icon.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="icon-picker-empty-hint">
                      هنوز آیکونی به کتابخانه اضافه نشده است.
                    </p>
                  )}
                </div>

                <div className="icon-picker-section">
                  <h4>آیکون‌های سفارشی پروژه</h4>
                  <div className="icon-picker-grid">
                    {Object.entries(customIcons).map(([name, Icon]) => (
                      <button
                        type="button"
                        key={name}
                        className={`icon-picker-item ${value === name ? "selected" : ""}`}
                        onClick={() => handleSelect(name)}
                        title={name}
                      >
                        <Icon />
                        <span>{name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="icon-picker-section">
                  <h4>آیکون‌های کتابخانه</h4>
                  <div className="icon-picker-grid">
                    {Object.entries(libraryIcons).map(([name, Icon]) => (
                      <button
                        type="button"
                        key={name}
                        className={`icon-picker-item ${value === name ? "selected" : ""}`}
                        onClick={() => handleSelect(name)}
                        title={name}
                      >
                        <Icon />
                        <span>{name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default IconPicker;

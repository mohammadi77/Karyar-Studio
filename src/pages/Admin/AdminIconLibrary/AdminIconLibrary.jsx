import { useMemo, useState } from "react";
import { useAppData } from "../../../hooks/useAppData";
import { useIconLibraryApi } from "../../../hooks/useIconLibraryApi";
import { useUpload } from "../../../hooks/useUpload";
import { useToast } from "../../../hooks/useToast";
import "../AdminDashboard/AdminDashboard.css";
import "./AdminIconLibrary.css";

function nameFromFile(file) {
  return file.name.replace(/\.svg$/i, "");
}

function AdminIconLibrary() {
  const { data } = useAppData();
  const { createIcon, deleteIcon } = useIconLibraryApi();
  const { uploadFile } = useUpload();
  const { showToast } = useToast();
  const icons = useMemo(() => data.iconLibrary || [], [data.iconLibrary]);

  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(null); // { url, name }
  const [saving, setSaving] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (!/\.svg$/i.test(file.name) && file.type !== "image/svg+xml") {
      showToast("فقط فایل SVG مجاز است", "error");
      return;
    }

    setUploading(true);
    const url = await uploadFile(file);
    setUploading(false);
    if (url) setPending({ url, name: nameFromFile(file) });
  };

  const cancelPending = () => setPending(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!pending) return;
    if (!pending.name.trim()) {
      showToast("یک نام برای آیکون وارد کنید", "error");
      return;
    }
    setSaving(true);
    const icon = await createIcon({ name: pending.name.trim(), url: pending.url });
    setSaving(false);
    if (icon) {
      showToast("آیکون به کتابخانه اضافه شد", "success");
      setPending(null);
    }
  };

  const handleDelete = async (icon) => {
    const confirmed = window.confirm(`آیکون «${icon.name}» حذف شود؟`);
    if (!confirmed) return;
    const success = await deleteIcon(icon.id);
    if (success) {
      showToast("آیکون حذف شد", "success");
    }
  };

  return (
    <div>
      <div className="admin-dashboard-header">
        <div>
          <h1>کتابخانه آیکون</h1>
          <p>
            آیکون‌های SVG دلخواهت رو آپلود کن تا از همه‌جای پنل (نوبار، دکمه‌ها،
            سکشن‌ها و ...) قابل انتخاب باشن
          </p>
        </div>
        <label className={`admin-btn-primary icon-library-upload-btn ${uploading ? "disabled" : ""}`}>
          {uploading ? "در حال آپلود..." : "+ آپلود آیکون SVG"}
          <input
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFile}
            disabled={uploading}
            hidden
          />
        </label>
      </div>

      {pending && (
        <form className="admin-create-form" onSubmit={handleAdd}>
          <div className="icon-library-pending-preview">
            <img src={pending.url} alt="" />
          </div>
          <div className="admin-create-form-field">
            <label>نام آیکون</label>
            <input
              type="text"
              dir="ltr"
              value={pending.name}
              onChange={(e) => setPending({ ...pending, name: e.target.value })}
              placeholder="مثلاً: send-icon"
            />
          </div>
          <div className="admin-create-form-actions">
            <button type="submit" className="admin-btn-primary" disabled={saving}>
              {saving ? "در حال ذخیره..." : "افزودن به کتابخانه"}
            </button>
            <button type="button" className="admin-btn-secondary" onClick={cancelPending}>
              انصراف
            </button>
          </div>
        </form>
      )}

      {icons.length === 0 ? (
        <p className="admin-empty-state">هنوز آیکونی به کتابخانه اضافه نشده است.</p>
      ) : (
        <div className="icon-library-grid">
          {icons.map((icon) => (
            <div className="icon-library-card" key={icon.id}>
              <div className="icon-library-card-preview">
                <img src={icon.url} alt="" />
              </div>
              <span className="icon-library-card-name" title={icon.name}>
                {icon.name}
              </span>
              <button
                type="button"
                className="admin-page-delete-btn"
                onClick={() => handleDelete(icon)}
                aria-label="حذف آیکون"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminIconLibrary;

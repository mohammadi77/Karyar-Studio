import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../../../hooks/useAppData";
import { usePagesApi } from "../../../hooks/usePagesApi";
import { useToast } from "../../../hooks/useToast";
import { slugify, validateSlug } from "../../../utils/slug";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { data } = useAppData();
  const { createPage, deletePage, updatePage } = usePagesApi();
  const { showToast } = useToast();
  const pages = useMemo(() => data.pages || [], [data.pages]);
  const sortedPages = useMemo(
    () => [...pages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [pages],
  );

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setSlug("");
    setShowForm(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const cleanSlug = slugify(slug);

    if (!name.trim()) {
      showToast("نام صفحه را وارد کنید", "error");
      return;
    }
    const slugError = validateSlug(cleanSlug, pages);
    if (slugError) {
      showToast(slugError, "error");
      return;
    }

    setSubmitting(true);
    const page = await createPage({ name: name.trim(), slug: cleanSlug });
    setSubmitting(false);
    if (page) {
      showToast("صفحه با موفقیت ساخته شد", "success");
      resetForm();
    }
  };

  const handleDelete = async (page) => {
    const confirmed = window.confirm(
      `صفحه «${page.name}» حذف شود؟ این عمل قابل بازگشت نیست.`,
    );
    if (!confirmed) return;
    const success = await deletePage(page.id);
    if (success) {
      showToast("صفحه حذف شد", "success");
    }
  };

  const handleToggleEnabled = async (page) => {
    const page_ = await updatePage(page.id, { enabled: !page.enabled });
    if (page_) {
      showToast(
        page_.enabled ? "صفحه فعال شد" : "صفحه غیرفعال شد",
        "success",
      );
    }
  };

  const handleMovePage = async (page, direction) => {
    const index = sortedPages.findIndex((p) => p.id === page.id);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sortedPages.length) return;

    const reordered = [...sortedPages];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];
    for (let i = 0; i < reordered.length; i += 1) {
      await updatePage(reordered[i].id, { order: i });
    }
  };

  return (
    <div>
      <div className="admin-dashboard-header">
        <div>
          <h1>مدیریت صفحات</h1>
          <p>صفحات سایت را بسازید، ویرایش یا حذف کنید</p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "بستن فرم" : "+ صفحه جدید"}
        </button>
      </div>

      {showForm && (
        <form className="admin-create-form" onSubmit={handleCreate}>
          <div className="admin-create-form-field">
            <label htmlFor="new-page-name">نام صفحه</label>
            <input
              id="new-page-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: نمونه کارها"
            />
          </div>
          <div className="admin-create-form-field">
            <label htmlFor="new-page-slug">اسلاگ (آدرس صفحه)</label>
            <input
              id="new-page-slug"
              type="text"
              dir="ltr"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="samples"
            />
          </div>
          <div className="admin-create-form-actions">
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={submitting}
            >
              ساخت صفحه
            </button>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={resetForm}
            >
              انصراف
            </button>
          </div>
        </form>
      )}

      <div className="admin-pages-grid">
        <div className="admin-page-card admin-page-card-system">
          <div className="admin-page-card-head">
            <h3>صفحه یافت نشد (۴۰۴)</h3>
            <span className="admin-page-status system">سیستمی</span>
          </div>
          <span className="admin-page-meta">
            نمایش داده می‌شود وقتی آدرسی در سایت پیدا نشود
          </span>
          <div className="admin-page-card-actions">
            <Link
              to="/admin/settings/not-found"
              className="admin-page-edit-link"
            >
              ویرایش
            </Link>
          </div>
        </div>

        {sortedPages.map((page, index) => (
          <div
            className={`admin-page-card ${page.enabled === false ? "disabled" : ""}`}
            key={page.id}
          >
            <div className="admin-page-card-head">
              <h3>{page.name}</h3>
              <span
                className={`admin-page-status ${page.enabled === false ? "off" : "on"}`}
              >
                {page.enabled === false ? "غیرفعال" : "فعال"}
              </span>
            </div>
            <span className="admin-page-slug">/{page.slug}</span>
            <span className="admin-page-meta">
              {page.sections?.length || 0} سکشن
            </span>
            <div className="admin-page-card-actions">
              <button
                type="button"
                className="admin-page-move-btn"
                onClick={() => handleMovePage(page, -1)}
                disabled={index === 0}
                aria-label="جابه‌جایی به بالا در منو"
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-page-move-btn"
                onClick={() => handleMovePage(page, 1)}
                disabled={index === sortedPages.length - 1}
                aria-label="جابه‌جایی به پایین در منو"
              >
                ↓
              </button>
              <Link
                to={`/admin/pages/${page.id}`}
                className="admin-page-edit-link"
              >
                ویرایش
              </Link>
              <button
                type="button"
                className="admin-page-toggle-btn"
                onClick={() => handleToggleEnabled(page)}
              >
                {page.enabled === false ? "فعال‌سازی" : "غیرفعال‌سازی"}
              </button>
              <button
                type="button"
                className="admin-page-delete-btn"
                onClick={() => handleDelete(page)}
                aria-label="حذف صفحه"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

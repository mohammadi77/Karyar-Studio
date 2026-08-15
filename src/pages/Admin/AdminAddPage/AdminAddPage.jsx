import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../../../hooks/useAppData";
import { usePagesApi } from "../../../hooks/usePagesApi";
import { useToast } from "../../../hooks/useToast";
import { slugify, validateSlug } from "../../../utils/slug";
import "./AdminAddPage.css";

function AdminAddPage() {
  const { data } = useAppData();
  const { createPage, deletePage } = usePagesApi();
  const { showToast } = useToast();
  const pages = useMemo(() => data.pages || [], [data.pages]);

  // Only show pages that are hidden from the menu (showInMenu === false)
  const hiddenPages = useMemo(
    () => pages.filter((p) => p.showInMenu === false),
    [pages],
  );

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

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
    const page = await createPage({
      name: name.trim(),
      slug: cleanSlug,
      showInMenu: false,
    });
    setSubmitting(false);
    if (page) {
      showToast("صفحه با موفقیت ساخته شد", "success");
      resetForm();
    }
  };

  const getPageUrl = (page) => {
    const base = window.location.origin;
    return page.slug ? `${base}/${page.slug}` : base;
  };

  const handleCopyLink = async (page) => {
    const url = getPageUrl(page);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(page.id);
      showToast("لینک کپی شد", "success");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast("خطا در کپی لینک", "error");
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

  return (
    <div>
      <div className="admin-addpage-header">
        <div>
          <h1>افزودن صفحه</h1>
          <p>
            صفحاتی بسازید که در منو نمایش داده نمی‌شوند و لینک آن‌ها را
            مستقیماً به اشتراک بگذارید
          </p>
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
        <form className="admin-addpage-form" onSubmit={handleCreate}>
          <div className="admin-addpage-form-field">
            <label htmlFor="addpage-name">نام صفحه</label>
            <input
              id="addpage-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: صفحه فرود تبلیغات"
            />
          </div>
          <div className="admin-addpage-form-field">
            <label htmlFor="addpage-slug">اسلاگ (آدرس صفحه)</label>
            <input
              id="addpage-slug"
              type="text"
              dir="ltr"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="landing-page"
            />
          </div>
          <div className="admin-addpage-form-actions">
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

      {hiddenPages.length === 0 && !showForm ? (
        <div className="admin-addpage-empty">
          هنوز صفحه‌ای اضافه نشده است. روی «+ صفحه جدید» کلیک کنید.
        </div>
      ) : (
        <div className="admin-addpage-list">
          {hiddenPages.map((page) => (
            <div className="admin-addpage-card" key={page.id}>
              <div className="admin-addpage-card-head">
                <h3>{page.name}</h3>
                <span className="admin-addpage-badge">خارج از منو</span>
              </div>
              <span className="admin-addpage-slug">/{page.slug}</span>
              <div className="admin-addpage-link-row">
                <input
                  type="text"
                  dir="ltr"
                  readOnly
                  value={getPageUrl(page)}
                  className="admin-addpage-link-input"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  type="button"
                  className={`admin-addpage-copy-btn ${copiedId === page.id ? "copied" : ""}`}
                  onClick={() => handleCopyLink(page)}
                >
                  {copiedId === page.id ? "کپی شد ✓" : "کپی لینک"}
                </button>
              </div>
              <div className="admin-addpage-card-actions">
                <Link
                  to={`/admin/pages/${page.id}`}
                  className="admin-addpage-edit-link"
                >
                  ویرایش
                </Link>
                <button
                  type="button"
                  className="admin-addpage-delete-btn"
                  onClick={() => handleDelete(page)}
                  aria-label="حذف صفحه"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminAddPage;

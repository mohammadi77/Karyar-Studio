import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppData } from "../../../hooks/useAppData";
import { usePagesApi } from "../../../hooks/usePagesApi";
import { useToast } from "../../../hooks/useToast";
import { sectionRegistry, sectionTypeOptions } from "../../../config/sectionRegistry";
import { customIcons } from "../../../components/CustomIcons/CustomIcons";
import PageRender from "../../../components/PageRender/PageRender";
import { slugify, validateSlug } from "../../../utils/slug";
import "./AdminPageEditor.css";

const ArrowUp = customIcons.arrow_circle_up;
const ArrowDown = customIcons.arrow_circle_down;

function newSectionId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function AdminPageEditor() {
  const { id } = useParams();
  const { data } = useAppData();

  const page = (data.pages || []).find((p) => p.id === id);

  if (!page) {
    return (
      <div>
        <p>صفحه مورد نظر پیدا نشد.</p>
        <Link to="/admin/pages" className="editor-back-link">
          بازگشت به مدیریت صفحات
        </Link>
      </div>
    );
  }

  // با تغییر id صفحه، کامپوننت زیر دوباره mount می‌شود تا state محلی از نو مقداردهی شود
  return <AdminPageEditorForm key={page.id} page={page} />;
}

function AdminPageEditorForm({ page }) {
  const { data } = useAppData();
  const { updatePage } = usePagesApi();
  const { showToast } = useToast();
  const isHome = page.slug === "";
  const otherPages = (data.pages || []).filter((p) => p.id !== page.id);

  const [sections, setSections] = useState(page.sections);
  const [name, setName] = useState(page.name);
  const [slug, setSlug] = useState(page.slug);
  const [newType, setNewType] = useState(sectionTypeOptions[0]?.type || "");
  const [saving, setSaving] = useState(false);

  const moveSection = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const next = [...sections];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setSections(next);
  };

  const toggleSectionEnabled = (section) => {
    updateSection(section.id, { ...section, enabled: section.enabled === false });
  };

  const removeSection = (sectionId) => {
    const confirmed = window.confirm("این سکشن حذف شود؟");
    if (!confirmed) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const updateSection = (sectionId, nextSection) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? nextSection : s)),
    );
  };

  const addSection = () => {
    const entry = sectionRegistry[newType];
    if (!entry) return;
    const section = {
      id: newSectionId(),
      type: newType,
      mode: "custom",
      refPageId: "",
      refSectionId: "",
      data: JSON.parse(JSON.stringify(entry.defaultData)),
    };
    setSections((prev) => [...prev, section]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("نام صفحه را وارد کنید", "error");
      return;
    }

    const patch = { sections, name: name.trim() };

    if (!isHome) {
      const cleanSlug = slugify(slug);
      const slugError = validateSlug(cleanSlug, otherPages);
      if (slugError) {
        showToast(slugError, "error");
        return;
      }
      patch.slug = cleanSlug;
    }

    const confirmed = window.confirm("آیا از ذخیره تغییرات این صفحه مطمئن هستید؟");
    if (!confirmed) return;

    setSaving(true);
    const result = await updatePage(page.id, patch);
    setSaving(false);
    if (result) {
      showToast("تغییرات ذخیره شد", "success");
    }
  };

  return (
    <div>
      <Link to="/admin/pages" className="editor-back-link">
        ← بازگشت به مدیریت صفحات
      </Link>

      <div className="editor-header">
        <div className="editor-header-fields">
          <div className="editor-header-field">
            <label htmlFor="page-name">نام صفحه</label>
            <input
              id="page-name"
              type="text"
              className="field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="editor-header-field">
            <label htmlFor="page-slug">اسلاگ (آدرس صفحه)</label>
            {isHome ? (
              <span className="editor-header-fixed-slug">/ (صفحه اصلی)</span>
            ) : (
              <input
                id="page-slug"
                type="text"
                dir="ltr"
                className="field-input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            )}
          </div>
        </div>
        <button
          type="button"
          className="editor-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>

      <div className="editor-layout">
        <div className="editor-preview">
          {sections.length === 0 ? (
            <div className="editor-preview-empty">
              هنوز سکشنی به این صفحه اضافه نشده است.
            </div>
          ) : (
            <div className="editor-preview-inner">
              <PageRender sections={sections} />
            </div>
          )}
        </div>

        <div className="editor-sidebar">
          <div className="editor-section-list">
            {sections.map((section, index) => {
              const entry = sectionRegistry[section.type];
              const isEnabled = section.enabled !== false;
              const refPage =
                section.mode === "reference" && section.refPageId
                  ? (data.pages || []).find((p) => p.id === section.refPageId)
                  : null;
              return (
                <div
                  className={`editor-section-item ${isEnabled ? "" : "disabled"}`}
                  key={section.id}
                >
                  <div className="editor-section-item-head">
                    <button
                      type="button"
                      className="editor-icon-btn"
                      onClick={() => moveSection(index, -1)}
                      disabled={index === 0}
                      aria-label="جابه‌جایی به بالا"
                    >
                      {ArrowUp && <ArrowUp />}
                    </button>
                    <button
                      type="button"
                      className="editor-icon-btn"
                      onClick={() => moveSection(index, 1)}
                      disabled={index === sections.length - 1}
                      aria-label="جابه‌جایی به پایین"
                    >
                      {ArrowDown && <ArrowDown />}
                    </button>

                    <span className="editor-section-item-title">
                      {entry?.label || section.type}
                      {refPage && (
                        <span className="editor-section-item-ref">
                          ↩ محتوا از «{refPage.name}»
                        </span>
                      )}
                    </span>

                    <Link
                      to={`/admin/sections/${section.type}`}
                      className="editor-section-item-edit-link"
                    >
                      ویرایش محتوا ←
                    </Link>

                    <button
                      type="button"
                      className={`editor-toggle-btn ${isEnabled ? "on" : "off"}`}
                      onClick={() => toggleSectionEnabled(section)}
                    >
                      {isEnabled ? "فعال" : "غیرفعال"}
                    </button>

                    <button
                      type="button"
                      className="editor-icon-btn danger"
                      onClick={() => removeSection(section.id)}
                      aria-label="حذف سکشن"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="editor-add-section">
            <h3>افزودن سکشن جدید</h3>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              {sectionTypeOptions.map((opt) => (
                <option key={opt.type} value={opt.type}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={addSection}>
              + افزودن به صفحه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPageEditor;

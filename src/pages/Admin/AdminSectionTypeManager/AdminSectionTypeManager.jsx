import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppData } from "../../../hooks/useAppData";
import { usePagesApi } from "../../../hooks/usePagesApi";
import { useToast } from "../../../hooks/useToast";
import { sectionRegistry } from "../../../config/sectionRegistry";
import SectionSourceEditor from "../../../components/Admin/SectionSourceEditor/SectionSourceEditor";
import "../AdminDashboard/AdminDashboard.css";
import "./AdminSectionTypeManager.css";

function newSectionId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function AdminSectionTypeManager() {
  const { type } = useParams();
  const { data } = useAppData();
  const { updatePage } = usePagesApi();
  const { showToast } = useToast();
  const entry = sectionRegistry[type];

  const pages = data.pages || [];
  const usedIn = pages.flatMap((page) =>
    (page.sections || [])
      .filter((section) => section.type === type)
      .map((section) => ({ page, section })),
  );
  const pagesWithout = pages.filter(
    (page) => !(page.sections || []).some((section) => section.type === type),
  );

  const [openKey, setOpenKey] = useState(null); // `${pageId}::${sectionId}`
  const [localSections, setLocalSections] = useState(null);
  const [saving, setSaving] = useState(false);
  const [addTargetPageId, setAddTargetPageId] = useState("");

  const [openPageId, openSectionId] = openKey ? openKey.split("::") : [null, null];
  const openSection = localSections?.find((s) => s.id === openSectionId) || null;
  const openPage = pages.find((p) => p.id === openPageId) || null;

  const openEntry = (pageId, sectionId) => {
    const page = pages.find((p) => p.id === pageId);
    setLocalSections(page ? [...page.sections] : []);
    setOpenKey(`${pageId}::${sectionId}`);
  };
  const closeEntry = () => {
    setOpenKey(null);
    setLocalSections(null);
  };

  const updateOpenSection = (next) => {
    setLocalSections((prev) => prev.map((s) => (s.id === openSectionId ? next : s)));
  };

  const handleSave = async () => {
    if (!openPageId || !localSections) return;
    const confirmed = window.confirm("آیا از ذخیره تغییرات این سکشن مطمئن هستید؟");
    if (!confirmed) return;
    setSaving(true);
    const result = await updatePage(openPageId, { sections: localSections });
    setSaving(false);
    if (result) {
      showToast("تغییرات ذخیره شد", "success");
    }
  };

  const handleAddToPage = async () => {
    const targetId = addTargetPageId || pagesWithout[0]?.id;
    const page = pages.find((p) => p.id === targetId);
    if (!page || !entry) return;

    const newSection = {
      id: newSectionId(),
      type,
      mode: "custom",
      refPageId: "",
      refSectionId: "",
      data: JSON.parse(JSON.stringify(entry.defaultData)),
    };
    const nextSections = [...(page.sections || []), newSection];
    const result = await updatePage(page.id, { sections: nextSections });
    if (result) {
      showToast(`«${entry.label}» به صفحه‌ی «${page.name}» اضافه شد`, "success");
      setLocalSections(nextSections);
      setOpenKey(`${page.id}::${newSection.id}`);
      setAddTargetPageId("");
    }
  };

  if (!entry) {
    return (
      <div>
        <p>نوع سکشن نامعتبر است.</p>
        <Link to="/admin/sections" className="editor-back-link">
          بازگشت به مدیریت سکشن‌ها
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/sections" className="editor-back-link">
        ← بازگشت به مدیریت سکشن‌ها
      </Link>

      <div className="admin-dashboard-header">
        <div>
          <h1>{entry.label}</h1>
          <p>مدیریت محتوای این سکشن روی همه‌ی صفحاتی که ازش استفاده می‌کنن</p>
        </div>
      </div>

      {usedIn.length === 0 ? (
        <p className="admin-empty-state">این سکشن هنوز به هیچ صفحه‌ای اضافه نشده.</p>
      ) : (
        <div className="section-type-usage-list">
          {usedIn.map(({ page, section }) => (
            <div className="section-type-usage-item" key={section.id}>
              <span className="section-type-usage-page">{page.name}</span>
              <span
                className={`section-type-usage-mode ${section.mode === "reference" ? "ref" : ""}`}
              >
                {section.mode === "reference" ? "مرجع از صفحه‌ی دیگر" : "محتوای اختصاصی"}
              </span>
              <button
                type="button"
                className="admin-page-toggle-btn"
                onClick={() => openEntry(page.id, section.id)}
              >
                ویرایش
              </button>
            </div>
          ))}
        </div>
      )}

      {pagesWithout.length > 0 && (
        <div className="section-type-add-box">
          <h3>افزودن این سکشن به یک صفحه‌ی دیگر</h3>
          <div className="section-type-add-row">
            <select
              className="field-input"
              value={addTargetPageId || pagesWithout[0].id}
              onChange={(e) => setAddTargetPageId(e.target.value)}
            >
              {pagesWithout.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button type="button" className="admin-btn-primary" onClick={handleAddToPage}>
              + افزودن به این صفحه
            </button>
          </div>
        </div>
      )}

      {openSection && openPage && (
        <div className="section-type-editor">
          <div className="section-type-editor-header">
            <h3>
              ویرایش «{entry.label}» در صفحه‌ی «{openPage.name}»
            </h3>
            <div className="section-type-editor-actions">
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
              <button type="button" className="admin-btn-secondary" onClick={closeEntry}>
                بستن
              </button>
            </div>
          </div>
          <SectionSourceEditor
            section={openSection}
            onChange={updateOpenSection}
            currentPageId={openPageId}
          />
        </div>
      )}
    </div>
  );
}

export default AdminSectionTypeManager;

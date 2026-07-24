import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../../../hooks/useAppData";
import { useResourceApi } from "../../../hooks/useResourceApi";
import { useToast } from "../../../hooks/useToast";
import SectionFieldEditor from "../../../components/Admin/SectionFieldEditor/SectionFieldEditor";
import "./AdminResourceEditor.css";

function AdminResourceEditor({ resourceKey, title }) {
  const { data } = useAppData();
  const { updateResource } = useResourceApi();
  const { showToast } = useToast();

  const [value, setValue] = useState(data[resourceKey]);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const confirmed = window.confirm("آیا از ذخیره تغییرات مطمئن هستید؟");
    if (!confirmed) return;

    setSaving(true);
    const result = await updateResource(resourceKey, value);
    setSaving(false);
    if (result) {
      showToast("تغییرات ذخیره شد", "success");
    }
  };

  return (
    <div>
      <Link to="/admin" className="editor-back-link">
        ← بازگشت به داشبورد
      </Link>

      <div className="resource-editor-header">
        <h1>{title}</h1>
        <button
          type="button"
          className="editor-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>

      <div className="resource-editor-body">
        <SectionFieldEditor data={value} onChange={setValue} />
      </div>
    </div>
  );
}

export default AdminResourceEditor;

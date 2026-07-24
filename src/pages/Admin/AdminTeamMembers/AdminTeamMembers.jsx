import { useMemo, useState } from "react";
import { useAppData } from "../../../hooks/useAppData";
import { useTeamMembersApi } from "../../../hooks/useTeamMembersApi";
import { useToast } from "../../../hooks/useToast";
import ImageField from "../../../components/Admin/ImageField/ImageField";
import "./AdminTeamMembers.css";

const emptyForm = { name: "", role: "", image: "", active: true };

function MemberForm({ value, onChange, onSubmit, onCancel, submitting, submitLabel }) {
  return (
    <form className="admin-create-form team-member-form" onSubmit={onSubmit}>
      <div className="admin-create-form-field">
        <label>نام</label>
        <input
          type="text"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          placeholder="مثلاً: مهتاب فرجی"
        />
      </div>
      <div className="admin-create-form-field">
        <label>سمت</label>
        <input
          type="text"
          value={value.role}
          onChange={(e) => onChange({ ...value, role: e.target.value })}
          placeholder="مثلاً: مدیر پروژه"
        />
      </div>
      <div className="admin-create-form-field team-member-form-image">
        <label>عکس</label>
        <ImageField
          value={value.image}
          onChange={(image) => onChange({ ...value, image })}
        />
      </div>
      <label className="team-member-active-toggle">
        <input
          type="checkbox"
          checked={value.active !== false}
          onChange={(e) => onChange({ ...value, active: e.target.checked })}
        />
        الان عضو کاریار هست
      </label>
      <div className="admin-create-form-actions">
        <button type="submit" className="admin-btn-primary" disabled={submitting}>
          {submitLabel}
        </button>
        <button type="button" className="admin-btn-secondary" onClick={onCancel}>
          انصراف
        </button>
      </div>
    </form>
  );
}

function AdminTeamMembers() {
  const { data } = useAppData();
  const { createTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembersApi();
  const { showToast } = useToast();
  const members = useMemo(() => data.teamMembers || [], [data.teamMembers]);

  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState(emptyForm);

  const resetCreateForm = () => {
    setNewMember(emptyForm);
    setShowForm(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) {
      showToast("نام عضو را وارد کنید", "error");
      return;
    }
    setSubmitting(true);
    const member = await createTeamMember(newMember);
    setSubmitting(false);
    if (member) {
      showToast("عضو جدید اضافه شد", "success");
      resetCreateForm();
    }
  };

  const startEdit = (member) => {
    setEditingId(member.id);
    setEditValue({
      name: member.name || "",
      role: member.role || "",
      image: member.image || "",
      active: member.active !== false,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editValue.name.trim()) {
      showToast("نام عضو را وارد کنید", "error");
      return;
    }
    setSubmitting(true);
    const member = await updateTeamMember(editingId, editValue);
    setSubmitting(false);
    if (member) {
      showToast("تغییرات ذخیره شد", "success");
      setEditingId(null);
    }
  };

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `«${member.name}» از لیست افراد تیم حذف شود؟ این عضو از هر سکشنی که بهش لینک شده هم حذف می‌شه.`,
    );
    if (!confirmed) return;
    const success = await deleteTeamMember(member.id);
    if (success) {
      showToast("عضو حذف شد", "success");
    }
  };

  return (
    <div>
      <div className="admin-dashboard-header">
        <div>
          <h1>افراد تیم</h1>
          <p>
            لیست مشترک اعضای تیم که سکشن‌های مختلف (مثل اسلایدر افراد یا افراد
            شرکت) می‌تونن ازش استفاده کنن
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "بستن فرم" : "+ عضو جدید"}
        </button>
      </div>

      {showForm && (
        <MemberForm
          value={newMember}
          onChange={setNewMember}
          onSubmit={handleCreate}
          onCancel={resetCreateForm}
          submitting={submitting}
          submitLabel="افزودن عضو"
        />
      )}

      {members.length === 0 ? (
        <p className="admin-empty-state">هنوز عضوی ثبت نشده است.</p>
      ) : (
        <div className="admin-pages-grid">
          {members.map((member) => (
            <div className="admin-page-card team-member-card" key={member.id}>
              {editingId === member.id ? (
                <MemberForm
                  value={editValue}
                  onChange={setEditValue}
                  onSubmit={handleUpdate}
                  onCancel={cancelEdit}
                  submitting={submitting}
                  submitLabel="ذخیره"
                />
              ) : (
                <>
                  <div className="team-member-card-head">
                    <div className="team-member-avatar">
                      {member.image ? (
                        <img src={member.image} alt="" />
                      ) : (
                        <span>{member.name?.trim()?.[0] || "?"}</span>
                      )}
                    </div>
                    <div className="team-member-card-info">
                      <h3>{member.name || "بدون نام"}</h3>
                      <span className="admin-page-meta">{member.role}</span>
                    </div>
                    <span
                      className={`admin-page-status ${member.active === false ? "off" : "on"}`}
                    >
                      {member.active === false ? "غیرفعال" : "فعال"}
                    </span>
                  </div>
                  <div className="admin-page-card-actions">
                    <button
                      type="button"
                      className="admin-page-toggle-btn"
                      onClick={() => startEdit(member)}
                    >
                      ویرایش
                    </button>
                    <button
                      type="button"
                      className="admin-page-delete-btn"
                      onClick={() => handleDelete(member)}
                      aria-label="حذف عضو"
                    >
                      ×
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminTeamMembers;

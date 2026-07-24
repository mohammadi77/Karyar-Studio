import { useState } from "react";
import { useAppData } from "../../../hooks/useAppData";
import { useResourceApi } from "../../../hooks/useResourceApi";
import { useToast } from "../../../hooks/useToast";
import ImageField from "../../../components/Admin/ImageField/ImageField";
import "./AdminProfile.css";

function AdminProfile() {
  const { data } = useAppData();
  const { updateResource } = useResourceApi();
  const { showToast } = useToast();
  const admin = data.admin || {};

  const [name, setName] = useState(admin.name || "");
  const [username, setUsername] = useState(admin.username || "");
  const [email, setEmail] = useState(admin.email || "");
  const [role, setRole] = useState(admin.role || "admin");
  const [avatar, setAvatar] = useState(admin.avatar || "");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !username.trim()) {
      showToast("نام و نام کاربری را وارد کنید", "error");
      return;
    }

    const confirmed = window.confirm("آیا از ذخیره تغییرات پروفایل مطمئن هستید؟");
    if (!confirmed) return;

    const patch = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      role,
      avatar,
    };
    if (newPassword.trim()) {
      patch.password = newPassword.trim();
    }

    setSaving(true);
    const result = await updateResource("admin", patch);
    setSaving(false);
    if (result) {
      showToast("پروفایل به‌روزرسانی شد", "success");
      setNewPassword("");
    }
  };

  return (
    <div>
      <h1 className="profile-title">پروفایل ادمین</h1>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-field">
          <label htmlFor="admin-avatar">عکس پروفایل</label>
          <ImageField value={avatar} onChange={setAvatar} />
        </div>

        <div className="profile-field">
          <label htmlFor="admin-name">نام نمایشی</label>
          <input
            id="admin-name"
            type="text"
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="profile-field">
          <label htmlFor="admin-username">نام کاربری</label>
          <input
            id="admin-username"
            type="text"
            dir="ltr"
            className="field-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="profile-field">
          <label htmlFor="admin-email">ایمیل</label>
          <input
            id="admin-email"
            type="email"
            dir="ltr"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="profile-field">
          <label htmlFor="admin-role">نقش</label>
          <select
            id="admin-role"
            className="field-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">ادمین</option>
            <option value="regular">کاربر معمولی</option>
            <option value="special">کاربر ویژه</option>
          </select>
        </div>

        <div className="profile-field">
          <label htmlFor="admin-password">رمز عبور جدید</label>
          <input
            id="admin-password"
            type="password"
            dir="ltr"
            className="field-input"
            placeholder="خالی بگذارید تا تغییر نکند"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="editor-save-btn" disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}

export default AdminProfile;

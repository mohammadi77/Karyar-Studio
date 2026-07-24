import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { customIcons } from "../../../components/CustomIcons/CustomIcons";
import { useAuth } from "../../../hooks/useAuth";
import { useAppData } from "../../../hooks/useAppData";
import { useToast } from "../../../hooks/useToast";
import "./AdminLogin.css";

const LogoIcon = customIcons.Logo;

function AdminLogin() {
  const { isAuthenticated, login } = useAuth();
  const { data } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      const adminName = data.admin?.name;
      showToast(
        adminName ? `${adminName}، خوش آمدید` : "خوش آمدید",
        "success",
      );
      navigate("/admin");
    } else {
      showToast("نام کاربری یا رمز عبور اشتباه است", "error");
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-logo">
          {LogoIcon && <LogoIcon />}
          <h1>ورود به پنل مدیریت</h1>
          <p>کاریار استودیو</p>
        </div>

        <div className="admin-login-field">
          <label htmlFor="admin-username">نام کاربری</label>
          <input
            id="admin-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="admin-login-field">
          <label htmlFor="admin-password">رمز عبور</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="admin-login-submit">
          ورود
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;

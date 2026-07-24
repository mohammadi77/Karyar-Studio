import { Link } from "react-router-dom";
import { sectionTypeOptions } from "../../../config/sectionRegistry";
import "../AdminDashboard/AdminDashboard.css";
import "./AdminSectionTypesIndex.css";

function AdminSectionTypesIndex() {
  return (
    <div>
      <div className="admin-dashboard-header">
        <div>
          <h1>مدیریت سکشن‌ها</h1>
          <p>
            هر نوع سکشن رو مستقل از هر صفحه، از همین‌جا مدیریت کن — می‌بینی
            تو کدوم صفحه‌ها استفاده شده و محتواش رو ویرایش می‌کنی
          </p>
        </div>
      </div>

      <div className="admin-pages-grid">
        {sectionTypeOptions.map(({ type, label }) => (
          <Link
            to={`/admin/sections/${type}`}
            className="admin-page-card section-type-card-link"
            key={type}
          >
            <h3>{label}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminSectionTypesIndex;

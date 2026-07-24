import { Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout/MainLayout";

import DynamicPage from "./pages/DynamicPage/DynamicPage";
import NotFound from "./pages/NotFound/NotFound";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import { usePageLoading } from "./hooks/usePageLoading";

import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import AdminOverview from "./pages/Admin/AdminOverview/AdminOverview";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminTeamMembers from "./pages/Admin/AdminTeamMembers/AdminTeamMembers";
import AdminPageEditor from "./pages/Admin/AdminPageEditor/AdminPageEditor";
import AdminSectionTypesIndex from "./pages/Admin/AdminSectionTypesIndex/AdminSectionTypesIndex";
import AdminSectionTypeManager from "./pages/Admin/AdminSectionTypeManager/AdminSectionTypeManager";
import AdminResourceEditor from "./pages/Admin/AdminResourceEditor/AdminResourceEditor";
import AdminIconLibrary from "./pages/Admin/AdminIconLibrary/AdminIconLibrary";
import AdminProfile from "./pages/Admin/AdminProfile/AdminProfile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const pageLoading = usePageLoading();

  if (pageLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* صفحه اصلی */}
        <Route index element={<DynamicPage slug="" />} />
        <Route path=":slug" element={<DynamicPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="pages" element={<AdminDashboard />} />
        <Route path="team" element={<AdminTeamMembers />} />
        <Route path="pages/:id" element={<AdminPageEditor />} />
        <Route path="sections" element={<AdminSectionTypesIndex />} />
        <Route path="sections/:type" element={<AdminSectionTypeManager />} />
        <Route
          path="settings/navbar"
          element={
            <AdminResourceEditor resourceKey="navbar" title="ناوبری و لوگو" />
          }
        />
        <Route
          path="settings/not-found"
          element={
            <AdminResourceEditor
              resourceKey="notFound"
              title="صفحه یافت نشد (۴۰۴)"
            />
          }
        />
        <Route path="settings/icons" element={<AdminIconLibrary />} />
        <Route path="settings/profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}

export default App;

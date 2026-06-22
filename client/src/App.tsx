import { Routes, Route } from "react-router-dom";
import { CustomerRoute, AdminRoute, PublicOnlyRoute } from "./components/ProtectedRoute";
import { useI18n } from "./context/LanguageContext";
import PublicLayout from "./layouts/PublicLayout";
import CustomerLayout from "./layouts/CustomerLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DestinationsPage from "./pages/DestinationsPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import PathwayDetailPage from "./pages/PathwayDetailPage";
import CoursesPage from "./pages/CoursesPage";
import ProceduresPage from "./pages/ProceduresPage";
import DashboardPage from "./pages/DashboardPage";
import ProcedureDetailPage from "./pages/ProcedureDetailPage";
import NotificationsPage from "./pages/NotificationsPage";
import CustomerProfilePage from "./pages/customer/CustomerProfilePage";
import CustomerCoursePage from "./pages/customer/CustomerCoursePage";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFinancePage from "./pages/admin/AdminFinancePage";
import AdminProcedures from "./pages/admin/AdminProcedures";
import AdminProcedureDetailPage from "./pages/admin/AdminProcedureDetailPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  const { isFrench } = useI18n();
  const copy = isFrench
    ? {
        notFound: "Page introuvable",
      }
    : {
        notFound: "Page not found",
      };

  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:id" element={<DestinationDetailPage />} />
        <Route path="/destinations/:id/pathways/:pathwaySlug" element={<PathwayDetailPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/procedures" element={<ProceduresPage />} />
      </Route>

      {/* Protected (logged in) */}
      <Route element={<CustomerRoute />}>
        <Route path="/dashboard" element={<CustomerLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="new-application" element={<ProceduresPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="procedures/:id" element={<ProcedureDetailPage />} />
          <Route path="courses/:id" element={<CustomerCoursePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="procedures" element={<AdminProcedures />} />
          <Route path="procedures/:id" element={<AdminProcedureDetailPage />} />
          <Route path="finance" element={<AdminFinancePage />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-6xl font-heading font-bold text-gray-300">404</h1>
            <p className="text-gray-500 mt-2">{copy.notFound}</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

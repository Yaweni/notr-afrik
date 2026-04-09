import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DestinationsPage from "./pages/DestinationsPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import CoursesPage from "./pages/CoursesPage";
import ProceduresPage from "./pages/ProceduresPage";
import DashboardPage from "./pages/DashboardPage";
import ProcedureDetailPage from "./pages/ProcedureDetailPage";
import NotificationsPage from "./pages/NotificationsPage";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFinancePage from "./pages/admin/AdminFinancePage";
import AdminProcedures from "./pages/admin/AdminProcedures";
import AdminProcedureDetailPage from "./pages/admin/AdminProcedureDetailPage";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEnrollments from "./pages/admin/AdminEnrollments";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/procedures" element={<ProceduresPage />} />

          {/* Protected (logged in) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/procedures/:id" element={<ProcedureDetailPage />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="procedures" element={<AdminProcedures />} />
              <Route path="procedures/:id" element={<AdminProcedureDetailPage />} />
              <Route path="finance" element={<AdminFinancePage />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="enrollments" element={<AdminEnrollments />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <h1 className="text-6xl font-heading font-bold text-gray-300">404</h1>
                <p className="text-gray-500 mt-2">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

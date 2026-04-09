import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, BookOpen, Wallet } from "lucide-react";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/admin/procedures", icon: FileText, label: "Procedures" },
  { to: "/admin/finance", icon: Wallet, label: "Finance" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/enrollments", icon: BookOpen, label: "Enrollments" },
];

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Manage procedures, finance, users, and content</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <nav className="lg:w-56 flex-shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto">
              {links.map(({ to, icon: Icon, label, exact }) => {
                const active = exact ? pathname === to : pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                      active ? "bg-amber-100 text-amber-800" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

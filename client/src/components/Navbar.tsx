import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useUnreadCount } from "../hooks/useApi";
import {
  Menu,
  X,
  Bell,
  LogOut,
  User,
  LayoutDashboard,
  Globe,
  BookOpen,
  Shield,
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const { data: unread } = useUnreadCount();
  const unreadCount = isAuthenticated ? unread?.count ?? 0 : 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cameroon-green to-cameroon-yellow flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-gray-900 hidden sm:block">
              Immigration<span className="text-cameroon-green">CM</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              Home
            </Link>
            <Link to="/destinations" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              Destinations
            </Link>
            <Link to="/courses" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              Courses
            </Link>
            <Link to="/procedures" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              Services
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/notifications"
                  className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-cameroon-red text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link to="/destinations" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              Destinations
            </Link>
            <Link to="/courses" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              Courses
            </Link>
            <Link to="/procedures" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              Services
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

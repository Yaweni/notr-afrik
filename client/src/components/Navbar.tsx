import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/LanguageContext";
import { useUnreadCount } from "../hooks/useApi";
import {
  Menu,
  X,
  Bell,
  LogOut,
  LayoutDashboard,
  Globe,
  Shield,
  Languages,
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { language, setLanguage, isFrench } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const { data: unread } = useUnreadCount(isAuthenticated && !isLoading);
  const unreadCount = isAuthenticated ? unread?.count ?? 0 : 0;

  const copy = isFrench
    ? {
        home: "Accueil",
        destinations: "Destinations",
        courses: "Cours",
        services: "Parcours",
        dashboard: "Tableau de bord",
        admin: "Admin",
        login: "Connexion",
        signup: "Inscription",
        logout: "Deconnexion",
        language: "Langue",
      }
    : {
        home: "Home",
        destinations: "Destinations",
        courses: "Courses",
        services: "Journeys",
        dashboard: "Dashboard",
        admin: "Admin",
        login: "Log In",
        signup: "Sign Up",
        logout: "Logout",
        language: "Language",
      };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const languageToggle = (
    <div className="hidden sm:flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm">
      <div className="flex items-center gap-1 px-2 text-xs font-semibold text-gray-500">
        <Languages className="w-3.5 h-3.5" />
        {copy.language}
      </div>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${language === "en" ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${language === "fr" ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
      >
        FR
      </button>
    </div>
  );

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
              {copy.home}
            </Link>
            <Link to="/destinations" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              {copy.destinations}
            </Link>
            <Link to="/courses" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              {copy.courses}
            </Link>
            <Link to="/procedures" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              {copy.services}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {languageToggle}

            {isLoading ? (
              <div className="hidden sm:block h-10 w-28 rounded-xl bg-gray-100 animate-pulse" />
            ) : isAuthenticated ? (
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
                  <span className="hidden sm:inline">{copy.dashboard}</span>
                </Link>

                {(user?.role === "admin" || user?.role === "staff") && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">{copy.admin}</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={copy.logout}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">
                  {copy.login}
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
                  {copy.signup}
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
              {copy.home}
            </Link>
            <Link to="/destinations" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              {copy.destinations}
            </Link>
            <Link to="/courses" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              {copy.courses}
            </Link>
            <Link to="/procedures" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              {copy.services}
            </Link>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 mt-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{copy.language}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${language === "en" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("fr")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${language === "fr" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  FR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

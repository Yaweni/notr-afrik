import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/LanguageContext";
import { useUnreadCount } from "../hooks/useApi";
import ThemeToggle from "./ThemeToggle";
import NotrAfrikLogo from "./NotrAfrikLogo";
import {
  Menu,
  X,
  Bell,
  LogOut,
  LayoutDashboard,
  Shield,
  Languages,
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { language, setLanguage, isFrench } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const portalHome = user?.role === "admin" || user?.role === "staff" ? "/admin" : "/dashboard";

  const { data: unread } = useUnreadCount(isAuthenticated && !isLoading);
  const unreadCount = isAuthenticated ? unread?.count ?? 0 : 0;

  const copy = isFrench
    ? {
        home: "Accueil",
        destinations: "Destinations",
        courses: "Cours",
        services: "Services",
        dashboard: "Tableau de bord",
        admin: "Admin",
        login: "Connexion",
        signup: "Inscription",
        logout: "Deconnexion",
        language: "Langue",
        theme: "Theme",
      }
    : {
        home: "Home",
        destinations: "Destinations",
        courses: "Courses",
        services: "Services",
        dashboard: "Dashboard",
        admin: "Admin",
        login: "Log In",
        signup: "Sign Up",
        logout: "Logout",
        language: "Language",
        theme: "Theme",
      };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  const languageToggle = (
    <div className="hidden sm:flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
      <div className="flex items-center gap-1 px-2 text-xs font-semibold text-muted-foreground">
        <Languages className="w-3.5 h-3.5" />
        {copy.language}
      </div>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${language === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
      >
        FR
      </button>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? portalHome : "/"} className="flex items-center gap-2">
            <NotrAfrikLogo className="h-10 w-auto" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {!isAuthenticated && (
              <>
            <Link to="/" className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
              {copy.home}
            </Link>
            <Link to="/destinations" className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
              {copy.destinations}
            </Link>
            <Link to="/courses" className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
              {copy.courses}
            </Link>
            <Link to="/procedures" className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
              {copy.services}
            </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {languageToggle}
            <ThemeToggle className="hidden sm:inline-flex" />

            {isLoading ? (
              <div className="hidden h-10 w-28 animate-pulse rounded-xl bg-muted sm:block" />
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/notifications"
                  className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
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
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">{copy.dashboard}</span>
                </Link>

                {(user?.role === "admin" || user?.role === "staff") && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-200 dark:hover:bg-amber-900/30"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">{copy.admin}</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
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
            {!isAuthenticated && (
              <button
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
              {copy.home}
            </Link>
            <Link to="/destinations" className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
              {copy.destinations}
            </Link>
            <Link to="/courses" className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
              {copy.courses}
            </Link>
            <Link to="/procedures" className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
              {copy.services}
            </Link>
            <div className="mt-3 space-y-3 border-t border-border px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.language}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("fr")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${language === "fr" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    FR
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.theme}</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

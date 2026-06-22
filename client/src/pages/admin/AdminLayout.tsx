import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, FileText, Wallet, LogOut,
  ShieldCheck, UserCircle2, ChevronLeft, ChevronRight,
  Menu, SunMedium, MoonStar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim().toUpperCase() || "AD";
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isFrench } = useI18n();
  const { isDark, toggleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem("admin-sidebar-collapsed") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const copy = isFrench
    ? {
        appName: "NOTR-AFRIK",
        dashboard: "Tableau de bord",
        procedures: "Dossiers",
        finance: "Finances",
        users: "Clients",
        profile: "Profil",
        access: "Admin",
        logout: "Déconnexion",
        darkMode: isDark ? "Mode clair" : "Mode sombre",
        menu: "Menu",
      }
    : {
        appName: "NOTR-AFRIK",
        dashboard: "Dashboard",
        procedures: "Procedures",
        finance: "Finance",
        users: "Users",
        profile: "Profile",
        access: "Admin",
        logout: "Logout",
        darkMode: isDark ? "Light mode" : "Dark mode",
        menu: "Menu",
      };

  const links = [
    { to: "/admin",            icon: LayoutDashboard, label: copy.dashboard,  exact: true },
    { to: "/admin/procedures", icon: FileText,         label: copy.procedures },
    { to: "/admin/finance",    icon: Wallet,           label: copy.finance },
    { to: "/admin/users",      icon: Users,            label: copy.users },
    { to: "/admin/profile",    icon: UserCircle2,      label: copy.profile },
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  /* ── shared sidebar body ── */
  const renderSidebar = (mobile: boolean) => (
    <div className="flex h-full flex-col overflow-hidden">

      {/* header row */}
      <div className={cn(
        "relative flex h-14 shrink-0 items-center border-b border-sidebar-border px-4",
        !mobile && collapsed && "justify-center",
      )}>
        <div className={cn("flex min-w-0 items-center gap-3", !mobile && !collapsed && "pr-8") }>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/20">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <span className={cn(
            "font-heading text-sm font-bold text-sidebar-foreground whitespace-nowrap overflow-hidden transition-all duration-300",
            !mobile && collapsed ? "w-0 opacity-0" : "flex-1 opacity-100",
          )}>
            {copy.appName}
          </span>
        </div>
        {!mobile && (
          <button
            type="button"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
              collapsed ? "right-1.5" : "right-3"
            )}
          >
            {collapsed
              ? <ChevronRight className="h-4 w-4" />
              : <ChevronLeft className="h-4 w-4" />
            }
          </button>
        )}
      </div>

      {/* user strip */}
      <div className={cn("px-3 py-3 shrink-0", !mobile && collapsed && "px-2")}>
        <div className={cn(
          "flex items-center gap-3 rounded-xl bg-sidebar-accent/40 p-2.5",
          !mobile && collapsed && "justify-center",
        )}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className={cn(
            "min-w-0 overflow-hidden transition-all duration-300",
            !mobile && collapsed ? "w-0 opacity-0" : "flex-1 opacity-100",
          )}>
            <p className="truncate text-sm font-semibold text-sidebar-foreground leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <Badge variant="outline" className="mt-0.5 h-4 px-1.5 text-[10px] border-sidebar-border text-sidebar-foreground/60">
              {copy.access}
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border shrink-0" />

      {/* nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {links.map(({ to, icon: Icon, label, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          const item = (
            <Link
              key={to}
              to={to}
              onClick={() => mobile && setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150",
                !mobile && collapsed && "justify-center px-2.5",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className={cn(
                "overflow-hidden transition-all duration-300",
                !mobile && collapsed ? "w-0 opacity-0" : "flex-1 opacity-100",
              )}>
                {label}
              </span>
              {active && (!collapsed || mobile) && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              )}
            </Link>
          );

          if (!mobile && collapsed) {
            return (
              <Tooltip key={to} delayDuration={0}>
                <TooltipTrigger asChild>{item}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            );
          }
          return item;
        })}
      </nav>

      <Separator className="bg-sidebar-border shrink-0" />

      {/* footer: theme + logout */}
      <div className={cn("p-2 pb-3 shrink-0 space-y-0.5", !mobile && collapsed && "items-center")}>
        {/* theme toggle */}
        {(!mobile && collapsed) ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center justify-center rounded-xl p-2.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              >
                {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{copy.darkMode}</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            {isDark ? <SunMedium className="h-4 w-4 shrink-0" /> : <MoonStar className="h-4 w-4 shrink-0" />}
            <span className={cn(
              "overflow-hidden transition-all duration-300",
              !mobile && collapsed ? "w-0 opacity-0" : "opacity-100",
            )}>
              {copy.darkMode}
            </span>
          </button>
        )}

        {/* logout */}
        {(!mobile && collapsed) ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center rounded-xl p-2.5 text-sidebar-foreground/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{copy.logout}</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className={cn(
              "overflow-hidden transition-all duration-300",
              !mobile && collapsed ? "w-0 opacity-0" : "opacity-100",
            )}>
              {copy.logout}
            </span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">

        {/* ── desktop sidebar ── */}
        <aside className={cn(
          "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar/95 shadow-sm backdrop-blur-xl",
          "transition-[width] duration-300 ease-in-out overflow-hidden shrink-0",
          collapsed ? "w-[72px]" : "w-64",
        )}>
          {renderSidebar(false)}
        </aside>

        {/* ── mobile sheet sidebar ── */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 border-r border-sidebar-border bg-sidebar/95 p-0 backdrop-blur-xl">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            {renderSidebar(true)}
          </SheetContent>
        </Sheet>

        {/* ── main area ── */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

          {/* mobile topbar */}
          <header className="lg:hidden flex items-center gap-3 border-b border-border bg-card/80 backdrop-blur-sm px-4 h-14 shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={copy.menu}
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <span className="font-heading text-sm font-bold">{copy.appName}</span>
            </div>
          </header>

          {/* page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8 max-w-screen-xl mx-auto animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

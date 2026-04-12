import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell, BookOpen, ChevronRight, FileText,
  LayoutDashboard, LogOut, UserCircle2, Menu,
  SunMedium, MoonStar, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useMyEnrollments, useMyProcedures } from "../hooks/useApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim().toUpperCase() || "CU";
}

export default function CustomerLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isFrench } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  const { data: procedures, isLoading: proceduresLoading } = useMyProcedures();
  const { data: enrollments, isLoading: enrollmentsLoading } = useMyEnrollments();

  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem("customer-sidebar-collapsed") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("customer-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const copy = isFrench
    ? {
        appName: "ImmoCM",
        overview: "Vue d'ensemble",
        profile: "Mon profil",
        journeys: "Mes parcours",
        courses: "Mes cours",
        notifications: "Notifications",
        noJourneys: "Aucun parcours actif",
        noCourses: "Aucun cours actif",
        loading: "Chargement...",
        logout: "Déconnexion",
        portal: "Portail client",
        darkMode: isDark ? "Mode clair" : "Mode sombre",
        menu: "Menu",
      }
    : {
        appName: "ImmoCM",
        overview: "Overview",
        profile: "My Profile",
        journeys: "My Journeys",
        courses: "My Courses",
        notifications: "Notifications",
        noJourneys: "No active journeys",
        noCourses: "No active courses",
        loading: "Loading...",
        logout: "Logout",
        portal: "Customer Portal",
        darkMode: isDark ? "Light mode" : "Dark mode",
        menu: "Menu",
      };

  const baseLinks = [
    { to: "/dashboard",              label: copy.overview,       icon: LayoutDashboard, exact: true },
    { to: "/dashboard/profile",      label: copy.profile,        icon: UserCircle2 },
    { to: "/dashboard/notifications", label: copy.notifications, icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const renderSidebar = (mobile: boolean) => (
    <div className="flex h-full flex-col overflow-hidden">

      {/* header */}
      <div className={cn(
        "relative flex h-14 shrink-0 items-center border-b border-sidebar-border px-4",
        !mobile && collapsed && "justify-center",
      )}>
        <div className={cn("flex min-w-0 items-center gap-3", !mobile && !collapsed && "pr-8") }>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/20">
            <LayoutDashboard className="h-4 w-4 text-primary" />
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
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
              {copy.portal}
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border shrink-0" />

      {/* primary nav */}
      <nav className="shrink-0 px-2 pt-3 pb-1 space-y-0.5">
        {baseLinks.map(({ to, label, icon: Icon, exact }) => {
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

      {/* journeys section (hidden when collapsed) */}
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        !mobile && collapsed ? "h-0 opacity-0" : "opacity-100",
      )}>
        <Separator className="bg-sidebar-border mx-2 my-2 w-auto" />
        <div className="px-4 pb-1">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            <FileText className="h-3 w-3" />
            {copy.journeys}
          </div>
          <div className="space-y-0.5">
            {proceduresLoading ? (
              <p className="px-2 py-1 text-xs text-sidebar-foreground/40">{copy.loading}</p>
            ) : procedures && procedures.length > 0 ? (
              procedures.map((procedure) => {
                const active = pathname === `/dashboard/procedures/${procedure.id}`;
                return (
                  <Link
                    key={procedure.id}
                    to={`/dashboard/procedures/${procedure.id}`}
                    onClick={() => mobile && setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-colors",
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{procedure.procedureType.name}</div>
                      <div className="truncate text-sidebar-foreground/40">{procedure.destination.name}</div>
                    </div>
                    <ChevronRight className="h-3 w-3 shrink-0" />
                  </Link>
                );
              })
            ) : (
              <p className="px-2 py-1 text-xs text-sidebar-foreground/40">{copy.noJourneys}</p>
            )}
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            <BookOpen className="h-3 w-3" />
            {copy.courses}
          </div>
          <div className="space-y-0.5">
            {enrollmentsLoading ? (
              <p className="px-2 py-1 text-xs text-sidebar-foreground/40">{copy.loading}</p>
            ) : enrollments && enrollments.length > 0 ? (
              enrollments.map((enrollment) => {
                const active = pathname === `/dashboard/courses/${enrollment.course.id}`;
                return (
                  <Link
                    key={enrollment.id}
                    to={`/dashboard/courses/${enrollment.course.id}`}
                    onClick={() => mobile && setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-colors",
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{enrollment.course.title}</div>
                      <div className="truncate text-sidebar-foreground/40">{enrollment.course.language} {enrollment.course.level}</div>
                    </div>
                    <ChevronRight className="h-3 w-3 shrink-0" />
                  </Link>
                );
              })
            ) : (
              <p className="px-2 py-1 text-xs text-sidebar-foreground/40">{copy.noCourses}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <Separator className="bg-sidebar-border shrink-0" />

      {/* footer */}
      <div className={cn("p-2 pb-3 shrink-0 space-y-0.5", !mobile && collapsed && "items-center")}>
        {(!mobile && collapsed) ? (
          <>
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
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            >
              {isDark ? <SunMedium className="h-4 w-4 shrink-0" /> : <MoonStar className="h-4 w-4 shrink-0" />}
              {copy.darkMode}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {copy.logout}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">

        {/* desktop sidebar */}
        <aside className={cn(
          "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar/95 shadow-sm backdrop-blur-xl",
          "transition-[width] duration-300 ease-in-out overflow-hidden shrink-0",
          collapsed ? "w-[72px]" : "w-64",
        )}>
          {renderSidebar(false)}
        </aside>

        {/* mobile sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 overflow-y-auto border-r border-sidebar-border bg-sidebar/95 p-0 backdrop-blur-xl">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            {renderSidebar(true)}
          </SheetContent>
        </Sheet>

        {/* main area */}
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
                <LayoutDashboard className="h-4 w-4 text-primary" />
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


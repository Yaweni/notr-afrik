import { Link } from "react-router-dom";
import { ArrowRight, Bell, BookOpen, Clock3, FileText, Sparkles } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/LanguageContext";
import { useMyEnrollments, useMyProcedures, useNotifications } from "@/hooks/useApi";

export default function DashboardPage() {
  const { user } = useAuth();
  const { isFrench, formatCurrency, formatDate, formatNumber } = useI18n();
  const { data: procedures, isLoading: procLoading } = useMyProcedures();
  const { data: enrollments, isLoading: enrLoading } = useMyEnrollments();
  const { data: notifications } = useNotifications();

  const copy = isFrench
    ? {
        welcome: "Bon retour",
        overview: "Voici une vue d'ensemble de votre projet d'immigration.",
        subtitle: "Gardez un oeil sur vos dossiers, vos cours et les prochaines actions importantes.",
        activeProcedures: "Parcours actifs",
        enrollments: "Inscriptions aux cours",
        unreadNotifications: "Notifications non lues",
        myProcedures: "Mes parcours",
        newApplication: "Nouveau dossier",
        paidOf: "Paye {paid} sur {total}",
        latest: "Derniere mise a jour : {message}",
        noProcedures: "Aucun parcours pour le moment.",
        startOne: "Commencer",
        myCourses: "Mes cours",
        browseCourses: "Voir les cours",
        noEnrollments: "Aucune inscription pour le moment.",
        enrolled: "Inscrit",
        inProgress: "En cours",
        completed: "Termine",
        dropped: "Abandonne",
      }
    : {
        welcome: "Welcome back",
        overview: "Here's an overview of your immigration journey.",
        subtitle: "Keep your cases, courses, and next actions in view from one place.",
        activeProcedures: "Active Procedures",
        enrollments: "Course Enrollments",
        unreadNotifications: "Unread Notifications",
        myProcedures: "My Procedures",
        newApplication: "New application",
        paidOf: "Paid {paid} of {total}",
        latest: "Latest: {message}",
        noProcedures: "No procedures yet.",
        startOne: "Start one",
        myCourses: "My Courses",
        browseCourses: "Browse courses",
        noEnrollments: "No enrollments yet.",
        enrolled: "Enrolled",
        inProgress: "In Progress",
        completed: "Completed",
        dropped: "Dropped",
      };

  const unreadNotifs = notifications?.filter((notification) => !notification.isRead).length ?? 0;
  const getTotalPaid = (procedure: { payments?: Array<{ amount: number }> }) =>
    (procedure.payments ?? []).reduce((sum, payment) => sum + payment.amount, 0);
  const procedureRows = procedures ?? [];
  const enrollmentRows = enrollments ?? [];

  const enrollmentLabels = {
    enrolled: copy.enrolled,
    in_progress: copy.inProgress,
    completed: copy.completed,
    dropped: copy.dropped,
  };

  if (procLoading || enrLoading) return <LoadingSpinner />;

  const cards = [
    {
      icon: FileText,
      label: copy.activeProcedures,
      value: formatNumber(procedureRows.length),
      gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: BookOpen,
      label: copy.enrollments,
      value: formatNumber(enrollmentRows.length),
      gradient: "from-emerald-500/20 via-emerald-600/10 to-transparent",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Bell,
      label: copy.unreadNotifications,
      value: formatNumber(unreadNotifs),
      gradient: "from-primary/20 via-primary/10 to-transparent",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {copy.welcome}, {user?.firstName}!
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/dashboard/new-application">{copy.newApplication}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/courses">{copy.browseCourses}</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ icon: Icon, label, value, gradient, iconBg, iconColor }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">{value}</p>
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">{copy.myProcedures}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{copy.overview}</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary">
              <Link to="/dashboard/new-application">
                {copy.newApplication}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {procedureRows.length > 0 ? (
            <div className="space-y-4 p-6">
              {procedureRows.map((procedure) => (
                <Link
                  to={`/dashboard/procedures/${procedure.id}`}
                  key={procedure.id}
                  className="block rounded-2xl border border-border bg-background/70 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">{procedure.procedureType.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{procedure.destination.name}</span>
                        <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{formatDate(procedure.createdAt)}</span>
                      </div>
                    </div>
                    <StatusBadge status={procedure.status} />
                  </div>

                  <div className="mt-4 text-sm font-medium text-muted-foreground">
                    {copy.paidOf
                      .replace("{paid}", formatCurrency(getTotalPaid(procedure), procedure.currency))
                      .replace("{total}", formatCurrency(procedure.agreedPrice, procedure.currency))}
                  </div>

                  {procedure.updates.length > 0 && (
                    <div className="mt-4 rounded-xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                      {copy.latest.replace("{message}", procedure.updates[0].message)}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-muted-foreground">{copy.noProcedures}</p>
              <Button asChild className="mt-4">
                <Link to="/dashboard/new-application">{copy.startOne}</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">{copy.myCourses}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{copy.browseCourses}</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary">
              <Link to="/courses">
                {copy.browseCourses}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {enrollmentRows.length > 0 ? (
            <div className="space-y-4 p-6">
              {enrollmentRows.map((enrollment) => {
                const badgeConfig = enrollment.status === "completed"
                  ? { variant: "success" as const, className: "" }
                  : enrollment.status === "in_progress"
                    ? { variant: "warning" as const, className: "border-primary/20 bg-primary/15 text-primary" }
                    : enrollment.status === "dropped"
                      ? { variant: "outline" as const, className: "border-red-200 bg-red-100 text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-300" }
                      : { variant: "info" as const, className: "" };

                return (
                  <div key={enrollment.id} className="rounded-2xl border border-border bg-background/70 p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">{enrollment.course.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>{enrollment.course.language} {enrollment.course.level}</span>
                          {enrollment.course.destination?.name && <span>{enrollment.course.destination.name}</span>}
                          {enrollment.course.schedule && <span>{enrollment.course.schedule}</span>}
                        </div>
                      </div>
                      <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
                        {enrollmentLabels[enrollment.status]}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-muted-foreground">{copy.noEnrollments}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/courses">{copy.browseCourses}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

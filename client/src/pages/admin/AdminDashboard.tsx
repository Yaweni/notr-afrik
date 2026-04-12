import { useAdminStats } from "../../hooks/useApi";
import { Users, FileText, Clock, TrendingUp } from "lucide-react";
import { useI18n } from "../../context/LanguageContext";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();
  const { isFrench, formatDate, formatNumber } = useI18n();

  if (isLoading) return <LoadingSpinner />;
  if (!stats) return null;

  const copy = isFrench
    ? {
        totalCustomers: "Clients",
        totalProcedures: "Dossiers",
        pendingProcedures: "En attente",
        recentProcedures: "Derniers dossiers",
        client: "Client",
        service: "Service",
        destination: "Destination",
        status: "Statut",
        date: "Date",
        activity: "Activité récente",
      }
    : {
        totalCustomers: "Customers",
        totalProcedures: "Procedures",
        pendingProcedures: "Pending",
        recentProcedures: "Recent Procedures",
        client: "Client",
        service: "Service",
        destination: "Destination",
        status: "Status",
        date: "Date",
        activity: "Recent Activity",
      };

  const cards = [
    {
      icon: Users,
      label: copy.totalCustomers,
      value: formatNumber(stats.totalUsers),
      gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: FileText,
      label: copy.totalProcedures,
      value: formatNumber(stats.totalProcedures),
      gradient: "from-violet-500/20 via-violet-600/10 to-transparent",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: Clock,
      label: copy.pendingProcedures,
      value: formatNumber(stats.pendingProcedures),
      gradient: "from-primary/20 via-primary/10 to-transparent",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
  ];

  return (
    <div>
      {/* page heading */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {isFrench ? "Tableau de bord" : "Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isFrench ? "Vue globale de l'activité" : "Office activity at a glance"}
          </p>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {cards.map(({ icon: Icon, label, value, gradient, iconBg, iconColor }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* gradient accent */}
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 font-heading text-3xl font-bold text-foreground tracking-tight">{value}</p>
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* recent procedures table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-heading text-base font-semibold text-foreground">{copy.recentProcedures}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.client}</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.service}</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">{copy.destination}</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.status}</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">{copy.date}</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProcedures.map((p, i) => (
                <tr
                  key={p.id}
                  className={`transition-colors hover:bg-muted/30 ${i !== stats.recentProcedures.length - 1 ? "border-b border-border" : ""}`}
                >
                  <td className="px-6 py-3.5 font-medium text-foreground">
                    {p.user?.firstName} {p.user?.lastName}
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground">{p.procedureType.name}</td>
                  <td className="px-6 py-3.5 text-muted-foreground hidden md:table-cell">{p.destination.name}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-3.5 text-muted-foreground hidden sm:table-cell">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



import { FolderKanban, ShieldCheck, UserRound, Users2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/context/LanguageContext";
import { useAdminUsers } from "@/hooks/useApi";

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim().toUpperCase() || "NA";
}

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();
  const { isFrench, formatDate, formatNumber } = useI18n();

  if (isLoading) return <LoadingSpinner />;

  const copy = isFrench
    ? {
        title: "Tous les clients",
        subtitle: "Suivez la base clients, les roles internes et la charge dossier.",
        directory: "Repertoire clients",
        name: "Nom",
        email: "Email",
        phone: "Telephone",
        role: "Role",
        procedures: "Dossiers",
        joined: "Inscrit le",
        noPhone: "Non renseigne",
        customer: "Client",
        admin: "Admin",
        staff: "Equipe",
        totalUsers: "Utilisateurs",
        internalTeam: "Equipe interne",
        trackedProcedures: "Dossiers suivis",
        records: "fiches",
        noUsers: "Aucun utilisateur a afficher.",
      }
    : {
        title: "All Users",
        subtitle: "Track client records, internal roles, and procedure load.",
        directory: "User Directory",
        name: "Name",
        email: "Email",
        phone: "Phone",
        role: "Role",
        procedures: "Procedures",
        joined: "Joined",
        noPhone: "Not provided",
        customer: "Customer",
        admin: "Admin",
        staff: "Staff",
        totalUsers: "Users",
        internalTeam: "Internal Team",
        trackedProcedures: "Tracked Procedures",
        records: "records",
        noUsers: "No users to display.",
      };

  const roleLabels = {
    customer: copy.customer,
    admin: copy.admin,
    staff: copy.staff,
  };

  const allUsers = users ?? [];
  const customerCount = allUsers.filter((user) => user.role === "customer").length;
  const internalCount = allUsers.filter((user) => user.role !== "customer").length;
  const procedureCount = allUsers.reduce((sum, user) => sum + (user._count?.procedures ?? 0), 0);

  const cards = [
    {
      icon: Users2,
      label: copy.totalUsers,
      value: formatNumber(allUsers.length),
      gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: UserRound,
      label: copy.customer,
      value: formatNumber(customerCount),
      gradient: "from-primary/20 via-primary/10 to-transparent",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
    {
      icon: ShieldCheck,
      label: copy.internalTeam,
      value: formatNumber(internalCount),
      gradient: "from-violet-500/20 via-violet-600/10 to-transparent",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: FolderKanban,
      label: copy.trackedProcedures,
      value: formatNumber(procedureCount),
      gradient: "from-emerald-500/20 via-emerald-600/10 to-transparent",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
          <Users2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{copy.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-heading text-base font-semibold text-foreground">{copy.directory}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{formatNumber(allUsers.length)} {copy.records}</p>
        </div>

        {allUsers.length === 0 ? (
          <div className="px-6 py-14 text-center text-sm text-muted-foreground">{copy.noUsers}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.name}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.phone}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.role}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.procedures}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.joined}</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user, index) => {
                  const roleBadge = user.role === "admin"
                    ? { variant: "warning" as const, className: "border-primary/20 bg-primary/15 text-primary" }
                    : user.role === "staff"
                      ? { variant: "outline" as const, className: "bg-secondary/60" }
                      : { variant: "info" as const, className: "" };

                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors hover:bg-muted/20 ${index !== allUsers.length - 1 ? "border-b border-border" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-foreground">{user.firstName} {user.lastName}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{user.phone || copy.noPhone}</td>
                      <td className="px-6 py-4">
                        <Badge variant={roleBadge.variant} className={roleBadge.className}>{roleLabels[user.role]}</Badge>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{formatNumber(user._count?.procedures ?? 0)}</td>
                      <td className="px-6 py-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { BookOpenText, FileBadge2, Mail, Phone, ShieldCheck, UserCircle2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AccountSettingsPanel from "@/components/AccountSettingsPanel";
import ProfileDocumentsPanel from "@/components/ProfileDocumentsPanel";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/LanguageContext";
import { useMyEnrollments, useMyProcedures, useProfileDocuments } from "@/hooks/useApi";

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const { isFrench, formatDate, formatNumber } = useI18n();
  const { data: procedures, isLoading: proceduresLoading } = useMyProcedures();
  const { data: enrollments, isLoading: enrollmentsLoading } = useMyEnrollments();
  const { data: profileDocuments, isLoading: profileDocumentsLoading } = useProfileDocuments();

  const copy = isFrench
    ? {
        title: "Mon profil",
        subtitle: "Cette fiche centralise vos informations reutilisables a travers vos differents dossiers.",
        contact: "Coordonnees",
        reusableRecord: "Fiche reutilisable",
        activeJourneys: "Parcours actifs",
        activeCourses: "Cours actifs",
        reusableDocs: "Docs reutilisables",
        joined: "Compte cree le",
        access: "Acces",
        noPhone: "Non renseigne",
        reusableSummary: "Conservez ici les fichiers de base que vous pourrez reutiliser quand une nouvelle demande ou une verification du bureau arrive.",
        officeReady: "Profil client",
      }
    : {
        title: "My Profile",
        subtitle: "This record centralizes the reusable information used across your different journeys.",
        contact: "Contact Details",
        reusableRecord: "Reusable Record",
        activeJourneys: "Active Journeys",
        activeCourses: "Active Courses",
        reusableDocs: "Reusable Docs",
        joined: "Account created on",
        access: "Access",
        noPhone: "Not provided",
        reusableSummary: "Store core supporting files here so they are ready when a new application or office request comes in.",
        officeReady: "Customer profile",
      };

  if (proceduresLoading || enrollmentsLoading || profileDocumentsLoading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      icon: FileBadge2,
      label: copy.activeJourneys,
      value: formatNumber(procedures?.length ?? 0),
      gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: BookOpenText,
      label: copy.activeCourses,
      value: formatNumber(enrollments?.length ?? 0),
      gradient: "from-emerald-500/20 via-emerald-600/10 to-transparent",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: FileBadge2,
      label: copy.reusableDocs,
      value: formatNumber(profileDocuments?.length ?? 0),
      gradient: "from-violet-500/20 via-violet-600/10 to-transparent",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: ShieldCheck,
      label: copy.access,
      value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "-",
      gradient: "from-primary/20 via-primary/10 to-transparent",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
          <UserCircle2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{copy.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ icon: Icon, label, value, gradient, iconBg, iconColor }) => (
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

      <div className="grid gap-6 lg:grid-cols-[1fr,1.1fr]">
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-heading text-base font-semibold text-foreground">{copy.contact}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{copy.joined}: {user?.createdAt ? formatDate(user.createdAt) : "-"}</p>
          </div>
          <div className="space-y-3 p-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
              <Mail className="h-4 w-4 text-primary" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
              <Phone className="h-4 w-4 text-primary" />
              <span>{user?.phone || copy.noPhone}</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>{copy.officeReady}</span>
              <Badge variant="outline" className="ml-auto">{user?.role ?? "-"}</Badge>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-heading text-base font-semibold text-foreground">{copy.reusableRecord}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{copy.reusableSummary}</p>
          </div>
          <div className="p-6">
            <div className="rounded-2xl border border-border bg-muted/20 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                    <FileBadge2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{copy.reusableDocs}</div>
                    <div className="text-sm text-muted-foreground">{copy.reusableSummary}</div>
                  </div>
                </div>
                <Badge variant="outline">{formatNumber(profileDocuments?.length ?? 0)}</Badge>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProfileDocumentsPanel />

      <div>
        <AccountSettingsPanel variant="customer" />
      </div>
    </div>
  );
}
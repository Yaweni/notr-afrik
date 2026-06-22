import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpenText, CalendarDays, Clock3, Globe2, Wallet } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/LanguageContext";
import { useCourse, useMyEnrollments } from "@/hooks/useApi";

function formatLanguage(language: string, isFrench: boolean) {
  const labels = isFrench
    ? { English: "Anglais", French: "Francais", German: "Allemand" }
    : { English: "English", French: "French", German: "German" };

  return labels[language as keyof typeof labels] ?? language;
}

export default function CustomerCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { isFrench, formatCurrency, formatDate, getLocalizedValue } = useI18n();
  const { data: course, isLoading } = useCourse(id ?? "");
  const { data: enrollments } = useMyEnrollments();

  const copy = isFrench
    ? {
        back: "Retour au portail",
        notFound: "Cours introuvable",
        destination: "Destination",
        schedule: "Rythme",
        dates: "Periode",
        fee: "Frais",
        enrolledStatus: "Statut d'inscription",
        objective: "Pourquoi ce cours compte",
        objectiveText:
          "Ce cours fait partie de votre preparation terrain. Utilisez cette page pour suivre les details pratiques et garder une vision claire de ce qui soutient votre dossier principal.",
        language: "Langue",
        level: "Niveau",
        enrolled: "Inscrit",
        inProgress: "En cours",
        completed: "Termine",
        dropped: "Abandonne",
      }
    : {
        back: "Back to portal",
        notFound: "Course not found",
        destination: "Destination",
        schedule: "Schedule",
        dates: "Dates",
        fee: "Fee",
        enrolledStatus: "Enrollment status",
        objective: "Why this course matters",
        objectiveText:
          "This course is part of your on-the-ground preparation. Use this page to keep the practical details visible and connected to your wider immigration journey.",
        language: "Language",
        level: "Level",
        enrolled: "Enrolled",
        inProgress: "In Progress",
        completed: "Completed",
        dropped: "Dropped",
      };

  if (isLoading) return <LoadingSpinner />;
  if (!course) return <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground shadow-sm">{copy.notFound}</div>;

  const enrollment = enrollments?.find((item) => item.course.id === course.id);
  const statusCopy = enrollment?.status === "completed"
    ? copy.completed
    : enrollment?.status === "in_progress"
      ? copy.inProgress
      : enrollment?.status === "dropped"
        ? copy.dropped
        : copy.enrolled;
  const statusBadge = enrollment?.status === "completed"
    ? { variant: "success" as const, className: "" }
    : enrollment?.status === "in_progress"
      ? { variant: "warning" as const, className: "border-primary/20 bg-primary/15 text-primary" }
      : enrollment?.status === "dropped"
        ? { variant: "outline" as const, className: "border-red-200 bg-red-100 text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-300" }
        : { variant: "info" as const, className: "" };

  const cards = [
    { icon: Globe2, label: copy.destination, value: course.destination?.name ?? "-" },
    { icon: Clock3, label: copy.schedule, value: course.schedule || "-" },
    { icon: CalendarDays, label: copy.dates, value: `${formatDate(course.startDate)} - ${formatDate(course.endDate)}` },
    { icon: Wallet, label: copy.fee, value: formatCurrency(course.price, course.currency) },
  ];

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-muted-foreground hover:text-foreground">
        <Link to="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          {copy.back}
        </Link>
      </Button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <BookOpenText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{copy.language}: {formatLanguage(course.language, isFrench)}</Badge>
              <Badge variant="info">{copy.level}: {course.level}</Badge>
              {enrollment && (
                <Badge variant={statusBadge.variant} className={statusBadge.className}>
                  {copy.enrolledStatus}: {statusCopy}
                </Badge>
              )}
            </div>
            <h1 className="mt-3 font-heading text-2xl font-bold text-foreground">{getLocalizedValue(course.title, course.titleFr)}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{getLocalizedValue(course.description, course.descriptionFr)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm font-medium text-muted-foreground">{label}</div>
            <div className="mt-2 font-semibold text-foreground">{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-heading text-xl font-semibold text-foreground">{copy.objective}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{copy.objectiveText}</p>
      </div>
    </div>
  );
}
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, ExternalLink, FileText, Globe2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/LanguageContext";
import { useDestination, useEnrollInCourse } from "../hooks/useApi";

function formatCategory(category?: string | null, isFrench = false) {
  const labels = isFrench
    ? {
        student: "Etudes",
        pr: "Residence permanente",
        work: "Travail",
        family: "Famille",
        visit: "Visite",
        general: "Parcours",
      }
    : {
        student: "Student",
        pr: "PR",
        work: "Work",
        family: "Family",
        visit: "Visit",
        general: "Pathway",
      };

  if (!category) return labels.general;
  if (category in labels) return labels[category as keyof typeof labels];
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function formatPriority(priority?: string | null, isFrench = false) {
  const labels = isFrench
    ? {
        recommended: "Recommande",
        strategic: "Strategique",
        optional: "Optionnel",
        primary: "Prioritaire",
      }
    : {
        recommended: "Recommended",
        strategic: "Strategic",
        optional: "Optional",
        primary: "Primary",
      };

  if (!priority) return labels.recommended;
  if (priority in labels) return labels[priority as keyof typeof labels];
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatSection(section?: string | null, isFrench = false) {
  const labels = isFrench
    ? {
        general: "General",
        admission: "Admission",
        identity: "Identite",
        finance: "Finances",
        language: "Langue",
        compliance: "Conformite",
        settlement: "Installation",
        education: "Etudes",
        strategy: "Strategie",
      }
    : {
        general: "General",
        admission: "Admission",
        identity: "Identity",
        finance: "Finance",
        language: "Language",
        compliance: "Compliance",
        settlement: "Settlement",
        education: "Education",
        strategy: "Strategy",
      };

  if (!section) return labels.general;
  if (section in labels) return labels[section as keyof typeof labels];
  return section.charAt(0).toUpperCase() + section.slice(1);
}

function formatLanguage(language?: string | null, isFrench = false) {
  if (!language) return "";
  const labels = isFrench
    ? { English: "Anglais", French: "Francais", German: "Allemand" }
    : { English: "English", French: "French", German: "German" };

  return labels[language as keyof typeof labels] ?? language;
}

export default function PathwayDetailPage() {
  const { id, pathwaySlug } = useParams<{ id: string; pathwaySlug: string }>();
  const { data: destination, isLoading } = useDestination(id!);
  const { user, isAuthenticated } = useAuth();
  const { isFrench, formatCurrency, formatDate, getLocalizedValue } = useI18n();
  const enrollMutation = useEnrollInCourse();

  const copy = isFrench
    ? {
        notFound: "Parcours introuvable",
        back: "Retour a la destination",
        publicRequirements: "Exigences publiques",
        officialResources: "Ressources officielles",
        recommendedCourses: "Cours recommandes",
        openPathway: "Ouvrir ce parcours",
        openGuide: "Ouvrir la ressource",
        loginToEnroll: "Connectez-vous pour vous inscrire",
        enrolled: "Inscription reussie !",
        enrollFailed: "L'inscription a echoue",
        enrollNow: "S'inscrire au cours",
        enrolling: "Inscription...",
        max: "Max",
        officialLabel: "Reference officielle",
        noCourses: "Aucun cours n'est encore lie a ce parcours.",
        noResources: "Aucune ressource officielle n'est encore ajoutee.",
        fee: "Frais",
        timeline: "Delai",
        support: "Appui",
        timelineFallback: "Le calendrier depend de la preparation des documents et du traitement officiel.",
      }
    : {
        notFound: "Pathway not found",
        back: "Back to destination",
        publicRequirements: "Public requirements",
        officialResources: "Official resources",
        recommendedCourses: "Recommended courses",
        openPathway: "Open this pathway",
        openGuide: "Open resource",
        loginToEnroll: "Please log in to enroll",
        enrolled: "Enrolled successfully!",
        enrollFailed: "Enrollment failed",
        enrollNow: "Enroll in course",
        enrolling: "Enrolling...",
        max: "Max",
        officialLabel: "Official reference",
        noCourses: "No courses are linked to this pathway yet.",
        noResources: "No official resources have been added yet.",
        fee: "Fee",
        timeline: "Timeline",
        support: "Support",
        timelineFallback: "Depends on document readiness and official processing.",
      };

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated) {
      toast.error(copy.loginToEnroll);
      return;
    }

    try {
      await enrollMutation.mutateAsync(courseId);
      toast.success(copy.enrolled);
    } catch (err: any) {
      toast.error(err.response?.data?.error || copy.enrollFailed);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const pathway = destination?.pathways?.find((item) => item.slug === pathwaySlug);

  if (!destination || !pathway) {
    return <div className="py-20 text-center text-muted-foreground">{copy.notFound}</div>;
  }

  const startPathwayHref = !isAuthenticated
    ? "/login"
    : user?.role === "admin" || user?.role === "staff"
      ? "/admin/procedures"
      : `/dashboard/new-application?destination=${destination.id}&pathway=${pathway.slug}`;

  const publicRequirements = (pathway.requirements ?? []).filter((item) => item.audience !== "customer");
  const resources = pathway.resources ?? [];
  const recommendedCourses = pathway.courseRecommendations ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to={`/destinations/${destination.id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        {copy.back}
      </Link>

      <div className="relative overflow-hidden rounded-[32px] border border-border bg-card px-6 py-8 shadow-sm sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_35%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                {destination.name}
              </Badge>
              <Badge variant="secondary">{formatCategory(pathway.category, isFrench)}</Badge>
              {getLocalizedValue(pathway.officialProgramName, pathway.officialProgramNameFr) && (
                <Badge variant="outline">{getLocalizedValue(pathway.officialProgramName, pathway.officialProgramNameFr)}</Badge>
              )}
            </div>
            <h1 className="mt-5 font-heading text-3xl font-bold text-foreground sm:text-4xl">{getLocalizedValue(pathway.name, pathway.nameFr)}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{getLocalizedValue(pathway.publicSummary, pathway.publicSummaryFr) || getLocalizedValue(pathway.description, pathway.descriptionFr)}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.fee}</div>
              <p className="mt-3 font-heading text-2xl font-semibold text-foreground">{formatCurrency(pathway.price, pathway.currency)}</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.timeline}</div>
              <p className="mt-3 text-sm leading-6 text-foreground">{getLocalizedValue(pathway.estimatedTimeline, pathway.estimatedTimelineFr, { en: copy.timelineFallback, fr: copy.timelineFallback })}</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.support}</div>
              <p className="mt-3 font-heading text-2xl font-semibold text-foreground">{recommendedCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="sm:min-w-56">
            <Link to={startPathwayHref}>
              {copy.openPathway}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {pathway.officialWebsiteUrl && (
            <Button asChild variant="outline">
              <a href={pathway.officialWebsiteUrl} target="_blank" rel="noreferrer">
                {getLocalizedValue(pathway.officialWebsiteLabel, pathway.officialWebsiteLabelFr, {
                  en: copy.officialLabel,
                  fr: copy.officialLabel,
                })}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <CardTitle>{copy.publicRequirements}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {publicRequirements.map((requirement) => (
                <div key={requirement.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{formatSection(requirement.section, isFrench)}</Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{getLocalizedValue(requirement.title, requirement.titleFr)}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{getLocalizedValue(requirement.description, requirement.descriptionFr)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Globe2 className="h-5 w-5" />
                </div>
                <CardTitle>{copy.officialResources}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.length > 0 ? (
                resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{getLocalizedValue(resource.label, resource.labelFr)}</p>
                      {getLocalizedValue(resource.provider, resource.providerFr) && <p className="mt-1 text-sm text-muted-foreground">{getLocalizedValue(resource.provider, resource.providerFr)}</p>}
                    </div>
                    <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  </a>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{copy.noResources}</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <CardTitle>{copy.recommendedCourses}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedCourses.length > 0 ? (
                recommendedCourses.map((recommendation) => (
                  <div key={recommendation.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={recommendation.isPrimary ? "success" : "outline"}>{formatPriority(recommendation.priority, isFrench)}</Badge>
                          <Badge variant="secondary">{formatLanguage(recommendation.course.language, isFrench)} {recommendation.course.level}</Badge>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-foreground">{getLocalizedValue(recommendation.course.title, recommendation.course.titleFr)}</p>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{getLocalizedValue(recommendation.rationale, recommendation.rationaleFr) || getLocalizedValue(recommendation.course.description, recommendation.course.descriptionFr)}</p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold text-foreground">{formatCurrency(recommendation.course.price, recommendation.course.currency)}</p>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{formatDate(recommendation.course.startDate)}</div>
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{recommendation.course.schedule}</div>
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{copy.max} {recommendation.course.maxStudents}</div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <Button onClick={() => handleEnroll(recommendation.course.id)} disabled={enrollMutation.isPending} className="sm:flex-1">
                        {enrollMutation.isPending ? copy.enrolling : copy.enrollNow}
                      </Button>
                      <Button asChild variant="outline" className="sm:flex-1">
                        <Link to={`/courses?destination=${destination.id}`}>
                          {copy.openGuide}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{copy.noCourses}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, ExternalLink, FileCheck2, Route, Users } from "lucide-react";
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

function formatLanguage(language?: string | null, isFrench = false) {
  if (!language) return "";
  const labels = isFrench
    ? { English: "Anglais", French: "Francais", German: "Allemand" }
    : { English: "English", French: "French", German: "German" };

  return labels[language as keyof typeof labels] ?? language;
}

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: destination, isLoading } = useDestination(id!);
  const { isAuthenticated } = useAuth();
  const { isFrench, formatCurrency, formatDate, getLocalizedValue } = useI18n();
  const enrollMutation = useEnrollInCourse();

  const copy = isFrench
    ? {
        loginToEnroll: "Connectez-vous pour vous inscrire",
        enrolled: "Inscription reussie !",
        enrollFailed: "L'inscription a echoue",
        notFound: "Destination introuvable",
        back: "Retour aux destinations",
        availableCourses: "Cours d'appui disponibles",
        pathways: "Parcours ouverts",
        pathwaysSubtitle: "Choisissez un parcours pour voir les exigences publiques, les ressources officielles et le cours d'appui lie a ce pays.",
        viewPathway: "Voir le parcours",
        officialGuide: "Guide officiel",
        supportCourses: "Cours recommandes",
        overview: "Vue d'ensemble",
        pathwayFocus: "Ce que ce parcours couvre",
        noPathways: "Aucun parcours public n'est encore configure pour cette destination.",
        max: "Max",
        enrolling: "Inscription...",
        enrollNow: "S'inscrire",
        noCourses: "Aucun cours n'est encore disponible pour cette destination.",
      }
    : {
        loginToEnroll: "Please log in to enroll",
        enrolled: "Enrolled successfully!",
        enrollFailed: "Enrollment failed",
        notFound: "Destination not found",
        back: "Back to destinations",
        availableCourses: "Support Courses",
        pathways: "Open pathways",
        pathwaysSubtitle: "Choose a pathway to review the public requirements, official resources, and the support course attached to this destination.",
        viewPathway: "View pathway",
        officialGuide: "Official guide",
        supportCourses: "Recommended courses",
        overview: "Overview",
        pathwayFocus: "What this pathway covers",
        noPathways: "No public pathways are configured for this destination yet.",
        max: "Max",
        enrolling: "Enrolling...",
        enrollNow: "Enroll Now",
        noCourses: "No courses available for this destination yet.",
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
  if (!destination) return <div className="py-20 text-center text-muted-foreground">{copy.notFound}</div>;

  const pathways = destination.pathways ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/destinations" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        {copy.back}
      </Link>

      <div className="relative overflow-hidden rounded-[32px] border border-border bg-card px-6 py-8 shadow-sm sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_35%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-2xl font-semibold text-primary">
                {destination.code}
              </div>
              <div>
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                  {copy.overview}
                </Badge>
                <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">{destination.name}</h1>
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{getLocalizedValue(destination.description, destination.descriptionFr)}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Route className="h-4 w-4" />
                {copy.pathways}
              </div>
              <p className="mt-3 font-heading text-3xl font-semibold text-foreground">{pathways.length}</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                {copy.supportCourses}
              </div>
              <p className="mt-3 font-heading text-3xl font-semibold text-foreground">{destination.languageCourses?.length ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-5">
          <h2 className="font-heading text-2xl font-semibold text-foreground">{copy.pathways}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{copy.pathwaysSubtitle}</p>
        </div>

        {pathways.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-2">
            {pathways.map((pathway) => {
              const publicRequirements = (pathway.requirements ?? []).filter((item) => item.audience !== "customer").slice(0, 3);
              const recommendedCourses = pathway.courseRecommendations ?? [];

              return (
                <Card key={pathway.id} className="overflow-hidden rounded-[28px] border-border/80 bg-card/95 shadow-sm">
                  <CardHeader className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_45%)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                            {formatCategory(pathway.category, isFrench)}
                          </Badge>
                          {getLocalizedValue(pathway.officialProgramName, pathway.officialProgramNameFr) && (
                            <Badge variant="secondary">{getLocalizedValue(pathway.officialProgramName, pathway.officialProgramNameFr)}</Badge>
                          )}
                        </div>
                        <CardTitle className="mt-4 text-2xl">{getLocalizedValue(pathway.name, pathway.nameFr)}</CardTitle>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{getLocalizedValue(pathway.description, pathway.descriptionFr)}</p>
                      </div>
                      <Badge variant="info">{formatCurrency(pathway.price, pathway.currency)}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{copy.pathwayFocus}</p>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{getLocalizedValue(pathway.publicSummary, pathway.publicSummaryFr)}</p>
                    </div>

                    {publicRequirements.length > 0 && (
                      <div className="space-y-3 rounded-2xl border border-border/80 bg-background/70 p-4">
                        {publicRequirements.map((requirement) => (
                          <div key={requirement.id} className="flex gap-3">
                            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <FileCheck2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{getLocalizedValue(requirement.title, requirement.titleFr)}</p>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">{getLocalizedValue(requirement.description, requirement.descriptionFr)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {recommendedCourses.map((recommendation) => (
                        <Badge key={recommendation.id} variant={recommendation.isPrimary ? "success" : "outline"} className="rounded-full px-3 py-1 text-xs">
                          {getLocalizedValue(recommendation.course.title, recommendation.course.titleFr)} • {formatPriority(recommendation.priority, isFrench)}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button asChild className="sm:flex-1">
                        <Link to={`/destinations/${destination.id}/pathways/${pathway.slug}`}>
                          {copy.viewPathway}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      {pathway.officialWebsiteUrl && (
                        <Button asChild variant="outline" className="sm:flex-1">
                          <a href={pathway.officialWebsiteUrl} target="_blank" rel="noreferrer">
                            {getLocalizedValue(pathway.officialWebsiteLabel, pathway.officialWebsiteLabelFr, {
                              en: copy.officialGuide,
                              fr: copy.officialGuide,
                            })}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            {copy.noPathways}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <h2 className="font-heading text-2xl font-semibold text-foreground">{copy.availableCourses}</h2>
        </div>

        {destination.languageCourses && destination.languageCourses.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {destination.languageCourses.map((course) => (
              <Card key={course.id} className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
                <CardContent className="space-y-5 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-foreground">{getLocalizedValue(course.title, course.titleFr)}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{getLocalizedValue(course.description, course.descriptionFr)}</p>
                    </div>
                    <Badge variant="info">{formatLanguage(course.language, isFrench)} {course.level}</Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{formatDate(course.startDate)}</div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{course.schedule}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{copy.max} {course.maxStudents}</div>
                    <div className="font-semibold text-foreground">{formatCurrency(course.price, course.currency)}</div>
                  </div>

                  <Button onClick={() => handleEnroll(course.id)} disabled={enrollMutation.isPending} className="w-full">
                    {enrollMutation.isPending ? copy.enrolling : copy.enrollNow}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">{copy.noCourses}</p>
        )}
      </section>
    </div>
  );
}
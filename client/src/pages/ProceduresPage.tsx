import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, FileCheck, Globe2, MapPinned, Route, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/LanguageContext";
import { useCreateProcedure, useDestinations, useMyEnrollments, useProcedureTypes } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

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

function formatPathwayCount(count: number, isFrench: boolean) {
  return isFrench
    ? `${count} ${count > 1 ? "parcours" : "parcours"}`
    : `${count} ${count === 1 ? "pathway" : "pathways"}`;
}

export default function ProceduresPage() {
  const { user, isAuthenticated } = useAuth();
  const { isFrench, formatCurrency, getLocalizedValue } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const isCustomerShell = location.pathname.startsWith("/dashboard/");
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialDestinationId = query.get("destination") ?? "";
  const initialPathwaySlug = query.get("pathway") ?? "";

  const [selected, setSelected] = useState<{ typeId: string; destId: string; notes: string }>({
    typeId: "",
    destId: initialDestinationId,
    notes: "",
  });

  const { data: destinations, isLoading: destinationsLoading } = useDestinations();
  const { data: pathways, isLoading: pathwaysLoading } = useProcedureTypes({ destinationId: selected.destId || undefined });
  const { data: enrollments } = useMyEnrollments(isCustomerShell && isAuthenticated);
  const createMutation = useCreateProcedure();

  useEffect(() => {
    if (isCustomerShell && !selected.destId && destinations?.length === 1) {
      setSelected((current) => ({ ...current, destId: destinations[0].id }));
    }
  }, [destinations, isCustomerShell, selected.destId]);

  useEffect(() => {
    if (!selected.destId || !initialPathwaySlug || selected.typeId || !pathways?.length) return;

    const match = pathways.find((pathway) => pathway.slug === initialPathwaySlug);
    if (match) {
      setSelected((current) => ({ ...current, typeId: match.id }));
    }
  }, [initialPathwaySlug, pathways, selected.destId, selected.typeId]);

  useEffect(() => {
    if (!selected.typeId || !pathways?.length) return;

    const exists = pathways.some((pathway) => pathway.id === selected.typeId);
    if (!exists) {
      setSelected((current) => ({ ...current, typeId: "" }));
    }
  }, [pathways, selected.typeId]);

  const copy = isFrench
    ? {
        loginFirst: "Connectez-vous d'abord",
        selectBoth: "Choisissez une destination et un parcours",
        submitted: "Dossier envoye !",
        failed: "Impossible d'ouvrir le dossier",
        publicEyebrow: "Parcours publics",
        publicTitle: "Parcourez les routes ouvertes avant d'entrer dans le portail client",
        publicSubtitle: "Les pages publiques donnent le contexte general. Le portail client transforme ensuite ce choix en dossier de travail, checklist, suivis et cours recommandes.",
        exploreDestination: "Voir la destination",
        workspace: "Ouverture de dossier",
        workspaceSubtitle: "Choisissez d'abord la destination, puis le parcours correspondant au vrai projet du client.",
        stepDestination: "1. Destination",
        stepPathway: "2. Parcours",
        stepSubmission: "3. Ouvrir le dossier",
        chooseDestination: "Choisissez la destination de travail avant de selectionner le parcours.",
        choosePathway: "Les parcours ci-dessous proviennent de la destination choisie et injectent ensuite les bonnes exigences et recommandations de cours.",
        internalChecklist: "Checklist suivie dans le portail",
        supportCourses: "Cours d'appui",
        notes: "Notes internes pour l'equipe",
        notesPlaceholder: "Contexte client, province cible, profil financier, priorites du dossier...",
        openPathway: "Ouvrir ce dossier",
        submitting: "Ouverture...",
        selectedPathway: "Parcours selectionne",
        alreadyEnrolled: "Deja inscrit",
        officialGuide: "Guide officiel",
        noCourses: "Aucun cours n'est encore lie a ce parcours.",
      }
    : {
        loginFirst: "Please log in first",
        selectBoth: "Select a destination and pathway",
        submitted: "Case opened!",
        failed: "Failed to open the case",
        publicEyebrow: "Public pathways",
        publicTitle: "Review the live routes before moving into the client portal",
        publicSubtitle: "The public pages give the outside view. The client portal then turns the chosen route into a working file with checklist items, follow-up, and course recommendations.",
        exploreDestination: "View destination",
        workspace: "Case opening workspace",
        workspaceSubtitle: "Choose the destination first, then the pathway that matches the real client objective.",
        stepDestination: "1. Destination",
        stepPathway: "2. Pathway",
        stepSubmission: "3. Open the case",
        chooseDestination: "Choose the working destination before selecting the pathway.",
        choosePathway: "These pathway cards come from the selected destination and feed the right requirements and course recommendations into the case.",
        internalChecklist: "Checklist tracked in the portal",
        supportCourses: "Support courses",
        notes: "Internal notes for the office team",
        notesPlaceholder: "Client context, target province, finance profile, priorities for the file...",
        openPathway: "Open this case",
        submitting: "Opening...",
        selectedPathway: "Selected pathway",
        alreadyEnrolled: "Already enrolled",
        officialGuide: "Official guide",
        noCourses: "No courses are linked to this pathway yet.",
      };

  if (isAuthenticated && !isCustomerShell) {
    if (user?.role === "admin" || user?.role === "staff") {
      return <Navigate to="/admin/procedures" replace />;
    }

    return <Navigate to="/dashboard/new-application" replace />;
  }

  if (destinationsLoading) return <LoadingSpinner />;

  const selectedDestination = destinations?.find((destination) => destination.id === selected.destId);
  const selectedPathway = pathways?.find((pathway) => pathway.id === selected.typeId);
  const checklist = (selectedPathway?.requirements ?? []).filter((item) => item.audience !== "public");
  const recommendedCourses = selectedPathway?.courseRecommendations ?? [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error(copy.loginFirst);
      navigate("/login");
      return;
    }

    if (!selected.destId || !selected.typeId) {
      toast.error(copy.selectBoth);
      return;
    }

    try {
      await createMutation.mutateAsync({
        procedureTypeId: selected.typeId,
        destinationId: selected.destId,
        notes: selected.notes || undefined,
      });
      toast.success(copy.submitted);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || copy.failed);
    }
  };

  if (!isCustomerShell) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-border bg-card px-6 py-8 shadow-sm sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_38%)]" />
          <div className="relative max-w-4xl">
            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
              {copy.publicEyebrow}
            </Badge>
            <h1 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">{copy.publicTitle}</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{copy.publicSubtitle}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {destinations?.map((destination) => (
            <Card key={destination.id} className="overflow-hidden rounded-[28px] border-border/80 bg-card/95 shadow-sm">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-lg font-semibold text-primary">
                    {destination.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <MapPinned className="h-4 w-4" />
                      {copy.publicEyebrow}
                    </div>
                    <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">{destination.name}</h2>
                  </div>
                </div>

                <p className="text-sm leading-7 text-muted-foreground">{getLocalizedValue(destination.description, destination.descriptionFr)}</p>

                <div className="flex flex-wrap gap-2">
                  {destination.featuredPathways?.map((pathway) => (
                    <Badge key={pathway.id} variant={pathway.isFeatured ? "info" : "outline"}>
                      {getLocalizedValue(pathway.name, pathway.nameFr)}
                    </Badge>
                  ))}
                </div>

                <Button asChild className="w-full justify-between">
                  <Link to={`/destinations/${destination.id}`}>
                    {copy.exploreDestination}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[32px] border border-border bg-card px-6 py-8 shadow-sm sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_38%)]" />
        <div className="relative max-w-4xl">
          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
            {copy.workspace}
          </Badge>
          <h1 className="mt-4 font-heading text-3xl font-bold text-foreground">{copy.workspace}</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.workspaceSubtitle}</p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">{copy.stepDestination}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{copy.chooseDestination}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {destinations?.map((destination) => (
            <button
              key={destination.id}
              type="button"
              onClick={() => setSelected((current) => ({ ...current, destId: destination.id, typeId: "" }))}
              className={cn(
                "rounded-[28px] border border-border/80 bg-card px-5 py-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                selected.destId === destination.id && "border-primary/40 bg-primary/5 shadow-md"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-base font-semibold text-primary">
                  {destination.code}
                </div>
                <div>
                  <p className="font-heading text-xl font-semibold text-foreground">{destination.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatPathwayCount(destination.pathwayCount ?? 0, isFrench)}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{getLocalizedValue(destination.description, destination.descriptionFr)}</p>
            </button>
          ))}
        </div>
      </section>

      {selectedDestination && (
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground">{copy.stepPathway}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{copy.choosePathway}</p>
          </div>

          {pathwaysLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {pathways?.map((pathway) => {
                const previewRequirements = (pathway.requirements ?? []).filter((item) => item.audience !== "customer").slice(0, 3);
                const pathwayCourses = pathway.courseRecommendations ?? [];

                return (
                  <Card
                    key={pathway.id}
                    className={cn(
                      "overflow-hidden rounded-[28px] border-border/80 bg-card/95 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                      selected.typeId === pathway.id && "border-primary/40 bg-primary/5 shadow-md"
                    )}
                  >
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
                      <div className="space-y-3">
                        {previewRequirements.map((requirement) => (
                          <div key={requirement.id} className="flex gap-3 rounded-2xl border border-border/70 bg-background/70 p-4">
                            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{getLocalizedValue(requirement.title, requirement.titleFr)}</p>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">{getLocalizedValue(requirement.description, requirement.descriptionFr)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {pathwayCourses.map((recommendation) => (
                          <Badge key={recommendation.id} variant={recommendation.isPrimary ? "success" : "outline"}>
                            {getLocalizedValue(recommendation.course.title, recommendation.course.titleFr)} • {formatPriority(recommendation.priority, isFrench)}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button type="button" onClick={() => setSelected((current) => ({ ...current, typeId: pathway.id }))} className="sm:flex-1">
                          {copy.openPathway}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button asChild variant="outline" className="sm:flex-1">
                          <Link to={`/destinations/${selectedDestination.id}/pathways/${pathway.slug}`}>
                            {getLocalizedValue(pathway.officialWebsiteLabel, pathway.officialWebsiteLabelFr, {
                              en: copy.officialGuide,
                              fr: copy.officialGuide,
                            })}
                            <Route className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {selectedPathway && (
        <>
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{copy.selectedPathway}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{getLocalizedValue(selectedPathway.name, selectedPathway.nameFr)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm leading-7 text-muted-foreground">{getLocalizedValue(selectedPathway.officeSummary, selectedPathway.officeSummaryFr) || getLocalizedValue(selectedPathway.publicSummary, selectedPathway.publicSummaryFr) || getLocalizedValue(selectedPathway.description, selectedPathway.descriptionFr)}</p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{copy.internalChecklist}</p>
                  <div className="mt-3 space-y-3">
                    {checklist.map((item) => (
                      <div key={item.id} className="flex gap-3 rounded-2xl border border-border/70 bg-background/70 p-4">
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{getLocalizedValue(item.title, item.titleFr)}</p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{getLocalizedValue(item.description, item.descriptionFr)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <CardTitle>{copy.supportCourses}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedCourses.length > 0 ? (
                  recommendedCourses.map((recommendation) => {
                    const alreadyEnrolled = enrollments?.some((enrollment) => enrollment.courseId === recommendation.course.id);

                    return (
                      <div key={recommendation.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={recommendation.isPrimary ? "success" : "outline"}>{formatPriority(recommendation.priority, isFrench)}</Badge>
                              {alreadyEnrolled && <Badge variant="secondary">{copy.alreadyEnrolled}</Badge>}
                            </div>
                            <p className="mt-3 text-sm font-semibold text-foreground">{getLocalizedValue(recommendation.course.title, recommendation.course.titleFr)}</p>
                            <p className="mt-2 text-sm leading-7 text-muted-foreground">{getLocalizedValue(recommendation.rationale, recommendation.rationaleFr) || getLocalizedValue(recommendation.course.description, recommendation.course.descriptionFr)}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{formatLanguage(recommendation.course.language, isFrench)} {recommendation.course.level}</p>
                          </div>
                          <p className="whitespace-nowrap text-sm font-semibold text-foreground">{formatCurrency(recommendation.course.price, recommendation.course.currency)}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">{copy.noCourses}</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle>{copy.stepSubmission}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="procedure-notes">{copy.notes}</Label>
                  <Textarea
                    id="procedure-notes"
                    rows={5}
                    value={selected.notes}
                    onChange={(event) => setSelected((current) => ({ ...current, notes: event.target.value }))}
                    placeholder={copy.notesPlaceholder}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" disabled={createMutation.isPending} className="sm:flex-1">
                    {createMutation.isPending ? copy.submitting : copy.openPathway}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setSelected((current) => ({ ...current, typeId: "" }))}>
                    {copy.stepPathway}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
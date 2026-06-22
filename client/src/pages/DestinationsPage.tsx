import { Link } from "react-router-dom";
import { ArrowRight, Globe2, MapPinned, Route } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "../context/LanguageContext";
import { useDestinations } from "../hooks/useApi";

function formatPathwayCount(count: number, isFrench: boolean) {
  return isFrench
    ? `${count} ${count > 1 ? "parcours actifs" : "parcours actif"}`
    : `${count} ${count === 1 ? "active pathway" : "active pathways"}`;
}

export default function DestinationsPage() {
  const { data: destinations, isLoading } = useDestinations();
  const { isFrench, getLocalizedValue } = useI18n();

  const copy = isFrench
    ? {
        eyebrow: "Destinations actives",
        title: "Choisissez d'abord le pays, puis le bon parcours",
        subtitle: "Chaque destination publique sert de point d'entree. A l'interieur, vous verrez les parcours actuellement ouverts, les exigences clefs et les cours d'appui lies a ce pays.",
        pathways: "parcours actifs",
        featured: "Parcours mis en avant",
        cta: "Voir les parcours",
      }
    : {
        eyebrow: "Active destinations",
        title: "Pick the country first, then the right pathway",
        subtitle: "Each public destination acts as an entry point. Inside it, you can review the live pathways, the headline requirements, and the support courses tied to that country.",
        pathways: "active pathways",
        featured: "Featured pathways",
        cta: "View pathways",
      };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[32px] border border-border bg-card px-6 py-8 shadow-sm sm:px-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_40%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
              {copy.eyebrow}
            </Badge>
            <h1 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">{copy.title}</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{copy.subtitle}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-background/80 px-4 py-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <MapPinned className="h-4 w-4" />
                {copy.eyebrow}
              </div>
              <p className="mt-2 font-heading text-3xl font-semibold text-foreground">{destinations?.length ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/80 px-4 py-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Route className="h-4 w-4" />
                {copy.pathways}
              </div>
              <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
                {destinations?.reduce((total, destination) => total + (destination.pathwayCount ?? 0), 0) ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {destinations?.map((dest) => (
          <Card key={dest.id} className="group overflow-hidden rounded-[28px] border-border/80 bg-card/95 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="relative p-6">
              <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_48%)]" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-lg font-semibold text-primary">
                      {dest.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <Globe2 className="h-4 w-4" />
                        {copy.eyebrow}
                      </div>
                      <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">{dest.name}</h2>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                    {formatPathwayCount(dest.pathwayCount ?? 0, isFrench)}
                  </Badge>
                </div>

                <p className="mt-5 text-sm leading-7 text-muted-foreground">{getLocalizedValue(dest.description, dest.descriptionFr)}</p>

                {dest.featuredPathways && dest.featuredPathways.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-border/80 bg-background/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{copy.featured}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {dest.featuredPathways.map((pathway) => (
                        <Badge key={pathway.id} variant={pathway.isFeatured ? "info" : "outline"} className="rounded-full px-3 py-1 text-xs">
                          {getLocalizedValue(pathway.name, pathway.nameFr)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button asChild className="mt-6 w-full justify-between">
                  <Link to={`/destinations/${dest.id}`}>
                    {copy.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, FileCheck, Globe2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/LanguageContext";
import { useCreateProcedure, useDestinations, useProcedureTypes } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

export default function ProceduresPage() {
  const { user, isAuthenticated } = useAuth();
  const { isFrench, formatCurrency } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: types, isLoading: typesLoading } = useProcedureTypes();
  const { data: destinations } = useDestinations();
  const createMutation = useCreateProcedure();

  const [selected, setSelected] = useState<{ typeId: string; destId: string; notes: string }>({ typeId: "", destId: "", notes: "" });
  const [showForm, setShowForm] = useState(false);
  const isCustomerShell = location.pathname.startsWith("/dashboard/");

  const copy = isFrench
    ? {
        loginFirst: "Connectez-vous d'abord",
        selectBoth: "Choisissez un service et une destination",
        submitted: "Demande envoyee !",
        failed: "Impossible d'envoyer la demande",
        title: "Nos parcours",
        subtitle: "Des parcours d'immigration plus lisibles, de l'exploration jusqu'au depot du dossier.",
        apply: "Commencer",
        formTitle: "Envoyer une demande",
        formSubtitle: "Choisissez votre service, la destination cible et ajoutez le contexte utile avant la reprise par l'equipe.",
        serviceType: "Type de service",
        selectService: "Choisir un service",
        destination: "Destination",
        selectDestination: "Choisir une destination",
        notes: "Notes",
        optional: "optionnel",
        notesPlaceholder: "Informations complementaires utiles...",
        submitting: "Envoi...",
        submit: "Envoyer la demande",
        cancel: "Annuler",
        workspace: "Espace de demande",
        workspaceSubtitle: "Lancez un nouveau dossier sans quitter votre portail client.",
      }
    : {
        loginFirst: "Please log in first",
        selectBoth: "Select a service and destination",
        submitted: "Application submitted!",
        failed: "Failed to submit",
        title: "Our Journeys",
        subtitle: "Clear immigration journeys from exploration to application handoff.",
        apply: "Start journey",
        formTitle: "Submit Application",
        formSubtitle: "Choose the service, target destination, and useful context before the office team picks it up.",
        serviceType: "Service Type",
        selectService: "Select a service",
        destination: "Destination",
        selectDestination: "Select destination",
        notes: "Notes",
        optional: "optional",
        notesPlaceholder: "Any additional information...",
        submitting: "Submitting...",
        submit: "Submit Application",
        cancel: "Cancel",
        workspace: "Application workspace",
        workspaceSubtitle: "Start a new case without leaving your customer portal.",
      };

  if (isAuthenticated && !isCustomerShell) {
    if (user?.role === "admin" || user?.role === "staff") {
      return <Navigate to="/admin/procedures" replace />;
    }
    return <Navigate to="/dashboard/new-application" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error(copy.loginFirst); navigate("/login"); return; }
    if (!selected.typeId || !selected.destId) { toast.error(copy.selectBoth); return; }
    try {
      await createMutation.mutateAsync({ procedureTypeId: selected.typeId, destinationId: selected.destId, notes: selected.notes || undefined });
      toast.success(copy.submitted);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || copy.failed);
    }
  };

  if (typesLoading) return <LoadingSpinner />;

  const selectedType = types?.find((type) => type.id === selected.typeId);
  const fieldClassName = "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className={cn("space-y-8", !isCustomerShell && "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8")}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
          <Globe2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          {isCustomerShell && <Badge variant="outline">{copy.workspace}</Badge>}
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">{copy.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{isCustomerShell ? copy.workspaceSubtitle : copy.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {types?.map((type, index) => (
          <div
            key={type.id}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
              selected.typeId === type.id && "border-primary/40 bg-primary/5 shadow-md"
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 opacity-60",
                index % 3 === 0 && "bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent",
                index % 3 === 1 && "bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent",
                index % 3 === 2 && "bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"
              )}
            />
            <div className="relative flex h-full flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">{type.name}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{type.description}</p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <Badge variant="outline">{formatCurrency(type.price, type.currency)}</Badge>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setSelected((current) => ({ ...current, typeId: type.id }));
                    setShowForm(true);
                  }}
                >
                  {copy.apply}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="font-heading text-lg font-semibold text-foreground">{copy.formTitle}</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{copy.formSubtitle}</p>
            {selectedType && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <FileCheck className="h-3.5 w-3.5" />
                {selectedType.name}
              </div>
            )}
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="procedure-type">{copy.serviceType}</Label>
                <select
                  id="procedure-type"
                  value={selected.typeId}
                  onChange={(e) => setSelected((current) => ({ ...current, typeId: e.target.value }))}
                  className={fieldClassName}
                  required
                >
                  <option value="">{copy.selectService}</option>
                  {types?.map((type) => (
                    <option key={type.id} value={type.id}>{type.name} - {formatCurrency(type.price, type.currency)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedure-destination">{copy.destination}</Label>
                <select
                  id="procedure-destination"
                  value={selected.destId}
                  onChange={(e) => setSelected((current) => ({ ...current, destId: e.target.value }))}
                  className={fieldClassName}
                  required
                >
                  <option value="">{copy.selectDestination}</option>
                  {destinations?.map((destination) => (
                    <option key={destination.id} value={destination.id}>{destination.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="procedure-notes">{copy.notes} <span className="text-muted-foreground">({copy.optional})</span></Label>
                <Textarea
                  id="procedure-notes"
                  value={selected.notes}
                  onChange={(e) => setSelected((current) => ({ ...current, notes: e.target.value }))}
                  rows={4}
                  placeholder={copy.notesPlaceholder}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2">
                <Button type="submit" disabled={createMutation.isPending} className="sm:flex-1">
                  {createMutation.isPending ? copy.submitting : copy.submit}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  {copy.cancel}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProcedureTypes, useDestinations, useCreateProcedure } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/LanguageContext";
import { FileCheck, ArrowRight } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function ProceduresPage() {
  const { isAuthenticated } = useAuth();
  const { isFrench, formatCurrency } = useI18n();
  const navigate = useNavigate();
  const { data: types, isLoading: typesLoading } = useProcedureTypes();
  const { data: destinations } = useDestinations();
  const createMutation = useCreateProcedure();

  const [selected, setSelected] = useState<{ typeId: string; destId: string; notes: string }>({ typeId: "", destId: "", notes: "" });
  const [showForm, setShowForm] = useState(false);

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
      };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">{copy.title}</h1>
        <p className="text-gray-500">{copy.subtitle}</p>
      </div>

      {/* Service cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {types?.map((t) => (
          <div key={t.id} className="card hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{t.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{t.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cameroon-green">{formatCurrency(t.price, t.currency)}</span>
              <button onClick={() => { setSelected((p) => ({ ...p, typeId: t.id })); setShowForm(true); }} className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                {copy.apply} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application form */}
      {showForm && (
        <div className="max-w-xl mx-auto">
          <div className="card">
            <h2 className="font-heading text-xl font-semibold text-gray-900 mb-6">{copy.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.serviceType}</label>
                <select value={selected.typeId} onChange={(e) => setSelected((p) => ({ ...p, typeId: e.target.value }))} className="input-field" required>
                  <option value="">{copy.selectService}</option>
                  {types?.map((t) => <option key={t.id} value={t.id}>{t.name} - {formatCurrency(t.price, t.currency)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.destination}</label>
                <select value={selected.destId} onChange={(e) => setSelected((p) => ({ ...p, destId: e.target.value }))} className="input-field" required>
                  <option value="">{copy.selectDestination}</option>
                  {destinations?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.notes} <span className="text-gray-400">({copy.optional})</span></label>
                <textarea value={selected.notes} onChange={(e) => setSelected((p) => ({ ...p, notes: e.target.value }))} className="input-field" rows={3} placeholder={copy.notesPlaceholder} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={createMutation.isPending} className="btn-primary flex-1">
                  {createMutation.isPending ? copy.submitting : copy.submit}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">{copy.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useParams, Link } from "react-router-dom";
import { useProcedure } from "../hooks/useApi";
import { useI18n } from "../context/LanguageContext";
import { ArrowLeft, Clock, CheckCircle2, ExternalLink } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProcedureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: proc, isLoading } = useProcedure(id!);
  const { isFrench, formatCurrency, formatDate, formatDateTime } = useI18n();

  const copy = isFrench
    ? {
        notFound: "Parcours introuvable",
        back: "Retour au tableau de bord",
        destination: "Destination",
        submitted: "Soumis le",
        updated: "Derniere mise a jour",
        notes: "Notes",
        totalFee: "Frais totaux",
        amountPaid: "Montant paye",
        remainingBalance: "Solde restant",
        timeline: "Chronologie du dossier",
        noUpdates: "Aucune mise a jour pour le moment.",
        sharedDocuments: "Documents partages",
        addedOn: "ajoute le",
        open: "Ouvrir",
        noDocuments: "Aucun document ni ressource partage pour l'instant.",
        paymentHistory: "Historique des paiements",
        recordedOn: "Enregistre le",
        offlinePayment: "Paiement hors ligne",
        noPayments: "Aucun paiement n'a encore ete enregistre pour ce dossier.",
      }
    : {
        notFound: "Procedure not found",
        back: "Back to dashboard",
        destination: "Destination",
        submitted: "Submitted",
        updated: "Last Updated",
        notes: "Notes",
        totalFee: "Total Fee",
        amountPaid: "Amount Paid",
        remainingBalance: "Remaining Balance",
        timeline: "Progress Timeline",
        noUpdates: "No updates yet.",
        sharedDocuments: "Shared Documents",
        addedOn: "added on",
        open: "Open",
        noDocuments: "No documents or resources have been shared for this procedure yet.",
        paymentHistory: "Payment History",
        recordedOn: "Recorded on",
        offlinePayment: "Offline payment",
        noPayments: "No payments have been recorded for this procedure yet.",
      };

  const totalPaid = (proc?.payments ?? []).reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = Math.max((proc?.agreedPrice ?? 0) - totalPaid, 0);

  if (isLoading) return <LoadingSpinner />;
  if (!proc) return <div className="text-center py-20 text-gray-500">{copy.notFound}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> {copy.back}
      </Link>

      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-heading text-2xl font-bold text-gray-900">{proc.procedureType.name}</h1>
          <StatusBadge status={proc.status} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">{copy.destination}</span>
            <div className="font-medium text-gray-900">{proc.destination.name}</div>
          </div>
          <div>
            <span className="text-gray-400">{copy.submitted}</span>
            <div className="font-medium text-gray-900">{formatDate(proc.createdAt)}</div>
          </div>
          <div>
            <span className="text-gray-400">{copy.updated}</span>
            <div className="font-medium text-gray-900">{formatDate(proc.updatedAt)}</div>
          </div>
        </div>
        {proc.notes && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
            <span className="font-medium text-gray-700">{copy.notes}:</span> {proc.notes}
          </div>
        )}

        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">{copy.totalFee}</div>
            <div className="font-semibold text-gray-900">{formatCurrency(proc.agreedPrice, proc.currency)}</div>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="text-xs uppercase tracking-wide text-emerald-600 mb-1">{copy.amountPaid}</div>
            <div className="font-semibold text-emerald-800">{formatCurrency(totalPaid, proc.currency)}</div>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <div className="text-xs uppercase tracking-wide text-amber-600 mb-1">{copy.remainingBalance}</div>
            <div className="font-semibold text-amber-800">{formatCurrency(remainingBalance, proc.currency)}</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <h2 className="font-heading text-xl font-semibold text-gray-900 mb-6">{copy.timeline}</h2>
      {proc.updates.length > 0 ? (
        <div className="space-y-0">
          {proc.updates.map((update, i) => (
            <div key={update.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-400"}`}>
                  {i === 0 ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                {i < proc.updates.length - 1 && <div className="w-px h-full bg-gray-200 my-1" />}
              </div>
              <div className="pb-6">
                <div className="font-semibold text-gray-900">{update.title}</div>
                <p className="text-sm text-gray-500 mt-1">{update.message}</p>
                <span className="text-xs text-gray-400">{formatDateTime(update.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">{copy.noUpdates}</p>
      )}

      <div className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-gray-900 mb-6">{copy.sharedDocuments}</h2>
        {proc.documents && proc.documents.length > 0 ? (
          <div className="space-y-3">
            {proc.documents.map((document) => (
              <div key={document.id} className="card flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{document.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {document.fileType} · {copy.addedOn} {formatDate(document.uploadedAt)}
                  </div>
                </div>
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !py-2 !px-4 text-sm inline-flex items-center gap-2"
                >
                  {copy.open} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-sm text-gray-400">{copy.noDocuments}</div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-gray-900 mb-6">{copy.paymentHistory}</h2>
        {proc.payments && proc.payments.length > 0 ? (
          <div className="space-y-3">
            {proc.payments.map((payment) => (
              <div key={payment.id} className="card flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</div>
                  <div className="text-sm text-gray-500 mt-1">{copy.recordedOn} {formatDate(payment.paidAt)}</div>
                  {payment.note && <p className="text-sm text-gray-400 mt-2">{payment.note}</p>}
                </div>
                <div className="badge bg-emerald-100 text-emerald-700">{copy.offlinePayment}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-sm text-gray-400">{copy.noPayments}</div>
        )}
      </div>
    </div>
  );
}

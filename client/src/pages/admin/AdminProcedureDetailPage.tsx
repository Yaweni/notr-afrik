import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { useI18n } from "../../context/LanguageContext";
import { useAddProcedureDocument, useAddProcedurePayment, useProcedure, useUpdateProcedureStatus } from "../../hooks/useApi";
import type { ProcedureStatus } from "../../types";

const statuses: ProcedureStatus[] = ["pending", "documents_review", "in_progress", "approved", "rejected", "completed"];

export default function AdminProcedureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: procedure, isLoading } = useProcedure(id ?? "");
  const updateStatus = useUpdateProcedureStatus();
  const addPayment = useAddProcedurePayment();
  const addDocument = useAddProcedureDocument();
  const { isFrench, formatCurrency, formatDate, formatDateTime, getLocalizedValue } = useI18n();

  const [status, setStatus] = useState<ProcedureStatus>("pending");
  const [statusMessage, setStatusMessage] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [documentName, setDocumentName] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentType, setDocumentType] = useState("resource");

  const copy = isFrench
    ? {
        notFound: "Dossier introuvable.",
        procedureUpdated: "Statut du dossier mis a jour",
        procedureUpdateFailed: "Impossible de mettre a jour le statut",
        invalidPayment: "Saisissez un montant valide",
        paymentRecorded: "Paiement hors ligne enregistre",
        paymentFailed: "Impossible d'enregistrer le paiement",
        documentRequired: "Le nom du document et l'URL sont requis",
        documentShared: "Document partage avec le client",
        documentFailed: "Impossible de partager le document",
        back: "Retour aux dossiers",
        forClient: "dossier pour",
        totalFee: "Frais totaux",
        amountPaid: "Montant paye",
        remainingBalance: "Solde restant",
        clientContact: "Contact client",
        noPhone: "Aucun numero",
        timeline: "Chronologie du dossier",
        noTimeline: "Aucune entree pour le moment.",
        sharedDocuments: "Documents partages",
        noDocuments: "Aucun document partage pour le moment.",
        open: "Ouvrir",
        paymentHistory: "Historique des paiements",
        recordedOn: "Enregistre le",
        offlinePayment: "Paiement hors ligne",
        noPayments: "Aucun paiement hors ligne enregistre.",
        updateStatus: "Mettre a jour le statut",
        status: "Statut",
        messageToClient: "Message au client",
        progressPlaceholder: "Expliquez la mise a jour...",
        updating: "Mise a jour...",
        saveStatus: "Enregistrer la mise a jour",
        recordPayment: "Enregistrer un paiement",
        amount: "Montant",
        paymentDate: "Date du paiement",
        internalNote: "Note interne",
        paymentNotePlaceholder: "Paiement espece au bureau, virement confirme, numero de recu...",
        saving: "Enregistrement...",
        recordPaymentAction: "Enregistrer le paiement",
        shareDocument: "Partager un document ou une ressource",
        name: "Nom",
        documentNamePlaceholder: "Checklist entretien, recu ambassade, guide de langue...",
        url: "URL",
        type: "Type",
        sharing: "Partage...",
        shareWithClient: "Partager avec le client",
      }
    : {
        notFound: "Procedure not found.",
        procedureUpdated: "Procedure status updated",
        procedureUpdateFailed: "Unable to update the procedure status",
        invalidPayment: "Enter a valid payment amount",
        paymentRecorded: "Offline payment recorded",
        paymentFailed: "Unable to record the payment",
        documentRequired: "Document name and URL are required",
        documentShared: "Document shared with the client",
        documentFailed: "Unable to share the document",
        back: "Back to procedures",
        forClient: "procedure for",
        totalFee: "Total fee",
        amountPaid: "Amount paid",
        remainingBalance: "Remaining balance",
        clientContact: "Client contact",
        noPhone: "No phone number",
        timeline: "Procedure timeline",
        noTimeline: "No timeline entries yet.",
        sharedDocuments: "Shared documents",
        noDocuments: "No documents shared yet.",
        open: "Open",
        paymentHistory: "Payment history",
        recordedOn: "Recorded on",
        offlinePayment: "Offline payment",
        noPayments: "No offline payments recorded yet.",
        updateStatus: "Update status",
        status: "Status",
        messageToClient: "Message to client",
        progressPlaceholder: "Explain the progress update...",
        updating: "Updating...",
        saveStatus: "Save status update",
        recordPayment: "Record offline payment",
        amount: "Amount",
        paymentDate: "Payment date",
        internalNote: "Internal note",
        paymentNotePlaceholder: "Cash payment at office, bank transfer confirmation, receipt number...",
        saving: "Saving...",
        recordPaymentAction: "Record payment",
        shareDocument: "Share document or resource",
        name: "Name",
        documentNamePlaceholder: "Interview checklist, embassy receipt, language guide...",
        url: "URL",
        type: "Type",
        sharing: "Sharing...",
        shareWithClient: "Share with client",
      };

  const statusLabels: Record<ProcedureStatus, string> = isFrench
    ? {
        pending: "En attente",
        documents_review: "Documents en revue",
        in_progress: "En cours",
        approved: "Approuve",
        rejected: "Refuse",
        completed: "Termine",
      }
    : {
        pending: "Pending",
        documents_review: "Documents review",
        in_progress: "In progress",
        approved: "Approved",
        rejected: "Rejected",
        completed: "Completed",
      };

  useEffect(() => {
    if (procedure?.status) {
      setStatus(procedure.status);
    }
  }, [procedure?.status]);

  if (isLoading) return <LoadingSpinner />;
  if (!procedure) return <div className="card text-gray-500">{copy.notFound}</div>;

  const totalPaid = (procedure.payments ?? []).reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = Math.max(procedure.agreedPrice - totalPaid, 0);

  const handleStatusUpdate = async () => {
    try {
      await updateStatus.mutateAsync({ id: procedure.id, status, message: statusMessage.trim() || undefined });
      toast.success(copy.procedureUpdated);
      setStatusMessage("");
    } catch {
      toast.error(copy.procedureUpdateFailed);
    }
  };

  const handlePaymentRecord = async () => {
    const amount = Number(paymentAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error(copy.invalidPayment);
      return;
    }

    try {
      await addPayment.mutateAsync({
        id: procedure.id,
        amount,
        note: paymentNote.trim() || undefined,
        paidAt: paymentDate ? new Date(`${paymentDate}T12:00:00`).toISOString() : undefined,
      });
      toast.success(copy.paymentRecorded);
      setPaymentAmount("");
      setPaymentNote("");
      setPaymentDate(new Date().toISOString().slice(0, 10));
    } catch {
      toast.error(copy.paymentFailed);
    }
  };

  const handleDocumentShare = async () => {
    if (!documentName.trim() || !documentUrl.trim()) {
      toast.error(copy.documentRequired);
      return;
    }

    try {
      await addDocument.mutateAsync({
        id: procedure.id,
        name: documentName.trim(),
        fileUrl: documentUrl.trim(),
        fileType: documentType.trim() || "resource",
      });
      toast.success(copy.documentShared);
      setDocumentName("");
      setDocumentUrl("");
      setDocumentType("resource");
    } catch {
      toast.error(copy.documentFailed);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link to="/admin/procedures" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> {copy.back}
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-gray-900">{getLocalizedValue(procedure.procedureType.name, procedure.procedureType.nameFr)}</h2>
            <p className="text-sm text-gray-500 mt-1">{procedure.destination.name} {copy.forClient} {procedure.user?.firstName} {procedure.user?.lastName}</p>
          </div>
          <StatusBadge status={procedure.status} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">{copy.totalFee}</div>
          <div className="font-semibold text-gray-900">{formatCurrency(procedure.agreedPrice, procedure.currency)}</div>
        </div>
        <div className="card bg-emerald-50 border-emerald-100">
          <div className="text-xs uppercase tracking-wide text-emerald-700 mb-1">{copy.amountPaid}</div>
          <div className="font-semibold text-emerald-900">{formatCurrency(totalPaid, procedure.currency)}</div>
        </div>
        <div className="card bg-amber-50 border-amber-100">
          <div className="text-xs uppercase tracking-wide text-amber-700 mb-1">{copy.remainingBalance}</div>
          <div className="font-semibold text-amber-900">{formatCurrency(remainingBalance, procedure.currency)}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">{copy.clientContact}</div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{procedure.user?.email}</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{procedure.user?.phone || copy.noPhone}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-8">
          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">{copy.timeline}</h3>
            {procedure.updates.length > 0 ? (
              <div className="space-y-4">
                {procedure.updates.map((update) => (
                  <div key={update.id} className="border-l-2 border-amber-100 pl-4">
                    <div className="font-medium text-gray-900">{getLocalizedValue(update.title, update.titleFr)}</div>
                    <p className="text-sm text-gray-500 mt-1">{getLocalizedValue(update.message, update.messageFr)}</p>
                    <div className="text-xs text-gray-400 mt-2">{formatDateTime(update.createdAt)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">{copy.noTimeline}</p>
            )}
          </div>

          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">{copy.sharedDocuments}</h3>
            {procedure.documents && procedure.documents.length > 0 ? (
              <div className="space-y-3">
                {procedure.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
                    <div>
                      <div className="font-medium text-gray-900">{document.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{document.fileType} · {formatDate(document.uploadedAt)}</div>
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
              <p className="text-sm text-gray-400">{copy.noDocuments}</p>
            )}
          </div>

          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">{copy.paymentHistory}</h3>
            {procedure.payments && procedure.payments.length > 0 ? (
              <div className="space-y-3">
                {procedure.payments.map((payment) => (
                  <div key={payment.id} className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 p-4">
                    <div>
                      <div className="font-medium text-gray-900">{formatCurrency(payment.amount, payment.currency)}</div>
                      <div className="text-sm text-gray-500 mt-1">{copy.recordedOn} {formatDate(payment.paidAt)}</div>
                      {payment.note && <p className="text-sm text-gray-400 mt-2">{payment.note}</p>}
                    </div>
                    <div className="badge bg-emerald-100 text-emerald-700">{copy.offlinePayment}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">{copy.noPayments}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">{copy.updateStatus}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.status}</label>
                <select value={status} onChange={(event) => setStatus(event.target.value as ProcedureStatus)} className="input-field">
                  {statuses.map((value) => (
                    <option key={value} value={value}>{statusLabels[value]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.messageToClient}</label>
                <textarea
                  value={statusMessage}
                  onChange={(event) => setStatusMessage(event.target.value)}
                  rows={4}
                  className="input-field"
                  placeholder={copy.progressPlaceholder}
                />
              </div>
              <button onClick={handleStatusUpdate} disabled={updateStatus.isPending} className="btn-primary w-full">
                {updateStatus.isPending ? copy.updating : copy.saveStatus}
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">{copy.recordPayment}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.amount}</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                  className="input-field"
                  placeholder={`${copy.amount} ${procedure.currency}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.paymentDate}</label>
                <input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.internalNote}</label>
                <textarea
                  value={paymentNote}
                  onChange={(event) => setPaymentNote(event.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder={copy.paymentNotePlaceholder}
                />
              </div>
              <button onClick={handlePaymentRecord} disabled={addPayment.isPending} className="btn-primary w-full">
                {addPayment.isPending ? copy.saving : copy.recordPaymentAction}
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">{copy.shareDocument}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.name}</label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(event) => setDocumentName(event.target.value)}
                  className="input-field"
                  placeholder={copy.documentNamePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.url}</label>
                <input
                  type="url"
                  value={documentUrl}
                  onChange={(event) => setDocumentUrl(event.target.value)}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.type}</label>
                <input
                  type="text"
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value)}
                  className="input-field"
                  placeholder="resource"
                />
              </div>
              <button onClick={handleDocumentShare} disabled={addDocument.isPending} className="btn-primary w-full">
                {addDocument.isPending ? copy.sharing : copy.shareWithClient}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
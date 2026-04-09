import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import { useAddProcedureDocument, useAddProcedurePayment, useProcedure, useUpdateProcedureStatus } from "../../hooks/useApi";
import type { ProcedureStatus } from "../../types";

const statuses: ProcedureStatus[] = ["pending", "documents_review", "in_progress", "approved", "rejected", "completed"];

const formatMoney = (value: number, currency: string) => `${value.toLocaleString()} ${currency}`;

export default function AdminProcedureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: procedure, isLoading } = useProcedure(id ?? "");
  const updateStatus = useUpdateProcedureStatus();
  const addPayment = useAddProcedurePayment();
  const addDocument = useAddProcedureDocument();

  const [status, setStatus] = useState<ProcedureStatus>("pending");
  const [statusMessage, setStatusMessage] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [documentName, setDocumentName] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentType, setDocumentType] = useState("resource");

  useEffect(() => {
    if (procedure?.status) {
      setStatus(procedure.status);
    }
  }, [procedure?.status]);

  if (isLoading) return <LoadingSpinner />;
  if (!procedure) return <div className="card text-gray-500">Procedure not found.</div>;

  const totalPaid = (procedure.payments ?? []).reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = Math.max(procedure.agreedPrice - totalPaid, 0);

  const handleStatusUpdate = async () => {
    try {
      await updateStatus.mutateAsync({ id: procedure.id, status, message: statusMessage.trim() || undefined });
      toast.success("Procedure status updated");
      setStatusMessage("");
    } catch {
      toast.error("Unable to update the procedure status");
    }
  };

  const handlePaymentRecord = async () => {
    const amount = Number(paymentAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }

    try {
      await addPayment.mutateAsync({
        id: procedure.id,
        amount,
        note: paymentNote.trim() || undefined,
        paidAt: paymentDate ? new Date(`${paymentDate}T12:00:00`).toISOString() : undefined,
      });
      toast.success("Offline payment recorded");
      setPaymentAmount("");
      setPaymentNote("");
      setPaymentDate(new Date().toISOString().slice(0, 10));
    } catch {
      toast.error("Unable to record the payment");
    }
  };

  const handleDocumentShare = async () => {
    if (!documentName.trim() || !documentUrl.trim()) {
      toast.error("Document name and URL are required");
      return;
    }

    try {
      await addDocument.mutateAsync({
        id: procedure.id,
        name: documentName.trim(),
        fileUrl: documentUrl.trim(),
        fileType: documentType.trim() || "resource",
      });
      toast.success("Document shared with the client");
      setDocumentName("");
      setDocumentUrl("");
      setDocumentType("resource");
    } catch {
      toast.error("Unable to share the document");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link to="/admin/procedures" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to procedures
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-gray-900">{procedure.procedureType.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{procedure.destination.name} procedure for {procedure.user?.firstName} {procedure.user?.lastName}</p>
          </div>
          <StatusBadge status={procedure.status} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Total fee</div>
          <div className="font-semibold text-gray-900">{formatMoney(procedure.agreedPrice, procedure.currency)}</div>
        </div>
        <div className="card bg-emerald-50 border-emerald-100">
          <div className="text-xs uppercase tracking-wide text-emerald-700 mb-1">Amount paid</div>
          <div className="font-semibold text-emerald-900">{formatMoney(totalPaid, procedure.currency)}</div>
        </div>
        <div className="card bg-amber-50 border-amber-100">
          <div className="text-xs uppercase tracking-wide text-amber-700 mb-1">Remaining balance</div>
          <div className="font-semibold text-amber-900">{formatMoney(remainingBalance, procedure.currency)}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Client contact</div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{procedure.user?.email}</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{procedure.user?.phone || "No phone number"}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-8">
          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Procedure timeline</h3>
            {procedure.updates.length > 0 ? (
              <div className="space-y-4">
                {procedure.updates.map((update) => (
                  <div key={update.id} className="border-l-2 border-amber-100 pl-4">
                    <div className="font-medium text-gray-900">{update.title}</div>
                    <p className="text-sm text-gray-500 mt-1">{update.message}</p>
                    <div className="text-xs text-gray-400 mt-2">{new Date(update.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No timeline entries yet.</p>
            )}
          </div>

          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Shared documents</h3>
            {procedure.documents && procedure.documents.length > 0 ? (
              <div className="space-y-3">
                {procedure.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
                    <div>
                      <div className="font-medium text-gray-900">{document.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{document.fileType} · {new Date(document.uploadedAt).toLocaleDateString()}</div>
                    </div>
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary !py-2 !px-4 text-sm inline-flex items-center gap-2"
                    >
                      Open <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No documents shared yet.</p>
            )}
          </div>

          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Payment history</h3>
            {procedure.payments && procedure.payments.length > 0 ? (
              <div className="space-y-3">
                {procedure.payments.map((payment) => (
                  <div key={payment.id} className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 p-4">
                    <div>
                      <div className="font-medium text-gray-900">{formatMoney(payment.amount, payment.currency)}</div>
                      <div className="text-sm text-gray-500 mt-1">Recorded on {new Date(payment.paidAt).toLocaleDateString()}</div>
                      {payment.note && <p className="text-sm text-gray-400 mt-2">{payment.note}</p>}
                    </div>
                    <div className="badge bg-emerald-100 text-emerald-700">Offline payment</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No offline payments recorded yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Update status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={status} onChange={(event) => setStatus(event.target.value as ProcedureStatus)} className="input-field">
                  {statuses.map((value) => (
                    <option key={value} value={value}>{value.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message to client</label>
                <textarea
                  value={statusMessage}
                  onChange={(event) => setStatusMessage(event.target.value)}
                  rows={4}
                  className="input-field"
                  placeholder="Explain the progress update..."
                />
              </div>
              <button onClick={handleStatusUpdate} disabled={updateStatus.isPending} className="btn-primary w-full">
                {updateStatus.isPending ? "Updating..." : "Save status update"}
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Record offline payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                  className="input-field"
                  placeholder={`Amount in ${procedure.currency}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment date</label>
                <input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal note</label>
                <textarea
                  value={paymentNote}
                  onChange={(event) => setPaymentNote(event.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Cash payment at office, bank transfer confirmation, receipt number..."
                />
              </div>
              <button onClick={handlePaymentRecord} disabled={addPayment.isPending} className="btn-primary w-full">
                {addPayment.isPending ? "Saving..." : "Record payment"}
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Share document or resource</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(event) => setDocumentName(event.target.value)}
                  className="input-field"
                  placeholder="Interview checklist, embassy receipt, language guide..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={documentUrl}
                  onChange={(event) => setDocumentUrl(event.target.value)}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value)}
                  className="input-field"
                  placeholder="resource"
                />
              </div>
              <button onClick={handleDocumentShare} disabled={addDocument.isPending} className="btn-primary w-full">
                {addDocument.isPending ? "Sharing..." : "Share with client"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
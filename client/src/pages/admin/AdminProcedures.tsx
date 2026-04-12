import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminProcedures, useUpdateProcedureStatus } from "../../hooks/useApi";
import { useI18n } from "../../context/LanguageContext";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import type { ProcedureStatus } from "../../types";

const statuses: ProcedureStatus[] = ["pending", "documents_review", "in_progress", "approved", "rejected", "completed"];

export default function AdminProcedures() {
  const [filter, setFilter] = useState<string>("");
  const { data, isLoading } = useAdminProcedures({ status: filter || undefined });
  const updateStatus = useUpdateProcedureStatus();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [message, setMessage] = useState("");
  const { isFrench, formatCurrency, formatDate } = useI18n();

  const copy = isFrench
    ? {
        statusUpdated: "Statut mis a jour",
        updateFailed: "La mise a jour a echoue",
        title: "Tous les dossiers",
        allStatuses: "Tous les statuts",
        client: "Client",
        email: "Email",
        service: "Service",
        destination: "Destination",
        paid: "Paye",
        balance: "Solde",
        status: "Statut",
        date: "Date",
        actions: "Actions",
        manage: "Gerer",
        quickUpdate: "Mise a jour rapide",
        modalTitle: "Mettre a jour le statut",
        newStatus: "Nouveau statut",
        messageToCustomer: "Message au client",
        messagePlaceholder: "Expliquez le changement de statut...",
        updating: "Mise a jour...",
        update: "Mettre a jour",
        cancel: "Annuler",
      }
    : {
        statusUpdated: "Status updated",
        updateFailed: "Update failed",
        title: "All Procedures",
        allStatuses: "All Statuses",
        client: "Client",
        email: "Email",
        service: "Service",
        destination: "Destination",
        paid: "Paid",
        balance: "Balance",
        status: "Status",
        date: "Date",
        actions: "Actions",
        manage: "Manage",
        quickUpdate: "Quick update",
        modalTitle: "Update Procedure Status",
        newStatus: "New Status",
        messageToCustomer: "Message to customer",
        messagePlaceholder: "Explain the status change...",
        updating: "Updating...",
        update: "Update",
        cancel: "Cancel",
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

  const handleUpdate = async (id: string) => {
    if (!newStatus) return;
    try {
      await updateStatus.mutateAsync({ id, status: newStatus, message: message || undefined });
      toast.success(copy.statusUpdated);
      setEditingId(null);
      setNewStatus("");
      setMessage("");
    } catch {
      toast.error(copy.updateFailed);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const procedures = data?.procedures ?? [];
  const getTotalPaid = (procedure: { payments?: Array<{ amount: number }> }) =>
    (procedure.payments ?? []).reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-lg font-semibold text-gray-900">{copy.title}</h2>
        <select className="input-field !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">{copy.allStatuses}</option>
          {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">{copy.client}</th>
              <th className="pb-3 font-medium">{copy.email}</th>
              <th className="pb-3 font-medium">{copy.service}</th>
              <th className="pb-3 font-medium">{copy.destination}</th>
              <th className="pb-3 font-medium">{copy.paid}</th>
              <th className="pb-3 font-medium">{copy.balance}</th>
              <th className="pb-3 font-medium">{copy.status}</th>
              <th className="pb-3 font-medium">{copy.date}</th>
              <th className="pb-3 font-medium">{copy.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {procedures.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50 align-top">
                <td className="py-3">{p.user?.firstName} {p.user?.lastName}</td>
                <td className="py-3 text-gray-400">{p.user?.email}</td>
                <td className="py-3">{p.procedureType.name}</td>
                <td className="py-3">{p.destination.name}</td>
                <td className="py-3 text-gray-500">{formatCurrency(getTotalPaid(p), p.currency)}</td>
                <td className="py-3 text-gray-500">{formatCurrency(Math.max((p.agreedPrice ?? 0) - getTotalPaid(p), 0), p.currency)}</td>
                <td className="py-3"><StatusBadge status={p.status} /></td>
                <td className="py-3 text-gray-400">{formatDate(p.createdAt)}</td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Link to={`/admin/procedures/${p.id}`} className="text-amber-700 font-medium text-xs hover:underline">
                      {copy.manage}
                    </Link>
                    <button onClick={() => { setEditingId(p.id); setNewStatus(p.status); }} className="text-primary-600 font-medium text-xs hover:underline">
                      {copy.quickUpdate}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">{copy.modalTitle}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.newStatus}</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-field">
                  {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.messageToCustomer}</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input-field" rows={3} placeholder={copy.messagePlaceholder} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleUpdate(editingId)} disabled={updateStatus.isPending} className="btn-primary flex-1">
                  {updateStatus.isPending ? copy.updating : copy.update}
                </button>
                <button onClick={() => setEditingId(null)} className="btn-secondary">{copy.cancel}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

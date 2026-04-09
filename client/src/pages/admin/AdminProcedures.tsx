import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminProcedures, useUpdateProcedureStatus } from "../../hooks/useApi";
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

  const handleUpdate = async (id: string) => {
    if (!newStatus) return;
    try {
      await updateStatus.mutateAsync({ id, status: newStatus, message: message || undefined });
      toast.success("Status updated");
      setEditingId(null);
      setNewStatus("");
      setMessage("");
    } catch {
      toast.error("Update failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const procedures = data?.procedures ?? [];
  const getTotalPaid = (procedure: { payments?: Array<{ amount: number }> }) =>
    (procedure.payments ?? []).reduce((sum, payment) => sum + payment.amount, 0);
  const formatMoney = (value: number, currency: string) => `${value.toLocaleString()} ${currency}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-lg font-semibold text-gray-900">All Procedures</h2>
        <select className="input-field !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">Client</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Service</th>
              <th className="pb-3 font-medium">Destination</th>
              <th className="pb-3 font-medium">Paid</th>
              <th className="pb-3 font-medium">Balance</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {procedures.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50 align-top">
                <td className="py-3">{p.user?.firstName} {p.user?.lastName}</td>
                <td className="py-3 text-gray-400">{p.user?.email}</td>
                <td className="py-3">{p.procedureType.name}</td>
                <td className="py-3">{p.destination.name}</td>
                <td className="py-3 text-gray-500">{formatMoney(getTotalPaid(p), p.currency)}</td>
                <td className="py-3 text-gray-500">{formatMoney(Math.max((p.agreedPrice ?? 0) - getTotalPaid(p), 0), p.currency)}</td>
                <td className="py-3"><StatusBadge status={p.status} /></td>
                <td className="py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Link to={`/admin/procedures/${p.id}`} className="text-amber-700 font-medium text-xs hover:underline">
                      Manage
                    </Link>
                    <button onClick={() => { setEditingId(p.id); setNewStatus(p.status); }} className="text-primary-600 font-medium text-xs hover:underline">
                      Quick update
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
            <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">Update Procedure Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-field">
                  {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message to customer</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input-field" rows={3} placeholder="Explain the status change..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleUpdate(editingId)} disabled={updateStatus.isPending} className="btn-primary flex-1">
                  {updateStatus.isPending ? "Updating..." : "Update"}
                </button>
                <button onClick={() => setEditingId(null)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

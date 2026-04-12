import type { ProcedureStatus } from "../types";
import { useI18n } from "../context/LanguageContext";

export default function StatusBadge({ status }: { status: ProcedureStatus }) {
  const { isFrench } = useI18n();
  const labels = isFrench
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
        documents_review: "Documents Review",
        in_progress: "In Progress",
        approved: "Approved",
        rejected: "Rejected",
        completed: "Completed",
      };

  const config: Record<ProcedureStatus, { label: string; class: string }> = {
    pending: { label: labels.pending, class: "badge-pending" },
    documents_review: { label: labels.documents_review, class: "bg-orange-100 text-orange-800" },
    in_progress: { label: labels.in_progress, class: "badge-in-progress" },
    approved: { label: labels.approved, class: "badge-approved" },
    rejected: { label: labels.rejected, class: "badge-rejected" },
    completed: { label: labels.completed, class: "badge-completed" },
  };

  const { label, class: cls } = config[status] ?? { label: status, class: "badge" };
  return <span className={`badge ${cls}`}>{label}</span>;
}

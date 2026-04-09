import type { ProcedureStatus } from "../types";

const config: Record<ProcedureStatus, { label: string; class: string }> = {
  pending: { label: "Pending", class: "badge-pending" },
  documents_review: { label: "Documents Review", class: "bg-orange-100 text-orange-800" },
  in_progress: { label: "In Progress", class: "badge-in-progress" },
  approved: { label: "Approved", class: "badge-approved" },
  rejected: { label: "Rejected", class: "badge-rejected" },
  completed: { label: "Completed", class: "badge-completed" },
};

export default function StatusBadge({ status }: { status: ProcedureStatus }) {
  const { label, class: cls } = config[status] ?? { label: status, class: "badge" };
  return <span className={`badge ${cls}`}>{label}</span>;
}

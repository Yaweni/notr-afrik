import { Badge, type BadgeProps } from "@/components/ui/badge";
import { useI18n } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { ProcedureStatus } from "@/types";

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

  const config: Record<ProcedureStatus, { label: string; variant: BadgeProps["variant"]; className?: string }> = {
    pending: { label: labels.pending, variant: "warning" },
    documents_review: {
      label: labels.documents_review,
      variant: "outline",
      className: "border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-900/50 dark:bg-orange-900/30 dark:text-orange-300",
    },
    in_progress: { label: labels.in_progress, variant: "info" },
    approved: { label: labels.approved, variant: "success" },
    rejected: {
      label: labels.rejected,
      variant: "outline",
      className: "border-red-200 bg-red-100 text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-300",
    },
    completed: { label: labels.completed, variant: "success" },
  };

  const { label, variant, className } = config[status] ?? { label: status, variant: "outline" as const };

  return (
    <Badge
      variant={variant}
      className={cn("rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide", className)}
    >
      {label}
    </Badge>
  );
}

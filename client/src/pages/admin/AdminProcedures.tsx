import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3, FolderKanban, MessageSquareText, ScanSearch, Wallet } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/context/LanguageContext";
import { useAdminProcedures, useUpdateProcedureStatus } from "@/hooks/useApi";
import type { Procedure, ProcedureStatus } from "@/types";
import toast from "react-hot-toast";

const statuses: ProcedureStatus[] = ["pending", "documents_review", "in_progress", "approved", "rejected", "completed"];
const fieldClassName = "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function AdminProcedures() {
  const [filter, setFilter] = useState<string>("");
  const { data, isLoading } = useAdminProcedures({ status: filter || undefined });
  const updateStatus = useUpdateProcedureStatus();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ProcedureStatus | "">("");
  const [message, setMessage] = useState("");
  const { isFrench, formatCurrency, formatDate, formatNumber } = useI18n();

  const copy = isFrench
    ? {
        statusUpdated: "Statut mis a jour",
        updateFailed: "La mise a jour a echoue",
        title: "Tous les dossiers",
        subtitle: "Suivez le pipeline des dossiers, les soldes ouverts et les mises a jour client.",
        allStatuses: "Tous les statuts",
        filterLabel: "Filtrer par statut",
        client: "Client",
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
        modalSubtitle: "Envoyez une mise a jour claire au client et conservez le dossier aligne.",
        newStatus: "Nouveau statut",
        messageToCustomer: "Message au client",
        messagePlaceholder: "Expliquez le changement de statut...",
        updating: "Mise a jour...",
        update: "Mettre a jour",
        cancel: "Annuler",
        totalProcedures: "Dossiers",
        needsAttention: "A surveiller",
        activeCases: "En cours",
        openBalance: "Solde ouvert",
        currentStatus: "Statut actuel",
        records: "dossiers",
        noProcedures: "Aucun dossier ne correspond au filtre actuel.",
      }
    : {
        statusUpdated: "Status updated",
        updateFailed: "Update failed",
        title: "All Procedures",
        subtitle: "Track case flow, open balances, and client-facing status updates.",
        allStatuses: "All Statuses",
        filterLabel: "Filter by status",
        client: "Client",
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
        modalSubtitle: "Send a clear client update while keeping the case record aligned.",
        newStatus: "New Status",
        messageToCustomer: "Message to customer",
        messagePlaceholder: "Explain the status change...",
        updating: "Updating...",
        update: "Update",
        cancel: "Cancel",
        totalProcedures: "Procedures",
        needsAttention: "Needs Attention",
        activeCases: "In Progress",
        openBalance: "Open Balance",
        currentStatus: "Current Status",
        records: "records",
        noProcedures: "No procedures match the current filter.",
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

  const closeEditor = () => {
    setEditingId(null);
    setNewStatus("");
    setMessage("");
  };

  const handleUpdate = async (id: string) => {
    if (!newStatus) return;
    try {
      await updateStatus.mutateAsync({ id, status: newStatus, message: message || undefined });
      toast.success(copy.statusUpdated);
      closeEditor();
    } catch {
      toast.error(copy.updateFailed);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const procedures = (data?.procedures ?? []) as Procedure[];
  const getTotalPaid = (procedure: { payments?: Array<{ amount: number }> }) =>
    (procedure.payments ?? []).reduce((sum, payment) => sum + payment.amount, 0);
  const outstandingTotal = procedures.reduce(
    (sum, procedure) => sum + Math.max((procedure.agreedPrice ?? 0) - getTotalPaid(procedure), 0),
    0
  );
  const pendingCount = procedures.filter((procedure) => ["pending", "documents_review"].includes(procedure.status)).length;
  const inProgressCount = procedures.filter((procedure) => procedure.status === "in_progress").length;
  const summaryCurrency = procedures[0]?.currency ?? "XAF";
  const activeProcedure = procedures.find((procedure) => procedure.id === editingId);
  const selectedStatus = (newStatus || activeProcedure?.status || "pending") as ProcedureStatus;

  const cards = [
    {
      icon: FolderKanban,
      label: copy.totalProcedures,
      value: formatNumber(procedures.length),
      gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: ScanSearch,
      label: copy.needsAttention,
      value: formatNumber(pendingCount),
      gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
    {
      icon: Clock3,
      label: copy.activeCases,
      value: formatNumber(inProgressCount),
      gradient: "from-violet-500/20 via-violet-600/10 to-transparent",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: Wallet,
      label: copy.openBalance,
      value: formatCurrency(outstandingTotal, summaryCurrency),
      gradient: "from-emerald-500/20 via-emerald-600/10 to-transparent",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">{copy.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>
        </div>

        <div className="w-full max-w-xs xl:w-64">
          <Label htmlFor="procedure-status-filter" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {copy.filterLabel}
          </Label>
          <select
            id="procedure-status-filter"
            className={fieldClassName}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">{copy.allStatuses}</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{statusLabels[status]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, gradient, iconBg, iconColor }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">{value}</p>
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-base font-semibold text-foreground">{copy.title}</h2>
            <p className="text-sm text-muted-foreground">{formatNumber(procedures.length)} {copy.records}</p>
          </div>
        </div>

        {procedures.length === 0 ? (
          <div className="px-6 py-14 text-center text-sm text-muted-foreground">{copy.noProcedures}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.client}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.service}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.destination}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.paid}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.balance}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.status}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.actions}</th>
                </tr>
              </thead>
              <tbody>
                {procedures.map((procedure, index) => {
                  const totalPaid = getTotalPaid(procedure);
                  const balance = Math.max((procedure.agreedPrice ?? 0) - totalPaid, 0);

                  return (
                    <tr
                      key={procedure.id}
                      className={`align-top transition-colors hover:bg-muted/20 ${index !== procedures.length - 1 ? "border-b border-border" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{procedure.user?.firstName} {procedure.user?.lastName}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{procedure.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{procedure.procedureType.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{formatDate(procedure.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{procedure.destination.name}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{formatCurrency(totalPaid, procedure.currency)}</td>
                      <td className="px-6 py-4 font-medium text-amber-700 dark:text-amber-300">{formatCurrency(balance, procedure.currency)}</td>
                      <td className="px-6 py-4"><StatusBadge status={procedure.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/admin/procedures/${procedure.id}`}>{copy.manage}</Link>
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-primary hover:bg-primary/10 hover:text-primary"
                            onClick={() => {
                              setEditingId(procedure.id);
                              setNewStatus(procedure.status);
                              setMessage("");
                            }}
                          >
                            {copy.quickUpdate}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[1.75rem] border border-border bg-card/95 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground">{copy.modalTitle}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{copy.modalSubtitle}</p>
              </div>
              <StatusBadge status={selectedStatus} />
            </div>

            {activeProcedure && (
              <div className="mt-5 rounded-2xl border border-border bg-muted/30 px-4 py-3">
                <div className="font-medium text-foreground">{activeProcedure.user?.firstName} {activeProcedure.user?.lastName}</div>
                <div className="mt-1 text-sm text-muted-foreground">{activeProcedure.procedureType.name} · {activeProcedure.destination.name}</div>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="procedure-status">{copy.newStatus}</Label>
                <select
                  id="procedure-status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ProcedureStatus)}
                  className={`${fieldClassName} mt-2`}
                >
                  {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                </select>
              </div>

              <div>
                <Label htmlFor="procedure-message">{copy.messageToCustomer}</Label>
                <Textarea
                  id="procedure-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 min-h-[140px]"
                  rows={5}
                  placeholder={copy.messagePlaceholder}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={closeEditor}>
                  {copy.cancel}
                </Button>
                <Button type="button" onClick={() => handleUpdate(editingId)} disabled={updateStatus.isPending} className="sm:min-w-40">
                  {updateStatus.isPending ? copy.updating : copy.update}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

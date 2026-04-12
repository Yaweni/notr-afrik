import { useState } from "react";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Download, FileText, Users, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/LanguageContext";
import { useAdminFinance } from "@/hooks/useApi";
import api from "@/lib/api";
import type { ProcedureStatus } from "@/types";

export default function AdminFinancePage() {
  const { data, isLoading } = useAdminFinance();
  const [isExporting, setIsExporting] = useState(false);
  const { isFrench, formatCurrency, formatDate, formatNumber } = useI18n();

  const copy = isFrench
    ? {
        exportDownloaded: "Export finance telecharge",
        exportFailed: "Impossible d'exporter les finances",
        title: "Vue finances",
        subtitle: "Suivez les paiements hors ligne, les soldes ouverts et exportez l'historique.",
        exporting: "Export en cours...",
        exportCsv: "Exporter CSV",
        contractValue: "Valeur des contrats",
        collected: "Encaisse",
        outstanding: "Restant",
        recordedPayments: "Paiements enregistres",
        clientsWithBalance: "Clients avec solde",
        clientBalances: "Soldes clients",
        clients: "clients",
        client: "Client",
        procedures: "Dossiers",
        paid: "Paye",
        status: "Statut",
        lastPayment: "Dernier paiement",
        noPaymentYet: "Aucun paiement",
        openProcedureBalances: "Soldes dossiers ouverts",
        openBalances: "soldes ouverts",
        procedure: "Dossier",
        recentPayments: "Paiements recents",
        payments: "paiements",
        offlinePayment: "Paiement hors ligne",
      }
    : {
        exportDownloaded: "Finance export downloaded",
        exportFailed: "Unable to export finance data",
        title: "Finance Overview",
        subtitle: "Track offline payments, outstanding balances, and export payment history.",
        exporting: "Exporting...",
        exportCsv: "Export CSV",
        contractValue: "Contract Value",
        collected: "Collected",
        outstanding: "Outstanding",
        recordedPayments: "Recorded Payments",
        clientsWithBalance: "Clients with Balance",
        clientBalances: "Client Balances",
        clients: "clients",
        client: "Client",
        procedures: "Procedures",
        paid: "Paid",
        status: "Status",
        lastPayment: "Last Payment",
        noPaymentYet: "No payment yet",
        openProcedureBalances: "Open Procedure Balances",
        openBalances: "open balances",
        procedure: "Procedure",
        recentPayments: "Recent Payments",
        payments: "payments",
        offlinePayment: "Offline payment",
      };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await api.get("/admin/finance/export", { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `finance-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(copy.exportDownloaded);
    } catch {
      toast.error(copy.exportFailed);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  const currency = data.procedures[0]?.currency ?? data.clients[0]?.currency ?? "XAF";
  const openBalances = data.procedures.filter((procedure) => procedure.remainingBalance > 0);
  const recentPayments = data.payments.slice(0, 12);

  const cards = [
    {
      icon: Wallet,
      label: copy.contractValue,
      value: formatCurrency(data.overview.totalContractValue, currency),
      gradient: "from-slate-500/20 via-slate-600/10 to-transparent",
      iconBg: "bg-slate-500/15",
      iconColor: "text-slate-700 dark:text-slate-300",
    },
    {
      icon: CheckCircle2,
      label: copy.collected,
      value: formatCurrency(data.overview.totalCollected, currency),
      gradient: "from-emerald-500/20 via-emerald-600/10 to-transparent",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: AlertTriangle,
      label: copy.outstanding,
      value: formatCurrency(data.overview.totalOutstanding, currency),
      gradient: "from-primary/20 via-primary/10 to-transparent",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
    {
      icon: FileText,
      label: copy.recordedPayments,
      value: formatNumber(data.overview.paymentCount),
      gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Users,
      label: copy.clientsWithBalance,
      value: formatNumber(data.overview.customersWithBalance),
      gradient: "from-violet-500/20 via-violet-600/10 to-transparent",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-600 dark:text-violet-400",
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

        <Button onClick={handleExport} disabled={isExporting} className="self-start xl:self-auto">
          <Download className="w-4 h-4" />
          {isExporting ? copy.exporting : copy.exportCsv}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ icon: Icon, label, value, gradient, iconBg, iconColor }) => (
          <Card
            key={label}
            className="group relative overflow-hidden border-border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
            <CardContent className="relative flex items-start justify-between gap-4 p-6">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">{value}</p>
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-base font-semibold text-foreground">{copy.clientBalances}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{formatNumber(data.clients.length)} {copy.clients}</p>
          </div>
          <Badge variant="outline" className="self-start sm:self-auto">{formatNumber(data.overview.customersWithBalance)} {copy.clientsWithBalance}</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[940px] w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.client}</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.procedures}</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.contractValue}</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.paid}</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.outstanding}</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.lastPayment}</th>
              </tr>
            </thead>
            <tbody>
              {data.clients.map((client, index) => (
                <tr
                  key={client.userId}
                  className={`align-top transition-colors hover:bg-muted/20 ${index !== data.clients.length - 1 ? "border-b border-border" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{client.firstName} {client.lastName}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{formatNumber(client.procedureCount)}</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatCurrency(client.totalContractValue, client.currency)}</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatCurrency(client.totalPaid, client.currency)}</td>
                  <td className="px-6 py-4 font-medium text-amber-700 dark:text-amber-300">{formatCurrency(client.totalOutstanding, client.currency)}</td>
                  <td className="px-6 py-4 text-muted-foreground">{client.lastPaymentAt ? formatDate(client.lastPaymentAt) : copy.noPaymentYet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-8 xl:grid-cols-[1fr,1.1fr]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">{copy.openProcedureBalances}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{formatNumber(openBalances.length)} {copy.openBalances}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.procedure}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.client}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.paid}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.outstanding}</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.status}</th>
                </tr>
              </thead>
              <tbody>
                {openBalances.slice(0, 12).map((procedure, index) => (
                  <tr
                    key={procedure.procedureId}
                    className={`align-top transition-colors hover:bg-muted/20 ${index !== Math.min(openBalances.length, 12) - 1 ? "border-b border-border" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{procedure.procedureTypeName}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{procedure.destinationName}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{procedure.client.firstName} {procedure.client.lastName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatCurrency(procedure.totalPaid, procedure.currency)}</td>
                    <td className="px-6 py-4 font-medium text-amber-700 dark:text-amber-300">{formatCurrency(procedure.remainingBalance, procedure.currency)}</td>
                    <td className="px-6 py-4"><StatusBadge status={procedure.status as ProcedureStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">{copy.recentPayments}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{formatNumber(data.payments.length)} {copy.payments}</p>
            </div>
          </div>
          <div className="space-y-3 p-6">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="font-heading text-xl font-semibold text-foreground">{formatCurrency(payment.amount, payment.currency)}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{payment.client.firstName} {payment.client.lastName} · {payment.procedureTypeName} · {payment.destinationName}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{payment.receiptNumber} · {formatDate(payment.paidAt)}</div>
                    {payment.note && <p className="mt-3 text-sm text-muted-foreground">{payment.note}</p>}
                  </div>
                  <Badge variant="success" className="self-start">{copy.offlinePayment}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
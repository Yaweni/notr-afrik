import { useState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileText, Users, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useI18n } from "../../context/LanguageContext";
import { useAdminFinance } from "../../hooks/useApi";
import api from "../../lib/api";

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
  const cards = [
    { icon: Wallet, label: copy.contractValue, value: formatCurrency(data.overview.totalContractValue, currency), color: "bg-slate-100 text-slate-700" },
    { icon: CheckCircle2, label: copy.collected, value: formatCurrency(data.overview.totalCollected, currency), color: "bg-emerald-100 text-emerald-700" },
    { icon: AlertTriangle, label: copy.outstanding, value: formatCurrency(data.overview.totalOutstanding, currency), color: "bg-amber-100 text-amber-700" },
    { icon: FileText, label: copy.recordedPayments, value: formatNumber(data.overview.paymentCount), color: "bg-blue-100 text-blue-700" },
    { icon: Users, label: copy.clientsWithBalance, value: formatNumber(data.overview.customersWithBalance), color: "bg-rose-100 text-rose-700" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-gray-900">{copy.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{copy.subtitle}</p>
        </div>
        <button onClick={handleExport} disabled={isExporting} className="btn-primary inline-flex items-center gap-2">
          <Download className="w-4 h-4" />
          {isExporting ? copy.exporting : copy.exportCsv}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-gray-900">{copy.clientBalances}</h3>
          <span className="text-sm text-gray-400">{formatNumber(data.clients.length)} {copy.clients}</span>
        </div>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">{copy.client}</th>
                <th className="pb-3 font-medium">{copy.procedures}</th>
                <th className="pb-3 font-medium">{copy.contractValue}</th>
                <th className="pb-3 font-medium">{copy.paid}</th>
                <th className="pb-3 font-medium">{copy.outstanding}</th>
                <th className="pb-3 font-medium">{copy.lastPayment}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.clients.map((client) => (
                <tr key={client.userId} className="hover:bg-gray-50 align-top">
                  <td className="py-3">
                    <div className="font-medium text-gray-900">{client.firstName} {client.lastName}</div>
                    <div className="text-xs text-gray-400 mt-1">{client.email}</div>
                  </td>
                  <td className="py-3 text-gray-500">{client.procedureCount}</td>
                  <td className="py-3 text-gray-500">{formatCurrency(client.totalContractValue, client.currency)}</td>
                  <td className="py-3 text-gray-500">{formatCurrency(client.totalPaid, client.currency)}</td>
                  <td className="py-3 font-medium text-amber-700">{formatCurrency(client.totalOutstanding, client.currency)}</td>
                  <td className="py-3 text-gray-400">{client.lastPaymentAt ? formatDate(client.lastPaymentAt) : copy.noPaymentYet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr,1.1fr]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-gray-900">{copy.openProcedureBalances}</h3>
            <span className="text-sm text-gray-400">{formatNumber(data.procedures.filter((procedure) => procedure.remainingBalance > 0).length)} {copy.openBalances}</span>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">{copy.procedure}</th>
                  <th className="pb-3 font-medium">{copy.client}</th>
                  <th className="pb-3 font-medium">{copy.paid}</th>
                  <th className="pb-3 font-medium">{copy.outstanding}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.procedures.filter((procedure) => procedure.remainingBalance > 0).slice(0, 12).map((procedure) => (
                  <tr key={procedure.procedureId} className="hover:bg-gray-50 align-top">
                    <td className="py-3">
                      <div className="font-medium text-gray-900">{procedure.procedureTypeName}</div>
                      <div className="text-xs text-gray-400 mt-1">{procedure.destinationName}</div>
                    </td>
                    <td className="py-3 text-gray-500">{procedure.client.firstName} {procedure.client.lastName}</td>
                    <td className="py-3 text-gray-500">{formatCurrency(procedure.totalPaid, procedure.currency)}</td>
                    <td className="py-3 font-medium text-amber-700">{formatCurrency(procedure.remainingBalance, procedure.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-gray-900">{copy.recentPayments}</h3>
            <span className="text-sm text-gray-400">{formatNumber(data.payments.length)} {copy.payments}</span>
          </div>
          <div className="space-y-3">
            {data.payments.slice(0, 12).map((payment) => (
              <div key={payment.id} className="card flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</div>
                  <div className="text-sm text-gray-500 mt-1">{payment.client.firstName} {payment.client.lastName} · {payment.procedureTypeName} · {payment.destinationName}</div>
                  <div className="text-xs text-gray-400 mt-2">{payment.receiptNumber} · {formatDate(payment.paidAt)}</div>
                  {payment.note && <p className="text-sm text-gray-400 mt-2">{payment.note}</p>}
                </div>
                <div className="badge bg-emerald-100 text-emerald-700">{copy.offlinePayment}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
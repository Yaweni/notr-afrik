import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3, ExternalLink, FileText, MapPinned, Wallet } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/LanguageContext";
import { useProcedure } from "@/hooks/useApi";

export default function ProcedureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: proc, isLoading } = useProcedure(id!);
  const { isFrench, formatCurrency, formatDate, formatDateTime } = useI18n();

  const copy = isFrench
    ? {
        notFound: "Parcours introuvable",
        back: "Retour au tableau de bord",
        destination: "Destination",
        submitted: "Soumis le",
        updated: "Derniere mise a jour",
        notes: "Notes",
        totalFee: "Frais totaux",
        amountPaid: "Montant paye",
        remainingBalance: "Solde restant",
        timeline: "Chronologie du dossier",
        timelineSubtitle: "Chaque mise a jour garde le parcours lisible pour vous comme pour le bureau.",
        noUpdates: "Aucune mise a jour pour le moment.",
        sharedDocuments: "Documents partages",
        sharedDocumentsSubtitle: "Les ressources ajoutees par le bureau apparaissent ici des qu'elles sont prêtes.",
        addedOn: "ajoute le",
        open: "Ouvrir",
        noDocuments: "Aucun document ni ressource partage pour l'instant.",
        paymentHistory: "Historique des paiements",
        paymentHistorySubtitle: "Suivez ce qui a deja ete enregistre et ce qui reste ouvert.",
        recordedOn: "Enregistre le",
        offlinePayment: "Paiement hors ligne",
        noPayments: "Aucun paiement n'a encore ete enregistre pour ce dossier.",
      }
    : {
        notFound: "Procedure not found",
        back: "Back to dashboard",
        destination: "Destination",
        submitted: "Submitted",
        updated: "Last Updated",
        notes: "Notes",
        totalFee: "Total Fee",
        amountPaid: "Amount Paid",
        remainingBalance: "Remaining Balance",
        timeline: "Progress Timeline",
        timelineSubtitle: "Each update keeps the case readable for both you and the office.",
        noUpdates: "No updates yet.",
        sharedDocuments: "Shared Documents",
        sharedDocumentsSubtitle: "Resources added by the office appear here as soon as they are ready.",
        addedOn: "added on",
        open: "Open",
        noDocuments: "No documents or resources have been shared for this procedure yet.",
        paymentHistory: "Payment History",
        paymentHistorySubtitle: "Track what has already been recorded and what remains open.",
        recordedOn: "Recorded on",
        offlinePayment: "Offline payment",
        noPayments: "No payments have been recorded for this procedure yet.",
      };

  const totalPaid = (proc?.payments ?? []).reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = Math.max((proc?.agreedPrice ?? 0) - totalPaid, 0);

  if (isLoading) return <LoadingSpinner />;
  if (!proc) return <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground shadow-sm">{copy.notFound}</div>;

  const overviewCards = [
    { icon: MapPinned, label: copy.destination, value: proc.destination.name },
    { icon: Clock3, label: copy.submitted, value: formatDate(proc.createdAt) },
    { icon: CheckCircle2, label: copy.updated, value: formatDate(proc.updatedAt) },
    { icon: Wallet, label: copy.totalFee, value: formatCurrency(proc.agreedPrice, proc.currency) },
    { icon: Wallet, label: copy.amountPaid, value: formatCurrency(totalPaid, proc.currency), tone: "text-emerald-600 dark:text-emerald-400" },
    { icon: Wallet, label: copy.remainingBalance, value: formatCurrency(remainingBalance, proc.currency), tone: "text-amber-700 dark:text-amber-300" },
  ];

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-muted-foreground hover:text-foreground">
        <Link to="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          {copy.back}
        </Link>
      </Button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <MapPinned className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">{proc.procedureType.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{proc.destination.name}</p>
          </div>
        </div>
        <StatusBadge status={proc.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm font-medium text-muted-foreground">{label}</div>
            <div className={`mt-2 font-semibold ${tone ?? "text-foreground"}`}>{value}</div>
          </div>
        ))}
      </div>

      {proc.notes && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-heading text-base font-semibold text-foreground">{copy.notes}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{proc.notes}</p>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-heading text-base font-semibold text-foreground">{copy.timeline}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy.timelineSubtitle}</p>
        </div>
        <div className="p-6">
          {proc.updates.length > 0 ? (
            <div className="space-y-0">
              {proc.updates.map((update, index) => (
                <div key={update.id} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${index === 0 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {index === 0 ? <Clock3 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    {index < proc.updates.length - 1 && <div className="mt-2 h-full w-px bg-border" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground">{update.title}</div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{update.message}</p>
                    <div className="mt-2 text-xs text-muted-foreground">{formatDateTime(update.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{copy.noUpdates}</div>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-base font-semibold text-foreground">{copy.sharedDocuments}</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{copy.sharedDocumentsSubtitle}</p>
        </div>
        <div className="space-y-3 p-6">
          {proc.documents && proc.documents.length > 0 ? (
            proc.documents.map((document) => (
              <div key={document.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-background/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-foreground">{document.name}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{document.fileType}</Badge>
                    <span>{copy.addedOn} {formatDate(document.uploadedAt)}</span>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a href={document.fileUrl} target="_blank" rel="noreferrer">
                    {copy.open}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">{copy.noDocuments}</div>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-heading text-base font-semibold text-foreground">{copy.paymentHistory}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy.paymentHistorySubtitle}</p>
        </div>
        <div className="space-y-3 p-6">
          {proc.payments && proc.payments.length > 0 ? (
            proc.payments.map((payment) => (
              <div key={payment.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-background/70 p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="font-heading text-xl font-semibold text-foreground">{formatCurrency(payment.amount, payment.currency)}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{copy.recordedOn} {formatDate(payment.paidAt)}</div>
                  {payment.note && <p className="mt-3 text-sm leading-6 text-muted-foreground">{payment.note}</p>}
                </div>
                <Badge variant="success">{copy.offlinePayment}</Badge>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">{copy.noPayments}</div>
          )}
        </div>
      </section>
    </div>
  );
}

import { useAdminStats } from "../../hooks/useApi";
import { Users, FileText, Clock } from "lucide-react";
import { useI18n } from "../../context/LanguageContext";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();
  const { isFrench, formatDate, formatNumber } = useI18n();

  if (isLoading) return <LoadingSpinner />;
  if (!stats) return null;

  const copy = isFrench
    ? {
        totalCustomers: "Clients totaux",
        totalProcedures: "Dossiers totaux",
        pendingProcedures: "A traiter / en cours",
        recentProcedures: "Derniers dossiers",
        client: "Client",
        service: "Service",
        destination: "Destination",
        status: "Statut",
        date: "Date",
      }
    : {
        totalCustomers: "Total Customers",
        totalProcedures: "Total Procedures",
        pendingProcedures: "Pending / In Progress",
        recentProcedures: "Recent Procedures",
        client: "Client",
        service: "Service",
        destination: "Destination",
        status: "Status",
        date: "Date",
      };

  const cards = [
    { icon: Users, label: copy.totalCustomers, value: formatNumber(stats.totalUsers), color: "bg-blue-100 text-blue-600" },
    { icon: FileText, label: copy.totalProcedures, value: formatNumber(stats.totalProcedures), color: "bg-purple-100 text-purple-600" },
    { icon: Clock, label: copy.pendingProcedures, value: formatNumber(stats.pendingProcedures), color: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Procedures */}
      <h2 className="font-heading text-lg font-semibold text-gray-900 mb-4">{copy.recentProcedures}</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">{copy.client}</th>
              <th className="pb-3 font-medium">{copy.service}</th>
              <th className="pb-3 font-medium">{copy.destination}</th>
              <th className="pb-3 font-medium">{copy.status}</th>
              <th className="pb-3 font-medium">{copy.date}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stats.recentProcedures.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3">{p.user?.firstName} {p.user?.lastName}</td>
                <td className="py-3">{p.procedureType.name}</td>
                <td className="py-3">{p.destination.name}</td>
                <td className="py-3"><StatusBadge status={p.status} /></td>
                <td className="py-3 text-gray-400">{formatDate(p.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

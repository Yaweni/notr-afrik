import { useAdminStats } from "../../hooks/useApi";
import { Users, FileText, Clock, BookOpen, GraduationCap } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) return <LoadingSpinner />;
  if (!stats) return null;

  const cards = [
    { icon: Users, label: "Total Customers", value: stats.totalUsers, color: "bg-blue-100 text-blue-600" },
    { icon: FileText, label: "Total Procedures", value: stats.totalProcedures, color: "bg-purple-100 text-purple-600" },
    { icon: Clock, label: "Pending/In Progress", value: stats.pendingProcedures, color: "bg-amber-100 text-amber-600" },
    { icon: BookOpen, label: "Active Courses", value: stats.activeCourses, color: "bg-emerald-100 text-emerald-600" },
    { icon: GraduationCap, label: "Total Enrollments", value: stats.totalEnrollments, color: "bg-pink-100 text-pink-600" },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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
      <h2 className="font-heading text-lg font-semibold text-gray-900 mb-4">Recent Procedures</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">Client</th>
              <th className="pb-3 font-medium">Service</th>
              <th className="pb-3 font-medium">Destination</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stats.recentProcedures.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3">{p.user?.firstName} {p.user?.lastName}</td>
                <td className="py-3">{p.procedureType.name}</td>
                <td className="py-3">{p.destination.name}</td>
                <td className="py-3"><StatusBadge status={p.status} /></td>
                <td className="py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

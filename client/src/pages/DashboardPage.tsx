import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMyProcedures, useMyEnrollments, useNotifications } from "../hooks/useApi";
import { FileText, BookOpen, Bell, ArrowRight, Clock } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: procedures, isLoading: procLoading } = useMyProcedures();
  const { data: enrollments, isLoading: enrLoading } = useMyEnrollments();
  const { data: notifications } = useNotifications();

  const unreadNotifs = notifications?.filter((n) => !n.isRead).length ?? 0;
  const getTotalPaid = (procedure: { payments?: Array<{ amount: number }> }) =>
    (procedure.payments ?? []).reduce((sum, payment) => sum + payment.amount, 0);
  const formatMoney = (value: number, currency: string) => `${value.toLocaleString()} ${currency}`;

  if (procLoading || enrLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-1">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-500">Here's an overview of your immigration journey.</p>
      </div>

      {/* Quick stats */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{procedures?.length ?? 0}</div>
            <div className="text-sm text-gray-500">Active Procedures</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{enrollments?.length ?? 0}</div>
            <div className="text-sm text-gray-500">Course Enrollments</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Bell className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{unreadNotifs}</div>
            <div className="text-sm text-gray-500">Unread Notifications</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Procedures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-gray-900">My Procedures</h2>
            <Link to="/procedures" className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              New application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {procedures && procedures.length > 0 ? (
            <div className="space-y-4">
              {procedures.map((proc) => (
                <Link to={`/dashboard/procedures/${proc.id}`} key={proc.id} className="card block hover:border-primary-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{proc.procedureType.name}</h3>
                    <StatusBadge status={proc.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{proc.destination.name}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(proc.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    Paid {formatMoney(getTotalPaid(proc), proc.currency)} of {formatMoney(proc.agreedPrice, proc.currency)}
                  </div>
                  {proc.updates.length > 0 && (
                    <p className="mt-2 text-sm text-gray-400 truncate">Latest: {proc.updates[0].message}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8 text-gray-400">
              No procedures yet. <Link to="/procedures" className="text-primary-600 font-semibold">Start one</Link>
            </div>
          )}
        </div>

        {/* Enrollments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-gray-900">My Courses</h2>
            <Link to="/courses" className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Browse courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {enrollments && enrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.map((enr) => (
                <div key={enr.id} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{enr.course.title}</h3>
                    <span className="badge bg-emerald-100 text-emerald-700">{enr.status.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{enr.course.language} {enr.course.level}</span>
                    <span>{enr.course.destination?.name}</span>
                    <span>{enr.course.schedule}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8 text-gray-400">
              No enrollments yet. <Link to="/courses" className="text-primary-600 font-semibold">Browse courses</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

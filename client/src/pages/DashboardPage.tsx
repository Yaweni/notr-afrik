import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/LanguageContext";
import { useMyProcedures, useMyEnrollments, useNotifications } from "../hooks/useApi";
import { FileText, BookOpen, Bell, ArrowRight, Clock } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DashboardPage() {
  const { user } = useAuth();
  const { isFrench, formatCurrency, formatDate } = useI18n();
  const { data: procedures, isLoading: procLoading } = useMyProcedures();
  const { data: enrollments, isLoading: enrLoading } = useMyEnrollments();
  const { data: notifications } = useNotifications();

  const copy = isFrench
    ? {
        welcome: "Bon retour",
        overview: "Voici une vue d'ensemble de votre projet d'immigration.",
        activeProcedures: "Parcours actifs",
        enrollments: "Inscriptions aux cours",
        unreadNotifications: "Notifications non lues",
        myProcedures: "Mes parcours",
        newApplication: "Nouveau dossier",
        paidOf: "Paye {paid} sur {total}",
        latest: "Derniere mise a jour : {message}",
        noProcedures: "Aucun parcours pour le moment.",
        startOne: "Commencer",
        myCourses: "Mes cours",
        browseCourses: "Voir les cours",
        noEnrollments: "Aucune inscription pour le moment.",
      }
    : {
        welcome: "Welcome back",
        overview: "Here's an overview of your immigration journey.",
        activeProcedures: "Active Procedures",
        enrollments: "Course Enrollments",
        unreadNotifications: "Unread Notifications",
        myProcedures: "My Procedures",
        newApplication: "New application",
        paidOf: "Paid {paid} of {total}",
        latest: "Latest: {message}",
        noProcedures: "No procedures yet.",
        startOne: "Start one",
        myCourses: "My Courses",
        browseCourses: "Browse courses",
        noEnrollments: "No enrollments yet.",
      };

  const unreadNotifs = notifications?.filter((n) => !n.isRead).length ?? 0;
  const getTotalPaid = (procedure: { payments?: Array<{ amount: number }> }) =>
    (procedure.payments ?? []).reduce((sum, payment) => sum + payment.amount, 0);

  if (procLoading || enrLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-1">
          {copy.welcome}, {user?.firstName}!
        </h1>
        <p className="text-gray-500">{copy.overview}</p>
      </div>

      {/* Quick stats */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{procedures?.length ?? 0}</div>
            <div className="text-sm text-gray-500">{copy.activeProcedures}</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{enrollments?.length ?? 0}</div>
            <div className="text-sm text-gray-500">{copy.enrollments}</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Bell className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{unreadNotifs}</div>
            <div className="text-sm text-gray-500">{copy.unreadNotifications}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Procedures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-gray-900">{copy.myProcedures}</h2>
            <Link to="/procedures" className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              {copy.newApplication} <ArrowRight className="w-4 h-4" />
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
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(proc.createdAt)}</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    {copy.paidOf
                      .replace("{paid}", formatCurrency(getTotalPaid(proc), proc.currency))
                      .replace("{total}", formatCurrency(proc.agreedPrice, proc.currency))}
                  </div>
                  {proc.updates.length > 0 && (
                    <p className="mt-2 text-sm text-gray-400 truncate">{copy.latest.replace("{message}", proc.updates[0].message)}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8 text-gray-400">
              {copy.noProcedures} <Link to="/procedures" className="text-primary-600 font-semibold">{copy.startOne}</Link>
            </div>
          )}
        </div>

        {/* Enrollments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-gray-900">{copy.myCourses}</h2>
            <Link to="/courses" className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              {copy.browseCourses} <ArrowRight className="w-4 h-4" />
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
              {copy.noEnrollments} <Link to="/courses" className="text-primary-600 font-semibold">{copy.browseCourses}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

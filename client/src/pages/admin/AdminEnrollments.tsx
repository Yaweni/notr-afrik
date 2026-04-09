import { useAdminEnrollments } from "../../hooks/useApi";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminEnrollments() {
  const { data: enrollments, isLoading } = useAdminEnrollments();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-gray-900 mb-6">All Enrollments</h2>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">Student</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Course</th>
              <th className="pb-3 font-medium">Language</th>
              <th className="pb-3 font-medium">Level</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(enrollments as any[])?.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900">{e.user?.firstName} {e.user?.lastName}</td>
                <td className="py-3 text-gray-500">{e.user?.email}</td>
                <td className="py-3">{e.course?.title}</td>
                <td className="py-3">{e.course?.language}</td>
                <td className="py-3"><span className="badge bg-primary-100 text-primary-700">{e.course?.level}</span></td>
                <td className="py-3">
                  <span className="badge bg-emerald-100 text-emerald-700">{e.status?.replace(/_/g, " ")}</span>
                </td>
                <td className="py-3 text-gray-400">{new Date(e.enrolledAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

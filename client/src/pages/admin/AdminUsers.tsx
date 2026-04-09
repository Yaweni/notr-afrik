import { useAdminUsers } from "../../hooks/useApi";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-gray-900 mb-6">All Users</h2>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Phone</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Procedures</th>
              <th className="pb-3 font-medium">Enrollments</th>
              <th className="pb-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(users as any[])?.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                <td className="py-3 text-gray-500">{u.email}</td>
                <td className="py-3 text-gray-500">{u.phone || "—"}</td>
                <td className="py-3">
                  <span className={`badge ${u.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 text-center">{u._count?.procedures ?? 0}</td>
                <td className="py-3 text-center">{u._count?.enrollments ?? 0}</td>
                <td className="py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

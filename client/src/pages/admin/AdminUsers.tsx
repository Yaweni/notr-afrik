import { useAdminUsers } from "../../hooks/useApi";
import { useI18n } from "../../context/LanguageContext";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();
  const { isFrench, formatDate } = useI18n();

  if (isLoading) return <LoadingSpinner />;

  const copy = isFrench
    ? {
        title: "Tous les clients",
        name: "Nom",
        email: "Email",
        phone: "Telephone",
        role: "Role",
        procedures: "Dossiers",
        joined: "Inscrit le",
        noPhone: "Non renseigne",
        customer: "Client",
        admin: "Admin",
        staff: "Equipe",
      }
    : {
        title: "All Users",
        name: "Name",
        email: "Email",
        phone: "Phone",
        role: "Role",
        procedures: "Procedures",
        joined: "Joined",
        noPhone: "Not provided",
        customer: "Customer",
        admin: "Admin",
        staff: "Staff",
      };

  const roleLabels = {
    customer: copy.customer,
    admin: copy.admin,
    staff: copy.staff,
  };

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-gray-900 mb-6">{copy.title}</h2>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">{copy.name}</th>
              <th className="pb-3 font-medium">{copy.email}</th>
              <th className="pb-3 font-medium">{copy.phone}</th>
              <th className="pb-3 font-medium">{copy.role}</th>
              <th className="pb-3 font-medium">{copy.procedures}</th>
              <th className="pb-3 font-medium">{copy.joined}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users?.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                <td className="py-3 text-gray-500">{u.email}</td>
                <td className="py-3 text-gray-500">{u.phone || copy.noPhone}</td>
                <td className="py-3">
                  <span className={`badge ${u.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"}`}>
                    {roleLabels[u.role]}
                  </span>
                </td>
                <td className="py-3 text-center">{u._count?.procedures ?? 0}</td>
                <td className="py-3 text-gray-400">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

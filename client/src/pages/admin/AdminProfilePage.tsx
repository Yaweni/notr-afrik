import { BadgeCheck, ShieldCheck, UsersRound } from "lucide-react";
import AccountSettingsPanel from "../../components/AccountSettingsPanel";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../context/LanguageContext";

export default function AdminProfilePage() {
  const { user } = useAuth();
  const { isFrench } = useI18n();

  const copy = isFrench
    ? {
        title: "Profil et securite",
        subtitle: "Gerez votre acces administratif, vos informations de contact et les parametres utiles a la MFA.",
        accessTitle: "Acces office",
        role: "Role",
        identity: "Identite",
        accessNote: "A terme, cette zone accueillera aussi les permissions detaillees, les appareils de confiance et les validations multi-facteurs.",
      }
    : {
        title: "Profile and Security",
        subtitle: "Manage your admin access, contact information, and details that will support MFA later on.",
        accessTitle: "Office Access",
        role: "Role",
        identity: "Identity",
        accessNote: "Later, this area should also surface granular permissions, trusted devices, and multi-factor validation settings.",
      };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-slate-100">{copy.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <ShieldCheck className="h-4 w-4 text-primary-600" />
            {copy.accessTitle}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{copy.role}</div>
          <div className="mt-1 font-medium capitalize text-slate-900 dark:text-slate-100">{user?.role}</div>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <UsersRound className="h-4 w-4 text-primary-600" />
            {copy.identity}
          </div>
          <div className="font-medium text-slate-900 dark:text-slate-100">{user?.firstName} {user?.lastName}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</div>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <BadgeCheck className="h-4 w-4 text-primary-600" />
            MFA
          </div>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{copy.accessNote}</p>
        </div>
      </div>

      <AccountSettingsPanel variant="admin" />
    </div>
  );
}
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from "../hooks/useApi";
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, FileText, BookOpen } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const typeIcon: Record<string, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  procedure: FileText,
  course: BookOpen,
};

const typeColor: Record<string, string> = {
  info: "bg-blue-100 text-blue-600",
  success: "bg-green-100 text-green-600",
  warning: "bg-amber-100 text-amber-600",
  procedure: "bg-purple-100 text-purple-600",
  course: "bg-emerald-100 text-emerald-600",
};

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();

  if (isLoading) return <LoadingSpinner />;

  const unread = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6" /> Notifications
          </h1>
          <p className="text-gray-500 text-sm">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={() => markAllRead.mutate()} className="btn-secondary !py-2 !px-4 text-sm flex items-center gap-2">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = typeIcon[n.type] ?? Info;
            const color = typeColor[n.type] ?? typeColor.info;
            return (
              <div
                key={n.id}
                className={`card flex items-start gap-4 cursor-pointer ${!n.isRead ? "border-l-4 border-l-primary-500 bg-primary-50/30" : ""}`}
                onClick={() => !n.isRead && markRead.mutate(n.id)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{n.title}</h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12 text-gray-400">No notifications yet.</div>
      )}
    </div>
  );
}

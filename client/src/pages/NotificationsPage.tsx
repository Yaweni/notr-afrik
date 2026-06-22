import { AlertTriangle, Bell, BookOpen, CheckCheck, CheckCircle, FileText, Info, Sparkles } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/LanguageContext";
import { useMarkAllRead, useMarkNotificationRead, useNotifications } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

const typeIcon: Record<string, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  procedure: FileText,
  course: BookOpen,
};

const typeColor: Record<string, string> = {
  info: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  warning: "bg-primary/15 text-primary",
  procedure: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  course: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();
  const { isFrench, formatDate, getLocalizedValue } = useI18n();

  const copy = isFrench
    ? {
        title: "Notifications",
        unread: "non lues",
        markAllRead: "Tout marquer comme lu",
        empty: "Aucune notification pour le moment.",
        subtitle: "Retrouvez les mises a jour dossier, cours et bureau depuis une seule file.",
      }
    : {
        title: "Notifications",
        unread: "unread",
        markAllRead: "Mark all read",
        empty: "No notifications yet.",
        subtitle: "Keep your case, course, and office updates visible in one queue.",
      };

  if (isLoading) return <LoadingSpinner />;

  const unread = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">{copy.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={unread > 0 ? "warning" : "outline"} className={unread > 0 ? "border-primary/20 bg-primary/15 text-primary" : ""}>
            {unread} {copy.unread}
          </Badge>
          {unread > 0 && (
            <Button type="button" variant="outline" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
              <CheckCheck className="h-4 w-4" />
              {copy.markAllRead}
            </Button>
          )}
        </div>
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = typeIcon[notification.type] ?? Info;
            const color = typeColor[notification.type] ?? typeColor.info;

            return (
              <div
                key={notification.id}
                className={cn(
                  "group flex cursor-pointer gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  !notification.isRead && "border-primary/30 bg-primary/5"
                )}
                onClick={() => !notification.isRead && markRead.mutate(notification.id)}
              >
                <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", color)}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{getLocalizedValue(notification.title, notification.titleFr)}</h3>
                        {!notification.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{getLocalizedValue(notification.message, notification.messageFr)}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground shadow-sm">
          {copy.empty}
        </div>
      )}
    </div>
  );
}

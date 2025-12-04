import { Button } from "@/components/ui/button";
import { Bell, Loader2, CheckCircle2, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { create } from "zustand";

const style = document.createElement("style");
style.textContent = `
  @keyframes slide {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(400%);
    }
  }
`;
document.head.appendChild(style);

interface Notification {
  id: number;
  type: "pending" | "complete";
  title: string;
  message: string;
  timestamp: string;
  seen: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotification: (id: number) => void;
  markAllAsSeen: () => void;
  updateNotificationStatus: (id: number, type: "pending" | "complete") => void;
  cleanupOldSeen: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [
    {
      id: 1,
      type: "pending",
      title: "System Update",
      message: "Installing security patches...",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      seen: false,
    },
    {
      id: 2,
      type: "pending",
      title: "Database Migration",
      message: "Migrating user data",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      seen: false,
    },
    {
      id: 3,
      type: "complete",
      title: "Backup Complete",
      message: "Daily backup finished",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      seen: false,
    },
    {
      id: 4,
      type: "complete",
      title: "Profile Updated",
      message: "Settings saved",
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      seen: false,
    },
  ],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  clearNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  markAllAsSeen: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, seen: true })),
    })),
  updateNotificationStatus: (id, type) =>
    set((state) => {
      const updatedNotifications = state.notifications.map((n) =>
        n.id === id
          ? { ...n, type, seen: false, timestamp: new Date().toISOString() }
          : n
      );

      updatedNotifications.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      return { notifications: updatedNotifications };
    }),
  cleanupOldSeen: () =>
    set((state) => {
      const seenNotifications = state.notifications.filter((n) => n.seen);
      const unseenNotifications = state.notifications.filter((n) => !n.seen);

      const recentSeen = seenNotifications
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 5);

      return {
        notifications: [...unseenNotifications, ...recentSeen].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      };
    }),
}));

const Notifications = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    notifications,
    markAllAsSeen,
    clearNotification,
    updateNotificationStatus,
    cleanupOldSeen,
  } = useNotificationStore();
  const popupRef = useRef<HTMLDivElement>(null);
  const cleanupTimerRef = useRef<NodeJS.Timeout | null>(null);

  const unseenNotifications = notifications.filter((n) => !n.seen);
  const hasUnseen = unseenNotifications.length > 0;
  const hasPending = notifications.some((n) => n.type === "pending");

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return "now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  useEffect(() => {
    if (isOpen && hasUnseen) {
      markAllAsSeen();

      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }

      cleanupTimerRef.current = setTimeout(() => {
        cleanupOldSeen();
      }, 15000);
    }

    return () => {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }
    };
  }, [isOpen, hasUnseen, markAllAsSeen, cleanupOldSeen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      const pendingNotif = notifications.find((n) => n.type === "pending");
      if (pendingNotif) {
        updateNotificationStatus(pendingNotif.id, "complete");
      }
    }, 15000);

    const timer2 = setTimeout(() => {
      const pendingNotifs = notifications.filter((n) => n.type === "pending");
      if (pendingNotifs[1]) {
        updateNotificationStatus(pendingNotifs[1].id, "complete");
      }
    }, 25000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {hasPending ? (
          <Loader2 className="w-3 h-3 animate-spin text-[#c1585c] absolute -top-0.5 -right-0.5" />
        ) : (
          hasUnseen && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#c1585c] rounded-full"></span>
          )
        )}
      </Button>

      {isOpen && (
        <div
          ref={popupRef}
          className="absolute right-0 top-12 w-80 max-h-96 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50"
        >
          <div className="p-3 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm text-foreground">
              Notifications
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-2 p-2.5 border-b border-border hover:bg-accent transition-colors ${
                    !notification.seen ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {notification.type === "pending" ? (
                      <div className="relative">
                        <Loader2 className="w-4 h-4 text-[#c1585c] animate-spin" />
                      </div>
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-xs text-foreground">
                        {notification.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {notification.message}
                    </p>
                    {notification.type === "pending" && (
                      <div className="mt-1.5">
                        <div className="h-1 bg-secondary rounded-full overflow-hidden relative">
                          <div className="absolute h-full w-1/3 bg-[#c1585c] rounded-full animate-[slide_1.5s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => clearNotification(notification.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

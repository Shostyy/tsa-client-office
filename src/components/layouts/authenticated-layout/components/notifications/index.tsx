"use client";
import { Button } from "@/components/ui/button";
import { Bell, Loader2, CheckCircle2, X, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUpdatesStore } from "@/stores/updates.store";
import { useTranslation } from "react-i18next";

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

const Notifications = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    sessions,
    clearSessions,
    markAsSeen,
    hasUnseenCompleted,
    hasPending,
    checkForInterruptedUpdates,
  } = useUpdatesStore();
  const popupRef = useRef<HTMLDivElement>(null);

  // Check for interrupted updates on mount
  useEffect(() => {
    checkForInterruptedUpdates();
  }, [checkForInterruptedUpdates]);

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );

  const isPending = hasPending();
  const hasUnseen = hasUnseenCompleted();

  const formatTime = (timestamp: Date): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return "now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  const getTitle = (session: (typeof sessions)[0]) => {
    if (session.status === "pending") {
      return t(`SSE.${session.type}.pending`);
    }
    if (session.status === "in-progress") {
      return t(`SSE.${session.type}.in-progress`);
    }
    if (session.status === "completed") {
      return t(`SSE.${session.type}.completed`);
    }
    if (session.status === "failed") {
      return t(`SSE.${session.type}.failed`);
    }
    if (session.status === "failed-user-interrupted") {
      return t(`SSE.${session.type}.failed-user-interrupted`);
    }
    return session.type;
  };

  const getMessage = (session: (typeof sessions)[0]) => {
    if (session.message) return session.message;
    if (session.error) return t(session.error); // Translate error key
    if (session.status === "pending") return t("SSE.initializing");
    if (session.status === "in-progress") return t("SSE.processing");
    return "";
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && hasUnseen) {
      // Mark as seen when opening if there are unseen notifications
      markAsSeen();
    }
  };

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

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={handleOpen}
      >
        <Bell className="w-5 h-5" />
        {isPending ? (
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
              {t("notifications")}
            </h3>
            <div className="flex items-center gap-1">
              {sessions.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={clearSessions}
                >
                  {t("clearAll")}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-80">
            {sortedSessions.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {t("noNotifications")}
              </div>
            ) : (
              sortedSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex gap-2 p-2.5 border-b border-border hover:bg-accent transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {session.status === "pending" ||
                    session.status === "in-progress" ? (
                      <div className="relative">
                        <Loader2 className="w-4 h-4 text-[#c1585c] animate-spin" />
                      </div>
                    ) : session.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-xs text-foreground">
                        {getTitle(session)}
                      </h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatTime(session.startedAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getMessage(session)}
                    </p>
                    {(session.status === "pending" ||
                      session.status === "in-progress") && (
                      <div className="mt-1.5">
                        <div className="h-1 bg-secondary rounded-full overflow-hidden relative">
                          <div className="absolute h-full w-1/3 bg-[#c1585c] rounded-full animate-[slide_1.5s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    )}
                  </div>
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

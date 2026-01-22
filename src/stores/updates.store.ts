import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UpdateSession {
  id: string;
  type: string;
  status:
    | "pending"
    | "in-progress"
    | "completed"
    | "failed"
    | "failed-user-interrupted";
  startedAt: Date;
  completedAt?: Date;
  message?: string;
  description?: string;
  error?: string;
  seen: boolean;
}

interface UpdatesStore {
  sessions: UpdateSession[];

  startUpdate: (type: string, description?: string) => string;
  setInProgress: (id: string, message?: string) => void;
  completeUpdate: (id: string, message?: string) => void;
  failUpdate: (id: string, error: string) => void;
  markAsSeen: () => void;
  getSession: (id: string) => UpdateSession | undefined;
  getSessionsByType: (type: string) => UpdateSession[];
  clearSessions: () => void;
  hasUnseenCompleted: () => boolean;
  hasPending: () => boolean;
  checkForInterruptedUpdates: () => void;
}

export const useUpdatesStore = create<UpdatesStore>()(
  persist(
    (set, get) => ({
      sessions: [],

      startUpdate: (type, description) => {
        const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newSession: UpdateSession = {
          id,
          type,
          status: "pending",
          startedAt: new Date(),
          description,
          seen: false,
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));

        return id;
      },

      setInProgress: (id, message) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id
              ? { ...session, status: "in-progress" as const, message }
              : session,
          ),
        }));
      },

      completeUpdate: (id, message) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id
              ? {
                  ...session,
                  status: "completed" as const,
                  completedAt: new Date(),
                  message,
                  seen: false,
                }
              : session,
          ),
        }));
      },

      failUpdate: (id, errorKey) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id
              ? {
                  ...session,
                  status: "failed" as const,
                  completedAt: new Date(),
                  error: errorKey,
                  seen: false,
                }
              : session,
          ),
        }));
      },

      markAsSeen: () => {
        set((state) => ({
          sessions: state.sessions.map((session) => ({
            ...session,
            seen: true,
          })),
        }));
      },

      getSession: (id) => {
        return get().sessions.find((s) => s.id === id);
      },

      getSessionsByType: (type) => {
        return get().sessions.filter((s) => s.type === type);
      },

      clearSessions: () => {
        set({ sessions: [] });
      },

      hasUnseenCompleted: () => {
        return get().sessions.some(
          (s) =>
            !s.seen &&
            (s.status === "completed" ||
              s.status === "failed" ||
              s.status === "failed-user-interrupted"),
        );
      },

      hasPending: () => {
        return get().sessions.some(
          (s) => s.status === "pending" || s.status === "in-progress",
        );
      },

      checkForInterruptedUpdates: () => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.status === "pending" || session.status === "in-progress"
              ? {
                  ...session,
                  status: "failed-user-interrupted" as const,
                  completedAt: new Date(),
                  error: "SSE.errors.userInterrupted",
                  seen: false,
                }
              : session,
          ),
        }));
      },
    }),
    {
      name: "updates-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

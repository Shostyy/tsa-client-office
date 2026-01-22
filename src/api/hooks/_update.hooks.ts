import { useQueryClient } from "@tanstack/react-query";
import { useUpdatesStore } from "@/stores/updates.store";

type SSEEvent<T = unknown> = {
  type: "connected" | "update" | "error";
  data?: T;
};

export function useSSEUpdate<
  TData,
  TEvent extends SSEEvent<TData> = SSEEvent<TData>,
>(
  updateType: string,
  service: {
    subscribeToUpdates: (
      onMessage: (event: TEvent) => void,
      onError?: (error: Error) => void,
    ) => () => void;
    initializeUpdate: () => Promise<void>;
  },
  queryKey: string[],
  description?: string,
) {
  const queryClient = useQueryClient();
  const { startUpdate, setInProgress, completeUpdate, failUpdate } =
    useUpdatesStore();

  const initiateUpdate = async () => {
    const sessionId = startUpdate(updateType, description);

    try {
      const unsubscribe = service.subscribeToUpdates(
        (event: TEvent) => {
          if (event.type === "connected") {
            setInProgress(sessionId);
          }

          if (event.type === "update" && event.data) {
            completeUpdate(sessionId);
            queryClient.invalidateQueries({ queryKey });
            unsubscribe();
          }

          if (event.type === "error") {
            failUpdate(sessionId, "SSE.errors.connectionError");
            unsubscribe();
          }
        },
        () => {
          failUpdate(sessionId, "SSE.errors.connectionError");
        },
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
      await service.initializeUpdate();
      setInProgress(sessionId);

      return { sessionId, unsubscribe };
    } catch (error) {
      failUpdate(sessionId, "SSE.errors.updateFailed");
      throw error;
    }
  };

  return { initiateUpdate };
}

import { apiClient } from "../clients/api-client";

export type UpdateEvent<T = unknown> =
  | { type: "connected" }
  | { type: "update"; data: T }
  | { type: "error"; message: string };

export interface SSEUpdateConfig {
  subscribeEndpoint: string;
  initializeEndpoint: string;
  queryKey: string[];
}

export interface BaseUpdateService<T> {
  config: SSEUpdateConfig;
  subscribeToUpdates: (
    onMessage: (event: UpdateEvent<T>) => void,
    onError?: (error: Error) => void,
  ) => () => void;
  initializeUpdate: () => Promise<void>;
}

export function createUpdateService<T>(
  config: SSEUpdateConfig,
): BaseUpdateService<T> {
  return {
    config,

    subscribeToUpdates: (
      onMessage: (event: UpdateEvent<T>) => void,
      onError?: (error: Error) => void,
    ): (() => void) => {
      return apiClient.subscribeToSSE<T>(config.subscribeEndpoint, {
        onOpen: () => {
          onMessage({ type: "connected" });
        },
        onMessage: (data) => {
          onMessage({
            type: "update",
            data: data,
          });
        },
        onError: (error) => {
          onMessage({
            type: "error",
            message: "Connection error",
          });
          onError?.(error);
        },
        withCredentials: true,
      });
    },

    initializeUpdate: async (): Promise<void> => {
      await apiClient.post(config.initializeEndpoint);
    },
  };
}

export function extendUpdateService<T, TExtension>(
  baseService: BaseUpdateService<T>,
  extension: TExtension,
): BaseUpdateService<T> & TExtension {
  return {
    ...baseService,
    ...extension,
  };
}

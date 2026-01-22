import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

type ContentType =
  | "application/x-www-form-urlencoded"
  | "application/json"
  | "text/plain";

interface ApiClientConfig {
  baseURL?: string;
  contentType?: ContentType;
}

export interface SSEOptions<T> {
  onMessage: (data: T) => void;
  onError?: (error: Error) => void;
  onOpen?: () => void;
  withCredentials?: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(config?: ApiClientConfig) {
    this.baseURL =
      config?.baseURL || process.env.NEXT_PUBLIC_BACKEND_URL || "example.com";

    this.client = axios.create({
      baseURL: this.baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": config?.contentType || "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          const requestUrl = error.config?.url || "";
          const currentPath = window.location.pathname;

          if (
            !currentPath.startsWith("/auth/") &&
            !requestUrl.includes("/login") &&
            !requestUrl.includes("/auth/")
          ) {
            window.location.href = "/auth/login";
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async get<TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return this.client.get<TResponse>(url, config);
  }

  async post<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return this.client.post<TResponse>(url, data, config);
  }

  async put<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return this.client.put<TResponse>(url, data, config);
  }

  async patch<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return this.client.patch<TResponse>(url, data, config);
  }

  async delete<TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return this.client.delete<TResponse>(url, config);
  }

  /**
   * Subscribe to Server-Sent Events
   * @param url - The SSE endpoint URL (can be relative or absolute)
   * @param options - SSE configuration options
   * @returns Cleanup function to close the connection
   */
  subscribeToSSE<T>(url: string, options: SSEOptions<T>): () => void {
    const { onMessage, onError, onOpen, withCredentials = true } = options;

    const fullUrl = url.startsWith("http")
      ? url
      : `${this.baseURL}${url.startsWith("/") ? url : `/${url}`}`;

    const eventSource = withCredentials
      ? new EventSource(fullUrl, { withCredentials: true })
      : new EventSource(fullUrl);

    eventSource.onopen = () => {
      console.log(`SSE connection opened: ${url}`);
      onOpen?.();
    };

    eventSource.addEventListener("update", (event) => {
      console.log("📨 Received update event:", event.data);
      try {
        const data = JSON.parse(event.data) as T;
        onMessage(data);
      } catch (error) {
        console.log("⚠️ Non-JSON update message:", event.data);

        if (typeof event.data === "string") {
          onMessage(event.data as any);
        } else {
          console.error("Failed to parse SSE update event:", error);
          onError?.(new Error("Failed to parse server update message"));
        }
      }
    });

    eventSource.onmessage = (event) => {
      console.log("📨 Received default message:", event.data);
      try {
        const data = JSON.parse(event.data) as T;
        onMessage(data);
      } catch (error) {
        console.error("Failed to parse SSE message:", error);
        onError?.(new Error("Failed to parse server message"));
      }
    };

    eventSource.onerror = (error) => {
      console.error(`SSE connection error: ${url}`, error);
      onError?.(new Error("SSE connection failed"));
    };

    return () => {
      console.log(`SSE connection closed: ${url}`);
      eventSource.close();
    };
  }

  setContentType(contentType: ContentType): void {
    this.client.defaults.headers.common["Content-Type"] = contentType;
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

export const apiClient = new ApiClient();

export default ApiClient;

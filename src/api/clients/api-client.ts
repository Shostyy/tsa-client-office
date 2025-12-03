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

class ApiClient {
  private client: AxiosInstance;

  constructor(config?: ApiClientConfig) {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "example.com",
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

          if (!requestUrl.includes("/login")) {
            window.location.href = "/auth/login";
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return this.client.get<TResponse>(url, config);
  }

  async post<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return this.client.post<TResponse>(url, data, config);
  }

  async put<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return this.client.put<TResponse>(url, data, config);
  }

  async patch<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return this.client.patch<TResponse>(url, data, config);
  }

  async delete<TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return this.client.delete<TResponse>(url, config);
  }

  setContentType(contentType: ContentType): void {
    this.client.defaults.headers.common["Content-Type"] = contentType;
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();

export default ApiClient;

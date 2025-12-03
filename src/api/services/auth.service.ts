import { ApiClient } from "@/api/clients";
import { AxiosResponse } from "axios";
import {
  ChangePasswordRequest,
  CompleteRegistrationRequest,
  LoginRequest,
  ResetPasswordRequest,
  User,
} from "@/api/types";

const apiClient = new ApiClient();

const authService = {
  login: (data: LoginRequest): Promise<AxiosResponse<void>> => {
    const params = new URLSearchParams();
    params.append("username", data.username);
    params.append("password", data.password);
    return apiClient.post("/login", params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  logout: (): Promise<AxiosResponse<void>> => {
    return apiClient.post("/logout");
  },

  getCurrentUser: (): Promise<AxiosResponse<User>> => {
    return apiClient.get<User>("/");
  },

  forgotPassword: (email: string): Promise<AxiosResponse<void>> => {
    return apiClient.post("/api/forgot-password", email, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },

  resetPassword: (data: ResetPasswordRequest): Promise<AxiosResponse<void>> => {
    return apiClient.post("/api/reset-password", data);
  },

  changePassword: (
    data: ChangePasswordRequest
  ): Promise<AxiosResponse<void>> => {
    return apiClient.put("/api/users/change-password", data);
  },

  completeRegistration: (
    data: CompleteRegistrationRequest
  ): Promise<AxiosResponse<void>> => {
    return apiClient.post("/api/complete-registration", data);
  },

  changeEmail: (
    newEmail: string,
    locale: string
  ): Promise<AxiosResponse<void>> => {
    return apiClient.put(
      `/api/users/change-email?newEmail=${newEmail}&locale=${locale}`,
      undefined,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  },

  verifyEmail: (token: string, lang: string): Promise<AxiosResponse<void>> => {
    return apiClient.get(`/api/verify-email?token=${token}&lang=${lang}`);
  },
};

export default authService;

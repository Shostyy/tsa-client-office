import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/api/services";
import {
  LoginRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  CompleteRegistrationRequest,
} from "@/api/types";

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "current-user"] as const,
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response.data;
    },
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  console.log("env", process.env.NEXT_PUBLIC_BACKEND_URL);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data),
  });
};

export const useCompleteRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteRegistrationRequest) =>
      authService.completeRegistration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
  });
};

export const useChangeEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ newEmail, locale }: { newEmail: string; locale: string }) =>
      authService.changeEmail(newEmail, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: ({ token, lang }: { token: string; lang: string }) =>
      authService.verifyEmail(token, lang),
  });
};

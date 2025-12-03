export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  login: string;
  email: string;
  blocked: boolean;
  role: {
    id: number;
    name: string;
  };
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  id: number;
  password: string;
  newPassword: string;
}

export interface CompleteRegistrationRequest {
  id: number;
  temporaryPassword: string;
  newPassword: string;
}

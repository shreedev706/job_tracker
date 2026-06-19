import api from "./axiosInstance";
import type { User } from "../features/user/userSlice";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const register = async (
  userData: RegisterUserData
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string }> => {
  const response = await api.post("/auth/refresh", { refreshToken });
  return response.data;
};

export const logoutApi = async (refreshToken: string): Promise<void> => {
  await api.post("/auth/logout", { refreshToken });
};
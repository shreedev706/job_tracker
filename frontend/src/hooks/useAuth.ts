import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth, clearAuth } from "../features/user/userSlice";
import type { RootState } from "../features/store";
import {
  login as loginApi,
  register as registerApi,
  logoutApi,
  type LoginCredentials,
  type RegisterUserData,
  type AuthResponse,
} from "../http/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await loginApi(credentials);

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      dispatch(setAuth({ isAuthenticated: true, user: response.user }));
      navigate("/dashboard");
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Authentication failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterUserData) => {
    setLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await registerApi(userData);

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      dispatch(setAuth({ isAuthenticated: true, user: response.user }));
      navigate("/dashboard");
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Registration failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch {
      // even if the backend call fails, proceed to clear local session
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(clearAuth());
      navigate("/auth");
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError,
  };
};
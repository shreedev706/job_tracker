import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

// 1. Define interfaces for your query parameters and API data payloads
export interface JobFilterParams {
  page?: number | string;
  status?: string;
  workType?: string;
  sort?: string;
  search?: string;
}

export interface JobPayload {
  companyName: string;
  jobTitle: string;
  jobType: string;
  status: string;
  personName?: string;
  appliedDate: string | Date;
  notes?: string;
}

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. Request Interceptor: Injecting Bearer Authorization securely
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Strongly-Typed Auth Endpoints
export const login = (data: any) => api.post("/auth/login", data);
export const register = (data: any) => api.post("/auth/register", data);
// Updated to be optional so components can call logout() or logout({})
export const logout = (data?: any) => api.post("/auth/logout", data || {});
export const getUser = () => api.get("/auth/user");

// 4. Strongly-Typed Job/Application Endpoints
export const getJobs = () => api.get("/applications");
export const addJob = (data: JobPayload) => api.post("/applications", data);
export const deleteJob = (id: string) => api.delete(`/applications/${id}`);

export const filterJobs = (params: JobFilterParams) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return api.get(`/applications?${query}`);
};

// 5. Response Interceptor for Token Refresh handling
// This interceptor automates the flow of retrying failed requests when an access token expires

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _isRetry?: boolean };
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`http://localhost:5000/auth/refresh`, { refreshToken });
        
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api.request(originalRequest);
      } catch (refreshError: any) {
        console.error("Session recovery failed:", refreshError.message);
      }
    }
    throw error;
  }
);

export default api;
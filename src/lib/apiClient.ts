import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "@/lib/tokenStorage";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kmcc-backend.onrender.com/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

let refreshPromise: Promise<string> | null = null;

const performRefresh = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ data: { accessToken: string; refreshToken?: string } }>(
        `${API_BASE_URL}/auth/refresh`,
        {
          refreshToken: tokenStorage.getRefreshToken(),
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data;
        tokenStorage.setTokens(accessToken, refreshToken);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    const isAuthEndpoint =
      url.includes("/auth/admin/login") ||
      url.includes("/auth/member/login") ||
      url.includes("/auth/refresh");

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await performRefresh();

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch {
        tokenStorage.clearTokens();

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:session-expired"));
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: {
    field: string;
    message: string;
  }[];
}

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiEnvelope<unknown> | undefined;

    return (
      data?.message ||
      error.message ||
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
};
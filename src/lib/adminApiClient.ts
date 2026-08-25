import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { adminTokenStorage } from "@/lib/adminTokenStorage";
import { API_BASE_URL } from "@/lib/publicApiClient";

// Authenticated client for admin-only endpoints. Reads/writes only the
// admin token namespace and refreshes only against /auth/admin/refresh —
// it never touches member tokens, so a member session elsewhere in the
// same browser is completely unaffected by anything this client does.
export const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApiClient.interceptors.request.use((config) => {
  const token = adminTokenStorage.getAccessToken();

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
        `${API_BASE_URL}/auth/admin/refresh`,
        { refreshToken: adminTokenStorage.getRefreshToken() }
      )
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data;
        adminTokenStorage.setTokens(accessToken, refreshToken);
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

adminApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    const isAuthEndpoint = url.includes("/auth/admin/login") || url.includes("/auth/admin/refresh");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const newToken = await performRefresh();

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return adminApiClient(originalRequest);
      } catch {
        adminTokenStorage.clearTokens();

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("admin:session-expired"));
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export { type ApiEnvelope, extractErrorMessage } from "@/lib/apiEnvelope";

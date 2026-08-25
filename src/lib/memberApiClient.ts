import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { memberTokenStorage } from "@/lib/memberTokenStorage";
import { API_BASE_URL } from "@/lib/publicApiClient";

// Authenticated client for member-only endpoints. Reads/writes only the
// member token namespace and refreshes only against /auth/member/refresh —
// it never touches admin tokens, so an admin session elsewhere in the same
// browser is completely unaffected by anything this client does.
export const memberApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

memberApiClient.interceptors.request.use((config) => {
  const token = memberTokenStorage.getAccessToken();

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
        `${API_BASE_URL}/auth/member/refresh`,
        { refreshToken: memberTokenStorage.getRefreshToken() }
      )
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data;
        memberTokenStorage.setTokens(accessToken, refreshToken);
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

memberApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    const isAuthEndpoint = url.includes("/auth/member/login") || url.includes("/auth/member/refresh");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const newToken = await performRefresh();

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return memberApiClient(originalRequest);
      } catch {
        memberTokenStorage.clearTokens();

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("member:session-expired"));
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export { type ApiEnvelope, extractErrorMessage } from "@/lib/apiEnvelope";

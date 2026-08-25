// Member session tokens live under their own localStorage keys, completely
// separate from admin tokens (see adminTokenStorage.ts), so a member and
// an admin can be signed in on the same browser at the same time without
// either session clobbering the other.
const ACCESS_TOKEN_KEY = "member_access_token";
const REFRESH_TOKEN_KEY = "member_refresh_token";

export const memberTokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  clearTokens(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

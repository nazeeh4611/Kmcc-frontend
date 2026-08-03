import { apiClient, type ApiEnvelope } from "@/lib/apiClient";
import { tokenStorage } from "@/lib/tokenStorage";
import type { Admin, AuthSession, Member, SessionType } from "@/types";
import type {
  AdminLoginInput,
  MemberLoginInput,
  ChangePasswordInput,
} from "@/lib/validators/authSchemas";

interface LoginTokens {
  token: string;
  refreshToken?: string;
}

export const authService = {
  adminLogin: async (payload: AdminLoginInput): Promise<Admin> => {
    const { data } = await apiClient.post<
      ApiEnvelope<{ admin: Admin } & LoginTokens>
    >("/auth/admin/login", payload);

    const { admin, token, refreshToken } = data.data;

    tokenStorage.setTokens(token, refreshToken);

    return admin;
  },

  memberLogin: async (payload: MemberLoginInput): Promise<Member> => {
    const { data } = await apiClient.post<
      ApiEnvelope<{ member: Member } & LoginTokens>
    >("/auth/member/login", payload);

    const { member, token, refreshToken } = data.data;

    tokenStorage.setTokens(token, refreshToken);

    return member;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      tokenStorage.clearTokens();
    }
  },

  getSession: async (): Promise<AuthSession> => {
    const { data } = await apiClient.get<
      ApiEnvelope<{
        user: Admin | Member;
        type: SessionType;
      }>
    >("/auth/me");

    return {
      user: data.data.user,
      type: data.data.type,
    };
  },

  changePassword: async (
    payload: ChangePasswordInput
  ): Promise<string> => {
    const { data } = await apiClient.post<ApiEnvelope<null>>(
      "/auth/change-password",
      payload
    );

    return data.message;
  },

  forgotPassword: async (email: string): Promise<string> => {
    const { data } = await apiClient.post<ApiEnvelope<null>>(
      "/auth/forgot-password",
      {
        email,
      }
    );

    return data.message;
  },

  resetPassword: async (payload: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<string> => {
    const { data } = await apiClient.post<ApiEnvelope<null>>(
      "/auth/reset-password",
      payload
    );

    return data.message;
  },

  getMyMembershipDetails: async (): Promise<Member> => {
    const { data } = await apiClient.get<ApiEnvelope<{ member: Member }>>(
      "/members/me"
    );

    return data.data.member;
  },

  downloadMembershipCard: async (): Promise<void> => {
    const response = await apiClient.get("/members/me/card", {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const disposition = response.headers["content-disposition"] as
      | string
      | undefined;

    const match = disposition?.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? "membership-card.pdf";

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  },
};
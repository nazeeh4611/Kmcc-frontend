import { adminApiClient, type ApiEnvelope } from "@/lib/adminApiClient";
import { memberApiClient } from "@/lib/memberApiClient";
import { adminTokenStorage } from "@/lib/adminTokenStorage";
import { memberTokenStorage } from "@/lib/memberTokenStorage";
import type { Admin, Member } from "@/types";
import type {
  AdminLoginInput,
  MemberLoginInput,
  ChangePasswordInput,
} from "@/lib/validators/authSchemas";

interface LoginTokens {
  token: string;
  refreshToken?: string;
}

export const adminAuthService = {
  login: async (payload: AdminLoginInput): Promise<Admin> => {
    const { data } = await adminApiClient.post<ApiEnvelope<{ admin: Admin } & LoginTokens>>(
      "/auth/admin/login",
      payload
    );

    const { admin, token, refreshToken } = data.data;
    adminTokenStorage.setTokens(token, refreshToken);

    return admin;
  },

  logout: async (): Promise<void> => {
    try {
      await adminApiClient.post("/auth/admin/logout");
    } finally {
      adminTokenStorage.clearTokens();
    }
  },

  getCurrentAdmin: async (): Promise<Admin> => {
    const { data } = await adminApiClient.get<ApiEnvelope<{ user: Admin }>>("/auth/admin/me");
    return data.data.user;
  },

  changePassword: async (payload: ChangePasswordInput): Promise<string> => {
    const { data } = await adminApiClient.post<ApiEnvelope<null>>("/auth/change-password", payload);
    return data.message;
  },

  forgotPassword: async (email: string): Promise<string> => {
    const { data } = await adminApiClient.post<ApiEnvelope<null>>("/auth/forgot-password", { email });
    return data.message;
  },

  resetPassword: async (payload: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<string> => {
    const { data } = await adminApiClient.post<ApiEnvelope<null>>("/auth/reset-password", payload);
    return data.message;
  },
};

export const memberAuthService = {
  login: async (payload: MemberLoginInput): Promise<Member> => {
    const { data } = await memberApiClient.post<ApiEnvelope<{ member: Member } & LoginTokens>>(
      "/auth/member/login",
      payload
    );

    const { member, token, refreshToken } = data.data;
    memberTokenStorage.setTokens(token, refreshToken);

    return member;
  },

  logout: async (): Promise<void> => {
    try {
      await memberApiClient.post("/auth/member/logout");
    } finally {
      memberTokenStorage.clearTokens();
    }
  },

  getCurrentMember: async (): Promise<Member> => {
    const { data } = await memberApiClient.get<ApiEnvelope<{ user: Member }>>("/auth/member/me");
    return data.data.user;
  },

  changePassword: async (payload: ChangePasswordInput): Promise<string> => {
    const { data } = await memberApiClient.post<ApiEnvelope<null>>("/auth/change-password", payload);
    return data.message;
  },

  getMyMembershipDetails: async (): Promise<Member> => {
    const { data } = await memberApiClient.get<ApiEnvelope<{ member: Member }>>("/members/me");
    return data.data.member;
  },

  downloadMembershipCard: async (): Promise<void> => {
    const response = await memberApiClient.get("/members/me/card", {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const disposition = response.headers["content-disposition"] as string | undefined;
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

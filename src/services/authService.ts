import axios from "axios";
import { apiClient, type ApiEnvelope } from "@/lib/apiClient";
import type { Admin, AuthSession, Member, SessionType } from "@/types";
import type {
  AdminLoginInput,
  MemberLoginInput,
  ChangePasswordInput,
} from "@/lib/validators/authSchemas";

console.log("AUTH SERVICE FILE LOADED");
export const authService = {
  
  adminLogin: async (payload: AdminLoginInput) => {
    try {
      console.log("Sending request...", payload);

      const response = await apiClient.post<ApiEnvelope<{ admin: Admin }>>(
        "/auth/admin/login",
        payload
      );

      console.log("SUCCESS:", response);

      return response.data.data.admin;
    } catch (err) {
      console.error("FULL ERROR:", err);

      if (axios.isAxiosError(err)) {
        console.log("Message:", err.message);
        console.log("Code:", err.code);
        console.log("Status:", err.response?.status);
        console.log("Response:", err.response?.data);
        console.log("Request:", err.request);
        console.log("Config:", err.config);
      }

      throw err;
    }
  },

  memberLogin: async (payload: MemberLoginInput) => {
    try {
      const response = await apiClient.post<ApiEnvelope<{ member: Member }>>(
        "/auth/member/login",
        payload
      );

      return response.data.data.member;
    } catch (err) {
      console.error("FULL ERROR:", err);

      if (axios.isAxiosError(err)) {
        console.log("Message:", err.message);
        console.log("Code:", err.code);
        console.log("Status:", err.response?.status);
        console.log("Response:", err.response?.data);
        console.log("Request:", err.request);
        console.log("Config:", err.config);
      }

      throw err;
    }
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  getSession: async (): Promise<AuthSession> => {
    const { data } = await apiClient.get<
      ApiEnvelope<{ user: Admin | Member; type: SessionType }>
    >("/auth/me");

    return {
      user: data.data.user,
      type: data.data.type,
    };
  },

  changePassword: async (payload: ChangePasswordInput) => {
    const { data } = await apiClient.post<ApiEnvelope<null>>(
      "/auth/change-password",
      payload
    );

    return data.message;
  },

  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post<ApiEnvelope<null>>(
      "/auth/forgot-password",
      { email }
    );

    return data.message;
  },

  resetPassword: async (payload: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const { data } = await apiClient.post<ApiEnvelope<null>>(
      "/auth/reset-password",
      payload
    );

    return data.message;
  },
};
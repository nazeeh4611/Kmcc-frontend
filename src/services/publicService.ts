import { apiClient, type ApiEnvelope } from "@/lib/apiClient";
import type { Coordinator, Zone } from "@/types";

export const publicService = {
  getZones: async () => {
    const { data } = await apiClient.get<ApiEnvelope<{ zones: Zone[] }>>("/public/zones");
    return data.data.zones;
  },

  getCoordinators: async (zoneId?: string) => {
    const { data } = await apiClient.get<ApiEnvelope<{ coordinators: Coordinator[] }>>("/public/coordinators", {
      params: zoneId ? { zone: zoneId } : undefined,
    });
    return data.data.coordinators;
  },

  registerMember: async (formData: FormData) => {
    const { data } = await apiClient.post<ApiEnvelope<{ applicationId: string; membershipId: string }>>(
      "/public/members/register",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  verifyMember: async (membershipId: string) => {
    const { data } = await apiClient.get<ApiEnvelope<{ member: unknown }>>(
      `/public/members/verify/${encodeURIComponent(membershipId)}`
    );
    return data.data.member;
  },
};

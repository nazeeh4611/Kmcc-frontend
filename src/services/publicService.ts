import { publicApiClient, type ApiEnvelope } from "@/lib/publicApiClient";

export const publicService = {
  registerMember: async (formData: FormData) => {
    const { data } = await publicApiClient.post<ApiEnvelope<{ applicationId: string; membershipId: string }>>(
      "/public/members/register",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  verifyMember: async (membershipId: string) => {
    const { data } = await publicApiClient.get<ApiEnvelope<{ member: unknown }>>(
      `/public/members/verify/${encodeURIComponent(membershipId)}`
    );
    return data.data.member;
  },
};

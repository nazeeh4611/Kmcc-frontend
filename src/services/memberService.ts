import { adminApiClient as apiClient, type ApiEnvelope } from "@/lib/adminApiClient";
import type { FamilyMember, Member, PaginatedResult } from "@/types";

export interface MemberListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  district?: string;
  country?: string;
  bloodGroup?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface MemberStats {
  total: number;
  active: number;
  expired: number;
  pending: number;
  suspended: number;
  upcomingExpiry: number;
  countryStatistics: { country: string; count: number }[];
  todaysBirthdays: { fullName: string; membershipId: string; phone: string }[];
}

export const memberService = {
  list: async (params: MemberListParams) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedResult<Member>>>("/members", { params });
    return data.data;
  },

  pending: async (params: { page?: number; limit?: number }) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedResult<Member>>>("/members/pending", { params });
    return data.data;
  },

  stats: async () => {
    const { data } = await apiClient.get<ApiEnvelope<MemberStats>>("/members/stats");
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiEnvelope<{ member: Member }>>(`/members/${id}`);
    return data.data.member;
  },

  create: async (formData: FormData) => {
    const { data } = await apiClient.post<ApiEnvelope<{ member: Member; temporaryPassword?: string }>>(
      "/members",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  update: async (id: string, formData: FormData) => {
    const { data } = await apiClient.patch<ApiEnvelope<{ member: Member }>>(`/members/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.member;
  },

  remove: async (id: string) => {
    await apiClient.delete(`/members/${id}`);
  },

  bulkRemove: async (ids: string[]) => {
    const { data } = await apiClient.post<ApiEnvelope<{ deletedCount: number }>>("/members/bulk-delete", { ids });
    return data.data;
  },

  approve: async (
    id: string,
    payload: { membershipType: string; membershipStart?: string; password?: string; committeeRole?: string; unit?: string }
  ) => {
    const { data } = await apiClient.post<ApiEnvelope<{ member: Member; temporaryPassword?: string }>>(
      `/members/${id}/approve`,
      payload
    );
    return data.data;
  },

  reject: async (id: string) => {
    await apiClient.post(`/members/${id}/reject`);
  },

  suspend: async (id: string, reason?: string) => {
    const { data } = await apiClient.post<ApiEnvelope<{ member: Member }>>(`/members/${id}/suspend`, { reason });
    return data.data.member;
  },

  reactivate: async (id: string) => {
    const { data } = await apiClient.post<ApiEnvelope<{ member: Member }>>(`/members/${id}/reactivate`);
    return data.data.member;
  },

  renew: async (id: string, payload: { membershipType: string; membershipStart?: string }) => {
    const { data } = await apiClient.post<ApiEnvelope<{ member: Member }>>(`/members/${id}/renew`, payload);
    return data.data.member;
  },

  transfer: async (
    id: string,
    payload: { newFullName: string; newPhone: string; newEmail?: string; relation?: string }
  ) => {
    const { data } = await apiClient.post<ApiEnvelope<{ member: Member }>>(`/members/${id}/transfer`, payload);
    return data.data.member;
  },

  resetPassword: async (id: string, newPassword?: string) => {
    const { data } = await apiClient.post<ApiEnvelope<{ temporaryPassword?: string }>>(
      `/members/${id}/reset-password`,
      { newPassword }
    );
    return data.data;
  },

  downloadCard: async (id: string, membershipId: string) => {
    const response = await apiClient.get(`/members/${id}/card`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${membershipId}-card.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  listFamily: async (memberId: string) => {
    const { data } = await apiClient.get<ApiEnvelope<{ familyMembers: FamilyMember[] }>>(
      `/members/${memberId}/family`
    );
    return data.data.familyMembers;
  },

  addFamily: async (memberId: string, formData: FormData) => {
    const { data } = await apiClient.post<ApiEnvelope<{ familyMember: FamilyMember }>>(
      `/members/${memberId}/family`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data.familyMember;
  },

  removeFamily: async (memberId: string, id: string) => {
    await apiClient.delete(`/members/${memberId}/family/${id}`);
  },

  exportExcel: async (status?: string) => {
    const response = await apiClient.get("/members/export", {
      params: status ? { status } : undefined,
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `members-export-${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

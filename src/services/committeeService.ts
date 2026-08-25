// services/committeeService.ts
import { adminApiClient as apiClient } from "@/lib/adminApiClient";

export const committeeService = {
  list: async () => {
    const res = await apiClient.get("/committee");
    return res.data.data;
  },

  listAdmin: async () => {
    const res = await apiClient.get("/committee/admin");
    return res.data.data;
  },

  create: async (data: FormData) => {
    const res = await apiClient.post("/committee", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  update: async (id: string, data: FormData) => {
    const res = await apiClient.put(`/committee/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(`/committee/${id}`);
    return res.data.data;
  },

  reorder: async (order: { id: string; priority: number }[]) => {
    const res = await apiClient.put("/committee/reorder", { order });
    return res.data.data;
  },
};
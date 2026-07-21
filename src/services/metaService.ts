import { apiClient, type ApiEnvelope } from "@/lib/apiClient";
import type { Coordinator, MembershipPlan, Zone } from "@/types";

export const metaService = {
  listZones: async () => {
    const { data } = await apiClient.get<ApiEnvelope<{ zones: Zone[] }>>("/zones");
    return data.data.zones;
  },

  listCoordinators: async () => {
    const { data } = await apiClient.get<ApiEnvelope<{ coordinators: Coordinator[] }>>("/coordinators");
    return data.data.coordinators;
  },

  listMembershipPlans: async () => {
    const { data } = await apiClient.get<ApiEnvelope<{ plans: MembershipPlan[] }>>("/membership-plans");
    return data.data.plans;
  },
};

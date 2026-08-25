import { adminApiClient, type ApiEnvelope } from "@/lib/adminApiClient";
import type { MembershipPlan } from "@/types";

export const metaService = {
  listMembershipPlans: async () => {
    const { data } = await adminApiClient.get<ApiEnvelope<{ plans: MembershipPlan[] }>>("/membership-plans");
    return data.data.plans;
  },
};

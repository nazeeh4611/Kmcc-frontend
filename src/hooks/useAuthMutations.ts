"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { SESSION_QUERY_KEY } from "@/store/authContext";
import type {
  AdminLoginInput,
  MemberLoginInput,
} from "@/lib/validators/authSchemas";

console.log("useAuthMutations.ts loaded");
console.log("authService:", authService);

export function useAdminLogin() {
  const queryClient = useQueryClient();

  console.log("useAdminLogin hook executed");

  return useMutation({
    mutationFn: async (payload: AdminLoginInput) => {
      console.log("Admin login payload:", payload);

      const result = await authService.adminLogin(payload);

      console.log("Admin login result:", result);

      return result;
    },

    onSuccess: (admin) => {
      console.log("Login successful:", admin);

      queryClient.setQueryData(SESSION_QUERY_KEY, {
        type: "admin",
        user: admin,
      });
    },

    onError: (error) => {
      console.error("Login mutation error:", error);
    },
  });
}

export function useMemberLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MemberLoginInput) => {
      console.log("Member login payload:", payload);

      const result = await authService.memberLogin(payload);

      console.log("Member login result:", result);

      return result;
    },

    onSuccess: (member) => {
      console.log("Member login successful:", member);

      queryClient.setQueryData(SESSION_QUERY_KEY, {
        type: "member",
        user: member,
      });
    },

    onError: (error) => {
      console.error("Member login error:", error);
    },
  });
}
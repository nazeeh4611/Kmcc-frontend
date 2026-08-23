"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { SESSION_QUERY_KEY } from "@/store/authContext";
import type {
  AdminLoginInput,
  MemberLoginInput,
} from "@/lib/validators/authSchemas";

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminLoginInput) => authService.adminLogin(payload),

    onSuccess: (admin) => {
      queryClient.setQueryData(SESSION_QUERY_KEY, {
        type: "admin",
        user: admin,
      });
    },
  });
}

export function useMemberLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MemberLoginInput) => authService.memberLogin(payload),

    onSuccess: (member) => {
      queryClient.setQueryData(SESSION_QUERY_KEY, {
        type: "member",
        user: member,
      });
    },
  });
}
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAuthService, memberAuthService } from "@/services/authService";
import { ADMIN_SESSION_QUERY_KEY } from "@/store/adminAuthContext";
import { MEMBER_SESSION_QUERY_KEY } from "@/store/memberAuthContext";
import type {
  AdminLoginInput,
  MemberLoginInput,
} from "@/lib/validators/authSchemas";

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminLoginInput) => adminAuthService.login(payload),

    onSuccess: (admin) => {
      queryClient.setQueryData(ADMIN_SESSION_QUERY_KEY, admin);
    },
  });
}

export function useMemberLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MemberLoginInput) => memberAuthService.login(payload),

    onSuccess: (member) => {
      queryClient.setQueryData(MEMBER_SESSION_QUERY_KEY, member);
    },
  });
}

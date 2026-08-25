"use client";

import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { adminAuthService } from "@/services/authService";
import type { Admin } from "@/types";

interface AdminAuthContextValue {
  admin: Admin | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  isLoggingOut: boolean;
  refetchSession: () => Promise<unknown>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const ADMIN_SESSION_QUERY_KEY = ["auth", "admin", "session"] as const;

// Fully isolated from MemberAuthProvider — own React Query cache key, own
// service, own token storage under the hood. An admin session here can
// never be read as (or overwrite) a member session, and vice versa.
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: admin,
    isLoading,
    refetch: refetchSession,
  } = useQuery({
    queryKey: ADMIN_SESSION_QUERY_KEY,
    queryFn: adminAuthService.getCurrentAdmin,
    retry: false,
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
  });

  const logoutMutation = useMutation({
    mutationFn: adminAuthService.logout,
    onSettled: () => {
      queryClient.setQueryData(ADMIN_SESSION_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: ["admin"] });
      queryClient.removeQueries({ queryKey: ["members"] });
    },
  });

  useEffect(() => {
    const handleExpired = () => {
      queryClient.setQueryData(ADMIN_SESSION_QUERY_KEY, null);
    };
    window.addEventListener("admin:session-expired", handleExpired);
    return () => window.removeEventListener("admin:session-expired", handleExpired);
  }, [queryClient]);

  const value: AdminAuthContextValue = {
    admin: admin ?? null,
    isLoading,
    isAuthenticated: !!admin,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
    refetchSession: () => refetchSession(),
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}

export { ADMIN_SESSION_QUERY_KEY };

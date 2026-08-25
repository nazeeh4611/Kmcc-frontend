"use client";

import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { memberAuthService } from "@/services/authService";
import type { Member } from "@/types";

interface MemberAuthContextValue {
  member: Member | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  isLoggingOut: boolean;
  refetchSession: () => Promise<unknown>;
}

const MemberAuthContext = createContext<MemberAuthContextValue | null>(null);

const MEMBER_SESSION_QUERY_KEY = ["auth", "member", "session"] as const;

// Fully isolated from AdminAuthProvider — own React Query cache key, own
// service, own token storage under the hood. A member session here can
// never be read as (or overwrite) an admin session, and vice versa.
export function MemberAuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: member,
    isLoading,
    refetch: refetchSession,
  } = useQuery({
    queryKey: MEMBER_SESSION_QUERY_KEY,
    queryFn: memberAuthService.getCurrentMember,
    retry: false,
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
  });

  const logoutMutation = useMutation({
    mutationFn: memberAuthService.logout,
    onSettled: () => {
      queryClient.setQueryData(MEMBER_SESSION_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: ["members", "me"] });
    },
  });

  useEffect(() => {
    const handleExpired = () => {
      queryClient.setQueryData(MEMBER_SESSION_QUERY_KEY, null);
    };
    window.addEventListener("member:session-expired", handleExpired);
    return () => window.removeEventListener("member:session-expired", handleExpired);
  }, [queryClient]);

  const value: MemberAuthContextValue = {
    member: member ?? null,
    isLoading,
    isAuthenticated: !!member,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
    refetchSession: () => refetchSession(),
  };

  return <MemberAuthContext.Provider value={value}>{children}</MemberAuthContext.Provider>;
}

export function useMemberAuth() {
  const ctx = useContext(MemberAuthContext);
  if (!ctx) throw new Error("useMemberAuth must be used within a MemberAuthProvider");
  return ctx;
}

export { MEMBER_SESSION_QUERY_KEY };

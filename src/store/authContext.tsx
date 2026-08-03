"use client";

import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import type { AuthSession } from "@/types";

interface AuthContextValue {
  session: AuthSession | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  isLoggingOut: boolean;
  refetchSession: () => Promise<unknown>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_QUERY_KEY = ["auth", "session"] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: session,
    isLoading,
    refetch: refetchSession,
  } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: authService.getSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      queryClient.setQueryData(SESSION_QUERY_KEY, null);
      queryClient.clear();
    },
  });

  useEffect(() => {
    const handleExpired = () => {
      queryClient.setQueryData(SESSION_QUERY_KEY, null);
    };
    window.addEventListener("auth:session-expired", handleExpired);
    return () => window.removeEventListener("auth:session-expired", handleExpired);
  }, [queryClient]);

  const value: AuthContextValue = {
    session: session ?? null,
    isLoading,
    isAuthenticated: !!session,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
    refetchSession: () => refetchSession(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { SESSION_QUERY_KEY };
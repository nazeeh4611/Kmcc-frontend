"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AdminAuthProvider } from "@/store/adminAuthContext";
import { MemberAuthProvider } from "@/store/memberAuthContext";
import { useState } from "react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <MemberAuthProvider>{children}</MemberAuthProvider>
      </AdminAuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/store/adminAuthContext";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAdminAuth();

  const isPublicPath = PUBLIC_ADMIN_PATHS.includes(pathname);

  useEffect(() => {
    if (isPublicPath || isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPublicPath, isLoading, isAuthenticated, pathname, router]);

  if (isPublicPath) return <>{children}</>;

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

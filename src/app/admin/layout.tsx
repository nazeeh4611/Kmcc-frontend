"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/authContext";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading, isAuthenticated } = useAuth();

  const isPublicPath = PUBLIC_ADMIN_PATHS.includes(pathname);

  useEffect(() => {
    if (isPublicPath || isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (session?.type !== "admin") {
      // A member session exists but tried to reach an admin route.
      router.replace("/admin/login");
    }
  }, [isPublicPath, isLoading, isAuthenticated, session, pathname, router]);

  if (isPublicPath) return <>{children}</>;

  if (isLoading || !isAuthenticated || session?.type !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

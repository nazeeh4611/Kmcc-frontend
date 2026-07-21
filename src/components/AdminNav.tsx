// components/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/store/authContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Image, LogOut, Users as UsersIcon } from "lucide-react";
import type { Admin } from "@/types";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/committee", label: "Committee", icon: UsersIcon },
  { href: "/admin/banners", label: "Banners", icon: Image },
];

export function AdminNav() {
  const pathname = usePathname();
  const { session, logout, isLoggingOut } = useAuth();
  const admin = session?.user as Admin | undefined;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
              K
            </div>
            <span className="font-display text-xl font-bold text-primary">KMCC</span>
          </div>
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium font-utility transition-all duration-200",
                    isActive
                      ? "bg-primary/20 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">{admin?.name}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            disabled={isLoggingOut}
            className="gap-2 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
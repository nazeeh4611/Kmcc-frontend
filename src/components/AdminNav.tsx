// src/components/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "@/store/adminAuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/committee", label: "Committee", icon: UsersRound },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
];

export function AdminNav() {
  const pathname = usePathname();
  const { admin, logout, isLoggingOut } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
              K
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="font-display text-[15px] font-bold text-primary">KMCC Admin</p>
              <p className="text-[11px] text-muted-foreground">Control panel</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium font-utility transition-all duration-150",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-black/[0.03] hover:text-foreground"
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
            <p className="text-sm font-semibold leading-tight text-foreground">{admin?.name ?? "Admin"}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary sm:flex">
            {(admin?.name ?? "A").charAt(0).toUpperCase()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            disabled={isLoggingOut}
            loading={isLoggingOut}
            className="hidden gap-2 hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:inline-flex"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Signing out" : "Sign out"}
          </Button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-foreground hover:bg-black/5 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-black/[0.03]"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              disabled={isLoggingOut}
              loading={isLoggingOut}
              className="mt-2 gap-2 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Signing out" : "Sign out"}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

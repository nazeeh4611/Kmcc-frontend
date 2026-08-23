// AdminDashboardPage.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Clock,
  TrendingUp,
  ShieldAlert,
  Cake,
  UserPlus,
  FileText,
  Calendar,
  ArrowRight,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { useAuth } from "@/store/authContext";
import { memberService } from "@/services/memberService";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Admin } from "@/types";

const QUICK_ACTIONS = [
  {
    label: "Add Member",
    description: "Register a new member manually",
    icon: UserPlus,
    href: "/admin/members/new",
  },
  {
    label: "Pending Approvals",
    description: "Review applications awaiting review",
    icon: FileText,
    href: "/admin/members?status=pending",
  },
  {
    label: "Expiring Soon",
    description: "Members due for renewal",
    icon: Calendar,
    href: "/admin/members?status=active",
  },
];

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const admin = session?.user as Admin | undefined;

  const { data: stats, isLoading } = useQuery({
    queryKey: ["members", "stats"],
    queryFn: memberService.stats,
  });

  const statCards = [
    { key: "total", label: "Total Members", value: stats?.total, icon: Users, tone: "default" as const },
    { key: "pending", label: "Pending Approval", value: stats?.pending, icon: Clock, tone: "warning" as const },
    { key: "expiring", label: "Expiring in 30d", value: stats?.upcomingExpiry, icon: TrendingUp, tone: "info" as const },
    { key: "suspended", label: "Suspended", value: stats?.suspended, icon: ShieldAlert, tone: "danger" as const },
  ];

  const toneStyles: Record<"default" | "warning" | "info" | "danger", { bg: string; text: string }> = {
    default: { bg: "bg-primary/10", text: "text-primary" },
    warning: { bg: "bg-amber-50", text: "text-amber-600" },
    info: { bg: "bg-blue-50", text: "text-blue-600" },
    danger: { bg: "bg-red-50", text: "text-red-600" },
  };

  return (
    <div className="min-h-screen bg-surface">
      <AdminNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8 flex flex-col gap-1 animate-in-up">
          <p className="font-utility text-sm font-semibold text-primary">Welcome back</p>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            {admin?.name ?? "Admin"}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Here&apos;s what&apos;s happening with your members today.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const tone = toneStyles[card.tone];
            return (
              <Card key={card.key} className="p-5 transition-shadow hover:card-shadow-lg sm:p-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone.bg} ${tone.text}`}>
                    <card.icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {card.label}
                    </p>
                    {isLoading ? (
                      <Skeleton className="mt-1.5 h-7 w-14" />
                    ) : (
                      <p className="text-2xl font-bold text-foreground">{card.value ?? 0}</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardContent className="p-5 pt-5 sm:p-6 sm:pt-6">
              <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your members efficiently with these common tasks.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="group flex items-center gap-4 rounded-xl border border-transparent px-3.5 py-3 transition-all hover:border-primary/20 hover:bg-primary/5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <action.icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{action.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-5 pt-5 sm:p-6 sm:pt-6">
              <h2 className="text-base font-semibold text-foreground">Admin Profile</h2>
              <p className="mt-1 text-sm text-muted-foreground">Your account details and access level.</p>
              <div className="mt-5 space-y-1">
                <div className="flex items-center justify-between border-b border-border/70 py-3">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </span>
                  <span className="text-sm font-medium text-foreground">{admin?.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/70 py-3">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BadgeCheck className="h-3.5 w-3.5" /> Role
                  </span>
                  <Badge className="capitalize">{admin?.role}</Badge>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge tone="success" className="gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {stats && stats.todaysBirthdays.length > 0 && (
          <Card className="mt-5 animate-in-up">
            <CardContent className="p-5 pt-5 sm:p-6 sm:pt-6">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Cake size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Today&apos;s Birthdays</h2>
                  <p className="text-sm text-muted-foreground">Celebrate with your members</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {stats.todaysBirthdays.map((b) => (
                  <div
                    key={b.membershipId}
                    className="flex items-center justify-between rounded-xl border border-border bg-black/[0.015] px-4 py-3"
                  >
                    <span className="text-sm font-medium text-foreground">{b.fullName}</span>
                    <span className="text-xs text-muted-foreground">{b.phone}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
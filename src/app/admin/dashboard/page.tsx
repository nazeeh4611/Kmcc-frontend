// app/admin/dashboard/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Clock, TrendingUp, ShieldAlert, Cake, UserPlus, FileText, Calendar } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { useAuth } from "@/store/authContext";
import { memberService } from "@/services/memberService";
import type { Admin } from "@/types";

const colors = {
  bg: "#F5F3EE",
  surface: "#FFFFFF",
  border: "#E7E2D8",
  primary: "#2D6A4F",
  primaryDark: "#1B4332",
  primaryLight: "#D8EDE6",
  primarySoft: "#E8F5F0",
  text: "#1F1B16",
  muted: "#6B6459",
  amberBg: "#FDF3D8",
  amberText: "#9A6B00",
  orangeBg: "#FBE7D6",
  orangeText: "#B4551A",
  redBg: "#FBE2E2",
  redText: "#B02A2A",
  greenBg: "#D8EDE6",
  greenText: "#1B4332",
  blueBg: "#E3EEF9",
  blueText: "#1A4B7A",
};

const QUICK_ACTIONS = [
  { label: "Add Member", icon: UserPlus, href: "/admin/members/new", color: colors.primary },
  { label: "Pending Approvals", icon: FileText, href: "/admin/members?status=pending", color: colors.amberText },
  { label: "Expiring Soon", icon: Calendar, href: "/admin/members?status=active", color: colors.orangeText },
];

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const admin = session?.user as Admin | undefined;
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["members", "stats"],
    queryFn: memberService.stats,
  });

  const statCards = [
    { key: "total", label: "Total Members", value: stats?.total, icon: Users, iconBg: colors.primarySoft, iconColor: colors.primary },
    { key: "pending", label: "Pending Approval", value: stats?.pending, icon: Clock, iconBg: colors.amberBg, iconColor: colors.amberText },
    { key: "expiring", label: "Expiring in 30d", value: stats?.upcomingExpiry, icon: TrendingUp, iconBg: colors.orangeBg, iconColor: colors.orangeText },
    { key: "suspended", label: "Suspended", value: stats?.suspended, icon: ShieldAlert, iconBg: colors.redBg, iconColor: colors.redText },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <AdminNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <p className="font-utility text-sm font-semibold text-primary">Welcome back</p>
          <h1 className="font-display text-3xl font-bold text-foreground">{admin?.name}</h1>
          <p className="mt-1 text-muted-foreground">Here's what's happening with your members today.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.key}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: card.iconBg, color: card.iconColor }}
              >
                <card.icon size={28} />
              </div>
              <div>
                <p className="text-sm font-utility uppercase tracking-wider text-muted-foreground">{card.label}</p>
                <p className="text-3xl font-bold text-foreground">{isLoading ? "—" : card.value ?? 0}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage your members efficiently with these common tasks.</p>
            <div className="mt-6 flex flex-col gap-3">
              {QUICK_ACTIONS.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  onMouseEnter={() => setHoveredBtn(action.label)}
                  onMouseLeave={() => setHoveredBtn(null)}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 transition-all hover:bg-primary/5"
                  style={{
                    background: hoveredBtn === action.label ? colors.primarySoft : "transparent",
                    border: hoveredBtn === action.label ? `1px solid ${colors.primary}` : "1px solid transparent",
                  }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors.primarySoft }}>
                    <action.icon size={20} style={{ color: action.color }} />
                  </div>
                  <span className="font-medium text-foreground">{action.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground">Admin Profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your account details and access level.</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">{admin?.email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Role</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium capitalize text-primary">{admin?.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="flex items-center gap-2 font-medium text-green-700">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-600" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {stats && stats.todaysBirthdays.length > 0 && (
          <div className="mt-8 rounded-2xl border border-border bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: colors.primarySoft, color: colors.primary }}>
                <Cake size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Today's Birthdays</h2>
                <p className="text-sm text-muted-foreground">Celebrate with your members</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stats.todaysBirthdays.map((b, index) => (
                <div
                  key={b.membershipId}
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background: index % 2 === 0 ? colors.primarySoft : "transparent",
                    border: index % 2 === 0 ? `1px solid ${colors.primary}` : `1px solid ${colors.border}`,
                  }}
                >
                  <span className="font-medium text-foreground">{b.fullName}</span>
                  <span className="text-sm text-muted-foreground">{b.phone}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
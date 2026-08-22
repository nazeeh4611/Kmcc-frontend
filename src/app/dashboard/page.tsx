"use client";

import { useAuth } from "@/store/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const FiUsers = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FiUserCheck = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17 11 19 13 23 9"></polyline>
  </svg>
);

const FiUserX = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="18" y1="8" x2="23" y2="13"></line>
    <line x1="23" y1="8" x2="18" y2="13"></line>
  </svg>
);

const FiUserPlus = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

const FiCreditCard = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const FiDollarSign = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const FiTrendingUp = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const FiClock = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const FiCalendar = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const FiLogOut = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

type ToneKey = "blue" | "green" | "amber" | "red" | "emerald" | "indigo" | "purple" | "orange";

const toneMap: Record<ToneKey, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  red: { bg: "bg-red-50", text: "text-red-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
};

const defaultTone = { bg: "bg-gray-50", text: "text-gray-600" };

const statCards: {
  key: string;
  title: string;
  value: string;
  icon: (props: { size?: number; className?: string }) => JSX.Element;
  tone: ToneKey;
}[] = [
  { key: "total-members", title: "Total Members", value: "1,234", icon: FiUsers, tone: "blue" },
  { key: "active-members", title: "Active Members", value: "987", icon: FiUserCheck, tone: "green" },
  { key: "pending-members", title: "Pending Approvals", value: "45", icon: FiUserPlus, tone: "amber" },
  { key: "expired-members", title: "Expired Memberships", value: "23", icon: FiUserX, tone: "red" },
  { key: "total-revenue", title: "Total Revenue", value: "$12,345", icon: FiDollarSign, tone: "emerald" },
  { key: "monthly-revenue", title: "This Month", value: "$2,345", icon: FiTrendingUp, tone: "indigo" },
  { key: "recent-joins", title: "New This Week", value: "12", icon: FiUserPlus, tone: "purple" },
  { key: "expiring-soon", title: "Expiring Soon", value: "8", icon: FiClock, tone: "orange" },
];

const recentActivities = [
  { message: "John Doe renewed membership", timestamp: new Date() },
  { message: "Jane Smith joined as new member", timestamp: new Date(Date.now() - 3600000) },
  { message: "Robert Johnson upgraded to premium", timestamp: new Date(Date.now() - 7200000) },
  { message: "Sarah Williams submitted pending documents", timestamp: new Date(Date.now() - 14400000) },
];

export default function AdminDashboardPage() {
  const { logout, isLoggingOut } = useAuth();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f8faf8] p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-utility text-xs font-semibold uppercase tracking-[0.2em] text-green">
              Admin Dashboard
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">Overview</h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/members")}
              className="border-line font-body text-sm"
            >
              <FiUsers size={16} className="mr-2" />
              Manage Members
            </Button>
            <Button variant="outline" onClick={logout} disabled={isLoggingOut}>
              <FiLogOut size={16} className="mr-2" />
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const tone = toneMap[card.tone] ?? defaultTone;
            return (
              <Card key={card.key} className="p-5 transition-shadow hover:shadow-lg sm:p-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone.bg} ${tone.text}`}>
                    <card.icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-utility text-[10px] uppercase tracking-wider text-slate/50">
                      {card.title}
                    </p>
                    <p className="font-display text-2xl font-bold text-ink truncate">
                      {card.value}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="font-display text-lg text-ink">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                    <div className="mt-0.5 rounded-full bg-green/10 p-1.5 text-green">
                      <FiCalendar size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm text-ink">{activity.message}</p>
                      <p className="font-utility text-[10px] text-slate/50">
                        {activity.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="font-display text-lg text-ink">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  onClick={() => router.push("/admin/members")}
                  className="h-auto justify-start bg-green/10 px-4 py-3 font-body text-sm text-green hover:bg-green/20"
                >
                  <FiUsers size={16} className="mr-2" />
                  View All Members
                </Button>
                <Button
                  onClick={() => router.push("/admin/members/pending")}
                  className="h-auto justify-start bg-amber/10 px-4 py-3 font-body text-sm text-amber-700 hover:bg-amber/20"
                >
                  <FiUserPlus size={16} className="mr-2" />
                  Pending Approvals
                </Button>
                <Button
                  onClick={() => router.push("/admin/members/expired")}
                  className="h-auto justify-start bg-red/10 px-4 py-3 font-body text-sm text-red-600 hover:bg-red/20"
                >
                  <FiUserX size={16} className="mr-2" />
                  Expired Memberships
                </Button>
                <Button
                  onClick={() => router.push("/admin/plans")}
                  className="h-auto justify-start bg-blue/10 px-4 py-3 font-body text-sm text-blue-600 hover:bg-blue/20"
                >
                  <FiCreditCard size={16} className="mr-2" />
                  Manage Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
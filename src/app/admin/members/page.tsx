// app/admin/members/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Download, Eye, Users, UserCheck, Clock, AlertTriangle, UserX } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { MemberStatusBadge } from "@/components/MemberStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { memberService } from "@/services/memberService";
import type { MembershipStatus } from "@/types";

const STATUS_TABS: { label: string; value: MembershipStatus | ""; icon: any }[] = [
  { label: "All", value: "", icon: Users },
  { label: "Pending", value: "pending", icon: Clock },
  { label: "Active", value: "active", icon: UserCheck },
  { label: "Expired", value: "expired", icon: AlertTriangle },
  { label: "Suspended", value: "suspended", icon: UserX },
  { label: "Inactive", value: "inactive", icon: Users },
];

export default function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<MembershipStatus | "">("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: stats } = useQuery({
    queryKey: ["members", "stats"],
    queryFn: memberService.stats,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["members", "list", { page, limit, search, status }],
    queryFn: () => memberService.list({ page, limit, search: search || undefined, status: status || undefined }),
    placeholderData: (prev) => prev,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (value: MembershipStatus | "") => {
    setStatus(value);
    setPage(1);
  };

  const handleExport = async () => {
    await memberService.exportExcel(status || undefined);
  };

  const members = data?.data ?? [];
  const pagination = data?.pagination;

  const statItems = [
    { label: "Total", value: stats?.total, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Active", value: stats?.active, icon: UserCheck, color: "bg-green-100 text-green-700" },
    { label: "Pending", value: stats?.pending, icon: Clock, color: "bg-amber-100 text-amber-700" },
    { label: "Expired", value: stats?.expired, icon: AlertTriangle, color: "bg-orange-100 text-orange-700" },
    { label: "Suspended", value: stats?.suspended, icon: UserX, color: "bg-red-100 text-red-700" },
    { label: "Expiring Soon", value: stats?.upcomingExpiry, icon: AlertTriangle, color: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <AdminNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-utility text-sm font-semibold text-primary">Member Management</p>
            <h1 className="font-display text-3xl font-bold text-foreground">Members</h1>
            <p className="mt-1 text-muted-foreground">Manage and view all registered members.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} className="gap-2 rounded-xl">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button asChild className="gap-2 rounded-xl bg-primary hover:bg-primary/90">
              <Link href="/admin/members/new">
                <Plus className="h-4 w-4" />
                Add Member
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {statItems.map((item) => (
            <Card key={item.label} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2 ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-utility uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="font-display text-2xl font-bold text-foreground">{item.value ?? 0}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleStatusChange(tab.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium font-utility transition-all duration-200 ${
                status === tab.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, phone, email, or membership ID"
              className="rounded-xl pl-9"
            />
          </div>
          <Button type="submit" variant="outline" className="rounded-xl">
            Search
          </Button>
        </form>

        <Card className="overflow-hidden border-border shadow-sm p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary/5 text-xs font-utility uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Membership ID</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary"></div>
                        Loading members...
                      </div>
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No members found.</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member._id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/10">
                            {member.photo?.url && (
                              <img src={member.photo.url} alt={member.fullName} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{member.fullName}</p>
                            <p className="text-xs text-muted-foreground">{member.email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{member.membershipId}</td>
                      <td className="px-4 py-3">{member.phone}</td>
                      <td className="px-4 py-3">
                        <MemberStatusBadge status={member.membershipStatus} />
                      </td>
                      <td className="px-4 py-3">
                        {member.membershipExpiry ? new Date(member.membershipExpiry).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="ghost" size="sm" className="gap-1 rounded-xl hover:bg-primary/10">
                          <Link href={`/admin/members/${member._id}`}>
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total members)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrevPage || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
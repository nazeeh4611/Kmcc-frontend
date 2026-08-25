"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Download,
  Eye,
  Trash2,
  Users,
  UserCheck,
  Clock,
  AlertTriangle,
  UserX,
  User as UserIcon,
} from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { adminApiClient, extractErrorMessage } from "@/lib/adminApiClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MemberStatusBadge } from "@/components/MemberStatusBadge";
import type { Member, MembershipStatus, PaginatedResult } from "@/types";

const workingCountryLabel = (m: Member) => (m.workingCountry === "Other" ? m.workingCountryOther || "Other" : m.workingCountry || "—");

type StatusFilter = MembershipStatus | "";

const STATUS_TABS: { label: string; value: StatusFilter; icon: typeof Users }[] = [
  { label: "All", value: "", icon: Users },
  { label: "Pending", value: "pending", icon: Clock },
  { label: "Active", value: "active", icon: UserCheck },
  { label: "Expired", value: "expired", icon: AlertTriangle },
  { label: "Suspended", value: "suspended", icon: UserX },
  { label: "Inactive", value: "inactive", icon: Users },
];

interface MemberStats {
  total: number;
  active: number;
  pending: number;
  expired: number;
  suspended: number;
  upcomingExpiry: number;
}

const memberService = {
  stats: async (): Promise<MemberStats> => {
    const { data } = await adminApiClient.get("/members/stats");
    return data.data;
  },
  list: async (params: { page: number; limit: number; search?: string; status?: string }) => {
    const { data } = await adminApiClient.get<{ data: PaginatedResult<Member> }>("/members", { params });
    return data.data;
  },
  remove: async (id: string) => {
    const { data } = await adminApiClient.delete(`/members/${id}`);
    return data;
  },
  exportExcel: async (status?: string) => {
    const response = await adminApiClient.get("/members/export", {
      params: status ? { status } : undefined,
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `members-export-${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default function AdminMembersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const initialStatus = (searchParams.get("status") as StatusFilter | null) || "";
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; fullName: string } | null>(null);
  const limit = 20;

  const { data: stats } = useQuery({ queryKey: ["members", "stats"], queryFn: memberService.stats });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["members", "list", { page, limit, search, status }],
    queryFn: () => memberService.list({ page, limit, search: search || undefined, status: status || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => memberService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(`${pendingDelete?.fullName ?? "Member"} was deleted successfully.`);
      setPendingDelete(null);
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });

  const handleDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handleExport = async () => {
    try {
      await memberService.exportExcel(status || undefined);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const members = data?.data || [];
  const pagination = data?.pagination;

  const statItems = [
    { label: "Total", value: stats?.total || 0, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Active", value: stats?.active || 0, icon: UserCheck, color: "bg-green-100 text-green-700" },
    { label: "Pending", value: stats?.pending || 0, icon: Clock, color: "bg-amber-100 text-amber-700" },
    { label: "Expired", value: stats?.expired || 0, icon: AlertTriangle, color: "bg-orange-100 text-orange-700" },
    { label: "Suspended", value: stats?.suspended || 0, icon: UserX, color: "bg-red-100 text-red-700" },
    { label: "Expiring Soon", value: stats?.upcomingExpiry || 0, icon: AlertTriangle, color: "bg-amber-100 text-amber-700" },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-surface">
        <AdminNav />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-xl bg-red-50 p-6 text-center">
            <p className="text-red-600">Error loading members: {(error as Error).message}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <AdminNav />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-utility text-sm font-semibold text-primary">Member Management</p>
            <h1 className="font-display text-3xl font-bold text-foreground">Members</h1>
            <p className="mt-1 text-muted-foreground">Manage and view all registered members.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => router.push("/admin/members/new")}>
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {statItems.map((item) => (
            <Card key={item.label} className="p-4 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2 ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-utility text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
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
              placeholder="Search by name, contact number, email, or membership ID"
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary/5 text-xs font-utility uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Membership ID</th>
                  <th className="px-4 py-3">Home Country No.</th>
                  <th className="px-4 py-3">Working Country No.</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Working Country</th>
                  <th className="px-4 py-3">Blood Group</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">DOB</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                        Loading members...
                      </div>
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No members found.</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member._id} className="transition-colors hover:bg-primary/5">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/10">
                            {member.photo?.url ? (
                              <Image src={member.photo.url} alt={member.fullName} fill sizes="36px" className="object-cover" />
                            ) : (
                              <UserIcon className="absolute inset-0 m-auto h-4 w-4 text-primary/50" />
                            )}
                          </div>
                          <p className="font-medium text-foreground">{member.fullName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{member.membershipId}</td>
                      <td className="px-4 py-3">{member.homeCountryNumber || "—"}</td>
                      <td className="px-4 py-3">{member.workingCountryNumber || "—"}</td>
                      <td className="px-4 py-3">{member.email || "—"}</td>
                      <td className="px-4 py-3">{member.zone || "—"}</td>
                      <td className="px-4 py-3">{workingCountryLabel(member)}</td>
                      <td className="px-4 py-3">{member.bloodGroup}</td>
                      <td className="px-4 py-3">
                        <MemberStatusBadge status={member.membershipStatus} />
                      </td>
                      <td className="px-4 py-3">{member.dob ? new Date(member.dob).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/members/${member._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPendingDelete({ id: member._id, fullName: member.fullName })}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
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
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage || isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        title="Delete this member?"
        description={`Are you sure you want to permanently delete ${pendingDelete?.fullName}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AdminNav } from "@/components/AdminNav";
import { apiClient } from "@/lib/apiClient";

import Image from "next/image";


const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-white rounded-xl border border-border shadow-sm ${className}`}>
      {children}
    </div>
  );
};

const Button = ({
  children,
  type = "button",
  variant = "default",
  size = "default",
  disabled = false,
  className = "",
  onClick,
  asChild = false,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  asChild?: boolean;
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyles = {
    default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/40",
    outline: "border border-border bg-white text-foreground hover:bg-primary/5 hover:text-primary focus:ring-primary/40",
    ghost: "text-muted-foreground hover:bg-primary/10 hover:text-primary",
  };
  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm rounded-lg",
    sm: "h-8 px-3 py-1 text-xs rounded-lg",
  };

  if (asChild) {
    return <>{children}</>;
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-10 rounded-xl border border-border bg-white/80 px-4 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200 ${className}`}
    />
  );
};

const MemberStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    suspended: "bg-red-100 text-red-700",
    expired: "bg-gray-100 text-gray-700",
    inactive: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[status] || styles.inactive}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Search = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const Plus = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Download = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const Eye = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const Users = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const UserCheck = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17 11 19 13 23 9"></polyline>
  </svg>
);

const Clock = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const AlertTriangle = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const UserX = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="18" y1="8" x2="23" y2="13"></line>
    <line x1="23" y1="8" x2="18" y2="13"></line>
  </svg>
);

type MembershipStatus = "active" | "pending" | "suspended" | "expired" | "inactive" | "";

const STATUS_TABS: { label: string; value: MembershipStatus | ""; icon: any }[] = [
  { label: "All", value: "", icon: Users },
  { label: "Pending", value: "pending", icon: Clock },
  { label: "Active", value: "active", icon: UserCheck },
  { label: "Expired", value: "expired", icon: AlertTriangle },
  { label: "Suspended", value: "suspended", icon: UserX },
  { label: "Inactive", value: "inactive", icon: Users },
];

const memberService = {
  stats: async () => {
    const response = await apiClient.get("/members/stats");
    return response.data.data ?? response.data;
  },
  list: async ({ page, limit, search, status }: { page: number; limit: number; search?: string; status?: string }) => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    const response = await apiClient.get(`/members?${params}`);
    return response.data.data ?? response.data;
  },
  exportExcel: async (status?: string) => {
    const response = await apiClient.get("/members/export", {
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
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<MembershipStatus | "">("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["members", "stats"],
    queryFn: () => memberService.stats(),
  });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["members", "list", { page, limit, search, status }],
    queryFn: () => memberService.list({ page, limit, search: search || undefined, status: status || undefined }),
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
                  members.map((member: any) => (
                    <tr key={member._id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/10">
                            {member.photo?.url && (
                              <Image src={member.photo.url} alt={member.fullName} fill sizes="40px" className="object-cover" />
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
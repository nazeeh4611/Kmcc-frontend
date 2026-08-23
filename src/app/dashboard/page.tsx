"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  Hash,
  Phone,
  Mail,
  MapPin,
  Droplet,
  Globe2,
  Calendar,
  Download,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/store/authContext";
import { authService } from "@/services/authService";
import { extractErrorMessage } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MemberStatusBadge } from "@/components/MemberStatusBadge";
import type { Zone, Coordinator, MembershipPlan } from "@/types";
import { useState } from "react";

const asName = (value: string | Zone | Coordinator | MembershipPlan | null | undefined, fallback = "—") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return "title" in value ? value.title : value.name;
};

export default function MemberDashboardPage() {
  const { logout, isLoggingOut } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const { data: member, isLoading } = useQuery({
    queryKey: ["members", "me"],
    queryFn: authService.getMyMembershipDetails,
  });

  const handleDownloadCard = async () => {
    setDownloadError(null);
    setIsDownloading(true);
    try {
      await authService.downloadMembershipCard();
    } catch (error) {
      setDownloadError(extractErrorMessage(error));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface pb-16">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <p className="font-utility text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Member Dashboard
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
              {isLoading ? "Welcome back" : member?.fullName ?? "Welcome back"}
            </h1>
          </div>
          <Button variant="outline" onClick={logout} loading={isLoggingOut} disabled={isLoggingOut}>
            <LogOut size={16} />
            Sign out
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 rounded-2xl lg:col-span-1" />
            <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
          </div>
        ) : !member ? (
          <Card className="p-8 text-center text-muted-foreground">
            We couldn&apos;t load your membership details. Please try refreshing the page.
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="animate-in-up p-6 lg:col-span-1">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-primary/10 ring-4 ring-primary/10">
                  {member.photo?.url ? (
                    <Image src={member.photo.url} alt={member.fullName} fill sizes="96px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserIcon className="h-10 w-10 text-primary/50" />
                    </div>
                  )}
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold text-foreground">{member.fullName}</h2>
                <p className="mt-1 flex items-center gap-1.5 font-utility text-xs text-muted-foreground">
                  <Hash size={12} />
                  {member.membershipId}
                </p>
                <div className="mt-3">
                  <MemberStatusBadge status={member.membershipStatus} />
                </div>

                <div className="mt-6 w-full space-y-1">
                  <Button className="w-full" onClick={handleDownloadCard} loading={isDownloading} disabled={isDownloading}>
                    <Download size={16} />
                    Download Membership Card
                  </Button>
                  {downloadError && <p className="text-xs text-red-600">{downloadError}</p>}
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-6 lg:col-span-2">
              <Card className="animate-in-up p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>Membership Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
                  <DetailRow icon={Calendar} label="Membership Type" value={asName(member.membershipType)} />
                  <DetailRow
                    icon={Calendar}
                    label="Expires On"
                    value={member.membershipExpiry ? new Date(member.membershipExpiry).toLocaleDateString() : "—"}
                  />
                  <DetailRow
                    icon={Calendar}
                    label="Days Remaining"
                    value={member.isExpired ? "Expired" : `${member.daysRemaining} days`}
                  />
                  <DetailRow icon={Globe2} label="Working Country" value={member.workingCountry ?? "—"} />
                  <DetailRow icon={MapPin} label="Native Place" value={member.nativePlace ?? "—"} />
                  <DetailRow icon={MapPin} label="Zone" value={asName(member.zone, member.zoneOther ?? "—")} />
                </CardContent>
              </Card>

              <Card className="animate-in-up p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
                  <DetailRow icon={Phone} label="Phone" value={member.phone} />
                  <DetailRow icon={Mail} label="Email" value={member.email || "—"} />
                  <DetailRow icon={Droplet} label="Blood Group" value={member.bloodGroup} />
                  <DetailRow icon={MapPin} label="Address" value={member.address ?? "—"} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

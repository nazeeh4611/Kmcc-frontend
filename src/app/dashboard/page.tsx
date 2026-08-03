"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/authService";
import { extractErrorMessage } from "@/lib/apiClient";
import type { Member } from "@/types";

const statusStyles: Record<string, string> = {
  active: "bg-green/10 text-green border-green/20",
  expired: "bg-amber-50 text-amber-700 border-amber-200",
  pending: "bg-blue-50 text-blue-700 border-blue-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
  inactive: "bg-slate/10 text-slate/70 border-line",
};

const FiDownload = ({ size = 18, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const FiDroplet = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
  </svg>
);

const FiMapPin = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const FiPhone = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const FiCalendar = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const FiGlobe = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const FiUser = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const FiUsers = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FiMail = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const FiHome = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const FiFlag = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
    <line x1="4" y1="22" x2="4" y2="15"></line>
  </svg>
);

const FiAward = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const FiLayers = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);

const FiClock = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const FiBriefcase = ({ size = 16, className = "" }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-brass">{icon}</span>
      <div>
        <p className="font-utility text-[10px] uppercase tracking-wider text-slate/50">
          {label}
        </p>
        <p className="font-body text-sm font-semibold text-ink">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default function MemberDashboardPage() {
  const { session, logout, isLoggingOut } = useAuth();
  const sessionMember = session?.user as Member | undefined;

  const [member, setMember] = useState<Member | undefined>(sessionMember);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    authService
      .getMyMembershipDetails()
      .then((data) => {
        if (isMounted) setMember(data);
      })
      .catch((error) => {
        if (isMounted) setProfileError(extractErrorMessage(error));
      })
      .finally(() => {
        if (isMounted) setIsLoadingProfile(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = async () => {
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

  const status = member?.membershipStatus ?? "pending";
  const statusClass = statusStyles[status] ?? statusStyles.pending;

  const formatDate = (value?: string | Date | null) =>
    value ? new Date(value).toLocaleDateString() : "—";

  const membershipTypeTitle =
    typeof member?.membershipType === "object" && member?.membershipType
      ? (member.membershipType as any).title
      : undefined;

  return (
    <main className="min-h-screen bg-[#f8faf8] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-utility text-xs font-semibold uppercase tracking-[0.2em] text-green">
              Member Dashboard
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">
              {isLoadingProfile ? "Loading..." : member?.fullName || "Welcome"}
            </h1>
          </div>
          <Button variant="outline" onClick={logout} disabled={isLoggingOut}>
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>

        {profileError && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 font-body text-sm text-red-800">
            {profileError}
          </div>
        )}

        <Card className="relative overflow-hidden rounded-2xl border border-line bg-white/95 shadow-xl shadow-green/5">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green via-brass to-green"></div>

          <CardHeader className="border-b border-dashed border-line pb-6 pt-8 px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle className="font-display text-2xl text-ink">
                Membership Card
              </CardTitle>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-utility text-[10px] font-semibold uppercase tracking-wider ${statusClass}`}
              >
                {status}
              </span>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-6">
            <div className="grid gap-8 md:grid-cols-[180px,1fr]">
              <div className="flex flex-col items-center gap-3">
                <div className="h-40 w-40 overflow-hidden rounded-2xl border border-line bg-slate/5">
                  {member?.photo?.url ? (
                    <img
                      src={member.photo.url}
                      alt={member.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-body text-xs text-slate/40">
                      No photo
                    </div>
                  )}
                </div>
                <span className="font-utility text-xs font-semibold uppercase tracking-wider text-slate/50">
                  {member?.membershipId || "—"}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <DetailItem icon={<FiUser />} label="Full name" value={member?.fullName} />
                <DetailItem icon={<FiUsers />} label="Father's name" value={member?.fatherName} />
                <DetailItem
                  icon={<FiCalendar />}
                  label="Date of birth"
                  value={member?.dob ? formatDate(member.dob) : member?.birthYear}
                />
                <DetailItem icon={<FiUser />} label="Gender" value={member?.gender} />
                <DetailItem icon={<FiDroplet />} label="Blood group" value={member?.bloodGroup} />
                <DetailItem icon={<FiPhone />} label="Phone" value={member?.phone} />
                <DetailItem icon={<FiMail />} label="Email" value={member?.email} />
                <DetailItem icon={<FiHome />} label="Address" value={member?.address} />
                <DetailItem icon={<FiMapPin />} label="Native place" value={member?.nativePlace} />
                <DetailItem icon={<FiGlobe />} label="Working country" value={member?.workingCountry} />
                <DetailItem
                  icon={<FiFlag />}
                  label="Zone"
                  value={member?.zone || member?.zoneOther}
                />
                <DetailItem
                  icon={<FiUsers />}
                  label="Coordinator"
                  value={member?.coordinator || member?.coordinatorOther}
                />
                <DetailItem
                  icon={<FiLayers />}
                  label="Mandalam committee"
                  value={member?.mandalamCommittee}
                />
                <DetailItem icon={<FiHome />} label="Panchayath" value={member?.panchayath} />
                <DetailItem icon={<FiLayers />} label="Unit" value={member?.unit} />
                <DetailItem icon={<FiAward />} label="Committee role" value={member?.committeeRole} />
                <DetailItem
                  icon={<FiBriefcase />}
                  label="Membership plan"
                  value={membershipTypeTitle}
                />
                <DetailItem
                  icon={<FiCalendar />}
                  label="Joined date"
                  value={formatDate(member?.joinedDate)}
                />
                <DetailItem
                  icon={<FiCalendar />}
                  label="Membership start"
                  value={formatDate(member?.membershipStart)}
                />
                <DetailItem
                  icon={<FiCalendar />}
                  label="Membership expiry"
                  value={formatDate(member?.membershipExpiry)}
                />
                <DetailItem
                  icon={<FiClock />}
                  label="Days remaining"
                  value={member?.daysRemaining ?? "—"}
                />
                <DetailItem
                  icon={<FiClock />}
                  label="Expired"
                  value={member?.isExpired ? "Yes" : "No"}
                />
              </div>
            </div>

            <div className="mt-8 border-t border-dashed border-line pt-6">
              {downloadError && (
                <p className="mb-3 font-body text-xs text-red-600">{downloadError}</p>
              )}
              <Button
                onClick={handleDownload}
                disabled={isDownloading || status === "pending"}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-green to-brass font-body text-sm font-semibold text-white shadow-lg shadow-green/20 disabled:opacity-60 sm:w-auto sm:px-8"
              >
                <FiDownload className="mr-2" />
                {isDownloading
                  ? "Preparing card..."
                  : status === "pending"
                  ? "Card unavailable while pending"
                  : "Download membership card"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
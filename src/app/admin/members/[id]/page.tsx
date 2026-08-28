"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminApiClient as apiClient } from "@/lib/adminApiClient";
import { memberEditFormSchema, type MemberEditFormInput } from "@/lib/validators/memberSchema";
import { MemberFormFields } from "@/features/member/MemberFormFields";
import Image from "next/image";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MemberStatusBadge } from "@/components/MemberStatusBadge";

const Alert = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}) => {
  const variantStyles = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-300 text-red-800",
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-4 shadow-sm ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

const selectClass =
  "flex h-11 w-full rounded-xl border border-border bg-white/80 px-4 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200";

interface MembershipPlan {
  _id: string;
  title: string;
  duration: number;
  price: number;
}

const FALLBACK_PLANS: MembershipPlan[] = [
  { _id: "fallback-1yr", title: "1 Year", duration: 12, price: 500 },
  { _id: "fallback-3yr", title: "3 Years", duration: 36, price: 1200 },
  { _id: "fallback-5yr", title: "5 Years", duration: 60, price: 2000 },
];

const memberService = {
  getById: async (id: string) => {
    const response = await apiClient.get(`/members/${id}`);
    return response.data.data.member;
  },
  update: async (id: string, formData: FormData) => {
    const response = await apiClient.patch(`/members/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data.member;
  },
  approve: async (id: string, data: { membershipType: string; committeeRole: string }) => {
    const response = await apiClient.post(`/members/${id}/approve`, data);
    return response.data.data;
  },
  reject: async (id: string) => {
    const response = await apiClient.post(`/members/${id}/reject`);
    return response.data;
  },
  suspend: async (id: string) => {
    const response = await apiClient.post(`/members/${id}/suspend`);
    return response.data.data.member;
  },
  reactivate: async (id: string) => {
    const response = await apiClient.post(`/members/${id}/reactivate`);
    return response.data.data.member;
  },
  resetPassword: async (id: string) => {
    const response = await apiClient.post(`/members/${id}/reset-password`);
    return response.data.data;
  },
  renew: async (id: string, data: { membershipType: string }) => {
    const response = await apiClient.post(`/members/${id}/renew`, data);
    return response.data.data.member;
  },
  remove: async (id: string) => {
    const response = await apiClient.delete(`/members/${id}`);
    return response.data;
  },
  downloadCard: async (id: string) => {
    const response = await apiClient.get(`/members/${id}/card`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${id}-card.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

const metaService = {
  listMembershipPlans: async (): Promise<MembershipPlan[]> => {
    try {
      const response = await apiClient.get("/membership-plans");
      const plans = response.data.data?.plans ?? response.data.data ?? [];
      return Array.isArray(plans) && plans.length > 0 ? plans : FALLBACK_PLANS;
    } catch {
      return FALLBACK_PLANS;
    }
  },
};

const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
};

function PhotoLightbox({ url, alt, onClose }: { url: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-xl hover:bg-white/20"
      >
        ✕
      </button>
   <Image
  src={url}
  alt={alt}
  width={1200}
  height={1200}
  className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
  onClick={(e) => e.stopPropagation()}
/>
    </div>
  );
}

export default function MemberDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: member, isLoading } = useQuery({
    queryKey: ["members", "detail", id],
    queryFn: () => memberService.getById(id),
    enabled: !!id,
  });

  const { data: plans } = useQuery({
    queryKey: ["meta", "plans"],
    queryFn: metaService.listMembershipPlans,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["members"] });
    queryClient.invalidateQueries({ queryKey: ["members", "detail", id] });
  };

  const withHandlers = <T,>(mutationFn: () => Promise<T>, successMsg: string | ((result: T) => string)) =>
    mutationFn()
      .then((result) => {
        setError(null);
        setNotice(typeof successMsg === "function" ? successMsg(result) : successMsg);
        invalidate();
      })
      .catch((err) => setError(extractErrorMessage(err)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <AdminNav />
        <div className="flex items-center justify-center p-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
            <p className="text-muted-foreground">Loading member details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-surface">
        <AdminNav />
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <span className="text-2xl">!</span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-foreground">Member Not Found</h2>
<p className="mt-2 text-muted-foreground">
  The member you&apos;re looking for doesn&apos;t exist or has been removed.
</p>          <Button className="mt-6" onClick={() => router.push("/admin/members")}>
            Back to Members
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <AdminNav />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-utility text-sm font-semibold text-primary">Member Management</p>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold text-foreground">{member.fullName}</h1>
              <MemberStatusBadge status={member.membershipStatus} />
            </div>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground">{member.membershipId}</span>
              {member.membershipExpiry && (
                <span className="text-sm text-muted-foreground">
                  Expires: {new Date(member.membershipExpiry).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin/members")} className="gap-2">
            ← Back to list
          </Button>
        </div>

        {notice && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
            <span className="font-medium">Success!</span> {notice}
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <span className="font-medium">Error:</span> {error}
          </Alert>
        )}

        {member.membershipStatus === "pending" ? (
          <>
            <Card className="mb-6 overflow-hidden border-border shadow-sm">
              <CardHeader className="border-b border-border bg-primary/5">
                <CardTitle className="text-foreground">Applicant Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ProfileView member={member} />
              </CardContent>
            </Card>

            <PendingApprovalCard
              memberId={id}
              plans={plans ?? []}
              onDone={(msg) => {
                setNotice(msg);
                invalidate();
              }}
              onError={setError}
            />
          </>
        ) : (
          <>
            <Card className="mb-6 overflow-hidden border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-primary/5">
                <CardTitle className="text-foreground">Profile Information</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsEditing((v) => !v)} className="gap-2">
                  {isEditing ? "✕ Cancel" : "✎ Edit"}
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditing ? (
                  <EditMemberForm
                    memberId={id}
                    initial={member}
                    onSaved={() => {
                      setIsEditing(false);
                      setNotice("Member updated successfully");
                      invalidate();
                    }}
                    onError={setError}
                  />
                ) : (
                  <ProfileView member={member} />
                )}
              </CardContent>
            </Card>

            <ActionsPanel memberId={id} member={member} plans={plans ?? []} withHandlers={withHandlers} />
          </>
        )}
      </main>
    </div>
  );
}

function FieldGrid({ fields }: { fields: [string, string | number | null | undefined][] }) {
  return (
    <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <div key={label} className="rounded-lg bg-primary/5 p-3">
          <p className="text-xs font-utility uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-sm font-medium text-foreground">{value || "—"}</p>
        </div>
      ))}
    </div>
  );
}

function ProfileView({
  member,
}: {
  member: NonNullable<Awaited<ReturnType<typeof memberService.getById>>>;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const workingCountryLabel =
    member.workingCountry === "Other" ? member.workingCountryOther || "Other" : member.workingCountry;

  const personalFields: [string, string | number | null | undefined][] = [
    ["Full Name", member.fullName],
    ["Father's Name", member.fatherName],
    ["Date of Birth", member.dob ? new Date(member.dob).toLocaleDateString() : "—"],
    ["Blood Group", member.bloodGroup],
  ];

  const contactFields: [string, string | number | null | undefined][] = [
    ["Home Country Number", member.homeCountryNumber],
    ["Working Country Number", member.workingCountryNumber],
    ["Email", member.email],
    ["Address", member.address],
  ];

  const locationFields: [string, string | number | null | undefined][] = [
    ["Zone", member.zone],
    ["Working Country", workingCountryLabel],
  ];

  const nomineeFields: [string, string | number | null | undefined][] = [
    ["Nominee Name", member.nomineeName],
    ["Nominee Relation", member.nomineeRelation],
  ];

  const membershipFields: [string, string | number | null | undefined][] = [
    ["Membership ID", member.membershipId],
    ["Status", member.membershipStatus],
    [
      "Membership Plan",
      typeof member.membershipType === "object" && member.membershipType ? member.membershipType.title : member.membershipType || "—",
    ],
    ["Membership Start", member.membershipStart ? new Date(member.membershipStart).toLocaleDateString() : "—"],
    ["Membership Expiry", member.membershipExpiry ? new Date(member.membershipExpiry).toLocaleDateString() : "—"],
    ["Days Remaining", member.daysRemaining],
  ];

  return (
    <div className="space-y-6">
      {member.photo?.url && (
        <div>
          <p className="mb-2 text-xs font-utility uppercase tracking-wider text-muted-foreground">Photo</p>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group relative h-32 w-32 overflow-hidden rounded-lg ring-1 ring-border"
          >
<Image
  src={member.photo.url}
  alt={member.fullName}
  fill
  sizes="128px"
  className="object-cover transition group-hover:brightness-75"
/>            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
              View full size
            </span>
          </button>
          {lightboxOpen && (
            <PhotoLightbox url={member.photo.url} alt={member.fullName} onClose={() => setLightboxOpen(false)} />
          )}
        </div>
      )}

      <div>
        <p className="mb-3 text-xs font-utility uppercase tracking-wider text-muted-foreground">Personal Information</p>
        <FieldGrid fields={personalFields} />
      </div>

      <div>
        <p className="mb-3 text-xs font-utility uppercase tracking-wider text-muted-foreground">Contact</p>
        <FieldGrid fields={contactFields} />
      </div>

      <div>
        <p className="mb-3 text-xs font-utility uppercase tracking-wider text-muted-foreground">Location</p>
        <FieldGrid fields={locationFields} />
      </div>

      <div>
        <p className="mb-3 text-xs font-utility uppercase tracking-wider text-muted-foreground">Nominee</p>
        <FieldGrid fields={nomineeFields} />
      </div>

      <div>
        <p className="mb-3 text-xs font-utility uppercase tracking-wider text-muted-foreground">Membership</p>
        <FieldGrid fields={membershipFields} />
      </div>
    </div>
  );
}

// Uses the exact same field set/validation as public registration and the
// admin "Add Member" form (memberEditFormSchema + MemberFormFields) — photo
// is optional here since the member already has one.
function EditMemberForm({
  memberId,
  initial,
  onSaved,
  onError,
}: {
  memberId: string;
  initial: NonNullable<Awaited<ReturnType<typeof memberService.getById>>>;
  onSaved: () => void;
  onError: (msg: string) => void;
}) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MemberEditFormInput>({
    resolver: zodResolver(memberEditFormSchema),
    defaultValues: {
      membershipId: initial.membershipId || "",
      fullName: initial.fullName || "",
      fatherName: initial.fatherName || "",
      dob: initial.dob ? new Date(initial.dob).toISOString().split("T")[0] : "",
      bloodGroup: (initial.bloodGroup as MemberEditFormInput["bloodGroup"]) || undefined,
      homeCountryNumber: initial.homeCountryNumber || "",
      workingCountryNumber: initial.workingCountryNumber || "",
      email: initial.email || "",
      address: initial.address || "",
      nomineeName: initial.nomineeName || "",
      nomineeRelation: (initial.nomineeRelation as MemberEditFormInput["nomineeRelation"]) || undefined,
      zone: (initial.zone as MemberEditFormInput["zone"]) || undefined,
      workingCountry: (initial.workingCountry as MemberEditFormInput["workingCountry"]) || undefined,
      workingCountryOther: initial.workingCountryOther || "",
    },
  });

  const onPhotoSelect = (file: File) => {
    setValue("photo", file, { shouldValidate: true });
    setPhotoPreview(URL.createObjectURL(file));
  };

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => memberService.update(memberId, formData),
    onSuccess: onSaved,
    onError: (err) => onError(extractErrorMessage(err)),
  });

  const onSubmit = (values: MemberEditFormInput) => {
    const formData = new FormData();
    if (values.photo instanceof File) formData.append("photo", values.photo);
    if (values.membershipId && values.membershipId !== initial.membershipId) {
      formData.append("membershipId", values.membershipId);
    }
    formData.append("fullName", values.fullName);
    formData.append("fatherName", values.fatherName);
    formData.append("dob", values.dob);
    formData.append("bloodGroup", values.bloodGroup);
    formData.append("homeCountryNumber", values.homeCountryNumber);
    formData.append("workingCountryNumber", values.workingCountryNumber);
    if (values.email) formData.append("email", values.email);
    formData.append("address", values.address);
    formData.append("nomineeName", values.nomineeName);
    formData.append("nomineeRelation", values.nomineeRelation);
    formData.append("zone", values.zone);
    formData.append("workingCountry", values.workingCountry);
    if (values.workingCountry === "Other" && values.workingCountryOther) {
      formData.append("workingCountryOther", values.workingCountryOther);
    }
    updateMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Label htmlFor="membershipId" className="text-amber-900">
          Membership ID <span className="font-normal text-amber-700">(admin only)</span>
        </Label>
        <Input
          id="membershipId"
          {...register("membershipId")}
          className="mt-1.5 rounded-xl bg-white"
          placeholder="e.g. 1001"
        />
        {errors.membershipId && (
          <p className="mt-1 text-xs text-red-600">{String(errors.membershipId.message)}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MemberFormFields
          register={register}
          errors={errors}
          watch={watch}
          photoPreview={photoPreview}
          onPhotoSelect={onPhotoSelect}
          existingPhotoUrl={initial.photo?.url}
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={() => onSaved()} className="rounded-xl">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || updateMutation.isPending}
          className="rounded-xl bg-primary hover:bg-primary/90"
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function PendingApprovalCard({
  memberId,
  plans,
  onDone,
  onError,
}: {
  memberId: string;
  plans: MembershipPlan[];
  onDone: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const router = useRouter();
  const [membershipType, setMembershipType] = useState("");
  const [committeeRole, setCommitteeRole] = useState("");

  const approveMutation = useMutation({
    mutationFn: () => memberService.approve(memberId, { membershipType, committeeRole }),
    onSuccess: (data) => {
      const msg = data.temporaryPassword
        ? `Application approved. Temporary password: ${data.temporaryPassword}`
        : "Application approved successfully.";
      onDone(msg);
    },
    onError: (err) => onError(extractErrorMessage(err)),
  });

  const rejectMutation = useMutation({
    mutationFn: () => memberService.reject(memberId),
    onSuccess: () => router.push("/admin/members"),
    onError: (err) => onError(extractErrorMessage(err)),
  });

  return (
    <Card className="overflow-hidden border-amber-200 shadow-lg">
      <CardHeader className="border-b border-amber-200 bg-amber-50">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-sm">!</span>
          Pending Application
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <p className="text-sm text-muted-foreground">
          Review the applicant details above, then select a membership plan to approve, or reject the application.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="p_plan">Membership Plan *</Label>
            <select
              id="p_plan"
              className={selectClass}
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
            >
              <option value="">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.title} ({plan.duration}mo)
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p_role">Committee Role</Label>
            <Input id="p_role" value={committeeRole} onChange={(e) => setCommitteeRole(e.target.value)} className="rounded-xl" placeholder="Optional" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="destructive"
            onClick={() => rejectMutation.mutate()}
            disabled={rejectMutation.isPending || approveMutation.isPending}
            className="rounded-xl"
          >
            {rejectMutation.isPending ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            onClick={() => {
              if (!membershipType) {
                onError("Please select a membership plan before approving.");
                return;
              }
              approveMutation.mutate();
            }}
            disabled={approveMutation.isPending || rejectMutation.isPending}
            className="rounded-xl bg-green-600 hover:bg-green-700"
          >
            {approveMutation.isPending ? "Approving..." : "Approve"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionsPanel({
  memberId,
  member,
  plans,
  withHandlers,
}: {
  memberId: string;
  member: NonNullable<Awaited<ReturnType<typeof memberService.getById>>>;
  plans: MembershipPlan[];
  withHandlers: <T>(mutationFn: () => Promise<T>, successMsg: string | ((result: T) => string)) => Promise<void>;
}) {
  const router = useRouter();
  const [renewPlan, setRenewPlan] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const run = async <T,>(fn: () => Promise<T>, msg: string | ((result: T) => string)) => {
    setBusy(true);
    await withHandlers(fn, msg);
    setBusy(false);
  };

  return (
    <Card className="mb-6 overflow-hidden border-border shadow-sm">
      <CardHeader className="border-b border-border bg-primary/5">
        <CardTitle>Member Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap gap-3">
          {member.membershipStatus === "suspended" ? (
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => run(() => memberService.reactivate(memberId), "Member reactivated successfully")}
              className="rounded-xl border-green-500 text-green-600 hover:bg-green-50"
            >
              <span className="mr-2">✓</span> Reactivate
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => run(() => memberService.suspend(memberId), "Member suspended successfully")}
              className="rounded-xl border-amber-500 text-amber-600 hover:bg-amber-50"
            >
              <span className="mr-2">⛔</span> Suspend
            </Button>
          )}

          <Button
            variant="outline"
            disabled={busy}
            onClick={() =>
              run(
                () => memberService.resetPassword(memberId),
                (result) =>
                  result?.temporaryPassword
                    ? `Password reset. New password: ${result.temporaryPassword}`
                    : "Password reset successfully"
              )
            }
            className="rounded-xl"
          >
            🔑 Reset Password
          </Button>

          <Button
            variant="outline"
            disabled={busy}
            onClick={() => memberService.downloadCard(memberId)}
            className="rounded-xl"
          >
            📇 Download Card
          </Button>

          <Button
            variant="destructive"
            disabled={busy}
            onClick={() => setConfirmDelete(true)}
            className="rounded-xl"
          >
            🗑 Delete Member
          </Button>
        </div>

        <div className="flex flex-wrap items-end gap-3 border-t border-border pt-4">
          <div className="w-64 space-y-1.5">
            <Label htmlFor="renewPlan">Renew Membership</Label>
            <select id="renewPlan" className={selectClass} value={renewPlan} onChange={(e) => setRenewPlan(e.target.value)}>
              <option value="">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.title} ({plan.duration}mo)
                </option>
              ))}
            </select>
          </div>
          <Button
            disabled={busy || !renewPlan}
            onClick={() => run(() => memberService.renew(memberId, { membershipType: renewPlan }), "Membership renewed successfully")}
            className="rounded-xl bg-primary hover:bg-primary/90"
          >
            🔄 Renew
          </Button>
        </div>
      </CardContent>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        loading={deleting}
        title="Delete this member?"
        description={`Are you sure you want to permanently delete ${member.fullName}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={async () => {
          setDeleting(true);
          try {
            await memberService.remove(memberId);
            toast.success(`${member.fullName} was deleted successfully.`);
            router.push("/admin/members");
          } catch (err) {
            toast.error(extractErrorMessage(err));
          } finally {
            setDeleting(false);
            setConfirmDelete(false);
          }
        }}
      />
    </Card>
  );
}
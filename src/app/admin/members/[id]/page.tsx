"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const AdminNav = () => {
  return (
    <nav className="bg-white border-b border-border px-6 py-4">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-foreground">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</a>
          <a href="/admin/members" className="text-sm text-primary font-medium">Members</a>
          <a href="/admin/committee" className="text-sm text-muted-foreground hover:text-primary transition-colors">Committee</a>
          <a href="/admin/banners" className="text-sm text-muted-foreground hover:text-primary transition-colors">Banners</a>
        </div>
      </div>
    </nav>
  );
};

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

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`px-6 py-4 border-b border-border ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={`text-lg font-semibold text-foreground ${className}`}>{children}</h3>
  );
};

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`px-6 py-4 ${className}`}>{children}</div>
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
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline" | "destructive" | "ghost";
  size?: "default" | "sm";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyles = {
    default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/40",
    outline: "border border-border bg-white text-foreground hover:bg-primary/5 hover:text-primary focus:ring-primary/40",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/40",
    ghost: "text-muted-foreground hover:bg-primary/5 hover:text-primary",
  };
  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm rounded-lg",
    sm: "h-8 px-3 py-1 text-xs rounded-lg",
  };

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
  id,
  type = "text",
  placeholder,
  className = "",
  required = false,
  value,
  onChange,
  accept,
}: {
  id?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      accept={accept}
      className={`w-full h-11 rounded-xl border border-border bg-white/80 px-4 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200 ${className}`}
    />
  );
};

const Label = ({
  children,
  htmlFor,
  className = "",
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-foreground ${className}`}
    >
      {children}
    </label>
  );
};

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

const MemberStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    suspended: "bg-red-100 text-red-700",
    expired: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[status] || styles.expired}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
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

const memberService = {
  getById: async (id: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}`);
    return response.data;
  },
  update: async (id: string, formData: FormData) => {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  listFamily: async (id: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}/family`);
    return response.data;
  },
  addFamily: async (id: string, formData: FormData) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}/family`, formData);
    return response.data;
  },
  removeFamily: async (memberId: string, familyId: string) => {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${memberId}/family/${familyId}`);
    return response.data;
  },
  approve: async (id: string, data: { membershipType: string; committeeRole: string; unit: string }) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}/approve`, data);
    return response.data;
  },
  reject: async (id: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}/reject`);
    return response.data;
  },
  suspend: async (id: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}/suspend`);
    return response.data;
  },
  reactivate: async (id: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}/reactivate`);
    return response.data;
  },
  resetPassword: async (id: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}/reset-password`);
    return response.data;
  },
  renew: async (id: string, data: { membershipType: string }) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}/renew`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}`);
    return response.data;
  },
  downloadCard: (id: string, membershipId: string) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/admin/members/${id}/card`, "_blank");
  },
};

const metaService = {
  listMembershipPlans: async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/meta/plans`);
    return response.data;
  },
};

const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
};

const FAMILY_RELATIONS = ["spouse", "son", "daughter", "father", "mother", "sibling", "other"];

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

  const { data: familyMembers } = useQuery({
    queryKey: ["members", "family", id],
    queryFn: () => memberService.listFamily(id),
    enabled: !!id && member?.membershipStatus !== "pending",
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["members"] });
    queryClient.invalidateQueries({ queryKey: ["members", "detail", id] });
  };

  const withHandlers = <T,>(mutationFn: () => Promise<T>, successMsg: string) =>
    mutationFn()
      .then(() => {
        setError(null);
        setNotice(successMsg);
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
          <p className="mt-2 text-muted-foreground">The member you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" onClick={() => router.push("/admin/members")}>
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
          <PendingApprovalCard
            memberId={id}
            plans={plans ?? []}
            onDone={(msg) => {
              setNotice(msg);
              invalidate();
            }}
            onError={setError}
          />
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
                    plans={plans ?? []}
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

            <FamilyMembersCard memberId={id} familyMembers={familyMembers ?? []} onError={setError} />
          </>
        )}
      </main>
    </div>
  );
}

function ProfileView({
  member,
}: {
  member: NonNullable<Awaited<ReturnType<typeof memberService.getById>>>;
}) {
  const fields: [string, string | number | null | undefined][] = [
    ["Phone", member.phone],
    ["Email", member.email],
    ["Gender", member.gender],
    ["Blood Group", member.bloodGroup],
    ["Date of Birth", member.dob ? new Date(member.dob).toLocaleDateString() : null],
    ["Birth Year", member.birthYear],
    ["Father's Name", member.fatherName],
    ["Mother's Name", member.motherName],
    ["House Name", member.houseName],
    ["Place", member.place],
    ["Post Office", member.postOffice],
    ["Address", member.address],
    ["District", member.district],
    ["State", member.state],
    ["Country", member.country],
    ["Working Country", member.workingCountry],
    ["Zone", typeof member.zone === "object" ? member.zone?.name : member.zone],
    ["Native Place", member.nativePlace],
    ["Coordinator", typeof member.coordinator === "object" ? member.coordinator?.name : member.coordinator],
    ["Passport Number", member.passportNumber],
    ["Civil ID", member.civilId],
    ["Occupation", member.occupation],
    ["Committee Role", member.committeeRole],
    ["Panchayath", member.panchayath],
    ["Unit", member.unit],
    [
      "Membership Plan",
      typeof member.membershipType === "object" && member.membershipType ? member.membershipType.title : member.membershipType || "—",
    ],
    ["Membership Start", member.membershipStart ? new Date(member.membershipStart).toLocaleDateString() : "—"],
    ["Membership Expiry", member.membershipExpiry ? new Date(member.membershipExpiry).toLocaleDateString() : "—"],
    ["Days Remaining", member.daysRemaining],
    ["Joined Date", member.joinedDate ? new Date(member.joinedDate).toLocaleDateString() : "—"],
  ];

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

function EditMemberForm({
  memberId,
  initial,
  plans,
  onSaved,
  onError,
}: {
  memberId: string;
  initial: NonNullable<Awaited<ReturnType<typeof memberService.getById>>>;
  plans: MembershipPlan[];
  onSaved: () => void;
  onError: (msg: string) => void;
}) {
  const [form, setForm] = useState({
    fullName: initial.fullName || "",
    phone: initial.phone || "",
    email: initial.email || "",
    gender: initial.gender || "male",
    bloodGroup: initial.bloodGroup || "unknown",
    fatherName: initial.fatherName || "",
    motherName: initial.motherName || "",
    dob: initial.dob || "",
    birthYear: initial.birthYear || "",
    address: initial.address || "",
    houseName: initial.houseName || "",
    place: initial.place || "",
    postOffice: initial.postOffice || "",
    district: initial.district || "",
    state: initial.state || "",
    country: initial.country || "",
    workingCountry: initial.workingCountry || "",
    zone: typeof initial.zone === "string" ? initial.zone : "",
    nativePlace: initial.nativePlace || "",
    coordinator: typeof initial.coordinator === "string" ? initial.coordinator : "",
    passportNumber: initial.passportNumber || "",
    civilId: initial.civilId || "",
    occupation: initial.occupation || "",
    committeeRole: initial.committeeRole || "",
    panchayath: initial.panchayath || "",
    unit: initial.unit || "",
    membershipType:
      typeof initial.membershipType === "object" && initial.membershipType ? initial.membershipType._id : 
      typeof initial.membershipType === "string" ? initial.membershipType : "",
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => memberService.update(memberId, formData),
    onSuccess: onSaved,
    onError: (err) => onError(extractErrorMessage(err)),
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (photo) formData.append("photo", photo);
    updateMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="e_fullName">Full Name</Label>
          <Input id="e_fullName" value={form.fullName} onChange={handleChange("fullName")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_phone">Phone</Label>
          <Input id="e_phone" value={form.phone} onChange={handleChange("phone")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_email">Email</Label>
          <Input id="e_email" value={form.email} onChange={handleChange("email")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_gender">Gender</Label>
          <select id="e_gender" className={selectClass} value={form.gender} onChange={handleChange("gender")}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_bloodGroup">Blood Group</Label>
          <select
            id="e_bloodGroup"
            className={selectClass}
            value={form.bloodGroup}
            onChange={handleChange("bloodGroup")}
          >
            {["unknown", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_photo">Photo</Label>
          <Input id="e_photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_dob">Date of Birth</Label>
          <Input id="e_dob" type="date" value={form.dob} onChange={handleChange("dob")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_birthYear">Birth Year</Label>
          <Input id="e_birthYear" type="number" value={form.birthYear} onChange={handleChange("birthYear")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_fatherName">Father's Name</Label>
          <Input id="e_fatherName" value={form.fatherName} onChange={handleChange("fatherName")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_motherName">Mother's Name</Label>
          <Input id="e_motherName" value={form.motherName} onChange={handleChange("motherName")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_houseName">House Name</Label>
          <Input id="e_houseName" value={form.houseName} onChange={handleChange("houseName")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_place">Place</Label>
          <Input id="e_place" value={form.place} onChange={handleChange("place")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_postOffice">Post Office</Label>
          <Input id="e_postOffice" value={form.postOffice} onChange={handleChange("postOffice")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="e_address">Address</Label>
          <Input id="e_address" value={form.address} onChange={handleChange("address")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_district">District</Label>
          <Input id="e_district" value={form.district} onChange={handleChange("district")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_state">State</Label>
          <Input id="e_state" value={form.state} onChange={handleChange("state")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_country">Country</Label>
          <Input id="e_country" value={form.country} onChange={handleChange("country")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_workingCountry">Working Country</Label>
          <Input id="e_workingCountry" value={form.workingCountry} onChange={handleChange("workingCountry")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_zone">Zone</Label>
          <Input id="e_zone" value={form.zone} onChange={handleChange("zone")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_nativePlace">Native Place</Label>
          <Input id="e_nativePlace" value={form.nativePlace} onChange={handleChange("nativePlace")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_coordinator">Coordinator</Label>
          <Input id="e_coordinator" value={form.coordinator} onChange={handleChange("coordinator")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_passportNumber">Passport Number</Label>
          <Input id="e_passportNumber" value={form.passportNumber} onChange={handleChange("passportNumber")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_civilId">Civil ID</Label>
          <Input id="e_civilId" value={form.civilId} onChange={handleChange("civilId")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_occupation">Occupation</Label>
          <Input id="e_occupation" value={form.occupation} onChange={handleChange("occupation")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_committeeRole">Committee Role</Label>
          <Input id="e_committeeRole" value={form.committeeRole} onChange={handleChange("committeeRole")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_panchayath">Panchayath</Label>
          <Input id="e_panchayath" value={form.panchayath} onChange={handleChange("panchayath")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_unit">Unit</Label>
          <Input id="e_unit" value={form.unit} onChange={handleChange("unit")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="e_membershipType">Membership Plan</Label>
          <select
            id="e_membershipType"
            className={selectClass}
            value={form.membershipType}
            onChange={handleChange("membershipType")}
          >
            <option value="">Keep current</option>
            {plans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.title} ({plan.duration}mo)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={() => onSaved()} className="rounded-xl">
          Cancel
        </Button>
        <Button type="submit" disabled={updateMutation.isPending} className="rounded-xl bg-primary hover:bg-primary/90">
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
  const [unit, setUnit] = useState("");

  const approveMutation = useMutation({
    mutationFn: () => memberService.approve(memberId, { membershipType, committeeRole, unit }),
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
          This member has submitted an application and is waiting for approval. Select a membership plan and optionally assign a committee role or unit.
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
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p_unit">Unit</Label>
            <Input id="p_unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="rounded-xl" placeholder="Optional" />
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
  withHandlers: <T>(mutationFn: () => Promise<T>, successMsg: string) => Promise<void>;
}) {
  const router = useRouter();
  const [renewPlan, setRenewPlan] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<unknown>, msg: string) => {
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
            onClick={() => run(() => memberService.resetPassword(memberId), "Password reset successfully")}
            className="rounded-xl"
          >
            🔑 Reset Password
          </Button>

          <Button
            variant="outline"
            disabled={busy}
            onClick={() => memberService.downloadCard(memberId, member.membershipId)}
            className="rounded-xl"
          >
            📇 Download Card
          </Button>

          <Button
            variant="destructive"
            disabled={busy}
            onClick={async () => {
              if (!confirm(`Are you sure you want to permanently delete ${member.fullName}? This action cannot be undone.`)) return;
              setBusy(true);
              try {
                await memberService.remove(memberId);
                router.push("/admin/members");
              } finally {
                setBusy(false);
              }
            }}
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
    </Card>
  );
}

function FamilyMembersCard({
  memberId,
  familyMembers,
  onError,
}: {
  memberId: string;
  familyMembers: Awaited<ReturnType<typeof memberService.listFamily>>;
  onError: (msg: string) => void;
}) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("spouse");

  const addMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("relation", relation);
      return memberService.addFamily(memberId, formData);
    },
    onSuccess: () => {
      setName("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["members", "family", memberId] });
    },
    onError: (err) => onError(extractErrorMessage(err)),
  });

  const removeMutation = useMutation({
    mutationFn: (familyId: string) => memberService.removeFamily(memberId, familyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members", "family", memberId] }),
    onError: (err) => onError(extractErrorMessage(err)),
  });

  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-primary/5">
        <CardTitle>Family Members</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowForm((v) => !v)} className="gap-2 rounded-xl">
          {showForm ? "✕ Cancel" : "+ Add"}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {showForm && (
          <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex-1 min-w-[150px] space-y-1.5">
              <Label htmlFor="fm_name">Name</Label>
              <Input id="fm_name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" placeholder="Enter name" />
            </div>
            <div className="flex-1 min-w-[120px] space-y-1.5">
              <Label htmlFor="fm_relation">Relation</Label>
              <select id="fm_relation" className={selectClass} value={relation} onChange={(e) => setRelation(e.target.value)}>
                {FAMILY_RELATIONS.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <Button
              disabled={!name.trim() || addMutation.isPending}
              onClick={() => addMutation.mutate()}
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              {addMutation.isPending ? "Adding..." : "Add Member"}
            </Button>
          </div>
        )}

        {familyMembers.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No family members added yet.</p>
            <p className="text-xs text-muted-foreground">Click "Add" to add a family member.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {familyMembers.map((fm: any) => (
              <li key={fm._id} className="flex items-center justify-between py-3">
                <div>
                  <span className="font-medium text-foreground">{fm.name}</span>
                  <span className="ml-2 text-sm text-muted-foreground">({fm.relation})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={removeMutation.isPending}
                  onClick={() => removeMutation.mutate(fm._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
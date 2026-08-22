"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";


const AdminNav = () => {
  return (
    <nav className="bg-white border-b border-border px-6 py-4">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-foreground">Admin Panel</span>
        </div>
        import Link from "next/link";

<div className="flex items-center gap-4">
  <Link
    href="/admin/dashboard"
    className="text-sm text-muted-foreground hover:text-primary transition-colors"
  >
    Dashboard
  </Link>

  <Link
    href="/admin/members"
    className="text-sm text-primary font-medium"
  >
    Members
  </Link>

  <Link
    href="/admin/committee"
    className="text-sm text-muted-foreground hover:text-primary transition-colors"
  >
    Committee
  </Link>

  <Link
    href="/admin/banners"
    className="text-sm text-muted-foreground hover:text-primary transition-colors"
  >
    Banners
  </Link>
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
  disabled = false,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyles = {
    default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/40",
    outline: "border border-border bg-white text-foreground hover:bg-primary/5 hover:text-primary focus:ring-primary/40",
  };
  const sizeStyles = "h-10 px-4 py-2 text-sm rounded-lg";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles} ${className}`}
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
      className={`w-full h-12 rounded-xl border border-border bg-white/80 px-4 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200 ${className}`}
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

const selectClass =
  "flex h-12 w-full rounded-xl border border-border bg-white/80 px-4 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200";

const memberService = {
  create: async (formData: FormData) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/members`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

const metaService = {
  listZones: async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/meta/zones`);
    return response.data;
  },
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

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function NewMemberPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    fatherName: "",
    address: "",
    bloodGroup: "",
    workingCountry: "",
    zone: "",
    committeeRole: "",
    unit: "",
    membershipType: "",
  });

  const { data: zones } = useQuery({ queryKey: ["meta", "zones"], queryFn: metaService.listZones });
  const { data: plans } = useQuery({ queryKey: ["meta", "plans"], queryFn: metaService.listMembershipPlans });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => memberService.create(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      router.push(`/admin/members/${data.member._id}`);
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!photo) {
      setError("Please upload a photo.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append("photo", photo);

    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-surface">
      <AdminNav />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <p className="font-utility text-sm font-semibold text-primary">Member Management</p>
          <h1 className="font-display text-3xl font-bold text-foreground">Add New Member</h1>
          <p className="mt-1 text-muted-foreground">Create a new member profile. All fields marked with * are required.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="border-b border-border bg-primary/5">
              <CardTitle>Member Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <span className="font-medium">Error:</span> {error}
                </Alert>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" required value={form.fullName} onChange={handleChange("fullName")} className="rounded-xl" placeholder="Enter full name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <Input id="phone" required value={form.phone} onChange={handleChange("phone")} className="rounded-xl" placeholder="Enter mobile number" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fatherName">Father's Name *</Label>
                  <Input id="fatherName" required value={form.fatherName} onChange={handleChange("fatherName")} className="rounded-xl" placeholder="Enter father's name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bloodGroup">Blood Group *</Label>
                  <select id="bloodGroup" required className={selectClass} value={form.bloodGroup} onChange={handleChange("bloodGroup")}>
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="workingCountry">Working Country *</Label>
                  <Input id="workingCountry" required value={form.workingCountry} onChange={handleChange("workingCountry")} className="rounded-xl" placeholder="Enter working country" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="photo">Photo *</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" required value={form.address} onChange={handleChange("address")} className="rounded-xl" placeholder="Enter address" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zone">Zone (optional)</Label>
                  <select id="zone" className={selectClass} value={form.zone} onChange={handleChange("zone")}>
                    <option value="">Select zone</option>
                    {zones?.map((zone: any) => (
                      <option key={zone._id} value={zone._id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="committeeRole">Committee Role (optional)</Label>
                  <Input id="committeeRole" value={form.committeeRole} onChange={handleChange("committeeRole")} className="rounded-xl" placeholder="Enter committee role" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="unit">Unit (optional)</Label>
                  <Input id="unit" value={form.unit} onChange={handleChange("unit")} className="rounded-xl" placeholder="Enter unit" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="membershipType">Membership Plan (optional)</Label>
                  <select
                    id="membershipType"
                    className={selectClass}
                    value={form.membershipType}
                    onChange={handleChange("membershipType")}
                  >
                    <option value="">No plan</option>
                    {plans?.map((plan: any) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.title} ({plan.duration}mo)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/members")} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} className="rounded-xl bg-primary hover:bg-primary/90">
                  {createMutation.isPending ? "Creating..." : "Create Member"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
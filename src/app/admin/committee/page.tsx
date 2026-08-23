"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractErrorMessage } from "@/lib/apiClient";
import { AdminNav } from "@/components/AdminNav";
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
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "default" | "icon" | "sm" | "lg";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyles = {
    default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/40",
    secondary: "bg-white text-foreground hover:bg-primary/5 focus:ring-primary/40 border border-border",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/40",
    outline: "border-2 border-border bg-white/50 text-ink hover:border-primary hover:bg-primary/5 hover:text-primary",
    ghost: "text-muted-foreground hover:bg-primary/5 hover:text-primary",
  };
  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm rounded-lg",
    icon: "h-9 w-9 rounded-lg",
    sm: "h-8 px-3 py-1 text-xs rounded-lg",
    lg: "h-12 px-6 py-3 text-base rounded-xl",
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

const Edit = ({ className = "", size = 16 }) => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const Trash2 = ({ className = "", size = 16 }) => (
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
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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

const Award = ({ className = "", size = 16 }) => (
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
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const Shield = ({ className = "", size = 16 }) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const Phone = ({ className = "", size = 14 }) => (
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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const Mail = ({ className = "", size = 14 }) => (
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
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const X = ({ className = "", size = 20 }) => (
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const COMMITTEE_TYPES = [
  { value: "executive", label: "Executive Committee", icon: Award },
  { value: "secretariat", label: "Secretariat", icon: Users },
  { value: "it_team", label: "IT & Media Team", icon: Shield },
  { value: "womens_wing", label: "Women's Wing", icon: Users },
  { value: "youth_wing", label: "Youth Wing", icon: Users },
];

const YEARS = [2024, 2025, 2026];

const committeeService = {
  listAdmin: async () => {
    const response = await apiClient.get(`/committee/admin`);
    return response.data;
  },
  create: async (data: FormData) => {
    const response = await apiClient.post(`/committee`, data);
    return response.data;
  },
  update: async (id: string, data: FormData) => {
    const response = await apiClient.put(`/committee/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/committee/${id}`);
    return response.data;
  },
};

export default function AdminCommitteePage() {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState("executive");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["committee", "admin"],
    queryFn: committeeService.listAdmin,
  });

  const members = data?.data?.members || data?.members || [];

  const filteredMembers = members.filter(
    (m: any) => m.type === selectedType && m.year === selectedYear
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => committeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["committee"] });
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this committee member?")) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface">
      <AdminNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-utility text-sm font-semibold text-primary">Committee Management</p>
            <h1 className="font-display text-3xl font-bold text-foreground">Committee Members</h1>
            <p className="mt-1 text-muted-foreground">Manage executive, secretariat, and other committee members.</p>
          </div>
          <Button
            className="gap-2 rounded-xl bg-primary hover:bg-primary/90"
            onClick={() => {
              setEditingMember(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 rounded-xl">
            {error}
          </Alert>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          {COMMITTEE_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium font-utility transition-all duration-200 ${
                selectedType === type.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <type.icon className="h-4 w-4" />
              {type.label}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                selectedYear === year
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {isFormOpen && (
          <CommitteeForm
            member={editingMember}
            type={selectedType}
            year={selectedYear}
            onClose={() => {
              setIsFormOpen(false);
              setEditingMember(null);
              queryClient.invalidateQueries({ queryKey: ["committee"] });
            }}
            onError={setError}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary"></div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <Card className="border-dashed border-2 p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-2 text-muted-foreground">No committee members found.</p>
            <p className="text-sm text-muted-foreground">Add your first committee member above.</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member: any) => (
              <Card key={member._id} className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="relative aspect-video bg-primary/5 flex items-center justify-center">
                    {member.photo?.url ? (
                      <Image src={member.photo.url} alt={member.name} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                    ) : (
                      <Users className="h-16 w-16 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="absolute right-2 top-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-xl bg-white/90 hover:bg-white"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-xl bg-white/90 hover:bg-white"
                      onClick={() => handleDelete(member._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.designation}</p>
                  <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        {member.phone}
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        {member.email}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Priority: {member.priority}
                    </span>
                    <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-0.5 rounded-full">
                      {member.year}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CommitteeForm({
  member,
  type,
  year,
  onClose,
  onError,
}: {
  member?: any;
  type: string;
  year: number;
  onClose: () => void;
  onError: (msg: string) => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: member?.name || "",
    designation: member?.designation || "",
    priority: member?.priority || 0,
    phone: member?.phone || "",
    email: member?.email || "",
    type: member?.type || type,
    year: member?.year || year,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(member?.photo?.url || null);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      member ? committeeService.update(member._id, data) : committeeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["committee"] });
      onClose();
    },
    onError: (err) => onError(extractErrorMessage(err)),
  });

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });
  if (photo) formData.append("photo", photo);

  mutation.mutate(formData);
};

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="mb-6 overflow-hidden border-primary/20 shadow-lg">
      <CardHeader className="border-b border-border bg-primary/5 flex flex-row items-center justify-between">
        <CardTitle>{member ? "Edit Committee Member" : "Add Committee Member"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cf_name">Full Name *</Label>
              <Input
                id="cf_name"
                required
                value={form.name}
                onChange={handleChange("name")}
                className="rounded-xl"
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cf_designation">Designation *</Label>
              <Input
                id="cf_designation"
                required
                value={form.designation}
                onChange={handleChange("designation")}
                className="rounded-xl"
                placeholder="Enter designation"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cf_phone">Phone</Label>
              <Input
                id="cf_phone"
                value={form.phone}
                onChange={handleChange("phone")}
                className="rounded-xl"
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cf_email">Email</Label>
              <Input
                id="cf_email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="rounded-xl"
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cf_priority">Priority</Label>
              <Input
                id="cf_priority"
                type="number"
                value={form.priority}
                onChange={handleChange("priority")}
                className="rounded-xl"
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Lower number = higher priority</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cf_photo">Photo</Label>
              <Input
                id="cf_photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="rounded-xl"
              />
              {photoPreview && (
                // eslint-disable-next-line @next/next/no-img-element -- may be a local blob: object URL, which next/image can't proxy
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mt-2 h-20 w-20 rounded-xl object-cover border border-border"
                />
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cf_type">Committee Type</Label>
              <select
                id="cf_type"
                className="flex h-11 w-full rounded-xl border border-border bg-white/80 px-4 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200"
                value={form.type}
                onChange={handleChange("type")}
              >
                {COMMITTEE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cf_year">Year</Label>
              <select
                id="cf_year"
                className="flex h-11 w-full rounded-xl border border-border bg-white/80 px-4 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200"
                value={form.year}
                onChange={handleChange("year")}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="rounded-xl bg-primary hover:bg-primary/90">
              {mutation.isPending ? "Saving..." : member ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
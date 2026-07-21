// app/admin/committee/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Users, Award, Shield, Phone, Mail, X } from "lucide-react";
import { committeeService } from "@/services/committeeService";
import { extractErrorMessage } from "@/lib/apiClient";

const COMMITTEE_TYPES = [
  { value: "executive", label: "Executive Committee", icon: Award },
  { value: "secretariat", label: "Secretariat", icon: Users },
  { value: "it_team", label: "IT & Media Team", icon: Shield },
  { value: "womens_wing", label: "Women's Wing", icon: Users },
  { value: "youth_wing", label: "Youth Wing", icon: Users },
];

const YEARS = [2024, 2025, 2026];

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

  const members = data?.members || [];

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
                  <div className="aspect-video bg-primary/5 flex items-center justify-center">
                    {member.photo?.url ? (
                      <img src={member.photo.url} alt={member.name} className="h-full w-full object-cover" />
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
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="rounded-xl"
              />
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
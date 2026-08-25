"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { adminApiClient, extractErrorMessage, type ApiEnvelope } from "@/lib/adminApiClient";
import { memberFormSchema, type MemberFormInput } from "@/lib/validators/memberSchema";
import { MemberFormFields } from "@/features/member/MemberFormFields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Member } from "@/types";

const createMember = async (formData: FormData) => {
  const { data } = await adminApiClient.post<ApiEnvelope<{ member: Member }>>("/members", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.member;
};

export default function NewMemberPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [created, setCreated] = useState<Member | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormInput>({
    resolver: zodResolver(memberFormSchema),
  });

  const onPhotoSelect = (file: File) => {
    setValue("photo", file, { shouldValidate: true });
    setPhotoPreview(URL.createObjectURL(file));
  };

  const createMutation = useMutation({
    mutationFn: createMember,
    onSuccess: (member) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setCreated(member);
    },
    onError: (err) => setServerError(extractErrorMessage(err)),
  });

  const onSubmit = (values: MemberFormInput) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("photo", values.photo as File);
    formData.append("fullName", values.fullName);
    formData.append("fatherName", values.fatherName);
    formData.append("dob", values.dob);
    formData.append("bloodGroup", values.bloodGroup);
    formData.append("homeCountryNumber", values.homeCountryNumber);
    formData.append("workingCountryNumber", values.workingCountryNumber);
    if (values.email) formData.append("email", values.email);
    formData.append("address", values.address);
    formData.append("zone", values.zone);
    formData.append("workingCountry", values.workingCountry);
    if (values.workingCountry === "Other" && values.workingCountryOther) {
      formData.append("workingCountryOther", values.workingCountryOther);
    }
    createMutation.mutate(formData);
  };

  if (created) {
    return (
      <div className="min-h-screen bg-surface">
        <AdminNav />
        <main className="mx-auto max-w-xl px-6 py-8">
          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="border-b border-border bg-primary/5">
              <CardTitle>Member Added</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{created.fullName}</span> (
                {created.membershipId}) has been added to the pending queue. Approve it to activate the
                membership and issue login credentials.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCreated(null);
                    setPhotoPreview(null);
                  }}
                >
                  Add Another Member
                </Button>
                <Button type="button" onClick={() => router.push(`/admin/members/${created._id}`)}>
                  Review &amp; Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <AdminNav />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <p className="font-utility text-sm font-semibold text-primary">Member Management</p>
          <h1 className="font-display text-3xl font-bold text-foreground">Add New Member</h1>
          <p className="mt-1 text-muted-foreground">
            Uses the same form as public registration. The member is created as pending — approve it
            afterwards to activate the membership.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="border-b border-border bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <UserPlus size={18} />
                Member Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {serverError && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
                  <span className="font-medium">Error:</span> {serverError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <MemberFormFields
                  register={register}
                  errors={errors}
                  watch={watch}
                  photoPreview={photoPreview}
                  onPhotoSelect={onPhotoSelect}
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/members")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || createMutation.isPending} loading={isSubmitting || createMutation.isPending}>
                  Add Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}

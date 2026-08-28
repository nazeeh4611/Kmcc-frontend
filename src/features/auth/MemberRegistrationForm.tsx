"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";
import { publicService } from "@/services/publicService";
import { memberFormSchema, type MemberFormInput } from "@/lib/validators/memberSchema";
import { MemberFormFields } from "@/features/member/MemberFormFields";

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: { field: string; message: string }[] }
      | undefined;

    if (data?.errors?.length) {
      return data.errors.map((e) => e.message).join(", ");
    }
    if (data?.message) return data.message;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred. Please try again.";
};

export function MemberRegistrationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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

  const onSubmit = async (values: MemberFormInput) => {
    setServerError(null);
    try {
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
      formData.append("nomineeName", values.nomineeName);
      formData.append("nomineeRelation", values.nomineeRelation);
      formData.append("zone", values.zone);
      formData.append("workingCountry", values.workingCountry);
      if (values.workingCountry === "Other" && values.workingCountryOther) {
        formData.append("workingCountryOther", values.workingCountryOther);
      }

      const result = await publicService.registerMember(formData);
      setApplicationId(result.applicationId);
    } catch (error) {
      setServerError(extractErrorMessage(error));
    }
  };

  if (applicationId) {
    return (
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line bg-white/90 text-center shadow-lg backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 border-b border-dashed border-line px-8 pb-6 pt-8">
          <span className="stamp-ring flex h-14 w-14 items-center justify-center text-brass">
            <CheckCircle2 size={26} />
          </span>
          <h2 className="font-display text-2xl text-ink">Application Submitted</h2>
          <p className="font-body text-slate">
            Reference: <span className="font-utility font-semibold text-green">{applicationId}</span>
          </p>
        </div>
        <div className="space-y-4 px-8 pb-8 pt-6">
          <p className="font-body text-sm text-slate">
            Our committee will review your application. You&apos;ll be notified once it&apos;s approved
            and your membership ID and login details are issued.
          </p>
          <button
            onClick={() => router.push("/")}
            className="h-12 w-full rounded-md bg-green px-8 font-body text-sm font-semibold text-paper transition-all duration-200 hover:bg-green-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-line bg-white/90 shadow-lg backdrop-blur-sm">
      <div className="border-b border-dashed border-line px-8 pb-6 pt-8">
        <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.22em] text-green">
          Membership Application
        </span>
        <h2 className="mt-2 font-display text-2xl text-ink">
          ഗ്ലോബൽ കെ എം സി സി അങ്കണാടി പഞ്ചായത്ത്
        </h2>
        <p className="font-body text-slate">Membership Form</p>
      </div>
      <div className="px-8 pb-8 pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {serverError && (
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 rounded-md border border-maroon/30 bg-maroon/5 p-4 text-maroon shadow-sm">
                {serverError}
              </div>
            </div>
          )}

          <MemberFormFields
            register={register}
            errors={errors}
            watch={watch}
            photoPreview={photoPreview}
            onPhotoSelect={onPhotoSelect}
          />

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-md bg-green px-8 font-body text-sm font-semibold text-paper transition-all duration-200 hover:bg-green-800 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

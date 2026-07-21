// src/features/auth/MemberRegistrationForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { FiCamera, FiCheckCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { registerMemberSchema, type RegisterMemberInput } from "@/lib/validators/authSchemas";
import { publicService } from "@/services/publicService";
import { extractErrorMessage } from "@/lib/apiClient";

const NOT_IN_LIST = "__not_in_list__";

export function MemberRegistrationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { data: zones = [] } = useQuery({ queryKey: ["public", "zones"], queryFn: publicService.getZones });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterMemberInput>({
    resolver: zodResolver(registerMemberSchema),
    defaultValues: { mandalamCommittee: "രൂപീകരിച്ചിട്ടില്ല" },
  });

  const selectedZone = watch("zone");

  const { data: coordinators = [] } = useQuery({
    queryKey: ["public", "coordinators", selectedZone],
    queryFn: () => publicService.getCoordinators(selectedZone),
    enabled: !!selectedZone && selectedZone !== NOT_IN_LIST,
  });

  useEffect(() => {
    setValue("coordinator", undefined);
    setValue("coordinatorOther", undefined);
  }, [selectedZone, setValue]);

  const zoneIsNotInList = selectedZone === NOT_IN_LIST;
  const coordinatorValue = watch("coordinator");
  const coordinatorIsNotInList = coordinatorValue === NOT_IN_LIST;

  const onSubmit = async (values: RegisterMemberInput) => {
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("nativePlace", values.nativePlace);
      formData.append("workingCountry", values.workingCountry);
      formData.append("fullName", values.fullName);
      formData.append("phone", values.phone);
      formData.append("birthYear", String(values.birthYear));
      if (values.email) formData.append("email", values.email);
      if (values.mandalamCommittee) formData.append("mandalamCommittee", values.mandalamCommittee);

      if (zoneIsNotInList) formData.append("zoneOther", values.zoneOther || "");
      else if (values.zone) formData.append("zone", values.zone);

      if (coordinatorIsNotInList) formData.append("coordinatorOther", values.coordinatorOther || "Not in List");
      else if (values.coordinator) formData.append("coordinator", values.coordinator);

      if (values.photo) formData.append("photo", values.photo);

      const result = await publicService.registerMember(formData);
      setApplicationId(result.membershipId);
    } catch (error) {
      setServerError(extractErrorMessage(error));
    }
  };

  if (applicationId) {
    return (
      <Card className="w-full max-w-xl rounded-xl border border-line text-center">
        <CardHeader className="items-center gap-3">
          <span className="stamp-ring flex h-14 w-14 items-center justify-center text-brass">
            <FiCheckCircle size={26} />
          </span>
          <CardTitle className="font-display text-ink">Application Submitted</CardTitle>
          <CardDescription className="font-body text-slate">
            Reference: <span className="font-utility font-semibold text-green">{applicationId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-body text-sm text-slate">
            Our committee will review your application. You&apos;ll be notified once it&apos;s approved
            and your membership ID and login details are issued.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="rounded-md bg-green font-body text-sm font-semibold text-paper hover:bg-green-800"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl rounded-xl border border-line">
      <CardHeader className="border-b border-dashed border-line pb-6">
        <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.22em] text-green">
          Membership Application
        </span>
        <CardTitle className="mt-2 font-display text-2xl text-ink">
          ഗ്ലോബൽ കെ എം സി സി അങ്കണാടി പഞ്ചായത്ത്
        </CardTitle>
        <CardDescription className="font-body text-slate">Membership Form</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {serverError && (
            <div className="sm:col-span-2">
              <Alert variant="destructive" className="rounded-md border border-maroon/30 bg-maroon/5 text-maroon">
                {serverError}
              </Alert>
            </div>
          )}

          <div className="flex flex-col items-center gap-2 sm:col-span-2">
            <label
              htmlFor="photo"
              className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-brass bg-white text-brass transition hover:bg-brass/5"
            >
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <FiCamera size={22} />
              )}
            </label>
            <input
              id="photo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("photo", file);
                  setPhotoPreview(URL.createObjectURL(file));
                }
              }}
            />
            <span className="font-body text-xs text-slate">Add photo (optional)</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="zone" className="font-body text-ink">Panchayath / Zone *</Label>
            <select
              id="zone"
              className="h-12 rounded-md border border-line bg-white px-4 font-body text-sm text-ink outline-none focus-visible:border-green"
              {...register("zone")}
            >
              <option value="">Select your zone</option>
              {zones.map((z) => (
                <option key={z._id} value={z._id}>
                  {z.name}
                </option>
              ))}
              <option value={NOT_IN_LIST}>Not in list</option>
            </select>
            {zoneIsNotInList && (
              <Input placeholder="Enter your zone" {...register("zoneOther")} />
            )}
            {errors.zone && <p className="font-body text-xs text-maroon">{errors.zone.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nativePlace" className="font-body text-ink">നാട്ടിലെ സ്ഥലം (Native Place) *</Label>
            <Input id="nativePlace" placeholder="Your native place" {...register("nativePlace")} />
            {errors.nativePlace && <p className="font-body text-xs text-maroon">{errors.nativePlace.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coordinator" className="font-body text-ink">Coordinator</Label>
            <select
              id="coordinator"
              className="h-12 rounded-md border border-line bg-white px-4 font-body text-sm text-ink outline-none focus-visible:border-green disabled:opacity-50"
              {...register("coordinator")}
              disabled={!selectedZone || zoneIsNotInList}
            >
              <option value="">Select your coordinator</option>
              {coordinators.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
              <option value={NOT_IN_LIST}>Not in List</option>
            </select>
            {(coordinatorIsNotInList || zoneIsNotInList) && (
              <Input placeholder="Coordinator name (if known)" {...register("coordinatorOther")} />
            )}
            {errors.coordinator && <p className="font-body text-xs text-maroon">{errors.coordinator.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workingCountry" className="font-body text-ink">ജോലി ചെയ്യുന്ന രാജ്യം (Working Country) *</Label>
            <Input id="workingCountry" placeholder="e.g. UAE" {...register("workingCountry")} />
            {errors.workingCountry && (
              <p className="font-body text-xs text-maroon">{errors.workingCountry.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mandalamCommittee" className="font-body text-ink">മണ്ഡലം കമ്മിറ്റി (Mandalam Committee)</Label>
            <Input id="mandalamCommittee" {...register("mandalamCommittee")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName" className="font-body text-ink">Name in English *</Label>
            <Input id="fullName" placeholder="Full name" {...register("fullName")} />
            {errors.fullName && <p className="font-body text-xs text-maroon">{errors.fullName.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone" className="font-body text-ink">മൊബൈൽ നമ്പർ (Mobile, with country code) *</Label>
            <Input id="phone" placeholder="+971 50 123 4567" {...register("phone")} />
            {errors.phone && <p className="font-body text-xs text-maroon">{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="font-body text-ink">ഇ-മെയിൽ (for login) — optional</Label>
            <Input id="email" type="email" placeholder="you@gmail.com" {...register("email")} />
            {errors.email && <p className="font-body text-xs text-maroon">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="birthYear" className="font-body text-ink">ജനന വർഷം (Birth Year, 4 digits) *</Label>
            <Input id="birthYear" placeholder="1990" maxLength={4} {...register("birthYear")} />
            {errors.birthYear && <p className="font-body text-xs text-maroon">{errors.birthYear.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full rounded-md bg-green font-body text-sm font-semibold text-paper hover:bg-green-800"
            >
              {isSubmitting ? "Submitting..." : "Submit & Add Photo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
"use client";

import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Camera } from "lucide-react";
import { ZONE_OPTIONS, WORKING_COUNTRY_OPTIONS, BLOOD_GROUP_OPTIONS } from "@/lib/constants/memberOptions";

// Shared field set rendered by BOTH public registration (MemberRegistrationForm)
// and the admin "Add Member" / "Edit Member" forms, so labels, field order,
// dropdown options, and styling never drift between the two. Field values are
// intentionally loosely typed (register/errors/watch as `any`-shaped) since
// this same component backs two closely related but distinct Zod schemas
// (create vs. edit, where `photo` is optional).
export interface MemberFormFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  photoPreview: string | null;
  onPhotoSelect: (file: File) => void;
  /** Existing photo URL to fall back to when editing and no new file is chosen yet. */
  existingPhotoUrl?: string | null;
}

const inputClass =
  "h-12 w-full rounded-md border border-line bg-white px-4 font-body text-sm text-ink outline-none focus-visible:border-green placeholder:text-slate/40";
const selectClass =
  "h-12 rounded-md border border-line bg-white px-4 font-body text-sm text-ink outline-none focus-visible:border-green";
const labelClass = "font-body text-sm font-semibold text-ink";
const errorClass = "font-body text-xs text-maroon";

export function MemberFormFields({
  register,
  errors,
  watch,
  photoPreview,
  onPhotoSelect,
  existingPhotoUrl,
}: MemberFormFieldsProps) {
  const workingCountry = watch("workingCountry");
  const showOtherCountry = workingCountry === "Other";
  const displayedPhoto = photoPreview || existingPhotoUrl || null;

  return (
    <>
      {/* Profile Photo */}
      <div className="flex flex-col items-center gap-2 sm:col-span-2">
        <label
          htmlFor="photo"
          className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-brass bg-white text-brass transition hover:bg-brass/5"
        >
          {displayedPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element -- object-URL/remote preview, next/image can't optimize blob: URLs
            <img src={displayedPhoto} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <Camera size={22} />
          )}
        </label>
        <input
          id="photo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPhotoSelect(file);
          }}
        />
        <span className="font-body text-xs text-slate">Profile Photo *</span>
        {errors.photo && <p className={errorClass}>{String(errors.photo.message)}</p>}
      </div>

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className={labelClass}>Full Name *</label>
        <input id="fullName" placeholder="Full name" className={inputClass} {...register("fullName")} />
        {errors.fullName && <p className={errorClass}>{String(errors.fullName.message)}</p>}
      </div>

      {/* Father's Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fatherName" className={labelClass}>Father&apos;s Name *</label>
        <input id="fatherName" placeholder="Father's name" className={inputClass} {...register("fatherName")} />
        {errors.fatherName && <p className={errorClass}>{String(errors.fatherName.message)}</p>}
      </div>

      {/* Date of Birth */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="dob" className={labelClass}>Date of Birth *</label>
        <input id="dob" type="date" max={new Date().toISOString().split("T")[0]} className={inputClass} {...register("dob")} />
        {errors.dob && <p className={errorClass}>{String(errors.dob.message)}</p>}
      </div>

      {/* Blood Group */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bloodGroup" className={labelClass}>Blood Group *</label>
        <select id="bloodGroup" className={selectClass} {...register("bloodGroup")}>
          <option value="">Select blood group</option>
          {BLOOD_GROUP_OPTIONS.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
        {errors.bloodGroup && <p className={errorClass}>{String(errors.bloodGroup.message)}</p>}
      </div>

      {/* Home Country Number */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="homeCountryNumber" className={labelClass}>Home Country Number *</label>
        <input id="homeCountryNumber" placeholder="+91 98765 43210" className={inputClass} {...register("homeCountryNumber")} />
        {errors.homeCountryNumber && <p className={errorClass}>{String(errors.homeCountryNumber.message)}</p>}
      </div>

      {/* Working Country Number */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="workingCountryNumber" className={labelClass}>Working Country Number *</label>
        <input id="workingCountryNumber" placeholder="+971 50 123 4567" className={inputClass} {...register("workingCountryNumber")} />
        {errors.workingCountryNumber && <p className={errorClass}>{String(errors.workingCountryNumber.message)}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>Email (optional)</label>
        <input id="email" type="email" placeholder="you@gmail.com" className={inputClass} {...register("email")} />
        {errors.email && <p className={errorClass}>{String(errors.email.message)}</p>}
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor="address" className={labelClass}>Address *</label>
        <input id="address" placeholder="Full address" className={inputClass} {...register("address")} />
        {errors.address && <p className={errorClass}>{String(errors.address.message)}</p>}
      </div>

      {/* Zone */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="zone" className={labelClass}>Zone *</label>
        <select id="zone" className={selectClass} {...register("zone")}>
          <option value="">Select your zone</option>
          {ZONE_OPTIONS.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
        {errors.zone && <p className={errorClass}>{String(errors.zone.message)}</p>}
      </div>

      {/* Working Country */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="workingCountry" className={labelClass}>Working Country *</label>
        <select id="workingCountry" className={selectClass} {...register("workingCountry")}>
          <option value="">Select working country</option>
          {WORKING_COUNTRY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.workingCountry && <p className={errorClass}>{String(errors.workingCountry.message)}</p>}
      </div>

      {showOtherCountry && (
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="workingCountryOther" className={labelClass}>Specify Working Country *</label>
          <input
            id="workingCountryOther"
            placeholder="Enter your working country"
            className={inputClass}
            {...register("workingCountryOther")}
          />
          {errors.workingCountryOther && (
            <p className={errorClass}>{String(errors.workingCountryOther.message)}</p>
          )}
        </div>
      )}
    </>
  );
}

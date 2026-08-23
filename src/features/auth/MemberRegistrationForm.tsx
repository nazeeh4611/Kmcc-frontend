"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/publicService";

const registerMemberSchema = z.object({
  photo: z.any().optional(),
  zone: z.string().min(1, "Zone is required"),
  zoneOther: z.string().optional(),
  nativePlace: z.string().min(1, "Native place is required"),
  coordinator: z.string().optional(),
  coordinatorOther: z.string().optional(),
  workingCountry: z.string().min(1, "Working country is required"),
  mandalamCommittee: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  address: z.string().min(1, "Address is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  birthYear: z.string().min(4, "Birth year is required").max(4, "Enter 4 digits"),
});

type RegisterMemberInput = z.infer<typeof registerMemberSchema>;

const Button = ({
  children,
  type = "button",
  size = "default",
  disabled = false,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  size?: "default" | "lg";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm rounded-lg",
    lg: "h-14 px-8 py-3 text-base rounded-xl",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${className}`}
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
  maxLength,
  ...props
}: {
  id?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  [key: string]: any;
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full h-12 rounded-md border border-line bg-white px-4 font-body text-sm text-ink outline-none focus-visible:border-green placeholder:text-slate/40 ${className}`}
      {...props}
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
      className={`font-body text-sm font-semibold text-ink ${className}`}
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
      className={`flex items-center gap-3 rounded-md border p-4 shadow-sm ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
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
    <div
      className={`relative overflow-hidden rounded-xl border border-line bg-white/90 backdrop-blur-sm shadow-lg ${className}`}
    >
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
    <div
      className={`relative border-b border-dashed border-line pb-6 pt-8 px-8 ${className}`}
    >
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
    <h2 className={`font-display text-2xl text-ink ${className}`}>{children}</h2>
  );
};

const CardDescription = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={`font-body text-slate ${className}`}>{children}</p>
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
    <div className={`relative px-8 pb-8 pt-6 ${className}`}>{children}</div>
  );
};

const FiCamera = ({ size = 22 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const FiCheckCircle = ({ size = 26 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const NOT_IN_LIST = "__not_in_list__";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"];

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

  const { data: zones = [] } = useQuery({
    queryKey: ["public", "zones"],
    queryFn: publicService.getZones,
    staleTime: 5 * 60 * 1000,
  });

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
  const zoneIsNotInList = selectedZone === NOT_IN_LIST;

  const { data: coordinators = [] } = useQuery({
    queryKey: ["public", "coordinators", selectedZone],
    queryFn: () => publicService.getCoordinators(selectedZone),
    enabled: Boolean(selectedZone) && !zoneIsNotInList,
    staleTime: 5 * 60 * 1000,
  });
  const coordinatorValue = watch("coordinator");
  const coordinatorIsNotInList = coordinatorValue === NOT_IN_LIST;

  const onSubmit = async (values: RegisterMemberInput) => {
    setServerError(null);
    try {
      const formData = new FormData();

      if (values.photo) {
        formData.append("photo", values.photo);
      }

      if (values.zone && !zoneIsNotInList) {
        formData.append("zone", values.zone);
      }

      if (zoneIsNotInList && values.zoneOther) {
        formData.append("zoneOther", values.zoneOther);
      }

      formData.append("nativePlace", values.nativePlace || "");

      if (values.coordinator && !coordinatorIsNotInList && !zoneIsNotInList) {
        formData.append("coordinator", values.coordinator);
      }

      if ((coordinatorIsNotInList || zoneIsNotInList) && values.coordinatorOther) {
        formData.append("coordinatorOther", values.coordinatorOther);
      }

      formData.append("workingCountry", values.workingCountry || "");
      formData.append("mandalamCommittee", values.mandalamCommittee || "രൂപീകരിച്ചിട്ടില്ല");
      formData.append("fullName", values.fullName || "");
      formData.append("fatherName", values.fatherName || "");
      formData.append("address", values.address || "");
      formData.append("bloodGroup", values.bloodGroup || "");
      formData.append("phone", values.phone || "");

      if (values.email) {
        formData.append("email", values.email);
      }

      formData.append("birthYear", String(values.birthYear || ""));

      const result = await publicService.registerMember(formData);
      setApplicationId(result.applicationId);
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
                // eslint-disable-next-line @next/next/no-img-element -- object-URL preview, next/image can't optimize blob: URLs
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
                  setValue("photo", file, { shouldValidate: true });
                  setPhotoPreview(URL.createObjectURL(file));
                }
              }}
            />
            <span className="font-body text-xs text-slate">Add photo *</span>
            {errors.photo && <p className="font-body text-xs text-maroon">{errors.photo.message as string}</p>}
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
            <Label htmlFor="fatherName" className="font-body text-ink">Father&apos;s Name *</Label>
            <Input id="fatherName" placeholder="Father's name" {...register("fatherName")} />
            {errors.fatherName && <p className="font-body text-xs text-maroon">{errors.fatherName.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="address" className="font-body text-ink">Address *</Label>
            <Input id="address" placeholder="Full address" {...register("address")} />
            {errors.address && <p className="font-body text-xs text-maroon">{errors.address.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bloodGroup" className="font-body text-ink">Blood Group *</Label>
            <select
              id="bloodGroup"
              className="h-12 rounded-md border border-line bg-white px-4 font-body text-sm text-ink outline-none focus-visible:border-green"
              {...register("bloodGroup")}
            >
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {errors.bloodGroup && <p className="font-body text-xs text-maroon">{errors.bloodGroup.message}</p>}
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
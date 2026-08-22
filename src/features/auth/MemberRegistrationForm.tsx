"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Image from "next/image";

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

const DUMMY_ZONES = [
  { _id: "zone_1", name: "Kozhikode North" },
  { _id: "zone_2", name: "Kozhikode South" },
  { _id: "zone_3", name: "Malappuram Central" },
  { _id: "zone_4", name: "Palakkad East" },
  { _id: "zone_5", name: "Thrissur West" },
  { _id: "zone_6", name: "Ernakulam Central" },
  { _id: "zone_7", name: "Kottayam South" },
  { _id: "zone_8", name: "Alappuzha North" },
  { _id: "zone_9", name: "Pathanamthitta Central" },
  { _id: "zone_10", name: "Kollam West" },
  { _id: "zone_11", name: "Thiruvananthapuram North" },
  { _id: "zone_12", name: "Wayanad East" },
  { _id: "zone_13", name: "Kannur South" },
  { _id: "zone_14", name: "Kasargod North" },
  { _id: "zone_15", name: "Idukki Central" },
];

const DUMMY_COORDINATORS: Record<string, { _id: string; name: string }[]> = {
  zone_1: [
    { _id: "coord_1_1", name: "Rajesh Kumar" },
    { _id: "coord_1_2", name: "Sreedevi Nair" },
    { _id: "coord_1_3", name: "Manoj Pillai" },
  ],
  zone_2: [
    { _id: "coord_2_1", name: "Lakshmi Menon" },
    { _id: "coord_2_2", name: "Suresh Gopi" },
    { _id: "coord_2_3", name: "Anitha Raj" },
  ],
  zone_3: [
    { _id: "coord_3_1", name: "Muhammed Ali" },
    { _id: "coord_3_2", name: "Fathima Beevi" },
    { _id: "coord_3_3", name: "Abdul Rahman" },
  ],
  zone_4: [
    { _id: "coord_4_1", name: "Krishnan Nair" },
    { _id: "coord_4_2", name: "Saraswathy Amma" },
    { _id: "coord_4_3", name: "Gopalakrishnan" },
  ],
  zone_5: [
    { _id: "coord_5_1", name: "Vijayan Thampi" },
    { _id: "coord_5_2", name: "Sreekumari" },
    { _id: "coord_5_3", name: "Ravindranath" },
  ],
  zone_6: [
    { _id: "coord_6_1", name: "George Mathew" },
    { _id: "coord_6_2", name: "Mary Thomas" },
    { _id: "coord_6_3", name: "Joseph Antony" },
  ],
  zone_7: [
    { _id: "coord_7_1", name: "Jacob Eapen" },
    { _id: "coord_7_2", name: "Elizabeth Abraham" },
    { _id: "coord_7_3", name: "Thomas Kurian" },
  ],
  zone_8: [
    { _id: "coord_8_1", name: "Santhosh Kumar" },
    { _id: "coord_8_2", name: "Sobhana Pillai" },
    { _id: "coord_8_3", name: "Ramesh Nair" },
  ],
  zone_9: [
    { _id: "coord_9_1", name: "Aravindakshan" },
    { _id: "coord_9_2", name: "Bindu Menon" },
    { _id: "coord_9_3", name: "Chandrasekharan" },
  ],
  zone_10: [
    { _id: "coord_10_1", name: "Sukumaran" },
    { _id: "coord_10_2", name: "Devaki Amma" },
    { _id: "coord_10_3", name: "Balakrishnan" },
  ],
  zone_11: [
    { _id: "coord_11_1", name: "Padmanabhan" },
    { _id: "coord_11_2", name: "Saroja Devi" },
    { _id: "coord_11_3", name: "Narayanan Nair" },
  ],
  zone_12: [
    { _id: "coord_12_1", name: "Vivek Raj" },
    { _id: "coord_12_2", name: "Priya Krishnan" },
    { _id: "coord_12_3", name: "Deepak Menon" },
  ],
  zone_13: [
    { _id: "coord_13_1", name: "Radhakrishnan" },
    { _id: "coord_13_2", name: "Lalitha Nair" },
    { _id: "coord_13_3", name: "Vasudevan" },
  ],
  zone_14: [
    { _id: "coord_14_1", name: "Rajan Pai" },
    { _id: "coord_14_2", name: "Shobha Shetty" },
    { _id: "coord_14_3", name: "Mohan Rao" },
  ],
  zone_15: [
    { _id: "coord_15_1", name: "Sajeev Thomas" },
    { _id: "coord_15_2", name: "Anu George" },
    { _id: "coord_15_3", name: "Biju Abraham" },
  ],
};

const extractErrorMessage = (error: any): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
};

export function MemberRegistrationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const zones = DUMMY_ZONES;

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

  const coordinators = selectedZone && selectedZone !== NOT_IN_LIST
    ? DUMMY_COORDINATORS[selectedZone] || []
    : [];

  const zoneIsNotInList = selectedZone === NOT_IN_LIST;
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

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/members/public/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setApplicationId(response.data.data.applicationId);
      } else {
        setServerError(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat().join(", ");
        setServerError(errorMessages);
      } else if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError(extractErrorMessage(error));
      }
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
                <Image src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
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
import { z } from "zod";
import { ZONE_OPTIONS, WORKING_COUNTRY_OPTIONS, BLOOD_GROUP_OPTIONS } from "@/lib/constants/memberOptions";

const phoneNumber = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number with country code");

// Shared field set for the member form — used by BOTH public registration
// (MemberRegistrationForm) and the admin "Add Member" form so the two stay
// identical. Mirrors backend/src/validators/memberValidators.js.
const memberFormShape = {
  photo: z.any().refine((v) => v instanceof File, "Photo is required"),
  fullName: z.string().trim().min(2, "Full name is required").max(150),
  fatherName: z.string().trim().min(1, "Father's name is required").max(150),
  dob: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.enum(BLOOD_GROUP_OPTIONS, { errorMap: () => ({ message: "Blood group is required" }) }),
  homeCountryNumber: phoneNumber,
  workingCountryNumber: phoneNumber,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  address: z.string().trim().min(1, "Address is required").max(500),
  zone: z.enum(ZONE_OPTIONS, { errorMap: () => ({ message: "Select a valid zone" }) }),
  workingCountry: z.enum(WORKING_COUNTRY_OPTIONS, {
    errorMap: () => ({ message: "Select a valid working country" }),
  }),
  workingCountryOther: z.string().trim().max(100).optional(),
};

const withWorkingCountryOtherRefine = <T extends z.ZodTypeAny>(schema: T) =>
  schema.refine(
    (data: { workingCountry?: string; workingCountryOther?: string }) =>
      data.workingCountry !== "Other" || Boolean(data.workingCountryOther?.trim()),
    { message: "Specify your working country", path: ["workingCountryOther"] }
  );

export const memberFormSchema = withWorkingCountryOtherRefine(z.object(memberFormShape));
export type MemberFormInput = z.infer<typeof memberFormSchema>;

// Used when editing an existing member — photo becomes optional (only
// re-upload if changing it).
export const memberEditFormSchema = withWorkingCountryOtherRefine(
  z.object({ ...memberFormShape, photo: z.any().optional() })
);
export type MemberEditFormInput = z.infer<typeof memberEditFormSchema>;

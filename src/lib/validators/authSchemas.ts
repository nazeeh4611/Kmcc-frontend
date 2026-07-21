import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const memberLoginSchema = z.object({
  membershipId: z.string().trim().min(3, "Membership ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type MemberLoginInput = z.infer<typeof memberLoginSchema>;

export const registerMemberSchema = z
  .object({
    zone: z.string().optional(),
    zoneOther: z.string().trim().max(150).optional(),
    nativePlace: z.string().trim().min(1, "Native place is required"),
    coordinator: z.string().optional(),
    coordinatorOther: z.string().trim().max(150).optional(),
    workingCountry: z.string().trim().min(1, "Working country is required"),
    mandalamCommittee: z.string().trim().optional(),
    fullName: z.string().trim().min(2, "Name is required"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid mobile number with country code"),
    email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
    birthYear: z.coerce
      .number()
      .int()
      .min(1900, "Enter a valid 4-digit year")
      .max(new Date().getFullYear(), "Enter a valid 4-digit year"),
    photo: z.instanceof(File).optional(),
  })
  .refine((data) => data.zone || data.zoneOther, {
    message: "Select a Panchayath/Zone or specify one",
    path: ["zone"],
  })
  .refine((data) => data.coordinator || data.coordinatorOther, {
    message: "Select a coordinator or choose Not in List",
    path: ["coordinator"],
  });
export type RegisterMemberInput = z.infer<typeof registerMemberSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

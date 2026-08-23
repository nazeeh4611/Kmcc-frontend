import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const memberLoginSchema = z.object({
  membershipId: z.string().min(1, "Membership ID is required"),
  password: z.string().regex(/^\d{4}$/, "Password must be exactly 4 digits"),
});
export type MemberLoginInput = z.infer<typeof memberLoginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
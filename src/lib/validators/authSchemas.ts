import { z } from "zod";

const NOT_IN_LIST = "__not_in_list__";

// Custom regex for your ID format
const ZONE_ID_REGEX = /^zone_\d+$/;
const COORDINATOR_ID_REGEX = /^coord_\d+_\d+$/;

export const registerMemberSchema = z
  .object({
    photo: z
      .instanceof(File, { message: "Photo is required." })
      .refine((file) => file.size > 0, { message: "Photo is required." }),
    zone: z.string().min(1, "Please select your zone."),
    zoneOther: z.string().optional(),
    nativePlace: z.string().min(1, "Native place is required."),
    coordinator: z.string().optional(),
    coordinatorOther: z.string().optional(),
    workingCountry: z.string().min(1, "Working country is required."),
    mandalamCommittee: z.string().optional(),
    fullName: z.string().min(1, "Name is required."),
    fatherName: z.string().min(1, "Father's name is required."),
    address: z.string().min(1, "Address is required."),
    bloodGroup: z.string().min(1, "Please select your blood group."),
    phone: z.string().min(7, "Enter a valid mobile number."),
    email: z.string().email("Enter a valid email.").optional().or(z.literal("")),
    birthYear: z
      .string()
      .length(4, "Enter a 4-digit birth year.")
      .refine(
        (val) => Number(val) >= 1900 && Number(val) <= new Date().getFullYear(),
        { message: "Enter a valid birth year." }
      ),
  })
  .superRefine((data, ctx) => {
    if (data.zone === NOT_IN_LIST && !data.zoneOther) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["zoneOther"], message: "Please enter your zone." });
    }
    if ((data.coordinator === NOT_IN_LIST || data.zone === NOT_IN_LIST) && !data.coordinatorOther) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["coordinatorOther"], message: "Please enter your coordinator name." });
    }
  });

export type RegisterMemberInput = z.infer<typeof registerMemberSchema>;
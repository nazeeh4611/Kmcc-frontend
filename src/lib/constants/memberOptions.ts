// Fixed option lists for the member registration/admin-create form. Mirrored
// exactly in the backend at backend/src/constants/memberOptions.js — keep
// both files in sync if this list ever changes.

export const ZONE_OPTIONS = [
  "Aanthurparamb",
  "Pavukkonam",
  "kottakulam",
  "melepathangalam",
  "thazepathangelam",
  "palakkod",
  "kundadi",
  "Panamanna",
  "pathayapadi Panamanna",
  "Kothakurssi",
  "Ananganadi",
] as const;

export const WORKING_COUNTRY_OPTIONS = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "London",
  "America",
  "Canada",
  "Other",
] as const;

export const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export type Zone = (typeof ZONE_OPTIONS)[number];
export type WorkingCountry = (typeof WORKING_COUNTRY_OPTIONS)[number];
export type BloodGroup = (typeof BLOOD_GROUP_OPTIONS)[number];

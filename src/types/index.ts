export type AdminRole = "super_admin" | "admin" | "editor";
export type MembershipStatus = "active" | "expired" | "suspended" | "inactive" | "pending";
export type Gender = "male" | "female" | "other";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "unknown";

export interface CloudinaryImage {
  url: string | null;
  publicId: string | null;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: AdminRole;
  photo?: CloudinaryImage;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipPlan {
  _id: string;
  title: string;
  price: number;
  duration: number; // months
  description?: string;
  benefits?: string[];
  isActive: boolean;
}

export interface Zone {
  _id: string;
  name: string;
  nameEnglish?: string | null;
  panchayath: string;
  priority: number;
  isActive: boolean;
}

export interface Coordinator {
  _id: string;
  name: string;
  zone?: string | Zone | null;
  phone?: string;
  isActive: boolean;
}

export interface Member {
  _id: string;
  membershipId: string;
  fullName: string;
  photo?: CloudinaryImage;
  fatherName?: string;
  dob?: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  homeCountryNumber?: string;
  workingCountryNumber?: string;
  email?: string;
  address?: string;
  workingCountry?: string;
  workingCountryOther?: string | null;
  zone?: string | null;
  joinedDate?: string;
  membershipStatus: MembershipStatus;
  membershipType?: string | MembershipPlan | null;
  membershipStart?: string | null;
  membershipExpiry?: string | null;
  daysRemaining: number;
  isExpired: boolean;
  committeeRole?: string | null;
  panchayath?: string;
  unit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  _id: string;
  memberId: string;
  name: string;
  relation: "spouse" | "son" | "daughter" | "father" | "mother" | "sibling" | "other";
  photo?: CloudinaryImage;
  dob?: string;
  gender?: Gender;
  phone?: string;
  bloodGroup?: BloodGroup;
  occupation?: string;
}

export type SessionType = "admin" | "member";

export interface AuthSession {
  type: SessionType;
  user: Admin | Member;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

import { publicApiClient as apiClient } from "@/lib/publicApiClient";

export interface CommitteeMember {
  _id: string;
  name: string;
  designation: string;
  phone?: string;
  email?: string;
  photo?: { url: string };
  priority: number;
  type: string;
  year: number;
}

export const YEAR_PRIORITY = [2026, 2025, 2024];

export const getCommitteeByType = async (type: string, year: number) => {
  const response = await apiClient.get(`/committee`, { params: { type, year } });
  return (response.data?.data?.members || response.data?.members || []) as CommitteeMember[];
};

export const getLatestCommitteeByType = async (type: string) => {
  for (const year of YEAR_PRIORITY) {
    const members = await getCommitteeByType(type, year);
    if (members.length > 0) {
      return { members, year };
    }
  }
  return { members: [] as CommitteeMember[], year: YEAR_PRIORITY[0] };
};
// src/lib/PlaceholderData.ts
export type Member = {
  name: string;
  role: string;
  location?: string;
};

export const heroStats = [
  { value: "40+", label: "Years of Service" },
  { value: "18", label: "Gulf Chapters" },
  { value: "12,000+", label: "Families Supported" },
];

export const features = [
  {
    title: "Welfare & Relief",
    desc: "Emergency aid, medical support, and monthly assistance for families facing hardship across Anganganadi.",
  },
  {
    title: "Expatriate Network",
    desc: "A trusted community connecting Anganganadi natives across the Gulf, sharing support, work, and opportunity.",
  },
  {
    title: "Transparent Governance",
    desc: "Every rupee and dirham accounted for, with committee oversight and open reporting to every member.",
  },
];

export const impactStats = [
  {
    value: "₹2.4Cr",
    label: "Relief Disbursed",
    note: "Distributed directly to families since the committee's founding.",
  },
  {
    value: "860",
    label: "Students Sponsored",
    note: "Educational grants awarded to children of expatriate and local families.",
  },
  {
    value: "140",
    label: "Homes Rebuilt",
    note: "Houses repaired or reconstructed for families across the panchayath.",
  },
];

export const committee2026: Member[] = [
  { name: "Abdul Rasheed K.", role: "President", location: "Dubai, UAE" },
  { name: "Muhammed Shafi P.", role: "Vice President", location: "Doha, Qatar" },
  { name: "Ashraf Kolakkadan", role: "General Secretary", location: "Riyadh, KSA" },
  { name: "Naseer Chungathara", role: "Joint Secretary", location: "Abu Dhabi, UAE" },
  { name: "Sadiq Puthiyakath", role: "Treasurer", location: "Manama, Bahrain" },
  { name: "Rasheed Karassery", role: "Organising Secretary", location: "Kuwait City, Kuwait" },
];

export const secretariatMembers: Member[] = [
  { name: "Yousuf Kappungal", role: "Secretariat Member", location: "Dubai, UAE" },
  { name: "Basheer Cholakkal", role: "Secretariat Member", location: "Muscat, Oman" },
  { name: "Faisal Chelakkara", role: "Secretariat Member", location: "Jeddah, KSA" },
  { name: "Nizamudheen T.K.", role: "Secretariat Member", location: "Sharjah, UAE" },
  { name: "Rafeeq Panamban", role: "Secretariat Member", location: "Doha, Qatar" },
  { name: "Sulaiman Kannoth", role: "Secretariat Member", location: "Dammam, KSA" },
];

export const mediaTeam: Member[] = [
  { name: "Ansar Vattaparambil", role: "Media Coordinator", location: "Dubai, UAE" },
  { name: "Jaseem Kariveppil", role: "IT Coordinator", location: "Abu Dhabi, UAE" },
  { name: "Rilwan Puthanpurayil", role: "Content Lead", location: "Doha, Qatar" },
];

export const gccChapters = ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"];
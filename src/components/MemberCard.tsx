"use client";

import { MapPin } from "lucide-react";

interface Member {
  name: string;
  role: string;
  location?: string;
  photo?: string;
}

interface MemberCardProps {
  member: Member;
  ink: "brass" | "maroon";
}

export default function MemberCard({ member, ink }: MemberCardProps) {
  const isBrass = ink === "brass";

  return (
    <div className="group rounded-2xl border border-line bg-white p-6 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-lg">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full font-display text-xl font-semibold text-white ${
          isBrass ? "bg-brass" : "bg-maroon"
        }`}
      >
        {member.name.charAt(0)}
      </div>
      <p className="mt-4 font-display text-base font-semibold text-ink">{member.name}</p>
      <span
        className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 font-utility text-[11px] font-semibold uppercase tracking-wide ${
          isBrass ? "bg-brass-100 text-brass-600" : "bg-maroon-100 text-maroon"
        }`}
      >
        {member.role}
      </span>
      {member.location && (
        <p className="mt-2.5 flex items-center justify-center gap-1 font-body text-xs text-slate">
          <MapPin className="h-3 w-3" />
          {member.location}
        </p>
      )}
    </div>
  );
}

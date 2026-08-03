"use client";

import { Phone, Mail } from "lucide-react";

interface Member {
  name: string;
  designation: string;
  phone?: string;
  email?: string;
  photo?: { url: string };
}

interface MemberCardProps {
  member: Member;
  ink: "brass" | "maroon";
}

export default function MemberCard({ member, ink }: MemberCardProps) {
  const isBrass = ink === "brass";

  return (
    <div className="group flex items-center gap-5 rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-lg">
      {member.photo?.url ? (
        <img
          src={member.photo.url}
          alt={member.name}
          className="h-24 w-24 shrink-0 rounded-2xl object-cover"
        />
      ) : (
        <div
          className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl font-display text-2xl font-semibold text-white ${
            isBrass ? "bg-brass" : "bg-maroon"
          }`}
        >
          {member.name.charAt(0)}
        </div>
      )}

      <div className="min-w-0 text-left">
        <p className="font-display text-base font-semibold text-ink">{member.name}</p>
        <span
          className={`mt-1 inline-block rounded-full px-2.5 py-0.5 font-utility text-[11px] font-semibold uppercase tracking-wide ${
            isBrass ? "bg-brass-100 text-brass-600" : "bg-maroon-100 text-maroon"
          }`}
        >
          {member.designation}
        </span>
        {member.phone && (
          <p className="mt-2 flex items-center gap-1 font-body text-xs text-slate">
            <Phone className="h-3 w-3 shrink-0" />
            {member.phone}
          </p>
        )}
        {member.email && (
          <p className="mt-1 flex items-center gap-1 font-body text-xs text-slate truncate">
            <Mail className="h-3 w-3 shrink-0" />
            {member.email}
          </p>
        )}
      </div>
    </div>
  );
}
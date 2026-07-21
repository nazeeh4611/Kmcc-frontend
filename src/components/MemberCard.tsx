// src/components/MemberCard.tsx
import { MapPin, Stamp } from "lucide-react";
import type { Member } from "../lib/PlaceholderData";

export default function MemberCard({ member, ink = "brass" }: { member: Member; ink?: "brass" | "maroon" }) {
  const initials = member.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  const inkColor = ink === "brass" ? "text-brass" : "text-maroon";
  const inkBorder = ink === "brass" ? "border-brass" : "border-maroon";

  return (
    <div className="id-card-notch relative overflow-hidden rounded-xl border border-line bg-white p-6 pt-8">
      <span className={`stamp-ring absolute right-5 top-5 flex h-12 w-12 items-center justify-center ${inkColor} ${inkBorder}`}>
        <Stamp className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <div className="flex items-center gap-4 pr-14">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green font-display text-base font-semibold text-paper">
          {initials}
        </span>
        <div>
          <p className="font-display text-base font-semibold text-ink">{member.name}</p>
          <p className={`mt-1 font-utility text-[11px] uppercase tracking-[0.16em] ${inkColor}`}>
            {member.role}
          </p>
        </div>
      </div>
      {member.location && (
        <div className="mt-5 flex items-center gap-1.5 border-t border-dashed border-line pt-4 font-body text-xs text-slate">
          <MapPin className="h-3.5 w-3.5 text-green" />
          {member.location}
        </div>
      )}
    </div>
  );
}
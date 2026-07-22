"use client";

import MemberCard from "./MemberCard";
import { mediaTeam, secretariatMembers } from "../lib/PlaceholderData";

export default function SecretariatMedia() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-green">
            Governance
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Secretariat Members</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {secretariatMembers.map((member, i) => (
            <MemberCard key={member.name} member={member} ink={i % 2 === 0 ? "maroon" : "brass"} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl">
        <div className="text-center">
          <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-green">
            Outreach
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink">IT &amp; Media Team</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mediaTeam.map((member, i) => (
            <MemberCard key={member.name} member={member} ink={i % 2 === 0 ? "brass" : "maroon"} />
          ))}
        </div>
      </div>
    </section>
  );
}

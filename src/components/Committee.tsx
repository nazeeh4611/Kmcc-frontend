"use client";

import MemberCard from "./MemberCard";
import { committee2026 } from "../lib/PlaceholderData";

export default function Committee() {
  return (
    <section id="committee" className="bg-white px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-green-900 px-8 py-7 text-center shadow-card-lg">
          <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-brass">
            2026
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-paper">Committee</h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {committee2026.map((member, i) => (
            <MemberCard key={member.name} member={member} ink={i % 2 === 0 ? "brass" : "maroon"} />
          ))}
        </div>
      </div>
    </section>
  );
}

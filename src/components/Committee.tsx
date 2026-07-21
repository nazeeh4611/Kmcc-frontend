// src/components/Committee.tsx
import MemberCard from "./MemberCard";
import { committee2026 } from "../lib/PlaceholderData";

export default function Committee() {
  return (
    <section id="committee" className="px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl bg-green px-8 py-7 text-center">
          <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-brass">
            2026
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">
            Committee
          </h2>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {committee2026.map((member, i) => (
            <MemberCard key={member.name} member={member} ink={i % 2 === 0 ? "brass" : "maroon"} />
          ))}
        </div>
      </div>
    </section>
  );
}
// src/components/ImpactStats.tsx
import { impactStats } from "../lib/PlaceholderData";

const inks = ["text-brass", "text-maroon", "text-brass"];

export default function ImpactStats() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl text-center">
        <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-green">
          Impact in Numbers
        </span>
        <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold text-ink">
          Decades of collective effort, entered into record
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {impactStats.map((stat, i) => (
            <div key={stat.label} className="rounded-xl border border-line bg-white p-8 text-left">
              <p className={`font-utility text-4xl font-bold ${inks[i]}`}>{stat.value}</p>
              <p className="mt-3 font-body text-sm font-semibold text-ink">{stat.label}</p>
              <p className="mt-2 font-body text-xs leading-relaxed text-slate">{stat.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
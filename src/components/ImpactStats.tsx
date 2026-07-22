import { impactStats } from "../lib/PlaceholderData";

const inks = ["text-brass", "text-maroon", "text-green"];

export default function ImpactStats() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-green">
          Impact in Numbers
        </span>
        <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold text-ink">
          Decades of collective effort, entered into record
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-3">
          {impactStats.map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-lg"
            >
              <p className={`font-display text-4xl font-bold ${inks[i % inks.length]}`}>{stat.value}</p>
              <p className="mt-3 font-body text-sm font-semibold text-ink">{stat.label}</p>
              <p className="mt-2 font-body text-xs leading-relaxed text-slate">{stat.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

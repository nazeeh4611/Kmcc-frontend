import { Stamp, Globe2 } from "lucide-react";
import { heroStats } from "../lib/PlaceholderData";

export default function AboutMission() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-green">
            Who We Are
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">
            Global KMCC · Anganganadi Constituency
          </h2>
          <p className="mt-6 max-w-lg font-body leading-relaxed text-slate">
            KMCC — the Kerala Muslim Cultural Centre — is the largest
            voluntary, non-profit organisation of expatriates from Kerala,
            and serves as the overseas cultural wing of the Indian Union
            Muslim League. Anganganadi&apos;s chapter carries that same charge:
            welfare rooted in service, not spectacle.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl border border-line bg-paper p-4">
              <Stamp className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
              <div>
                <p className="font-body text-sm font-semibold text-ink">Compassion in Action</p>
                <p className="mt-1 font-body text-xs leading-relaxed text-slate">
                  Rapid relief aid and support for families in their toughest hours.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl border border-line bg-paper p-4">
              <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-maroon" />
              <div>
                <p className="font-body text-sm font-semibold text-ink">Global Network</p>
                <p className="mt-1 font-body text-xs leading-relaxed text-slate">
                  Coordinated chapters uniting expatriates across the Gulf and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-green-900 bg-green-900 p-10 text-center shadow-card-lg">
          <span className="flex h-16 w-16 items-center justify-center rounded-xl border border-brass text-brass">
            <Stamp className="h-7 w-7" strokeWidth={1.6} />
          </span>
          <p className="mt-2 font-display text-xl font-semibold text-paper">Global KMCC</p>
          <p className="font-utility text-xs uppercase tracking-[0.3em] text-brass">
            Anganganadi Constituency
          </p>
          <p className="mt-2 max-w-xs font-body text-sm italic text-paper/60">
            The greatest honor for a KMCC volunteer is the grateful prayer of a life lifted from hardship.
          </p>

          <div className="mt-6 grid w-full grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-lg font-bold text-brass">{stat.value}</p>
                <p className="mt-1 font-body text-[11px] text-paper/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

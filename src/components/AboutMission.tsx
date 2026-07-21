// src/components/AboutMission.tsx
import { Stamp, Globe2 } from "lucide-react";

export default function AboutMission() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr,1fr]">
        <div>
          <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-green">
            Who We Are
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Global KMCC · Anganganadi Constituency
          </h2>
          <p className="mt-6 max-w-lg font-body leading-relaxed text-slate">
            KMCC — the Kerala Muslim Cultural Centre — is the largest
            voluntary, non-profit organisation of expatriates from Kerala,
            and serves as the overseas cultural wing of the Indian Union
            Muslim League. Anganganadi's chapter carries that same charge:
            welfare rooted in service, not spectacle.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-lg border border-line bg-white p-4">
              <Stamp className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
              <div>
                <p className="font-body text-sm font-semibold text-ink">Compassion in Action</p>
                <p className="mt-1 font-body text-xs leading-relaxed text-slate">
                  Rapid relief aid and support for families in their toughest hours.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-line bg-white p-4">
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

        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-green-900 bg-green p-10 text-center">
          <span className="stamp-ring flex h-16 w-16 items-center justify-center text-brass">
            <Stamp className="h-7 w-7" strokeWidth={1.6} />
          </span>
          <p className="font-display text-xl font-semibold text-paper">Global KMCC</p>
          <p className="font-utility text-xs uppercase tracking-[0.3em] text-brass">
            Anganganadi Constituency
          </p>
          <p className="mt-2 max-w-xs font-body text-sm italic text-paper/60">
            The greatest honor for a KMCC volunteer is the grateful prayer of a life lifted from hardship.
          </p>
        </div>
      </div>
    </section>
  );
}
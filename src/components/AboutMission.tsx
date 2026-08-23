import { Stamp, Globe2 } from "lucide-react";
import Image from "next/image";

export default function AboutMission() {
  return (
    <section id="about" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left side - Content */}
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

        {/* Right side - Logo only */}
       <div className="flex items-center justify-center">
  <div className="relative h-[350px] w-[350px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
    <Image
      src="/kmcc.avif"
      alt="Global KMCC Logo"
      fill
      className="object-contain"
    />
  </div>
</div>
      </div>
    </section>
  );
}
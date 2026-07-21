// src/components/Hero.tsx
import Link from "next/link";
import { ArrowRight, Users2, Stamp } from "lucide-react";
import { heroStats } from "../lib/PlaceholderData";
import HeroBanner from "./HeroBanner";

export default function Hero() {
  return (
    <section className="bg-paper pb-0 pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr,0.9fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-1.5 font-utility text-[11px] font-semibold uppercase tracking-[0.22em] text-green">
            <Stamp className="h-3.5 w-3.5 text-brass" />
            Overseas Cultural Wing of IUML
          </span>

          <h1 className="mt-7 font-display text-5xl font-semibold leading-[1.08] text-ink sm:text-6xl">
            Global KMCC
            <br />
            Anganganadi Panchayath
          </h1>

          <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-slate">
            KMCC grows beyond a cultural forum into a movement that shelters
            thousands through its deep-rooted spirit of service. For every
            volunteer, the greatest honor is the grateful prayer of a life
            lifted from hardship.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md bg-green px-6 py-3 font-body text-sm font-semibold text-paper transition hover:bg-green-800"
            >
              Membership Form
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/committee"
              className="inline-flex items-center gap-2 rounded-md border border-line px-6 py-3 font-body text-sm font-semibold text-ink transition hover:border-green hover:text-green"
            >
              <Users2 className="h-4 w-4" />
              Meet the Committee
            </Link>
          </div>
        </div>

        <HeroBanner />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 border-t border-dashed border-line pt-8 sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-baseline justify-between sm:flex-col sm:items-start sm:gap-1"
            >
              <span className="font-utility text-3xl font-bold text-ink">{stat.value}</span>
              <span className="font-body text-sm text-slate">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ticket-divider ticket-divider--on-green mx-6" />
    </section>
  );
}
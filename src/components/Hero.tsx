"use client";

import Link from "next/link";
import { ArrowRight, Users2, Stamp } from "lucide-react";
import { heroStats } from "../lib/PlaceholderData";
import HeroBanner from "./HeroBanner";

export default function Hero() {
  return (
    <section className="bg-paper pb-0 pt-28 sm:pt-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 font-utility text-[11px] font-semibold uppercase tracking-[0.2em] text-green-900 shadow-card">
            <Stamp className="h-3.5 w-3.5 text-brass" />
            Overseas Cultural Wing of IUML
          </span>

          <h1 className="mt-7 font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl">
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
              className="inline-flex items-center gap-2 rounded-lg bg-green px-6 py-3 font-body text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-card-lg"
            >
              Membership Form
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/#committee"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-6 py-3 font-body text-sm font-semibold text-ink transition-all hover:border-green/30 hover:text-green"
            >
              <Users2 className="h-4 w-4" />
              Meet the Committee
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-green-900 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 font-body text-xs text-slate sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <HeroBanner />
      </div>
    </section>
  );
}

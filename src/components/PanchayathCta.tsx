"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PanchayathCta() {
  return (
    <section className="bg-paper px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-green-900 px-6 py-16 text-center shadow-card-lg sm:px-10">
        <div className="dot-grid absolute inset-0 opacity-30" />
        <div className="relative">
          <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.3em] text-brass">
            Panchayath Network
          </span>
          <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-semibold text-paper">
            Meet Our Panchayath Coordinators
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-sm leading-relaxed text-paper/65">
            Explore the dedicated coordinators connecting expatriates across
            every panchayath. View full profiles, responsibilities, and contact
            points.
          </p>
          <Link
            href="/coordinators"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brass px-6 py-3 font-body text-sm font-semibold text-green-900 transition-all hover:-translate-y-0.5 hover:bg-brass-600 hover:text-white"
          >
            View Coordinators
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

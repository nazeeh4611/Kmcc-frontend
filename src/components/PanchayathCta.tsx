// src/components/PanchayathCta.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PanchayathCta() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl rounded-xl border border-green-900 bg-green px-8 py-16 text-center">
        <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.3em] text-brass">
          Panchayath Network
        </span>
        <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-semibold text-paper sm:text-4xl">
          Meet Our Panchayath Coordinators
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-body text-sm leading-relaxed text-paper/65">
          Explore the dedicated coordinators connecting expatriates across
          every panchayath. View full profiles, responsibilities, and contact
          points.
        </p>
        <Link
          href="/coordinators"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-brass px-6 py-3 font-body text-sm font-semibold text-green-900 transition hover:bg-brass-600"
        >
          View Coordinators
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
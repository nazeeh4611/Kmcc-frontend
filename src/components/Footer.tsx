// src/components/Footer.tsx
import Link from "next/link";
import { Stamp } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { gccChapters } from "../lib/PlaceholderData";

const quickLinks = ["Home", "About", "Committee", "Updates"];
const anchors = [
  "CM Center Chalakkara",
  "SNADS Chelambra",
  "Prabhodanam Movement",
  "CM Center Approvedma",
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white px-6 pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 border-b border-line pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="stamp-ring flex h-9 w-9 items-center justify-center text-brass">
                <Stamp className="h-4 w-4" />
              </span>
              <span className="font-display text-lg font-semibold text-ink">Global KMCC</span>
            </div>
            <p className="mt-4 font-body text-sm leading-relaxed text-slate">
              Serving Anganganadi expatriates worldwide. We connect families
              across every panchayath, giving those back home a stronger
              support system and volunteers a way to transform lives.
            </p>
            <Link
              href="/register"
              className="mt-5 inline-block rounded-md bg-green px-5 py-2.5 font-body text-sm font-semibold text-paper transition hover:bg-green-800"
            >
              Become a Member
            </Link>
          </div>

          <div>
            <p className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-green">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item}>
                  <Link href="/" className="font-body text-sm text-slate transition-colors hover:text-green">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-green">
              Charity Anchors
            </p>
            <ul className="mt-4 space-y-2.5">
              {anchors.map((item) => (
                <li key={item} className="font-body text-sm text-slate">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-green">
              Global Network
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2.5">
              {gccChapters.map((item) => (
                <li key={item} className="font-body text-sm text-slate">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="font-body text-xs text-slate">
            © 2026 Global KMCC Anganganadi Panchayath. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <FaFacebook className="h-4 w-4 text-slate transition-colors hover:text-green" />
            <FaInstagram className="h-4 w-4 text-slate transition-colors hover:text-green" />
            <FaYoutube className="h-4 w-4 text-slate transition-colors hover:text-green" />
          </div>
        </div>
      </div>
    </footer>
  );
}
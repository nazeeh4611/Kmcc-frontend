// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Stamp } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Committee", href: "/committee" },
  { label: "Panchayaths", href: "/panchayaths" },
  { label: "Media", href: "/media" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="border-b border-green-900 bg-green">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="stamp-ring flex h-9 w-9 items-center justify-center text-brass">
              <Stamp className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-paper">
              Global KMCC
              <span className="ml-2 font-utility text-[10px] font-medium uppercase tracking-[0.25em] text-brass">
                Anganganadi Panchayath
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm font-medium text-paper/75 transition hover:text-brass"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="rounded-md border border-paper/25 px-5 py-2 font-body text-sm font-medium text-paper transition hover:border-brass hover:text-brass"
            >
              Member Login
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-brass px-5 py-2 font-body text-sm font-semibold text-green-900 transition hover:bg-brass-600"
            >
              Apply for Membership
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="text-paper lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="flex flex-col gap-1 border-t border-green-900 px-6 py-4 lg:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 font-body text-sm font-medium text-paper/80 hover:bg-white/5 hover:text-brass"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/login" className="rounded-md border border-paper/25 px-5 py-2.5 text-center font-body text-sm font-medium text-paper">
                Member Login
              </Link>
              <Link href="/register" className="rounded-md bg-brass px-5 py-2.5 text-center font-body text-sm font-semibold text-green-900">
                Apply for Membership
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
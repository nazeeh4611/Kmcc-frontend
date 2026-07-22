"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Committee", href: "/committee" },
  { label: "Panchayaths", href: "/panchayaths" },
  { label: "Media", href: "/media" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass border-b border-line shadow-sm" : "border-b border-transparent bg-paper/60"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green text-brass">
            <Stamp className="h-4 w-4 stroke-[1.8]" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-green-900">
            Global KMCC
            <span className="ml-2 hidden font-utility text-[10px] font-medium uppercase tracking-[0.22em] text-brass-600 sm:inline">
              Anganganadi Panchayath
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-medium text-ink/70 transition-colors hover:text-green"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-line px-4 py-2 font-body text-sm font-medium text-ink transition-all hover:border-green/40 hover:text-green"
          >
            Member Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-green px-4 py-2 font-body text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-800"
          >
            Apply for Membership
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-green lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-line bg-paper px-4 py-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 font-body text-sm font-medium text-ink/80 transition-colors hover:bg-green/5 hover:text-green"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="rounded-lg border border-line px-5 py-2.5 text-center font-body text-sm font-medium text-ink"
            >
              Member Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-green px-5 py-2.5 text-center font-body text-sm font-semibold text-white"
            >
              Apply for Membership
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

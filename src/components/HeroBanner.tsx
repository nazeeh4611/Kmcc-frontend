"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { publicApiClient } from "@/lib/publicApiClient";

type BannerImage = {
  id: string;
  url: string;
  alt: string;
  description: string;
  createdAt: string;
};

export default function HeroBanner() {
  const [banners, setBanners] = useState<BannerImage[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [textOpen, setTextOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // portal needs document

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await publicApiClient.get("/carousel");
        const slides = res.data.data.slides ?? [];
        setBanners(
          slides.map((slide: any) => ({
            id: slide._id,
            url: slide.image.url,
            alt: slide.title,
            description: slide.description ?? "",
            createdAt: slide.createdAt,
          }))
        );
      } catch (error) {
        console.error("Failed to load banners:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (banners.length === 0) return;
      setCurrent(((index % banners.length) + banners.length) % banners.length);
    },
    [banners.length]
  );

  // Autoplay pauses while the text popup is open, otherwise the slide
  // (and the text) would change under the reader after 5 seconds.
  useEffect(() => {
    if (banners.length <= 1 || textOpen) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, textOpen]);

  // Escape to close + lock page scroll while the popup is open.
  useEffect(() => {
    if (!textOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTextOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [textOpen]);

  const active = banners[current];
  const popupBody = active?.description || active?.alt || "";

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-green-900 shadow-card-lg sm:h-[520px] lg:h-[640px]">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
        </div>
      ) : banners.length > 0 ? (
        <>
          <div
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="relative h-full w-full flex-shrink-0 overflow-hidden">
                <Image
                  src={banner.url}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="100vw"
                  className="scale-110 object-cover blur-2xl opacity-60"
                />
                <div className="absolute inset-0 bg-green-900/40" />
                <Image
                  src={banner.url}
                  alt={banner.alt}
                  fill
                  sizes="100vw"
                  className="relative z-10 object-contain"
                />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-900/90 via-transparent to-green-900/30" />

          {banners.length > 1 && (
            <>
              <button
                onClick={() => goTo(current - 1)}
                aria-label="Previous banner"
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-paper backdrop-blur-sm transition-all hover:bg-black/50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={() => goTo(current + 1)}
                aria-label="Next banner"
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-paper backdrop-blur-sm transition-all hover:bg-black/50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm">
            {/* The text itself is the click target */}
            <button
              type="button"
              onClick={() => setTextOpen(true)}
              aria-haspopup="dialog"
              className="min-w-0 flex-1 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
            >
              <span className="block truncate font-utility text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">
                {active?.alt || "Global KMCC"}
              </span>
              {active?.description && (
                <span className="mt-0.5 block truncate text-xs text-white/70">
                  {active.description}
                </span>
              )}
            </button>
            <div className="flex flex-shrink-0 gap-1.5">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  onClick={() => goTo(index)}
                  aria-label={`Go to banner ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === current ? "w-5 bg-brass" : "w-1.5 bg-brass/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="dot-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-green-800/85 to-green-900/95" />
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-xl font-semibold text-paper">Anganganadi Constituency</p>
            <p className="mt-1.5 font-body text-sm text-paper/70">Global KMCC · Serving the Community</p>
          </div>
        </>
      )}

      {/* Full-text popup: blurred backdrop, white text. Portaled to <body> so the
          hero's overflow-hidden / rounded corners can't clip it. */}
      {mounted &&
        textOpen &&
        active &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.alt || "Banner details"}
            onClick={() => setTextOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md sm:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto overscroll-contain px-2 py-4 text-white"
            >
              <button
                type="button"
                onClick={() => setTextOpen(false)}
                aria-label="Close"
                autoFocus
                className="sticky top-0 ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition-colors hover:bg-black/50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {active.description && active.alt && (
                <h3 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">
                  {active.alt}
                </h3>
              )}
              <p className="whitespace-pre-line break-words text-base leading-relaxed text-white sm:text-lg">
                {popupBody}
              </p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
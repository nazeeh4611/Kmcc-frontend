"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Image from "next/image";

type BannerImage = {
  id: string;
  url: string;
  alt: string;
  createdAt: number;
};

export default function HeroBanner() {
  const [banners, setBanners] = useState<BannerImage[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/banners");
        setBanners(res.data.banners ?? []);
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

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

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
                  className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-60"
                />
                <div className="absolute inset-0 bg-green-900/40" />
                <Image
                  src={banner.url}
                  alt={banner.alt}
                  className="relative z-10 h-full w-full object-contain"
                />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-900/90 via-transparent to-green-900/30" />

          {banners.length > 1 && (
            <>
              <button
                onClick={() => goTo(current - 1)}
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-paper backdrop-blur-sm transition-all hover:bg-black/50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={() => goTo(current + 1)}
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-paper backdrop-blur-sm transition-all hover:bg-black/50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm">
            <span className="truncate pr-3 font-utility text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">
              {banners[current]?.alt || "Global KMCC"}
            </span>
            <div className="flex flex-shrink-0 gap-1.5">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
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
    </div>
  );
}
// src/components/HeroBanner.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";

type BannerImage = {
  id: string;
  url: string;
  alt: string;
  createdAt: number;
};

export default function HeroBanner() {
  const [banners, setBanners] = useState<BannerImage[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch("/api/banners", { cache: "no-store" });
      const data = await res.json();
      setBanners(data.banners ?? []);
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);
  const next = () => setIndex((i) => (i + 1) % banners.length);

  if (loading) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-xl border border-dashed border-line bg-white">
        <p className="font-body text-xs text-slate">Loading banner…</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-white p-8 text-center">
        <ImageOff className="h-8 w-8 text-slate" strokeWidth={1.6} />
        <p className="font-body text-sm font-medium text-ink">No banner images yet</p>
        <p className="font-body text-xs text-slate">
          Upload images from <span className="font-utility">/admin/banners</span>
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-line bg-white">
      {banners.map((banner, i) => (
        <img
          key={banner.id}
          src={banner.url}
          alt={banner.alt || "Global KMCC banner"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink transition hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink transition hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 w-2 rounded-full border border-line transition ${
                  i === index ? "bg-brass" : "bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
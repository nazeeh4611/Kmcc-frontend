import { Layers } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-green-900 shadow-card-lg">
      <div className="dot-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-green-800/85 to-green-900/95" />
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass">
          <Layers className="h-7 w-7 text-brass" strokeWidth={1.6} />
        </div>
        <p className="font-display text-xl font-semibold text-paper">Anganganadi Constituency</p>
        <p className="mt-1.5 font-body text-sm text-paper/70">Global KMCC · Serving the Community</p>
        <div className="mt-5 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-brass" />
          <span className="h-2 w-2 rounded-full bg-brass/50" />
          <span className="h-2 w-2 rounded-full bg-brass/30" />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm">
        <span className="font-utility text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">
          Est. Chapter
        </span>
        <span className="font-body text-xs text-paper/80">Kerala &middot; Gulf Network</span>
      </div>
    </div>
  );
}

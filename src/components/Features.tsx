import { HandHeart, Globe2, ShieldCheck, type LucideIcon } from "lucide-react";
import { features } from "../lib/PlaceholderData";

const icons: LucideIcon[] = [HandHeart, Globe2, ShieldCheck];
const tones = ["text-brass border-brass/40 bg-brass-100/40", "text-maroon border-maroon/30 bg-maroon-100/40", "text-green border-green/25 bg-green-50"];

export default function Features() {
  return (
    <section className="bg-paper px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = icons[i] ?? Globe2;
          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-line bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-lg"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tones[i % tones.length]}`}>
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-slate">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

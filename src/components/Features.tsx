// src/components/Features.tsx
import { HandHeart, Globe2, ShieldCheck, type LucideIcon } from "lucide-react";
import { features } from "../lib/PlaceholderData";

const icons: LucideIcon[] = [HandHeart, Globe2, ShieldCheck];
const inks = ["brass", "maroon", "brass"] as const;

export default function Features() {
  return (
    <section className="bg-green px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-xl border border-green-900 bg-green-900 sm:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = icons[i] ?? Globe2;
          const inkColor = inks[i] === "brass" ? "text-brass" : "text-maroon";
          return (
            <div key={feature.title} className="bg-green p-8">
              <span className={`stamp-ring flex h-11 w-11 items-center justify-center ${inkColor}`}>
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-paper">{feature.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-paper/65">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
import { Users, ShieldCheck, HeartHandshake, Sparkles, Newspaper, Vote } from "lucide-react";

const pillars = [
  {
    icon: Users,
    title: "Membership",
    body: "Register once and stay connected to your ward committee, wherever you are working.",
  },
  {
    icon: ShieldCheck,
    title: "Committee & Governance",
    body: "Elected local committees represent the chapter and coordinate with the panchayath office.",
  },
  {
    icon: HeartHandshake,
    title: "Welfare & Support",
    body: "Emergency assistance, medical aid, and scholarships for families back home.",
  },
  {
    icon: Sparkles,
    title: "Cultural Events",
    body: "Onam, Eid, and community gatherings that keep our traditions alive abroad.",
  },
  {
    icon: Newspaper,
    title: "News & Circulars",
    body: "Official announcements, panchayath updates, and chapter news in one feed.",
  },
  {
    icon: Vote,
    title: "Meetings & Elections",
    body: "Committee meeting schedules, minutes, and election notices for members.",
  },
];

export default function Pillars() {
  return (
    <section id="pillars" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-utility text-xs font-semibold uppercase tracking-[0.18em] text-maroon">
            What the chapter offers
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
            Everything the community needs, organised
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group rounded-2xl border border-line bg-paper p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brass/40 hover:shadow-[0_20px_40px_-20px_rgba(122,39,51,0.25)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-100 text-maroon transition-colors group-hover:bg-maroon group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold text-ink">{pillar.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-slate">{pillar.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
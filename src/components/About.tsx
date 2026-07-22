const points = [
  {
    title: "Rooted in Anganganadi",
    body: "Every member traces back to the panchayath — our wards, our families, our tharavadu.",
  },
  {
    title: "Present wherever we work",
    body: "From the Gulf to Europe, local committees keep the community connected and supported.",
  },
  {
    title: "Built on mutual care",
    body: "Welfare support, scholarships, and emergency assistance for families back home.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-paper py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <span className="font-utility text-xs font-semibold uppercase tracking-[0.18em] text-maroon">
            About the chapter
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            One panchayath, spread across the world, still one family
          </h2>
          <p className="mt-6 font-body leading-relaxed text-slate">
            Global KMCC Anganganadi Panchayath was formed so that no one who leaves home for work
            has to lose their connection to it. We organise the community abroad into local
            committees, run welfare programmes for families back in Kerala, and keep everyone
            informed through regular news, meetings, and gatherings.
          </p>

          <ul className="mt-10 space-y-6">
            {points.map((point, index) => (
              <li key={point.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon-100 font-display text-sm font-bold text-maroon">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{point.title}</h3>
                  <p className="mt-1 font-body text-sm leading-relaxed text-slate">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-[2rem] bg-green-900 p-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #C9A227 0, #C9A227 2px, transparent 2px, transparent 18px)",
              }}
            />
            <svg viewBox="0 0 400 420" className="relative h-full w-full">
              <ellipse cx="200" cy="380" rx="170" ry="20" fill="#1F3229" />
              <path
                d="M60 380 C 60 260 90 160 130 90"
                stroke="#E7C766"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M130 90 C 90 70 60 40 50 10" stroke="#E7C766" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M130 90 C 100 90 60 90 30 80" stroke="#E7C766" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M130 90 C 150 70 190 60 210 30" stroke="#E7C766" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path
                d="M300 380 C 300 250 270 150 235 85"
                stroke="#C9A227"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M235 85 C 270 65 300 35 310 8" stroke="#C9A227" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M235 85 C 265 90 300 92 330 82" stroke="#C9A227" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M235 85 C 210 65 175 55 155 28" stroke="#C9A227" strokeWidth="5" fill="none" strokeLinecap="round" />
              <rect x="150" y="330" width="100" height="50" rx="4" fill="#7A2733" />
              <rect x="165" y="300" width="70" height="35" rx="3" fill="#9B3A47" />
              <path d="M155 300 L200 275 L245 300 Z" fill="#E7C766" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
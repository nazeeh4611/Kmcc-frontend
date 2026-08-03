"use client";

import CommitteeSection from "./CommitteeSection";

export default function SecretariatMedia() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8 space-y-20">
      <CommitteeSection
        type="secretariat"
        eyebrow="Governance"
        title="Secretariat Members"
        primaryInk="maroon"
      />
      <CommitteeSection
        type="it_team"
        eyebrow="Outreach"
        title="IT & Media Team"
        primaryInk="brass"
      />
      <CommitteeSection
        type="womens_wing"
        eyebrow="Community"
        title="Women's Wing"
        primaryInk="maroon"
      />
      <CommitteeSection
        type="youth_wing"
        eyebrow="Community"
        title="Youth Wing"
        primaryInk="brass"
      />
    </section>
  );
}
"use client";

import { useQuery } from "@tanstack/react-query";
import MemberCard from "./MemberCard";
import { getLatestCommitteeByType } from "../lib/committeePublicService";

interface CommitteeSectionProps {
  type: string;
  eyebrow: string;
  title: string;
  primaryInk: "brass" | "maroon";
}

export default function CommitteeSection({ type, eyebrow, title, primaryInk }: CommitteeSectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["committee", "public", type],
    queryFn: () => getLatestCommitteeByType(type),
  });

  const members = data?.members || [];
  const year = data?.year;

  if (!isLoading && members.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="text-center">
        <span className="font-utility text-[11px] font-semibold uppercase tracking-[0.25em] text-green">
          {eyebrow}
          {year ? ` · ${year}` : ""}
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink">{title}</h2>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, i) => (
          <MemberCard
            key={member._id}
            member={member}
            ink={i % 2 === 0 ? primaryInk : primaryInk === "brass" ? "maroon" : "brass"}
          />
        ))}
      </div>
    </div>
  );
}
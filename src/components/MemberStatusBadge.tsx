// components/MemberStatusBadge.tsx
import { cn } from "@/lib/utils";
import type { MembershipStatus } from "@/types";

const STYLES: Record<MembershipStatus, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  expired: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  suspended: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  inactive: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
};

export function MemberStatusBadge({ status }: { status: MembershipStatus }) {
  const style = STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold font-utility capitalize",
        style.bg,
        style.text
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", style.dot)} />
      {status}
    </span>
  );
}
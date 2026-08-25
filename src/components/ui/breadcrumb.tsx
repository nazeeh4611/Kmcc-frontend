import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 font-body text-sm text-slate/60">
      <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-green">
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-slate/30" />
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-green">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

import Link from "next/link";
import type { MailListVerticalOption } from "@/lib/mailListVerticals";

interface Props {
  options: MailListVerticalOption[];
  activeSlug: string;
  baseHref: string;
  totalCount: number;
}

export function MailListVerticalFilter({
  options,
  activeSlug,
  baseHref,
  totalCount,
}: Props) {
  const tabs = [
    { slug: "all", name: "Alle branches", count: totalCount },
    ...options.map((o) => ({ slug: o.slug, name: o.name, count: o.count })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = activeSlug === tab.slug;
        const href =
          tab.slug === "all"
            ? baseHref
            : `${baseHref}${baseHref.includes("?") ? "&" : "?"}vertical=${tab.slug}`;
        return (
          <Link
            key={tab.slug}
            href={href}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
              active ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.name}
            {tab.count > 0 ? ` (${tab.count})` : ""}
          </Link>
        );
      })}
    </div>
  );
}

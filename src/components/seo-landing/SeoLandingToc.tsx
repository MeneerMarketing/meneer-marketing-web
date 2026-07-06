"use client";

import type { SeoLandingTocItem } from "@/data/seo-landings/enriched-types";

interface SeoLandingTocProps {
  items: readonly SeoLandingTocItem[];
}

export function SeoLandingToc({ items }: SeoLandingTocProps) {
  return (
    <nav
      aria-label="Op deze pagina"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        Op deze pagina
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

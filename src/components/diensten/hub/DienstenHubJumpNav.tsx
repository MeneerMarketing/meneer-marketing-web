"use client";

import { DIENSTEN_HUB_PILLARS } from "@/data/diensten-hub";

export function DienstenHubJumpNav() {
  return (
    <nav
      className="sticky top-[calc(var(--header-height,4rem)+0.5rem)] z-20 hidden border-b border-slate-200/80 bg-white/90 backdrop-blur-md lg:block"
      aria-label="Spring naar hoofdstuk"
    >
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DIENSTEN_HUB_PILLARS.map((pillar) => (
          <a
            key={pillar.slug}
            href={`#${pillar.anchor}`}
            className="shrink-0 rounded-full px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            style={{ ["--hover-accent" as string]: pillar.accent }}
          >
            <span className="hover:text-[color:var(--hover-accent)]">{pillar.eyebrow}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

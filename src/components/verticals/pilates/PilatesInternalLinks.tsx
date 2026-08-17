import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PILATES_RELATED_LINKS } from "@/data/verticals/pilates";

/** Topical internal links: crawlable, compact, design-light. */
export function PilatesInternalLinks() {
  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="pilates-related-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
          Verder op deze site
        </p>
        <h2
          id="pilates-related-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Website, SEO en pilates marketing. Dieper per dienst.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Dit Pilates-programma leunt op dezelfde expertise. Bekijk de
          onderliggende diensten of de case.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PILATES_RELATED_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-[#f7fafc] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#FF5722]/40 hover:bg-white hover:shadow-[0_12px_28px_-18px_rgba(15,23,42,0.2)]"
              >
                <span>
                  <span className="block text-sm font-extrabold tracking-tight text-slate-900 group-hover:text-[#FF5722]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    {item.hint}
                  </span>
                </span>
                <ArrowUpRight
                  className="mt-0.5 size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF5722]"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

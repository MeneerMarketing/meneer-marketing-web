import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HOME_PILLAR_LINKS, TOP_ZOEKEN_HUB_LINKS } from "@/lib/seo/internal-links";

/** Mobiele pillar-links voor interne linkflow. */
export function HomeMobilePillarsStrip() {
  return (
    <section
      aria-labelledby="mobile-pillars-strip-heading"
      className="border-b border-slate-200 bg-white px-4 py-12"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C2410C]">
        Vijf blokken
      </p>
      <h2
        id="mobile-pillars-strip-heading"
        className="mt-2 text-pretty text-[1.65rem] font-extrabold leading-[1.08] tracking-tight text-slate-900"
      >
        Waar wil je starten?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Tik een blok. Elke pillar heeft eigen diensten, artikelen en zoekpagina&apos;s.
      </p>

      <ul className="mt-6 space-y-2">
        {HOME_PILLAR_LINKS.map((pillar) => (
          <li key={pillar.slug}>
            <Link
              href={`/${pillar.slug}`}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 transition hover:border-[#FF5722]/35 hover:bg-orange-50/50"
            >
              <span>
                <span className="block text-sm font-extrabold text-slate-900 group-hover:text-[#FF5722]">
                  {pillar.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">{pillar.hint}</span>
              </span>
              <ArrowUpRight
                className="size-4 shrink-0 text-slate-400 transition group-hover:text-[#FF5722]"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/diensten"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#C2410C]"
      >
        Alle diensten
        <ArrowUpRight className="size-4" aria-hidden />
      </Link>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Of start bij wat je googelt
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {TOP_ZOEKEN_HUB_LINKS.map((hub) => (
            <li key={hub.slug}>
              <Link
                href={`/zoeken/${hub.slug}`}
                className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700"
              >
                {hub.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

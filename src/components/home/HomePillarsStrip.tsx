import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { HOME_PILLAR_LINKS, TOP_ZOEKEN_HUB_LINKS } from "@/lib/seo/internal-links";

/** Compacte pillar-nav op de homepage voor interne linkflow. */
export function HomePillarsStrip() {
  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="home-pillars-strip-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                Vijf blokken
              </p>
              <h2
                id="home-pillars-strip-heading"
                className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
              >
                Kies je startpunt. Ik regel de rest.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Strategie, bouwen, vindbaarheid, campagnes of behoud. Elk blok heeft
                eigen diensten, cases en artikelen.
              </p>
            </div>
            <Link
              href="/diensten"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#FF5722]"
            >
              Alle diensten
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        {/* Reveal ín de li: een ul mag alleen li's als directe kinderen (a11y list-regel). */}
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {HOME_PILLAR_LINKS.map((pillar, i) => (
            <li key={pillar.slug}>
              <Reveal delay={0.04 * i} className="h-full">
                <Link
                  href={`/${pillar.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#FF5722]/35 hover:bg-orange-50/50 hover:shadow-sm"
                >
                  <span className="text-sm font-extrabold text-slate-900 group-hover:text-[#FF5722]">
                    {pillar.label}
                  </span>
                  <span className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-500">
                    {pillar.hint}
                  </span>
                  <ArrowUpRight
                    className="mt-3 size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF5722]"
                    aria-hidden
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.12}>
          <div className="mt-10 border-t border-slate-100 pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Of start bij wat je googelt
            </p>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Campagnes, SEO en builds onder één aanspreekpunt. Kies het hub waar jij nu zit.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {TOP_ZOEKEN_HUB_LINKS.map((hub) => (
                <li key={hub.slug}>
                  <Link
                    href={`/zoeken/${hub.slug}`}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
                  >
                    {hub.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

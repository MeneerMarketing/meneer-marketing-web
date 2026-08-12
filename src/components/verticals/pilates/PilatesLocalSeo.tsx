"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

const { queries, pages } = PILATES_VERTICAL.localSeoExamples;

export function PilatesLocalSeo() {
  return (
    <section
      className="border-b border-slate-200 bg-[#f3f7fb]"
      aria-labelledby="pilates-local-seo-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Local SEO
            </p>
            <h2
              id="pilates-local-seo-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.55rem] lg:leading-[1.08]"
            >
              Mooi is leuk.
              <span className="mt-1 block text-[#FF5722]">
                Gevonden worden betaalt de reformers.
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Ik bouw de site rond echte lokale zoekvraag. Niet rond een
              keyword-lijst van 200 dunne pagina&apos;s. Local Growth houdt dat
              maandelijks scherp, want Google blijft bewegen.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <Search className="size-4 text-slate-400" aria-hidden />
                <span className="text-sm font-medium text-slate-700">
                  pilates + jouw stad
                </span>
              </div>
              <div className="space-y-0 divide-y divide-slate-100 p-4 sm:p-5">
                {queries.map((q, i) => (
                  <div key={q} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-[11px] text-slate-400">
                      Resultaat {i === 0 ? "dat je wilt" : "die erbij horen"}
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-sky-800 hover:underline">
                      {q}
                    </p>
                    <p className="mt-0.5 text-xs text-emerald-700">
                      jouwstudio.nl · Open · Boek proefles
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      Lessen, prijzen en een boekingspad dat klopt. Zo ziet
                      intentie eruit als de site meewerkt.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6">
              <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                Pagina&apos;s die ergens over gaan
              </h3>
              <ul className="grid grid-cols-2 gap-2">
                {pages.map((page) => (
                  <li
                    key={page}
                    className="bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/90"
                  >
                    {page}
                  </li>
                ))}
              </ul>

              <p className="text-sm leading-relaxed text-slate-600">
                Technische SEO, snelheid, schema, interne linking, Google
                Business Profile, Search Console, rank tracking. Bij Growth
                stuur ik maandelijks bij. Meer over{" "}
                <Link
                  href="/diensten/local-seo"
                  className="font-bold text-slate-900 underline decoration-[#FF5722]/40 underline-offset-2 hover:text-[#FF5722]"
                >
                  lokale SEO
                </Link>{" "}
                en{" "}
                <Link
                  href="/vindbaarheid"
                  className="font-bold text-slate-900 underline decoration-[#FF5722]/40 underline-offset-2 hover:text-[#FF5722]"
                >
                  vindbaarheid
                </Link>
                .
              </p>

              <div className="bg-slate-900 p-5 text-white sm:p-6">
                <p className="text-sm font-extrabold tracking-tight">
                  Magische #1-beloftes? Doe ik niet.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Wel meten, bouwen en bijsturen. Transparantie wint van loze
                  garanties. Elke keer.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { MarketingFunFactCard } from "@/components/shared/MarketingFunFactCard";
import { getFunFactById } from "@/data/marketing-fun-facts";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

const { queries, pages } = PILATES_VERTICAL.localSeoExamples;

const PAGE_HINTS: Record<string, string> = {
  Homepage:
    "Hier landt iemand die je studio al kent. Snelheid, proefles en vertrouwen in één blik.",
  "Reformer Pilates":
    "Hoge intentie. Mensen zoeken dit letterlijk. Een dunne tekstpagina wint dat niet.",
  "Mat Pilates":
    "Andere zoeker, andere belofte. Apart uitwerken voorkomt dat alles op één hoop belandt.",
  "Private Pilates":
    "Premium intentie. Prijs, privacy en boeken moeten hier meteen kloppen.",
  Prijzen:
    "Twijfelers willen duidelijkheid. Verberg je tarieven en je verliest ze aan de concurrent.",
  "Studio / locatie":
    "Maps, parkeren, sfeer, openingstijden. Lokaal zoeken eindigt vaak hier.",
  FAQ: "Vragen die je sowieso krijgt, vooraf beantwoord. Scheelt DM's en wrijving.",
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function PilatesLocalSeo() {
  const reduce = useReducedMotion();
  const [activePage, setActivePage] = useState(pages[1] ?? pages[0]!);
  const weetje = getFunFactById("google-page-two");
  const hint = PAGE_HINTS[activePage] ?? "Elke pagina verdient een eigen zoekintentie.";

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      aria-labelledby="pilates-local-seo-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.045) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          {/* Left */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                Local SEO
              </p>
              <h2
                id="pilates-local-seo-heading"
                className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-4xl lg:text-[2.45rem] lg:leading-[1.08]"
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

              <div className="mt-8 flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80">
                <div className="flex items-center gap-2 border-b border-slate-200/80 bg-white px-4 py-3">
                  <Search className="size-4 text-slate-400" aria-hidden />
                  <span className="text-sm font-medium text-slate-700">
                    pilates + jouw stad
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center divide-y divide-slate-200/80 p-4 sm:p-5">
                  {queries.map((q, i) => (
                    <div key={q} className="py-3.5 first:pt-0 last:pb-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {i === 0 ? "Dit wil je scoren" : "Hier hoor je bij"}
                      </p>
                      <p className="mt-1 text-base font-semibold text-sky-800">
                        {q}
                      </p>
                      <p className="mt-0.5 text-xs text-emerald-700">
                        jouwstudio.nl · Open · Boek proefles
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        Lessen, prijzen en een boekingspad dat klopt. Zo ziet
                        intentie eruit als de site meewerkt.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right */}
          <Reveal delay={0.08} className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)] sm:p-8">
              <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                Tik een pagina. Ik zeg waarom die telt.
              </h3>
              <p className="mt-1.5 text-sm text-slate-500">
                Dunne pagina&apos;s scoren zelden. Dit zijn de bouwstenen.
              </p>

              <div
                className="mt-4 flex flex-wrap gap-2"
                role="tablist"
                aria-label="Pagina types"
              >
                {pages.map((page) => {
                  const selected = activePage === page;
                  return (
                    <button
                      key={page}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActivePage(page)}
                      className={
                        selected
                          ? "rounded-full border border-slate-900 bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-md transition"
                          : "rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
                      }
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 min-h-[5.5rem] rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-white p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePage}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: EASE }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                      {activePage}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-800">
                      {hint}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {weetje ? (
                <div className="mt-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Weetje · tik om te draaien
                  </p>
                  <MarketingFunFactCard
                    fact={weetje}
                    className="!h-[210px] sm:!h-[220px]"
                  />
                </div>
              ) : null}

              <div className="mt-5 flex-1 rounded-2xl bg-slate-900 p-5 text-white sm:p-6">
                <p className="text-sm font-extrabold tracking-tight">
                  Magische #1-beloftes laat ik aan anderen.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Ik meet, bouw en stuur bij. Transparantie wint van loze
                  garanties. Elke keer.
                </p>
                <p className="mt-4 text-xs leading-relaxed text-slate-400">
                  Technische SEO, snelheid, schema, interne linking, Google
                  Business Profile, Search Console, rank tracking. Bij Growth
                  stuur ik maandelijks bij. Meer over{" "}
                  <Link
                    href="/diensten/local-seo"
                    className="font-bold text-white underline decoration-[#FF5722]/50 underline-offset-2 hover:text-[#FF5722]"
                  >
                    lokale SEO
                  </Link>{" "}
                  en{" "}
                  <Link
                    href="/vindbaarheid"
                    className="font-bold text-white underline decoration-[#FF5722]/50 underline-offset-2 hover:text-[#FF5722]"
                  >
                    vindbaarheid
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

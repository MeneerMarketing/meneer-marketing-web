"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, Search, Star } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { MarketingFunFactCard } from "@/components/shared/MarketingFunFactCard";
import { getFunFactById } from "@/data/marketing-fun-facts";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";

const { queries } = HUIDKLINIEKEN_VERTICAL.localSeoExamples;

const EASE = [0.22, 1, 0.36, 1] as const;

const RESULT_COPY: Record<number, { title: string; snippet: string }> = {
  0: {
    title: "Jouw kliniek · huidkliniek in het centrum",
    snippet:
      "Behandelingen, tarieven en een intake die je in twee tikken boekt. Precies wat iemand met deze zoekvraag zoekt.",
  },
  1: {
    title: "Huidverbetering · behandelingen & aanpak",
    snippet:
      "Eigen pagina voor huidverbetering, met protocol, verwachting en wat je kunt verwachten bij een eerste consult.",
  },
  2: {
    title: "Intake plannen · nieuwe patiënten",
    snippet:
      "Directe afspraakroute vanaf Google. Zonder omweg via een contactformulier dat niemand invult.",
  },
};

export function HuidkliniekLocalSeo() {
  const reduce = useReducedMotion();
  const [activeQuery, setActiveQuery] = useState(0);
  const weetje = getFunFactById("google-page-two");
  const query = queries[activeQuery] ?? queries[0]!;

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      aria-labelledby="Huidkliniek-local-seo-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(255,87,34,0.08),_transparent_60%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Local SEO
            </p>
            <h2
              id="Huidkliniek-local-seo-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.06]"
            >
              Mooi is leuk.
              <span className="text-[#FF5722]">
                {" "}
                Gevonden worden vult de agenda.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Kies een zoekopdracht die jouw toekomstige patiënten intikken. Zo
              ziet het eruit als de site meewerkt in plaats van tegenwerkt.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-10 lg:mt-12">
          <Reveal delay={0.06}>
            <div className="relative z-0 mx-auto max-w-2xl">
              <div
                className="flex flex-wrap justify-center gap-2"
                role="tablist"
                aria-label="Zoekopdrachten"
              >
                {queries.map((q, i) => {
                  const selected = activeQuery === i;
                  return (
                    <button
                      key={q}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveQuery(i)}
                      onMouseEnter={() => {
                        if (!reduce) setActiveQuery(i);
                      }}
                      className={
                        selected
                          ? "rounded-full bg-slate-900 px-3.5 py-2 text-xs font-bold text-white"
                          : "rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300"
                      }
                    >
                      {q}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_28px_70px_-40px_rgba(15,23,42,0.35)]">
                <div className="border-b border-slate-100 px-4 pb-4 pt-5 sm:px-6">
                  <div className="flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/google-logo.png"
                      alt="Google"
                      width={110}
                      height={36}
                      className="h-8 w-auto bg-transparent"
                      draggable={false}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <Search className="size-4 shrink-0 text-slate-400" aria-hidden />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={query}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: EASE }}
                        className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-slate-800 sm:text-base"
                      >
                        {query}
                      </motion.span>
                    </AnimatePresence>
                    <span
                      className="h-4 w-px shrink-0 animate-pulse bg-[#FF5722]"
                      aria-hidden
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-white text-[#FF5722] ring-1 ring-slate-200">
                    <MapPin className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900">
                      Maps · jouw kliniek bovenaan
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                      <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
                      Google Business Profile netjes ingericht
                    </p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.ol
                    key={query}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="divide-y divide-slate-100"
                  >
                    {[0, 1, 2].map((i) => {
                      const copy = RESULT_COPY[i]!;
                      const first = i === 0;
                      return (
                        <li
                          key={i}
                          className={
                            first
                              ? "relative bg-slate-50 px-4 py-4 sm:px-6"
                              : "px-4 py-4 sm:px-6"
                          }
                        >
                          {first ? (
                            <span className="mb-2 inline-flex rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                              Topresultaat
                            </span>
                          ) : null}
                          <p className="text-[11px] text-emerald-700">
                            jouwkliniek.nl · Open · Boek intake
                          </p>
                          <p className="mt-1 text-base font-semibold text-sky-800">
                            {copy.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                            {copy.snippet}
                          </p>
                        </li>
                      );
                    })}
                  </motion.ol>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {weetje ? (
            <div className="pointer-events-auto absolute -right-2 top-16 z-30 hidden w-[250px] rotate-[3deg] xl:block">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Weetje · draai me om
              </p>
              <MarketingFunFactCard fact={weetje} className="!h-[230px]" />
            </div>
          ) : null}
        </div>

        <Reveal delay={0.14}>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              {
                title: "Techniek die meewerkt",
                text: "Snelheid, schema, interne linking en een structuur die Google snapt.",
              },
              {
                title: "Maps en profiel",
                text: "Google Business Profile, categorieën, foto's en reviews op orde.",
              },
              {
                title: "Blijven bijsturen",
                text: "Search Console, rank tracking en maandelijkse aanpassingen bij Growth.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#FF5722]/35"
              >
                <p className="text-sm font-extrabold tracking-tight text-slate-900">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center text-sm leading-relaxed text-slate-500">
            Bij Clinic Edition zit de injectie op huidkliniek [jouw stad]. Meer
            over{" "}
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
        </Reveal>
      </div>
    </section>
  );
}

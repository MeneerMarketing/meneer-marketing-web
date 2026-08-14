"use client";

import { useState } from "react";
import { MapPinned, RotateCcw, Search, Sparkles } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";

const intents = [
  {
    id: "kliniek-stad",
    icon: Search,
    label: "Huidkliniek + stad",
    body: "Mensen die een kliniek in de buurt willen, niet een landelijke ketenpagina.",
  },
  {
    id: "behandeling",
    icon: Sparkles,
    label: "Behandeling + stad",
    body: "Wie een specifieke behandeling zoekt, landt sneller als die pagina lokaal en concreet is.",
  },
  {
    id: "maps",
    icon: MapPinned,
    label: "Maps",
    body: "“Open nu”, reviews en route bepalen of iemand belt of doorscrollt naar de volgende pin.",
  },
  {
    id: "nazorg",
    icon: RotateCcw,
    label: "Nazorg / herhaal",
    body: "Terugkerende cliënten zoeken jouw naam, jouw locatie of nazorg na de eerste afspraak.",
  },
] as const;

export function HuidkliniekIntent() {
  const [active, setActive] = useState<(typeof intents)[number]["id"]>(
    intents[0]!.id,
  );
  const current = intents.find((i) => i.id === active) ?? intents[0]!;
  const query =
    HUIDKLINIEKEN_VERTICAL.localSeoExamples.queries[0] ?? "huidkliniek Utrecht";

  return (
    <section
      className="border-b border-stone-200 bg-[#0f1419] text-white"
      aria-labelledby="huidkliniek-intent-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
              Zoekintentie
            </p>
            <h2
              id="huidkliniek-intent-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
            >
              Wat Google écht zoekt bij huid
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Ik help je kliniek gevonden worden en afspraken binnenhalen.
              Behandelclaims en medische beloftes blijven bij jou en je
              specialisten.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <Reveal delay={0.05}>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {intents.map((intent) => {
                const Icon = intent.icon;
                const selected = intent.id === active;
                return (
                  <button
                    key={intent.id}
                    type="button"
                    onClick={() => setActive(intent.id)}
                    className={
                      selected
                        ? "rounded-2xl border border-orange-400/40 bg-white/10 px-4 py-4 text-left transition"
                        : "rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
                    }
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={
                          selected
                            ? "mt-0.5 size-4 shrink-0 text-orange-300"
                            : "mt-0.5 size-4 shrink-0 text-slate-400"
                        }
                        aria-hidden
                      />
                      <div>
                        <p className="text-sm font-extrabold tracking-tight">
                          {intent.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {intent.body}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white text-slate-900 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.65)]">
              <div className="border-b border-slate-100 bg-slate-50 px-4 pb-3 pt-4">
                <div className="flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/google-logo.png"
                    alt="Google"
                    width={96}
                    height={32}
                    className="h-7 w-auto bg-transparent"
                    draggable={false}
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                  <GoogleLogoMark className="size-4 shrink-0" />
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                    {query}
                  </p>
                  <Search className="size-3.5 shrink-0 text-slate-400" aria-hidden />
                </div>
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <div>
                  <p className="text-xs text-slate-500">Sponsored · Maps</p>
                  <p className="mt-2 text-lg font-bold text-blue-800">
                    Jouw kliniek · {current.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {current.body}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-emerald-700">
                    Open · Route · Bel · Website
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Organisch resultaat
                  </p>
                  <p className="mt-2 text-base font-bold text-blue-800">
                    Behandelingen & intake · jouwkliniek.nl
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Helder aanbod, rustige toon, directe knop naar consult. Zo
                    hoort een kliniek online te landen.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

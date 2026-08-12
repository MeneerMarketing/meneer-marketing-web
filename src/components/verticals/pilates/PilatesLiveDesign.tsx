"use client";

import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";

const arts = PILATES_VERTICAL.artDirections;

const PREVIEW_UI: Record<
  string,
  { nav: string; hero: string; accent: string }
> = {
  editorial: {
    nav: "Editorial · Lessen · Studio",
    hero: "Move with intention",
    accent: "linear-gradient(145deg, #1e293b 0%, #334155 42%, #FF5722 130%)",
  },
  "reformer-minimal": {
    nav: "Reformer · Book · Visit",
    hero: "Precision on the reformer",
    accent: "linear-gradient(145deg, #0f172a 0%, #1e3a2f 52%, #94a3b8 130%)",
  },
  "soft-movement": {
    nav: "Soft · Classes · Join",
    hero: "Warmth in every class",
    accent: "linear-gradient(145deg, #292524 0%, #44403c 48%, #fbbf24 140%)",
  },
};

export function PilatesLiveDesign() {
  return (
    <section
      id="live-design"
      className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white"
      aria-labelledby="pilates-live-design-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 0%, rgba(255,87,34,0.25), transparent 55%), radial-gradient(ellipse 40% 40% at 90% 80%, rgba(14,165,233,0.15), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
            Live Pilates design
          </p>
          <h2
            id="pilates-live-design-heading"
            className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.06]"
          >
            Drie art directions.
            <span className="mt-1 block text-orange-300">
              Eén wordt van jouw studio.
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Gespecialiseerde Pilates foundation. Jij kiest de richting. Ik zet
            logo, kleuren, fotografie, lessen, plaats en booking erin tot het
            als jouw studio voelt.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:mt-14 lg:grid-cols-3">
          {arts.map((art, i) => {
            const ui = PREVIEW_UI[art.id] ?? PREVIEW_UI.editorial!;
            return (
              <Reveal key={art.id} delay={i * 0.07}>
                <a
                  href={art.demoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackPilatesEvent("pilates_demo_click", {
                      location: "live_design",
                      variant: art.id,
                    })
                  }
                  className="group flex h-full flex-col rounded-3xl border border-white/15 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-orange-400/50 hover:bg-white/[0.07] sm:p-6"
                >
                  <div className="relative mb-5 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                    <div className="flex items-center gap-1 border-b border-white/10 px-2.5 py-1.5">
                      <span className="size-1.5 rounded-full bg-white/25" />
                      <span className="size-1.5 rounded-full bg-white/25" />
                      <span className="size-1.5 rounded-full bg-white/25" />
                      <span className="ml-2 truncate text-[9px] text-white/40">
                        {ui.nav}
                      </span>
                    </div>
                    <div
                      className="relative aspect-[16/10] transition duration-500 group-hover:scale-[1.02]"
                      style={{ background: ui.accent }}
                    >
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                          Studio Edition
                        </p>
                        <p className="mt-1 text-sm font-extrabold text-white">
                          {ui.hero}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight">
                    {art.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                    {art.blurb}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-orange-300 transition group-hover:text-orange-200">
                    Open live demo
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-slate-400">
              Foundation, geen templatelijst. Ik bouw hem om tot jouw merk.
            </p>
            <a
              href={PILATES_VERTICAL.demo.primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackPilatesEvent("pilates_demo_click", {
                  location: "live_design_cta",
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold tracking-tight text-slate-900 transition hover:bg-orange-50"
            >
              Bekijk volledige demo
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

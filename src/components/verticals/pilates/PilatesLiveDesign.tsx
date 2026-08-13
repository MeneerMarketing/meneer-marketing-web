"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";

const arts = PILATES_VERTICAL.artDirections;

type ArtId = (typeof arts)[number]["id"];

const EASE = [0.22, 1, 0.36, 1] as const;

const DIRECTION_META: Record<
  ArtId,
  {
    vibe: string;
    feel: string;
    typeLabel: string;
    accent: string;
    studioName: string;
  }
> = {
  editorial: {
    vibe: "Magazine-energie",
    feel: "Alsof je studio in een designmag staat. En toch met één klik boekt.",
    typeLabel: "Display · editorial",
    accent: "#FF5722",
    studioName: "FORMA",
  },
  "reformer-minimal": {
    vibe: "Architecturaal rustig",
    feel: "Strak als een interieurproject. Reformer eerst, ruis later.",
    typeLabel: "Grid · minimal",
    accent: "#94a3b8",
    studioName: "LINEA",
  },
  "soft-movement": {
    vibe: "Warm & organisch",
    feel: "Zacht genoeg om al bijna op de mat te liggen. Nog steeds premium.",
    typeLabel: "Soft · rounded",
    accent: "#d97706",
    studioName: "ATELIER",
  },
};

function ArtDirectionStage({ id }: { id: ArtId }) {
  if (id === "editorial") {
    return (
      <div className="relative flex h-full min-h-[360px] flex-col bg-[#f4f0ea] text-slate-900 sm:min-h-[440px] lg:min-h-[500px]">
        <div className="flex items-center justify-between border-b border-slate-900/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:px-8">
          <span>{DIRECTION_META.editorial.studioName}</span>
          <span className="hidden sm:inline">Lessen · Studio · Prijzen</span>
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[9px] text-white">
            Boek
          </span>
        </div>
        <div className="grid flex-1 grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-between p-5 sm:p-9 lg:p-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                Arnhem · Reformer
              </p>
              <h4 className="mt-4 max-w-[11ch] text-[2rem] font-extrabold leading-[0.95] tracking-tight sm:text-[3rem] lg:text-[3.6rem]">
                Move with intention.
              </h4>
              <div className="mt-5 h-px w-20 bg-[#FF5722]" />
              <p className="mt-5 max-w-[34ch] text-xs leading-relaxed text-slate-600 sm:text-sm">
                Premium typografie. Weinig ruis. Ruimte om te ademen, met een
                boekknop die altijd binnen bereik blijft.
              </p>
            </div>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Volgende les · 18:30 Reformer
            </p>
          </div>
          <div className="relative m-3 overflow-hidden rounded-2xl bg-slate-900 sm:m-6">
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  "linear-gradient(160deg, #1e293b 0%, #334155 45%, #FF5722 160%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200">
                Featured
              </p>
              <p className="mt-1 text-sm font-extrabold text-white">
                Private session
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "reformer-minimal") {
    return (
      <div className="relative flex h-full min-h-[360px] flex-col bg-[#0b1220] text-white sm:min-h-[440px] lg:min-h-[500px]">
        <div className="grid grid-cols-4 border-b border-white/10 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {["Studio", "Reformer", "Mat", "Book"].map((item) => (
            <span
              key={item}
              className="border-r border-white/10 px-3 py-3 last:border-r-0 sm:px-6"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-2">
          <div className="flex flex-col justify-between border-r border-white/10 p-5 sm:p-9 lg:p-12">
            <div>
              <p className="font-mono text-[10px] tracking-widest text-slate-500">
                REFORMER / STUDIO
              </p>
              <h4 className="mt-5 text-[1.8rem] font-extrabold leading-[1.02] tracking-tight sm:text-[2.6rem] lg:text-[3.1rem]">
                Precision
                <span className="mt-1 block text-slate-400">
                  on the machine.
                </span>
              </h4>
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-px w-full bg-white/15" />
              <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span>Open slots vandaag</span>
                <span className="text-emerald-300">Vier</span>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col p-5 sm:p-9 lg:p-12">
            <div className="absolute left-0 top-10 h-px w-12 bg-[#FF5722]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {DIRECTION_META["reformer-minimal"].studioName}
            </p>
            <div className="mt-auto grid gap-2">
              {["09:30 · Reformer", "11:00 · Tower", "18:30 · Private"].map(
                (row) => (
                  <div
                    key={row}
                    className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[11px] font-semibold sm:px-4 sm:py-3"
                  >
                    <span className="text-slate-300">{row}</span>
                    <span className="text-[#FF5722]">→</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[360px] flex-col bg-[#f7efe6] text-stone-900 sm:min-h-[440px] lg:min-h-[500px]">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <span className="text-sm font-extrabold tracking-tight">
          {DIRECTION_META["soft-movement"].studioName}
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
          Soft Movement
        </span>
      </div>
      <div className="grid flex-1 gap-6 px-5 pb-5 sm:grid-cols-[1fr_0.9fr] sm:px-8 sm:pb-8 lg:px-12 lg:pb-12">
        <div className="flex flex-col justify-center">
          <h4 className="max-w-[13ch] text-[1.9rem] font-extrabold leading-[1.05] tracking-tight text-stone-800 sm:text-[2.6rem] lg:text-[3.1rem]">
            Warmth in every class.
          </h4>
          <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-stone-600">
            Organische vormen. Zachte focus. Alsof de site al ademt, terwijl
            boeken toch in twee tikken klaar is.
          </p>
          <div className="mt-6 w-fit rounded-full bg-stone-900 px-6 py-3 text-xs font-bold text-white">
            Reserveer je plek
          </div>
        </div>
        <div className="grid gap-3 sm:grid-rows-2">
          <div className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm ring-1 ring-stone-200/80 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Mat
            </p>
            <p className="mt-2 text-sm font-bold">Flow · 55 min</p>
            <p className="mt-1 text-xs text-stone-500">Nog drie plekken</p>
          </div>
          <div className="rounded-[1.5rem] bg-gradient-to-br from-amber-200/80 to-orange-100 p-4 shadow-sm sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">
              Reformer
            </p>
            <p className="mt-2 text-sm font-bold text-stone-900">Evening glow</p>
            <p className="mt-1 text-xs text-stone-700/80">18:30 · open</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PilatesLiveDesign() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState<ArtId>(arts[0]!.id);
  const active = arts.find((a) => a.id === activeId) ?? arts[0]!;
  const meta = DIRECTION_META[activeId];

  function select(id: ArtId, track = true) {
    setActiveId(id);
    if (!track) return;
    trackPilatesEvent("pilates_demo_click", {
      location: "live_design_picker",
      variant: id,
      interaction: "select",
    });
  }

  return (
    <section
      id="live-design"
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="pilates-live-design-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,23,42,0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Live Pilates design
            </p>
            <h2
              id="pilates-live-design-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.06]"
            >
              Tik een vibe.
              <span className="text-[#FF5722]"> Zie jouw studio verschijnen.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Drie art directions op één Pilates foundation. Jij kiest de
              richting. Ik zet logo, kleuren, foto&apos;s, lessen en booking erin
              tot het écht van jou voelt.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Art directions"
          >
            {arts.map((art) => {
              const selected = activeId === art.id;
              const m = DIRECTION_META[art.id];
              return (
                <button
                  key={art.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => select(art.id)}
                  onMouseEnter={() => {
                    if (!reduce) select(art.id, false);
                  }}
                  className={
                    selected
                      ? "group flex items-center gap-2.5 rounded-full bg-slate-900 px-4 py-2.5 text-white transition sm:px-5"
                      : "group flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-slate-700 transition hover:border-slate-300 hover:shadow-sm sm:px-5"
                  }
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: m.accent }}
                    aria-hidden
                  />
                  <span className="text-sm font-extrabold tracking-tight">
                    {art.name}
                  </span>
                  <span
                    className={
                      selected
                        ? "hidden text-[11px] font-semibold text-slate-400 sm:inline"
                        : "hidden text-[11px] font-semibold text-slate-400 sm:inline"
                    }
                  >
                    {m.vibe}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Wide cinematic stage */}
        <Reveal delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-900 shadow-[0_36px_90px_-40px_rgba(15,23,42,0.5)]">
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-slate-900 px-4 py-3">
              <span className="size-2.5 rounded-full bg-rose-400/70" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 truncate rounded-md bg-white/5 px-3 py-1 text-[10px] font-medium text-slate-400">
                jouwstudio.nl · {meta.typeLabel}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <ArtDirectionStage id={activeId} />
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              <span className="font-extrabold text-slate-900">
                {active.name}:
              </span>{" "}
              {meta.feel}
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={active.demoHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackPilatesEvent("pilates_demo_click", {
                    location: "live_design",
                    variant: activeId,
                  })
                }
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FF5722] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
              >
                Open deze demo
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <a
                href={PILATES_VERTICAL.demo.primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackPilatesEvent("pilates_demo_click", {
                    location: "live_design_cta",
                  })
                }
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:border-[#FF5722] hover:text-[#FF5722]"
              >
                Alle demos
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

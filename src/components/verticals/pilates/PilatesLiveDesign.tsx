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
      <div className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[1.75rem] bg-[#f4f0ea] text-slate-900 shadow-inner sm:min-h-[400px]">
        <div className="flex items-center justify-between border-b border-slate-900/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <span>{DIRECTION_META.editorial.studioName}</span>
          <span className="hidden sm:inline">Lessen · Studio · Prijzen</span>
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[9px] text-white">
            Boek
          </span>
        </div>
        <div className="grid flex-1 grid-cols-[1.15fr_0.85fr] gap-0">
          <div className="flex flex-col justify-between p-5 sm:p-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                Arnhem · Reformer
              </p>
              <h4 className="mt-3 max-w-[10ch] text-[1.85rem] font-extrabold leading-[0.95] tracking-tight sm:text-[2.35rem]">
                Move with intention.
              </h4>
              <div className="mt-4 h-px w-16 bg-[#FF5722]" />
              <p className="mt-4 max-w-[28ch] text-xs leading-relaxed text-slate-600 sm:text-sm">
                Premium typografie. Weinig ruis. Ruimte om te ademen.
              </p>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Volgende les · 18:30 Reformer
            </p>
          </div>
          <div className="relative m-3 overflow-hidden rounded-2xl bg-slate-900 sm:m-4">
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  "linear-gradient(160deg, #1e293b 0%, #334155 45%, #FF5722 160%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4">
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
      <div className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[1.75rem] bg-[#0b1220] text-white shadow-inner sm:min-h-[400px]">
        <div className="grid grid-cols-4 border-b border-white/10 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {["Studio", "Reformer", "Mat", "Book"].map((item) => (
            <span
              key={item}
              className="border-r border-white/10 px-3 py-3 last:border-r-0"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-2">
          <div className="flex flex-col justify-between border-r border-white/10 p-5 sm:p-7">
            <div>
              <p className="font-mono text-[10px] tracking-widest text-slate-500">
                01 / REFORMER
              </p>
              <h4 className="mt-4 text-2xl font-extrabold leading-[1.02] tracking-tight sm:text-[2.1rem]">
                Precision
                <span className="mt-1 block text-slate-400">on the machine.</span>
              </h4>
            </div>
            <div className="space-y-2">
              <div className="h-px w-full bg-white/15" />
              <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span>Open slots</span>
                <span className="text-emerald-300">04</span>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col p-5 sm:p-7">
            <div className="absolute left-0 top-8 h-px w-10 bg-[#FF5722]" />
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {DIRECTION_META["reformer-minimal"].studioName}
            </p>
            <div className="mt-auto grid gap-2">
              {["09:30 · Reformer", "11:00 · Tower", "18:30 · Private"].map(
                (row) => (
                  <div
                    key={row}
                    className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[11px] font-semibold"
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
    <div className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[1.75rem] bg-[#f7efe6] text-stone-900 shadow-inner sm:min-h-[400px]">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-extrabold tracking-tight">
          {DIRECTION_META["soft-movement"].studioName}
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
          Soft Movement
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 sm:px-7 sm:pb-7">
        <h4 className="max-w-[12ch] text-[1.9rem] font-extrabold leading-[1.05] tracking-tight text-stone-800 sm:text-[2.3rem]">
          Warmth in every class.
        </h4>
        <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-stone-600">
          Organische vormen. Zachte focus. Alsof de site al ademt.
        </p>
        <div className="mt-6 grid flex-1 grid-cols-2 gap-3">
          <div className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm ring-1 ring-stone-200/80">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Mat
            </p>
            <p className="mt-2 text-sm font-bold">Flow · 55 min</p>
            <p className="mt-1 text-xs text-stone-500">Nog 3 plekken</p>
          </div>
          <div className="rounded-[1.5rem] bg-gradient-to-br from-amber-200/80 to-orange-100 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">
              Reformer
            </p>
            <p className="mt-2 text-sm font-bold text-stone-900">Evening glow</p>
            <p className="mt-1 text-xs text-stone-700/80">18:30 · open</p>
          </div>
        </div>
        <div className="mt-4 rounded-full bg-stone-900 py-3 text-center text-xs font-bold text-white">
          Reserveer je plek
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
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      aria-labelledby="pilates-live-design-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.05) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Live Pilates design
          </p>
          <h2
            id="pilates-live-design-heading"
            className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.06]"
          >
            Tik een vibe.
            <span className="mt-1 block text-[#FF5722]">
              Zie hoe jouw studio eruit kan zien.
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Drie art directions op één Pilates foundation. Jij kiest de
            richting. Ik zet logo, kleuren, foto&apos;s, lessen en booking erin
            tot het écht van jou voelt.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch lg:gap-8">
          {/* Picker */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200/90 bg-white p-5 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.2)] sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Kies je art direction
              </p>
              <div
                className="mt-4 flex flex-1 flex-col gap-2.5"
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
                          ? "group flex flex-1 flex-col justify-center rounded-2xl border-2 border-slate-900 bg-slate-900 px-4 py-4 text-left text-white transition sm:px-5"
                          : "group flex flex-1 flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-slate-900 transition hover:border-slate-300 hover:bg-white sm:px-5"
                      }
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-base font-extrabold tracking-tight sm:text-lg">
                          {art.name}
                        </span>
                        <span
                          className={
                            selected
                              ? "rounded-full bg-[#FF5722] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
                              : "rounded-full bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 ring-1 ring-slate-200"
                          }
                        >
                          {m.vibe}
                        </span>
                      </span>
                      <span
                        className={
                          selected
                            ? "mt-2 text-sm leading-relaxed text-slate-300"
                            : "mt-2 text-sm leading-relaxed text-slate-500"
                        }
                      >
                        {art.blurb}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                Hover of tik. De preview rechts verandert mee. Live demo
                opent in een nieuw tabblad.
              </p>
            </div>
          </Reveal>

          {/* Stage */}
          <Reveal delay={0.08} className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200/90 bg-white p-4 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.25)] sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
                      {meta.typeLabel}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {meta.feel}
                    </p>
                  </motion.div>
                </AnimatePresence>
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: meta.accent }}
                  aria-hidden
                />
              </div>

              <div className="relative flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    initial={reduce ? false : { opacity: 0, scale: 0.985, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.99, y: -8 }}
                    transition={{ duration: 0.32, ease: EASE }}
                    className="h-full"
                  >
                    <ArtDirectionStage id={activeId} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-slate-500">
                  Foundation die ik ombouw tot jouw merk. Logo, kleur, foto&apos;s,
                  lessen, stad.
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
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#FF5722] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
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
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:border-[#FF5722] hover:text-[#FF5722]"
                  >
                    Alle demos
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { trackHuidkliniekEvent } from "@/lib/verticals/analytics";

const arts = HUIDKLINIEKEN_VERTICAL.artDirections;

type ArtId = (typeof arts)[number]["id"];

const EASE = [0.22, 1, 0.36, 1] as const;

const DIRECTION_META: Record<
  ArtId,
  { vibe: string; accent: string }
> = {
  editorial: {
    vibe: "Magazine · binnenkort",
    accent: "#9C6B45",
  },
  "reformer-minimal": {
    vibe: "Warm licht · binnenkort",
    accent: "#C4A484",
  },
  "soft-movement": {
    vibe: "Donker premium · binnenkort",
    accent: "#E8D5C4",
  },
};

function ConceptStage({ artId }: { artId: ArtId }) {
  if (artId === "editorial") {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f3ebe1] sm:aspect-[16/9.2]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 15% 20%, rgba(156,107,69,0.12), transparent 50%), linear-gradient(180deg, #f8f4ee 0%, #efe6da 100%)",
          }}
        />
        <div className="absolute inset-6 grid gap-4 sm:inset-8 sm:grid-cols-[1.1fr_0.9fr] sm:gap-6">
          <div className="flex flex-col justify-between rounded-2xl border border-[#d9cbb8]/80 bg-[#faf6f0]/90 p-5 shadow-sm sm:p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9C6B45]">
                Clinical Editorial
              </p>
              <p className="mt-3 max-w-[16ch] text-2xl font-extrabold leading-[1.05] tracking-tight text-[#2c2217] sm:text-3xl">
                Behandelingen als magazine spreads.
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5c4f42]">
                Warm bone, cream en typografie met punch. Kliniek die rust
                uitstraalt en toch scherp blijft.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Intake", "Huidverbetering", "Team"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[#cbb9a4] bg-white/70 px-3 py-1 text-[11px] font-semibold text-[#45382c]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden flex-col gap-3 sm:flex">
            <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#dcc9b4] via-[#f0e6da] to-[#c9b49a] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b5340]/80">
                Spread
              </p>
              <p className="mt-2 text-lg font-extrabold text-[#2c2217]">
                Laser & licht
              </p>
            </div>
            <div className="h-24 rounded-2xl border border-[#d9cbb8] bg-white/80 p-4">
              <p className="text-xs font-bold text-[#2c2217]">Boek een consult</p>
              <p className="mt-1 text-[11px] text-[#6b5340]">
                Van Google naar agenda in één pad
              </p>
            </div>
          </div>
        </div>
        <span className="absolute right-4 top-4 rounded-full bg-[#2c2217] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f8f4ee]">
          Binnenkort
        </span>
      </div>
    );
  }

  if (artId === "reformer-minimal") {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#faf7f2] sm:aspect-[16/9.2]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 70% 30%, rgba(255,214,170,0.45), transparent 55%), linear-gradient(160deg, #fffaf5 0%, #f3e8dc 55%, #e8d8c8 100%)",
          }}
        />
        <div className="absolute inset-6 flex flex-col justify-between sm:inset-10">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c52]">
              Soft Clinical
            </p>
            <p className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#3a2f26] sm:text-4xl">
              Warm licht. Zachte materialen. Heldere zorg.
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6a5a4a] sm:text-base">
              Soft warm light zonder soft-focus fluff. Een kliniek die rustig
              voelt en toch premium oogt.
            </p>
          </div>
          <div className="grid max-w-lg grid-cols-3 gap-2 sm:gap-3">
            {[
              { t: "Consult", d: "30 min" },
              { t: "Peeling", d: "45 min" },
              { t: "Nazorg", d: "Online" },
            ].map((card) => (
              <div
                key={card.t}
                className="rounded-2xl border border-white/70 bg-white/75 px-3 py-3 shadow-sm backdrop-blur-sm"
              >
                <p className="text-xs font-extrabold text-[#3a2f26]">{card.t}</p>
                <p className="mt-1 text-[11px] text-[#8a7460]">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
        <span className="absolute right-4 top-4 rounded-full bg-[#3a2f26] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#fffaf5]">
          Binnenkort
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c0a09] sm:aspect-[16/9.2]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 80% 10%, rgba(232,213,196,0.18), transparent 50%), linear-gradient(180deg, #12100e 0%, #1a1613 55%, #0c0a09 100%)",
        }}
      />
      <div className="absolute inset-6 flex flex-col justify-between sm:inset-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e8d5c4]/80">
            Precision Dark
          </p>
          <p className="mt-3 max-w-[18ch] text-2xl font-extrabold leading-tight tracking-tight text-[#f7f1ea] sm:text-4xl">
            Donkere precisie. High-end cosmetische kliniek.
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#b8a99a] sm:text-base">
            Scherp, rustig, premium. Voor klinieken die zwart, brons en stilte
            als signature willen.
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["Laser", "Injectables", "Huidanalyse"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-[#e8d5c4]"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="rounded-2xl border border-[#e8d5c4]/25 bg-[#e8d5c4]/10 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#e8d5c4]">
              Afspraak
            </p>
            <p className="mt-1 text-sm font-extrabold text-white">
              Intake vandaag · 16:30
            </p>
          </div>
        </div>
      </div>
      <span className="absolute right-4 top-4 rounded-full bg-[#e8d5c4] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#12100e]">
        Binnenkort
      </span>
    </div>
  );
}

export function HuidkliniekLiveDesign() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState<ArtId>(arts[0]!.id);
  const active = arts.find((a) => a.id === activeId) ?? arts[0]!;
  const meta = DIRECTION_META[activeId];

  function select(id: ArtId, track = true) {
    setActiveId(id);
    if (!track) return;
    trackHuidkliniekEvent("huidkliniek_demo_click", {
      location: "live_design_picker",
      variant: id,
      interaction: "select",
    });
  }

  return (
    <section
      id="live-design"
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="Huidkliniek-live-design-heading"
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
              Local Growth Engine · templates
            </p>
            <h2
              id="Huidkliniek-live-design-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.06]"
            >
              Kliniek-richtingen in wording
              <span className="text-[#FF5722]"> Clinical · Soft · Dark.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Drie concepten voor huid- en cosmetische klinieken. Zodra Template
              1 live staat in de engine, komt die hier exact binnen. Nu al
              kiezen we de vibe die bij jouw behandelkamer past.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Huidkliniek templates"
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
                    className={
                      selected
                        ? "flex size-5 items-center justify-center rounded-full bg-[#FF5722] text-[10px] font-extrabold text-white"
                        : "flex size-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-extrabold text-slate-600"
                    }
                  >
                    {art.shortLabel ?? "·"}
                  </span>
                  <span className="text-sm font-extrabold tracking-tight">
                    {art.name}
                  </span>
                  <span className="hidden text-[11px] font-semibold text-slate-400 sm:inline">
                    {m.vibe}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-900 shadow-[0_36px_90px_-40px_rgba(15,23,42,0.5)]">
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-slate-900 px-4 py-3">
              <span className="size-2.5 rounded-full bg-rose-400/70" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 flex min-w-0 flex-1 items-center gap-2 truncate rounded-md bg-white/5 px-3 py-1 text-[10px] font-medium text-slate-400">
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: meta.accent }}
                  aria-hidden
                />
                <span className="truncate">
                  Concept · {active.name} · binnenkort live
                </span>
              </span>
              <span className="hidden shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200/90 sm:inline">
                Binnenkort
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <ConceptStage artId={activeId} />
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              <span className="font-extrabold text-slate-900">
                Template {active.shortLabel} · {active.name}:
              </span>{" "}
              {active.blurb}
            </p>
            <a
              href="#aanvraag"
              onClick={() =>
                trackHuidkliniekEvent("huidkliniek_demo_click", {
                  location: "live_design",
                  variant: activeId,
                })
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FF5722] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
            >
              Stuur mijn kliniek door
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


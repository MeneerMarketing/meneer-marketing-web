"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";

const arts = PILATES_VERTICAL.artDirections;

type ArtId = (typeof arts)[number]["id"];

const EASE = [0.22, 1, 0.36, 1] as const;

/** Desktop artboard; scaled with object-fit:cover math to fill the stage. */
const FRAME_W = 1440;
const FRAME_H = 900;

const DIRECTION_META: Record<
  ArtId,
  { vibe: string; accent: string }
> = {
  editorial: {
    vibe: "Magazine · klaar",
    accent: "#9C6B45",
  },
  "reformer-minimal": {
    vibe: "Full screen · Figma",
    accent: "#64748b",
  },
  "soft-movement": {
    vibe: "Warm · organisch",
    accent: "#d97706",
  },
};

function LiveTemplateFrame({ src, title }: { src: string; title: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      // Cover: always fill the whole block (may crop a bit on one axis).
      setScale(Math.max(width / FRAME_W, height / FRAME_H));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 sm:aspect-[16/9.2]"
    >
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{
          width: FRAME_W,
          height: FRAME_H,
          transform: `scale(${scale})`,
        }}
      >
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0 bg-[#f8f4ee]"
          tabIndex={-1}
        />
      </div>

      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10 flex items-end justify-center bg-gradient-to-t from-slate-950/55 via-transparent to-transparent pb-5 transition hover:from-slate-950/70 sm:pb-6"
        onClick={() =>
          trackPilatesEvent("pilates_demo_click", {
            location: "live_design_stage",
            variant: title,
          })
        }
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg">
          <Maximize2 className="size-4 text-[#FF5722]" aria-hidden />
          Open volledige template
        </span>
      </a>
    </div>
  );
}

export function PilatesLiveDesign() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState<ArtId>(arts[0]!.id);
  const active = arts.find((a) => a.id === activeId) ?? arts[0]!;
  const meta = DIRECTION_META[activeId];
  const path = active.demoHref.replace("https://preview.meneermarketing.nl", "");

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
              Local Growth Engine · templates
            </p>
            <h2
              id="pilates-live-design-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.06]"
            >
              Dit zijn de echte Pilates templates.
              <span className="text-[#FF5722]"> Live uit de engine.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Template 1 (Editorial) staat klaar. Tik een richting en je ziet
              de echte preview. Logo, kleuren, foto&apos;s en booking zetten we
              daarna om naar jouw studio.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Pilates templates"
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
                  preview.meneermarketing.nl{path}
                </span>
              </span>
              <a
                href={active.demoHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
                onClick={() =>
                  trackPilatesEvent("pilates_demo_click", {
                    location: "live_design_chrome",
                    variant: activeId,
                  })
                }
              >
                Live
                <ExternalLink className="size-3" aria-hidden />
              </a>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <LiveTemplateFrame
                  src={active.demoHref}
                  title={`${active.name} · Template ${active.shortLabel ?? ""}`}
                />
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
                Open deze template
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
                Template 1 fullscreen
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

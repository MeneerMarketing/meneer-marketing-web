"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, MousePointerClick, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { OfficeScene } from "@/components/home/office/OfficeScene";
import { OFFICE_PILLARS, type OfficePillar } from "@/data/services-office";
import { BRAND_DISPLAY } from "@/lib/seo/e-e-a-t";
import type { PillarSlug } from "@/lib/navigation";

const ZOOM_SCALE = 2;

interface CameraState {
  x: number;
  y: number;
  scale: number;
  originX: number;
  originY: number;
}

const CAMERA_HOME: CameraState = { x: 0, y: 0, scale: 1, originX: 50, originY: 50 };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function PillarPanel({
  pillar,
  onClose,
}: {
  pillar: OfficePillar;
  onClose: () => void;
}) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white p-6 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.6)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Sluit dienstinformatie"
        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <X className="size-4" strokeWidth={2.4} />
      </button>

      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
        {pillar.label}
      </p>
      <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        {pillar.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.body}</p>

      <ul className="mt-4 divide-y divide-slate-100">
        {pillar.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-center justify-between gap-3 py-2.5 text-sm font-bold text-slate-800 transition hover:text-[#FF5722]"
            >
              {link.name}
              <ArrowUpRight
                className="size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF5722]"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={pillar.pillarHref}
        className="mt-4 block rounded-xl bg-[#FF5722] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#E64A19]"
      >
        Alles over {pillar.label.toLowerCase()}
      </Link>
    </div>
  );
}

/**
 * Diensten-sectie op de homepage: het kantoor van Meneer Marketing.
 * Cinematische letterbox-intro, klikbare objecten met camera-zoom en
 * een infopaneel per hoofddienst.
 */
export function ServicesOfficeSection() {
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, margin: "-15% 0px -15% 0px" });

  const [active, setActive] = useState<PillarSlug | null>(null);
  const [hovered, setHovered] = useState<PillarSlug | null>(null);
  const [camera, setCamera] = useState<CameraState>(CAMERA_HOME);

  const activePillar = active
    ? (OFFICE_PILLARS.find((p) => p.id === active) ?? null)
    : null;

  const select = useCallback(
    (id: PillarSlug) => {
      const pillar = OFFICE_PILLARS.find((p) => p.id === id);
      const frame = frameRef.current;
      if (!pillar || !frame) return;
      setActive(id);
      (document.activeElement as HTMLElement | null)?.blur?.();
      if (reduce) return;

      const rect = frame.getBoundingClientRect();
      const s = ZOOM_SCALE;
      // Object landt naast het paneel, niet eronder
      const targetX = pillar.panelSide === "right" ? 0.35 : 0.65;
      const targetY = 0.5;
      const tx = clamp(
        (targetX - pillar.x) * rect.width,
        -(1 - pillar.x) * rect.width * (s - 1),
        pillar.x * rect.width * (s - 1),
      );
      const ty = clamp(
        (targetY - pillar.y) * rect.height,
        -(1 - pillar.y) * rect.height * (s - 1),
        pillar.y * rect.height * (s - 1),
      );
      setCamera({
        x: tx,
        y: ty,
        scale: s,
        originX: pillar.x * 100,
        originY: pillar.y * 100,
      });
    },
    [reduce],
  );

  const close = useCallback(() => {
    setActive(null);
    setHovered(null);
    setCamera((prev) => ({ ...prev, x: 0, y: 0, scale: 1 }));
  }, []);

  useEffect(() => {
    if (!active) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, close]);

  const introDone = reduce || inView;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative overflow-hidden border-y border-slate-800 bg-slate-950 py-20 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,87,34,0.14),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Diensten
          </p>
          <div
            className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#FF5722]/50 to-transparent"
            aria-hidden
          />
          <h2
            id="services-heading"
            className="mt-5 text-4xl font-extrabold tracking-tighter text-white sm:text-5xl lg:text-[3.25rem]"
          >
            Stap het kantoor{" "}
            <span className="text-[#FF5722]">binnen.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
            Strategie, bouwen, vindbaarheid, campagnes en behoud. Vijf dingen die
            elk bedrijf nodig heeft. Vijf objecten in mijn kantoor die jouw
            bedrijf een boost geven.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 backdrop-blur-sm">
            <MousePointerClick className="size-4 shrink-0 text-[#FF5722]" aria-hidden />
            Klik op het bord, de laptop, het vergrootglas, de megafoon of de
            mailmachine
          </p>
        </div>

        <div className="relative mt-12">
          <div
            ref={frameRef}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#191E29] shadow-[0_48px_96px_-40px_rgba(0,0,0,0.8)]"
          >
            {/* Camera: zoomt in op het gekozen object */}
            <motion.div
              className="relative will-change-transform"
              style={{ transformOrigin: `${camera.originX}% ${camera.originY}%` }}
              animate={{ x: camera.x, y: camera.y, scale: camera.scale }}
              transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.9 }}
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 1.06 }}
                animate={introDone ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <OfficeScene
                  active={active}
                  hovered={hovered}
                  interactive={!active}
                  onSelect={select}
                  onHover={setHovered}
                />
              </motion.div>
            </motion.div>

            {/* Vignet als er een dienst open staat */}
            <motion.div
              className="pointer-events-none absolute inset-0 bg-slate-950"
              initial={{ opacity: 0 }}
              animate={{ opacity: active ? 0.42 : 0 }}
              transition={{ duration: 0.5 }}
              aria-hidden
            />

            {/* Klik naast het paneel om te sluiten */}
            {active ? (
              <button
                type="button"
                onClick={close}
                aria-label="Zoom uit en sluit dienstinformatie"
                className="absolute inset-0 z-10 cursor-zoom-out"
              />
            ) : null}

            {/* Letterbox-intro */}
            {reduce ? null : (
              <>
                <motion.div
                  className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[14%] origin-top bg-slate-950"
                  initial={{ scaleY: 1 }}
                  animate={introDone ? { scaleY: 0 } : undefined}
                  transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden
                />
                <motion.div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[14%] origin-bottom bg-slate-950"
                  initial={{ scaleY: 1 }}
                  animate={introDone ? { scaleY: 0 } : undefined}
                  transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden
                />
                <motion.p
                  className="pointer-events-none absolute inset-x-0 top-[4%] z-20 text-center font-mono text-[11px] uppercase tracking-[0.32em] text-slate-400"
                  initial={{ opacity: 1 }}
                  animate={introDone ? { opacity: 0 } : undefined}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  aria-hidden
                >
                  {BRAND_DISPLAY} presenteert
                </motion.p>
              </>
            )}

            {/* Infopaneel op desktop, over de scène */}
            <div
              className={`pointer-events-none absolute inset-y-0 z-30 hidden w-[min(400px,38%)] items-center px-6 lg:flex ${
                activePillar?.panelSide === "right" ? "right-0" : "left-0"
              }`}
            >
              <AnimatePresence mode="wait">
                {activePillar ? (
                  <motion.div
                    key={activePillar.id}
                    className="pointer-events-auto w-full"
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.15 }}
                  >
                    <PillarPanel pillar={activePillar} onClose={close} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* Infopaneel op mobiel, onder de scène */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              {activePillar ? (
                <motion.div
                  key={activePillar.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35 }}
                  className="mt-4"
                >
                  <PillarPanel pillar={activePillar} onClose={close} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Chips: werkt ook zonder muis of op touch */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {OFFICE_PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => (active === pillar.id ? close() : select(pillar.id))}
                aria-pressed={active === pillar.id}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  active === pillar.id
                    ? "border-[#FF5722] bg-[#FF5722] text-white"
                    : "border-white/15 text-slate-200 hover:border-white/35"
                }`}
              >
                {pillar.label}
              </button>
            ))}
            <Link
              href="/diensten"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-slate-400 transition hover:text-white"
            >
              Alle diensten
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

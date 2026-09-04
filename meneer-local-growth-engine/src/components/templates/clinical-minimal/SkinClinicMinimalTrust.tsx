"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { SkinClinicTrustPillar } from "@/components/templates/clinical-minimal/skinClinicMinimalModel";

type PillarIcon = "analysis" | "protocol" | "transparent" | "care";

function pillarIconFor(id: string): PillarIcon {
  if (id.includes("analysis")) return "analysis";
  if (id.includes("protocol")) return "protocol";
  if (id.includes("transparent")) return "transparent";
  return "care";
}

function PillarIcon({ type, active }: { type: PillarIcon; active: boolean }) {
  const stroke = active ? "var(--fc-accent-deep)" : "var(--fc-ink-mute)";

  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
        active
          ? "border-[var(--fc-accent-deep)]/30 bg-[var(--fc-accent-soft)]"
          : "border-[var(--fc-line)] bg-[var(--fc-paper)]"
      }`}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke={stroke}
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === "analysis" ? (
          <>
            <circle cx="10.5" cy="10.5" r="5.5" />
            <path d="M15.5 15.5 21 21" />
            <path d="M8.5 10.5h4" />
            <path d="M10.5 8.5v4" />
          </>
        ) : null}
        {type === "protocol" ? (
          <>
            <path d="M12 3 4 7v6c0 4.4 3.6 8 8 8s8-3.6 8-8V7l-8-4z" />
            <path d="M9 12l2 2 4-4" />
          </>
        ) : null}
        {type === "transparent" ? (
          <>
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
            <path d="M9 14h6" />
            <path d="M9 18h4" />
          </>
        ) : null}
        {type === "care" ? (
          <>
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 3v6h-6" />
            <path d="M12 8v4l2.5 1.5" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

export function SkinClinicMinimalTrust({
  pillars,
}: {
  pillars: SkinClinicTrustPillar[];
}) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  if (pillars.length === 0) return null;

  const safeIndex = activeIndex % pillars.length;
  const active = pillars[safeIndex]!;

  return (
    <section className="relative overflow-hidden border-y border-[var(--fc-line)] bg-[var(--fc-paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 100% 0%, color-mix(in srgb, var(--fc-accent-deep) 7%, transparent), transparent 65%)",
        }}
      />

      <div className="relative mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-[5vw] lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <ScrollReveal className="lg:col-span-5">
            <p className="figma-label text-[var(--fc-label)]">Onze aanpak</p>
            <h2 className="figma-display-l mt-3 max-w-[16ch]">
              <span className="font-bold">Zorg die</span>{" "}
              <span className="font-light text-[var(--fc-ink-soft)]">meetbaar voelt</span>
            </h2>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-7 text-[var(--fc-ink-soft)]">
              Vier pijlers die elke behandeling dragen. Klik een stap om het verhaal en beeld
              te zien.
            </p>

            <div className="mt-8 flex flex-col gap-2">
              {pillars.map((pillar, index) => {
                const isActive = index === safeIndex;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`group flex w-full items-start gap-4 rounded-[var(--fc-radius)] border p-4 text-left transition-all duration-300 sm:p-5 ${
                      isActive
                        ? "border-[var(--fc-accent-deep)]/30 bg-[var(--fc-mist)] shadow-[0_16px_40px_-28px_rgba(20,16,12,0.35)]"
                        : "border-[var(--fc-line)] bg-[var(--fc-paper)] hover:border-[var(--fc-accent-deep)]/18 hover:bg-[var(--fc-wash)]"
                    }`}
                  >
                    <PillarIcon type={pillarIconFor(pillar.id)} active={isActive} />
                    <span className="min-w-0 flex-1">
                      <span className="figma-label text-[var(--fc-ink-faint)]">{pillar.tag}</span>
                      <span
                        className={`mt-1 block text-base font-semibold tracking-tight transition-colors ${
                          isActive ? "text-[var(--fc-ink)]" : "text-[var(--fc-ink-soft)]"
                        }`}
                      >
                        {pillar.title}
                      </span>
                      <span
                        className={`mt-2 block text-sm leading-6 transition-all duration-300 ${
                          isActive
                            ? "max-h-24 text-[var(--fc-ink-soft)] opacity-100"
                            : "max-h-0 overflow-hidden opacity-0 lg:max-h-none lg:opacity-70"
                        }`}
                      >
                        {pillar.body}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          <div className="lg:col-span-7">
            <ScrollReveal delayMs={80}>
              <div className="relative overflow-hidden rounded-[var(--fc-radius-lg)] border border-[var(--fc-line)] bg-[var(--fc-mist)]">
                <div className="relative aspect-[16/11] sm:aspect-[16/10]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.id}
                      initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={active.image.url}
                        alt={active.image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 52vw"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/18 to-black/8"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${active.id}-copy`}
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.35 }}
                      >
                        <p className="figma-label text-white/65">{active.tag}</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]">
                          {active.title}
                        </h3>
                        <p className="mt-3 max-w-[48ch] text-sm leading-6 text-white/82 sm:text-[15px]">
                          {active.body}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid gap-px bg-[var(--fc-line)] sm:grid-cols-3">
                  {active.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-2 bg-[var(--fc-paper)] px-4 py-3.5 text-[12px] text-[var(--fc-ink-soft)] sm:px-5"
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--fc-accent-deep)]"
                      />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {pillars
                .filter((pillar) => pillar.id !== active.id)
                .slice(0, 2)
                .map((pillar) => (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() =>
                      setActiveIndex(pillars.findIndex((item) => item.id === pillar.id))
                    }
                    className="group overflow-hidden rounded-[var(--fc-radius)] border border-[var(--fc-line)] bg-[var(--fc-paper)] text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--fc-accent-deep)]/25"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={pillar.image.url}
                        alt={pillar.image.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 50vw, 24vw"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                      />
                      <p className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white">
                        {pillar.title}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

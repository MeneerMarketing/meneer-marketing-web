"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import {
  EditorialPose,
  type EditorialPoseName,
} from "@/components/templates/editorial/EditorialPose";
import type { ClinicTreatment } from "@/components/templates/reformer-minimal/clinicModel";

interface Props {
  treatments: ClinicTreatment[];
  heading?: string;
}

/**
 * Lestype naar lijntekening. De volgorde is bewust: eerst de lessen die zich
 * onderscheiden (herstel, mat, privé, duo), en pas daarna de reformer, anders
 * pakt de eerste les met "reformer" in de naam het toestel op en houden de
 * andere niets over.
 */
const LESSON_POSES: readonly (readonly [RegExp, EditorialPoseName])[] = [
  [/stretch|restore|herstel|rust|adem|rek|mobil/i, "fold"],
  [/mat\b|matwork|vloer|core/i, "ball"],
  [/priv|één-op-één|een-op-een|persoonlijk|1-op-1/i, "kneel"],
  [/duo|samen|tweeën|koppel/i, "boat"],
  [/reformer|toestel|machine/i, "reformer"],
  [/flow|beweg|lenig/i, "lunge"],
  [/houding|postuur|rug|alignment/i, "cobra"],
] as const;

const POSE_FALLBACK: readonly EditorialPoseName[] = [
  "lunge",
  "cobra",
  "boat",
  "fold",
  "kneel",
  "ball",
] as const;

function posesForLessons(treatments: ClinicTreatment[]): EditorialPoseName[] {
  const used = new Set<EditorialPoseName>();

  return treatments.map((treatment, index) => {
    const match = LESSON_POSES.find(([pattern]) => pattern.test(treatment.name));
    const preferred =
      match && !used.has(match[1])
        ? match[1]
        : (POSE_FALLBACK.find((candidate) => !used.has(candidate)) ??
          POSE_FALLBACK[index % POSE_FALLBACK.length]!);

    used.add(preferred);
    return preferred;
  });
}

/**
 * Lessen als editorial index: de lijst links wordt actief terwijl je scrollt,
 * het beeld rechts blijft staan en wisselt mee. Op smalle schermen wordt het
 * een snap-rail, want een sticky paneel heeft daar geen ruimte.
 */
export function ClinicTreatments({
  treatments,
  heading = "Populaire lessen",
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  const setRowRef = useCallback((node: HTMLDivElement | null, index: number) => {
    rowRefs.current[index] = node;
  }, []);

  const setCardRef = useCallback((node: HTMLElement | null, index: number) => {
    cardRefs.current[index] = node;
  }, []);

  // De rij die het midden van het scherm kruist bepaalt het beeld. Zo komen de
  // lessen voorbij zonder dat de bezoeker iets hoeft aan te klikken.
  useEffect(() => {
    const rows = rowRefs.current.filter((row): row is HTMLDivElement =>
      Boolean(row)
    );
    if (rows.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = rows.indexOf(entry.target as HTMLDivElement);
          if (index >= 0) setActiveIndex(index);
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [treatments.length]);

  // Op mobiel lopen de streepjes mee met de swipe door de rail.
  useEffect(() => {
    const rail = railRef.current;
    const cards = cardRefs.current.filter((card): card is HTMLElement =>
      Boolean(card)
    );
    if (!rail || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < 0.6) continue;
          const index = cards.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActiveIndex(index);
        }
      },
      { root: rail, threshold: [0.6] }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [treatments.length]);

  const active = treatments[activeIndex] ?? treatments[0] ?? null;
  const [headStrong, headLight] = useMemo(() => splitHeading(heading), [heading]);
  const poses = useMemo(() => posesForLessons(treatments), [treatments]);

  if (treatments.length === 0 || !active) return null;

  return (
    <section id="lessen" className="fc-plane-025">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-[5vw] lg:py-24">
        <ScrollReveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="figma-label text-[var(--fc-label)]">Aanbod</p>
              <h2 className="figma-display-l mt-3">
                <span className="font-bold">{headStrong}</span>
                {headLight ? (
                  <>
                    {" "}
                    <span className="font-light">{headLight}</span>
                  </>
                ) : null}
              </h2>
              <p className="mt-3 max-w-[44ch] text-[14px] leading-6 text-[var(--fc-ink-soft)] sm:text-[15px]">
                Kies wat bij jouw ritme past. Elke les met instructie die telt.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="figma-label text-[var(--fc-ink-mute)]">
                {treatments.length} lessen
              </span>
              <span aria-hidden className="flex items-center gap-1.5">
                {treatments.map((treatment, index) => (
                  <span
                    key={treatment.id}
                    className={`h-[2px] rounded-full transition-all duration-500 ease-[var(--fc-ease)] ${
                      index === activeIndex
                        ? "w-7 bg-[var(--fc-accent-deep)]"
                        : "w-3 bg-[var(--fc-line)]"
                    }`}
                  />
                ))}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Desktop: index links, sticky beeld rechts */}
        <div className="mt-12 hidden gap-10 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="border-t border-[var(--fc-line)]">
            {treatments.map((treatment, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={treatment.id}
                  ref={(node) => setRowRef(node, index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="border-b border-[var(--fc-line)]"
                >
                  <button
                    type="button"
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                    className="group flex w-full items-start gap-5 py-6 text-left"
                  >
                    <EditorialPose
                      name={poses[index] ?? "boat"}
                      className={`mt-0.5 h-11 w-11 shrink-0 transition-all duration-500 ease-[var(--fc-ease)] ${
                        isActive
                          ? "scale-105 text-[var(--fc-accent-deep)] opacity-100"
                          : "text-[var(--fc-ink-mute)] opacity-60 group-hover:opacity-90"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span
                          className={`text-[clamp(1.35rem,2.2vw,1.9rem)] tracking-[-0.03em] transition-colors duration-500 ${
                            isActive
                              ? "font-semibold text-[var(--fc-ink)]"
                              : "font-light text-[var(--fc-ink-soft)]"
                          }`}
                        >
                          {treatment.name}
                        </span>
                        {treatment.duration ? (
                          <span className="figma-label text-[var(--fc-ink-mute)]">
                            {treatment.duration}
                          </span>
                        ) : null}
                        {treatment.highlight ? (
                          <span className="rounded-full bg-[var(--fc-wash)] px-2.5 py-0.5 text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--fc-accent-deep)]">
                            Meest gekozen
                          </span>
                        ) : null}
                      </span>

                      <span
                        className="grid transition-[grid-template-rows] duration-500 ease-[var(--fc-ease)] motion-reduce:transition-none"
                        style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                      >
                        <span className="overflow-hidden">
                          <span className="block max-w-[48ch] pt-3 text-[14px] leading-6 text-[var(--fc-ink-soft)]">
                            {treatment.description}
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="relative">
            <div className="sticky top-28">
              <div className="relative flex gap-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-[var(--fc-radius-lg)] bg-[var(--fc-wash)]">
                  <AnimatePresence initial={false} mode="sync">
                    <motion.div
                      key={active.id}
                      initial={
                        reduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, scale: 1.05 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.7,
                        ease: [0.25, 0.8, 0.25, 1],
                      }}
                      className="absolute inset-0"
                    >
                      {active.image ? (
                        <Image
                          src={active.image.url}
                          alt={active.image.alt}
                          fill
                          className="object-cover"
                          sizes="45vw"
                          priority={false}
                        />
                      ) : null}
                    </motion.div>
                  </AnimatePresence>

                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(46,38,32,0.55)] to-transparent"
                  />

                  <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
                    <p className="text-[1.1rem] font-semibold tracking-tight text-[var(--fc-on-dark)]">
                      {active.name}
                    </p>
                    <a
                      href="#tarieven"
                      className="figma-label shrink-0 rounded-full bg-[var(--fc-on-dark-btn)] px-4 py-2 text-[var(--fc-on-dark-btn-text)] transition-transform duration-500 ease-[var(--fc-ease)] hover:-translate-y-0.5"
                    >
                      Tarieven
                    </a>
                  </div>
                </div>

                <p
                  aria-hidden
                  style={{ writingMode: "vertical-rl" }}
                  className="figma-label shrink-0 self-start pt-2 text-[var(--fc-ink-faint)]"
                >
                  In de studio
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobiel: compacte snap-rail */}
        <div
          ref={railRef}
          className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {treatments.map((treatment, index) => (
            <article
              key={treatment.id}
              ref={(node) => setCardRef(node, index)}
              className="figma-card flex w-[72vw] max-w-[280px] shrink-0 snap-start flex-col overflow-hidden"
            >
              <div className="figma-media relative aspect-[5/4] bg-[var(--fc-wash)]">
                {treatment.image ? (
                  <Image
                    src={treatment.image.url}
                    alt={treatment.image.alt}
                    fill
                    className="object-cover"
                    sizes="72vw"
                  />
                ) : null}
                {treatment.highlight ? (
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--fc-accent-deep)] px-2.5 py-1 text-[9px] font-medium tracking-[0.12em] uppercase text-[var(--fc-on-dark)]">
                    Meest gekozen
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-[1.05rem] font-semibold tracking-tight">
                    <EditorialPose
                      name={poses[index] ?? "boat"}
                      className="h-7 w-7 shrink-0 text-[var(--fc-accent-deep)] opacity-70"
                    />
                    {treatment.name}
                  </h3>
                  {treatment.duration ? (
                    <span className="figma-label shrink-0 text-[var(--fc-ink-mute)]">
                      {treatment.duration}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 flex-1 text-[13px] leading-6 text-[var(--fc-ink-soft)]">
                  {treatment.description}
                </p>
                <a
                  href="#tarieven"
                  className="figma-label mt-4 inline-flex items-center gap-2 text-[var(--fc-accent-deep)]"
                >
                  Bekijk tarieven
                  <span aria-hidden>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Kop half vet, half licht: laatste woord wordt de lichte helft. */
function splitHeading(heading: string): [string, string] {
  const words = heading.trim().split(/\s+/);
  if (words.length < 2) return [heading, ""];
  const tail = words.pop() as string;
  return [words.join(" "), tail];
}

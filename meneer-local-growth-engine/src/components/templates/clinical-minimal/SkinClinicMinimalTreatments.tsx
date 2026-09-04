"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { ClinicTreatment } from "@/components/templates/reformer-minimal/clinicModel";

interface Props {
  treatments: ClinicTreatment[];
  studioName: string;
}

const TREATMENT_MARKS = [
  "laser",
  "hydrate",
  "inject",
  "peel",
  "analysis",
  "needle",
  "glow",
  "care",
] as const;

type TreatmentMark = (typeof TREATMENT_MARKS)[number];

function markForTreatment(name: string, index: number): TreatmentMark {
  const blob = name.toLowerCase();
  if (/laser|licht|ipl|pigment|onthar/.test(blob)) return "laser";
  if (/hydra|facial|reinig|hydrat|gezichts/.test(blob)) return "hydrate";
  if (/botox|filler|inject|lip|wang|kaak/.test(blob)) return "inject";
  if (/peel|exfol|zuur|chemisch/.test(blob)) return "peel";
  if (/intake|analyse|consult|scan|huidanalyse/.test(blob)) return "analysis";
  if (/needle|microneed|collageen|dermapen/.test(blob)) return "needle";
  if (/glow|teint|vitamine|bright|led/.test(blob)) return "glow";
  if (/huidverbeter|acne|roodheid|eczeem|anti[- ]?age|verzorg/.test(blob)) return "care";
  return TREATMENT_MARKS[index % TREATMENT_MARKS.length] ?? "care";
}

function TreatmentMarkIcon({
  mark,
  active,
}: {
  mark: TreatmentMark;
  active: boolean;
}) {
  const stroke = active ? "var(--fc-accent-deep)" : "var(--fc-ink-mute)";

  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-500 ease-[var(--fc-ease)] ${
        active
          ? "scale-105 border-[var(--fc-accent-deep)]/35 bg-[var(--fc-accent-soft)] shadow-[0_10px_30px_-18px_color-mix(in_srgb,var(--fc-accent-deep)_55%,transparent)]"
          : "border-[var(--fc-line)] bg-[var(--fc-paper)] opacity-80"
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
        {mark === "laser" ? (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3" />
            <path d="M12 19v3" />
            <path d="M2 12h3" />
            <path d="M19 12h3" />
            <path d="M4.9 4.9l2.1 2.1" />
            <path d="M17 17l2.1 2.1" />
            <path d="M19 4.9l-2.1 2.1" />
            <path d="M7 17l-2.1 2.1" />
          </>
        ) : null}
        {mark === "hydrate" ? (
          <>
            <path d="M12 3.5c-3.2 4.6-5 7.4-5 10.2a5 5 0 0 0 10 0c0-2.8-1.8-5.6-5-10.2z" />
            <path d="M9.5 14.5c.8.8 1.7 1.2 2.5 1.2" opacity="0.55" />
          </>
        ) : null}
        {mark === "inject" ? (
          <>
            <path d="m18 2 4 4-9 9-4-4z" />
            <path d="m6 16-3 3" />
            <path d="M3 21l2-2" />
            <path d="M14 6l6 6" />
          </>
        ) : null}
        {mark === "peel" ? (
          <>
            <path d="M4 8c3-2 6-2 8 0s5 2 8 0" />
            <path d="M4 12c3-2 6-2 8 0s5 2 8 0" />
            <path d="M4 16c3-2 6-2 8 0s5 2 8 0" />
            <path d="M12 18v3" />
          </>
        ) : null}
        {mark === "analysis" ? (
          <>
            <circle cx="10.5" cy="10.5" r="5.5" />
            <path d="M15.5 15.5 21 21" />
            <path d="M8.5 10.5h4" />
            <path d="M10.5 8.5v4" />
          </>
        ) : null}
        {mark === "needle" ? (
          <>
            {[
              [6, 6],
              [12, 6],
              [18, 6],
              [6, 12],
              [12, 12],
              [18, 12],
              [6, 18],
              [12, 18],
              [18, 18],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.35" fill={stroke} stroke="none" />
            ))}
          </>
        ) : null}
        {mark === "glow" ? (
          <>
            <path d="M12 3v2" />
            <path d="M12 19v2" />
            <path d="M3 12h2" />
            <path d="M19 12h2" />
            <path d="M5.6 5.6l1.4 1.4" />
            <path d="M17 17l1.4 1.4" />
            <path d="M18.4 5.6 17 7" />
            <path d="M7 17l-1.4 1.4" />
            <circle cx="12" cy="12" r="3.25" />
          </>
        ) : null}
        {mark === "care" ? (
          <path d="M12 20c-4.5-3.2-7-5.6-7-9a4 4 0 0 1 7-2.4A4 4 0 0 1 19 11c0 3.4-2.5 5.8-7 9z" />
        ) : null}
      </svg>
    </span>
  );
}

function splitHeading(text: string): [string, string | null] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 2) return [text, null];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export function SkinClinicMinimalTreatments({ treatments, studioName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  const heading = `Behandelingen bij ${studioName}`;
  const [headStrong, headLight] = useMemo(() => splitHeading(heading), [heading]);
  const marks = useMemo(
    () => treatments.map((t, i) => markForTreatment(t.name, i)),
    [treatments],
  );

  const setRowRef = useCallback((node: HTMLDivElement | null, index: number) => {
    rowRefs.current[index] = node;
  }, []);

  const setCardRef = useCallback((node: HTMLElement | null, index: number) => {
    cardRefs.current[index] = node;
  }, []);

  useEffect(() => {
    const rows = rowRefs.current.filter((row): row is HTMLDivElement => Boolean(row));
    if (rows.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = rows.indexOf(entry.target as HTMLDivElement);
          if (index >= 0) setActiveIndex(index);
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [treatments.length]);

  useEffect(() => {
    const rail = railRef.current;
    const cards = cardRefs.current.filter((card): card is HTMLElement => Boolean(card));
    if (!rail || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < 0.6) continue;
          const index = cards.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActiveIndex(index);
        }
      },
      { root: rail, threshold: [0.6] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [treatments.length]);

  const active = treatments[activeIndex] ?? treatments[0] ?? null;
  if (treatments.length === 0 || !active) return null;

  return (
    <section id="behandelingen" className="fc-plane-025">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-[5vw] lg:py-28">
        <ScrollReveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="figma-label text-[var(--fc-label)]">Behandelingen</p>
              <h2 className="figma-display-l mt-3 max-w-[20ch] lg:max-w-none lg:whitespace-nowrap">
                <span className="font-bold">{headStrong}</span>
                {headLight ? (
                  <>
                    {" "}
                    <span className="font-light">{headLight}</span>
                  </>
                ) : null}
              </h2>
              <p className="mt-3 max-w-[48ch] text-[14px] leading-6 text-[var(--fc-ink-soft)] sm:text-[15px] sm:leading-7">
                Van intake tot laser en injectables. Elk protocol start met analyse,
                zodat je weet wat bij jouw huid past.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="figma-label text-[var(--fc-ink-mute)]">
                {treatments.length} behandelingen
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
                    <TreatmentMarkIcon mark={marks[index]!} active={isActive} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3
                          className={`text-[clamp(1.35rem,2.2vw,1.9rem)] tracking-[-0.03em] transition-colors duration-500 ${
                            isActive
                              ? "text-[var(--fc-ink)]"
                              : "text-[var(--fc-ink-mute)] group-hover:text-[var(--fc-ink-soft)]"
                          }`}
                        >
                          {treatment.name}
                        </h3>
                        {treatment.duration ? (
                          <span className="figma-label text-[var(--fc-ink-faint)]">
                            {treatment.duration}
                          </span>
                        ) : null}
                        {treatment.highlight ? (
                          <span className="rounded-full bg-[var(--fc-accent-soft)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--fc-accent-deep)]">
                            Populair
                          </span>
                        ) : null}
                      </div>
                      <p
                        className={`mt-2 max-w-[44ch] text-[14px] leading-6 transition-colors duration-500 sm:text-[15px] ${
                          isActive
                            ? "text-[var(--fc-ink-soft)]"
                            : "text-[var(--fc-ink-faint)]"
                        }`}
                      >
                        {treatment.description}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="relative">
            <div className="sticky top-24">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--fc-radius-lg)] bg-[var(--fc-wash)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={reduceMotion ? false : { opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
                    className="absolute inset-0"
                  >
                    {active.image ? (
                      <Image
                        src={active.image.url}
                        alt={active.image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 42vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[var(--fc-mist)]" />
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                      <p className="figma-label text-white/75">Behandeling</p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        {active.name}
                      </p>
                      {active.duration ? (
                        <p className="mt-2 text-sm text-white/80">{active.duration}</p>
                      ) : null}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={railRef}
          className="mt-10 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {treatments.map((treatment, index) => (
            <article
              key={treatment.id}
              ref={(node) => setCardRef(node, index)}
              className={`min-w-[min(88vw,22rem)] shrink-0 snap-center overflow-hidden rounded-[var(--fc-radius)] border bg-[var(--fc-paper)] ${
                index === activeIndex
                  ? "border-[var(--fc-accent-deep)]"
                  : "border-[var(--fc-line)]"
              }`}
            >
              {treatment.image ? (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={treatment.image.url}
                    alt={treatment.image.alt}
                    fill
                    className="object-cover"
                    sizes="88vw"
                  />
                </div>
              ) : null}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <TreatmentMarkIcon mark={marks[index]!} active={index === activeIndex} />
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-[var(--fc-ink)]">
                      {treatment.name}
                    </h3>
                    {treatment.duration ? (
                      <p className="mt-1 text-xs text-[var(--fc-ink-faint)]">
                        {treatment.duration}
                      </p>
                    ) : null}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--fc-ink-soft)]">
                  {treatment.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

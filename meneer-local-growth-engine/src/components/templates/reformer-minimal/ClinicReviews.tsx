"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { ClinicQuote } from "@/components/templates/reformer-minimal/clinicModel";

interface ReviewsProps {
  quotes: ClinicQuote[];
  rating: string | null;
  reviewCount: number;
}

type CardTone = "paper" | "sand" | "dark";

/**
 * Speelse review-raft: solide g-050 vlak, kolommen die tegengesteld
 * parallaxen, kaarten die zacht schalen terwijl je scrollt.
 */
export function ClinicReviews({ quotes, rating, reviewCount }: ReviewsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const list = quotes.slice(0, 6);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const columns = useMemo(() => {
    const cols: ClinicQuote[][] = [[], [], []];
    list.forEach((quote, index) => {
      cols[index % 3]!.push(quote);
    });
    return cols;
  }, [list]);

  if (list.length === 0) return null;

  return (
    <section
      id="ervaringen"
      ref={sectionRef}
      className="fc-plane-025"
    >
      <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <ScrollReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="figma-label text-[var(--fc-label)]">Ervaringen</p>
              <h2 className="figma-display-l mt-4">Wat leden zeggen</h2>
              <p className="mt-4 max-w-[40ch] text-[15px] leading-7 text-[var(--fc-ink-soft)]">
                Echte stemmen uit de studio. Kort, eerlijk en herkenbaar.
              </p>
            </div>

            {rating ? (
              <div className="inline-flex items-center gap-4 rounded-[var(--fc-radius-lg)] border border-[var(--fc-line)] bg-[var(--fc-paper)] px-5 py-4">
                <div>
                  <p className="figma-label text-[var(--fc-label)]">Score</p>
                  <p className="mt-1 text-[2.4rem] font-medium leading-none tracking-tight tabular-nums text-[var(--fc-accent-deep)]">
                    {rating}
                  </p>
                </div>
                <div className="h-12 w-px bg-[var(--fc-line)]" aria-hidden />
                <div>
                  <div
                    className="flex gap-0.5 text-[var(--fc-accent-deep)]"
                    aria-hidden
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-[13px]">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-[13px] text-[var(--fc-ink-soft)]">
                    {reviewCount > 0
                      ? `${reviewCount} reviews`
                      : "Ledenwaardering"}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollReveal>

        {/* Desktop: 3 parallax-kolommen */}
        <div className="mt-14 hidden gap-5 lg:grid lg:grid-cols-3">
          {columns.map((col, colIndex) => (
            <ReviewColumn
              key={colIndex}
              quotes={col}
              colIndex={colIndex}
              progress={scrollYProgress}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </div>

        {/* Mobiel: gestapelde speelse kaarten met lichte shift */}
        <div className="mt-12 flex flex-col gap-4 lg:hidden">
          {list.map((quote, index) => (
            <MobileReviewCard
              key={quote.id}
              quote={quote}
              index={index}
              progress={scrollYProgress}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewColumn({
  quotes,
  colIndex,
  progress,
  reduceMotion,
}: {
  quotes: ClinicQuote[];
  colIndex: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const direction = colIndex === 1 ? 1 : colIndex === 0 ? -1 : 1;
  const amount = colIndex === 1 ? 72 : 48;
  const y = useTransform(
    progress,
    [0, 1],
    reduceMotion ? [0, 0] : [direction * amount, direction * -amount]
  );
  const startOffset = colIndex === 1 ? "mt-16" : colIndex === 2 ? "mt-8" : "";

  return (
    <motion.div style={{ y }} className={`flex flex-col gap-5 will-change-transform ${startOffset}`}>
      {quotes.map((quote, index) => (
        <ReviewCard
          key={quote.id}
          quote={quote}
          tone={pickTone(colIndex, index)}
          progress={progress}
          index={colIndex * 3 + index}
          reduceMotion={reduceMotion}
        />
      ))}
    </motion.div>
  );
}

function MobileReviewCard({
  quote,
  index,
  progress,
  reduceMotion,
}: {
  quote: ClinicQuote;
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const shift = index % 2 === 0 ? 18 : -18;
  const y = useTransform(
    progress,
    [0, 1],
    reduceMotion ? [0, 0] : [shift, -shift]
  );

  return (
    <motion.div style={{ y }} className="will-change-transform">
      <ReviewCard
        quote={quote}
        tone={pickTone(index % 3, index)}
        progress={progress}
        index={index}
        reduceMotion={reduceMotion}
      />
    </motion.div>
  );
}

function ReviewCard({
  quote,
  tone,
  progress,
  index,
  reduceMotion,
}: {
  quote: ClinicQuote;
  tone: CardTone;
  progress: MotionValue<number>;
  index: number;
  reduceMotion: boolean;
}) {
  const peak = 0.35 + (index % 5) * 0.08;
  const scale = useTransform(
    progress,
    [0, peak, 1],
    reduceMotion ? [1, 1, 1] : [0.94, 1.04, 0.96]
  );
  const rotate = useTransform(
    progress,
    [0, 1],
    reduceMotion ? [0, 0] : [index % 2 === 0 ? -1.2 : 1.2, index % 2 === 0 ? 0.8 : -0.6]
  );

  const initials = quote.author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const surface =
    tone === "dark"
      ? "bg-[var(--fc-dark)] text-[var(--fc-on-dark)] border-transparent"
      : tone === "sand"
        ? "bg-[var(--fc-accent-soft)] text-[var(--fc-ink)] border-transparent"
        : "bg-[var(--fc-paper)] text-[var(--fc-ink)] border-[var(--fc-line)]";

  const starColor =
    tone === "dark" ? "text-[var(--fc-on-dark-label)]" : "text-[var(--fc-accent-deep)]";
  const bodyColor =
    tone === "dark" ? "text-[var(--fc-on-dark-body)]" : "text-[var(--fc-ink-soft)]";
  const metaColor =
    tone === "dark" ? "text-[var(--fc-on-dark-label)]" : "text-[var(--fc-ink-mute)]";
  const avatar =
    tone === "dark"
      ? "bg-[var(--fc-dark-deeper)] text-[var(--fc-on-dark-btn)]"
      : tone === "sand"
        ? "bg-[var(--fc-paper)] text-[var(--fc-accent-deep)]"
        : "bg-[var(--fc-wash)] text-[var(--fc-accent-deep)]";

  return (
    <motion.figure
      style={{ scale, rotate }}
      className={`relative flex flex-col overflow-hidden rounded-[var(--fc-radius-lg)] border p-7 will-change-transform sm:p-8 ${surface}`}
    >
      <div className={`relative flex gap-1 ${starColor}`} aria-label={`${quote.rating} sterren`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < Math.round(quote.rating) ? "opacity-100" : "opacity-25"}
          >
            ★
          </span>
        ))}
      </div>

      <blockquote className="relative mt-5 flex-1 text-[1.08rem] leading-snug tracking-tight sm:text-[1.15rem]">
        {quote.text}
      </blockquote>

      <figcaption className="relative mt-8 flex items-center gap-3">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-semibold tracking-wide ${avatar}`}
          aria-hidden
        >
          {initials || "•"}
        </span>
        <span>
          <cite className="figma-label not-italic">{quote.author}</cite>
          {quote.meta ? (
            <p className={`mt-1 text-[12px] ${metaColor}`}>{quote.meta}</p>
          ) : (
            <p className={`mt-1 text-[12px] ${bodyColor}`}>Lid</p>
          )}
        </span>
      </figcaption>
    </motion.figure>
  );
}

function pickTone(colIndex: number, index: number): CardTone {
  const pattern: CardTone[] = ["paper", "sand", "dark", "paper", "sand", "paper"];
  return pattern[(colIndex + index * 2) % pattern.length]!;
}

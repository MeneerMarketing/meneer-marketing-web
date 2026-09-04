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
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";
import type { CineQuote } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
  variant?: "pilates" | "skin-clinic";
}

type CardTone = "paper" | "sand" | "dark";

/**
 * Speelse review-raft in cinematic-stijl: parallax-kolommen, sterren,
 * avatars en kaarten die meebewegen bij scroll.
 */
export function CinematicReviews({ model, variant = "pilates" }: Props) {
  const { reviews, city, quotesAreHighlights } = model;
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const list = reviews.quotes.slice(0, 6);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const columns = useMemo(() => {
    const cols: CineQuote[][] = [[], [], []];
    list.forEach((quote, index) => {
      cols[index % 3]!.push(quote);
    });
    return cols;
  }, [list]);

  if (list.length === 0) return null;

  const eyebrow = quotesAreHighlights
    ? variant === "skin-clinic"
      ? "Kliniek in het kort"
      : "Studio in het kort"
    : "Ervaringen";

  const title =
    variant === "skin-clinic" ? "Wat klanten zeggen" : "Wat leden zeggen";

  const intro =
    variant === "skin-clinic"
      ? "Echte ervaringen na intake en behandeling. Kort, eerlijk en herkenbaar."
      : "Echte stemmen uit de studio. Kort, eerlijk en herkenbaar.";

  return (
    <section id="ervaringen" ref={sectionRef} className="bg-[var(--cn-cream-2)]">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <ScrollReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="cine-label text-[var(--cn-muted)]">{eyebrow}</p>
              <h2 className="cine-display cine-display-l cine-lower mt-5 text-[var(--cn-oxblood)]">
                {title}
              </h2>
              <p className="mt-4 max-w-[40ch] text-[13.5px] leading-6 text-[var(--cn-body)] sm:text-[14px] sm:leading-7">
                {intro}
              </p>
            </div>

            {reviews.rating ? (
              <div className="inline-flex items-center gap-4 rounded-[1.75rem] border border-[var(--cn-line)] bg-[var(--cn-cream)] px-5 py-4">
                <div>
                  <p className="cine-label text-[var(--cn-muted)]">Score</p>
                  <p className="cine-display mt-1 text-[2.4rem] leading-none tabular-nums text-[var(--cn-oxblood)]">
                    {reviews.rating}
                  </p>
                </div>
                <div className="h-12 w-px bg-[var(--cn-line)]" aria-hidden />
                <div>
                  <div
                    className="flex gap-0.5 text-[var(--cn-oxblood)]"
                    aria-hidden
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-[13px]">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-[13px] text-[var(--cn-muted)]">
                    {reviews.count > 0
                      ? `${reviews.count} reviews`
                      : "waardering"}
                    {city ? ` · ${city.toLowerCase()}` : ""}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollReveal>

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
  quotes: CineQuote[];
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
  quote: CineQuote;
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
  quote: CineQuote;
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
      ? "bg-[var(--cn-oxblood)] text-[var(--cn-on-dark)] border-transparent"
      : tone === "sand"
        ? "bg-[var(--cn-cream)] text-[var(--cn-ink)] border-[var(--cn-line)]"
        : "bg-[var(--cn-cream)] text-[var(--cn-ink)] border-[var(--cn-line)]";

  const starColor =
    tone === "dark" ? "text-[var(--cn-on-dark)]" : "text-[var(--cn-oxblood)]";
  const quoteColor =
    tone === "dark" ? "text-[var(--cn-on-dark)]" : "text-[var(--cn-ink)]";
  const metaColor =
    tone === "dark" ? "text-[var(--cn-on-dark-soft)]" : "text-[var(--cn-muted)]";
  const avatar =
    tone === "dark"
      ? "bg-[var(--cn-dark)] text-[var(--cn-on-dark)]"
      : "bg-[var(--cn-cream-2)] text-[var(--cn-oxblood)]";

  const filledStars = Math.min(5, Math.max(1, Math.round(quote.rating)));

  return (
    <motion.figure
      style={{ scale, rotate }}
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border p-7 transition-shadow duration-500 will-change-transform hover:shadow-[0_24px_60px_rgba(36,24,29,0.12)] sm:p-8 ${surface}`}
    >
      <div
        className={`relative flex gap-1 ${starColor}`}
        aria-label={`${filledStars} van 5 sterren`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-[15px] transition-transform duration-500 group-hover:scale-110 ${
              i < filledStars ? "opacity-100" : "opacity-20"
            }`}
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            ★
          </span>
        ))}
      </div>

      <blockquote
        className={`relative mt-5 flex-1 text-[1.05rem] leading-snug tracking-tight sm:text-[1.12rem] ${quoteColor}`}
      >
        {quote.text}
      </blockquote>

      <figcaption className="relative mt-8 flex items-center gap-3">
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold tracking-wide ${avatar}`}
          aria-hidden
        >
          {initials || "•"}
        </span>
        <span>
          <cite
            className={`cine-label not-italic ${tone === "dark" ? "text-[var(--cn-on-dark)]" : ""}`}
          >
            {quote.author}
          </cite>
          {quote.meta ? (
            <p className={`mt-1 text-[12px] ${metaColor}`}>{quote.meta}</p>
          ) : (
            <p className={`mt-1 text-[12px] ${metaColor}`}>
              {tone === "dark" ? "Klant" : "Lid"}
            </p>
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

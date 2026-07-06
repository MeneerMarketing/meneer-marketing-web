"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import type { AboutMeneerJourneyStep } from "@/data/home-about-meneer";

const EASE = [0.22, 1, 0.36, 1] as const;
const BUBBLE_TAIL =
  "pointer-events-none absolute -bottom-[6px] left-5 size-3 rotate-45 border-b border-r border-slate-800 bg-slate-900";
const LOGO_OFFSET = "pl-[2.75rem]";
const MESSAGE_GAP_MS = 720;
const TYPING_MS = 520;

function formatEra(step: AboutMeneerJourneyStep): string {
  return step.eraSub ? `${step.era} ${step.eraSub}` : step.era;
}

function JourneyTypingIndicator() {
  return (
    <div className={`flex items-end gap-2.5 ${LOGO_OFFSET}`} aria-hidden>
      <span className="inline-flex gap-1 rounded-2xl rounded-bl-sm bg-slate-900 px-4 py-3 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.35)]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-[#FF5722]/80"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14 }}
          />
        ))}
      </span>
    </div>
  );
}

interface JourneyChatBubbleProps {
  step: AboutMeneerJourneyStep;
  isLast: boolean;
  showTargetOnLast: boolean;
}

function JourneyChatBubble({ step, isLast, showTargetOnLast }: JourneyChatBubbleProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      className={`relative max-w-[min(100%,20rem)] rounded-2xl rounded-bl-sm bg-slate-900 px-4 py-3 text-white shadow-[0_12px_32px_-14px_rgba(15,23,42,0.45)] ${
        isLast ? "ring-1 ring-[#FF5722]/25" : ""
      }`}
    >
      <span className={BUBBLE_TAIL} aria-hidden />
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
        {formatEra(step)}
      </p>
      <p className="mt-1.5 text-pretty text-sm font-semibold leading-snug text-white/95">
        {step.detail}
      </p>
      <p className="mt-1.5 text-[11px] font-medium text-white/40">{step.title}</p>
      {showTargetOnLast && isLast ? (
        <span
          className="absolute right-3 top-3 size-2 rounded-full bg-[#FF5722] shadow-[0_0_10px_rgba(255,87,34,0.55)]"
          aria-hidden
        />
      ) : null}
    </motion.article>
  );
}

interface AboutMeneerJourneyListProps {
  steps: readonly AboutMeneerJourneyStep[];
  showTargetOnLast?: boolean;
}

/** Meneer vertelt zijn route als chatberichten, één voor één. */
export function AboutMeneerJourneyList({
  steps,
  showTargetOnLast = false,
}: AboutMeneerJourneyListProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-12%" });
  const [visibleCount, setVisibleCount] = useState(reduce ? steps.length : 0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (reduce) {
      setVisibleCount(steps.length);
      setIsTyping(false);
      return;
    }

    if (!isInView) return;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function schedule(fn: () => void, ms: number) {
      timeouts.push(setTimeout(fn, ms));
    }

    setVisibleCount(0);
    setIsTyping(false);

    schedule(() => {
      if (cancelled) return;
      setVisibleCount(1);
    }, 280);

    for (let i = 1; i < steps.length; i++) {
      const typingAt = 280 + i * MESSAGE_GAP_MS - TYPING_MS;
      const showAt = 280 + i * MESSAGE_GAP_MS;

      schedule(() => {
        if (cancelled) return;
        setIsTyping(true);
      }, typingAt);

      schedule(() => {
        if (cancelled) return;
        setIsTyping(false);
        setVisibleCount(i + 1);
      }, showAt);
    }

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [isInView, reduce, steps.length]);

  const visibleSteps = steps.slice(0, visibleCount);

  return (
    <div ref={containerRef} className="space-y-3" role="list" aria-live="polite">
      {visibleSteps.map((step, i) => {
        const isFirst = i === 0;
        const isLast = i === steps.length - 1;

        return (
          <div
            key={step.id}
            role="listitem"
            className={`flex items-end gap-2.5 ${isFirst ? "" : LOGO_OFFSET}`}
          >
            {isFirst ? (
              <InteractiveLogo className="size-9 shrink-0" interactive={false} />
            ) : null}
            <JourneyChatBubble
              step={step}
              isLast={isLast}
              showTargetOnLast={showTargetOnLast}
            />
          </div>
        );
      })}

      <AnimatePresence>
        {isTyping && !reduce ? (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <JourneyTypingIndicator />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** @deprecated Gebruik AboutMeneerJourneyList. */
export function AboutMeneerJourneyBadge({
  era,
  eraSub,
}: Pick<AboutMeneerJourneyStep, "era" | "eraSub">) {
  return (
    <span
      className="flex size-11 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-950 text-center"
      aria-hidden
    >
      <span className="font-black uppercase leading-none tracking-wide text-[#FF5722] [font-size:11px]">
        {era}
      </span>
      {eraSub ? (
        <span className="mt-1 font-bold uppercase leading-none tracking-[0.14em] text-white/50 [font-size:8px]">
          {eraSub}
        </span>
      ) : null}
    </span>
  );
}

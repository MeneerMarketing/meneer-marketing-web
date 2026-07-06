"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import type { AboutMeneerStrategyMessage } from "@/data/home-about-meneer";

const EASE = [0.22, 1, 0.36, 1] as const;
const MESSAGE_GAP_MS = 680;
const TYPING_MS = 480;

function TypingBubble({ align }: { align: "left" | "right" }) {
  const isMeneer = align === "left";
  return (
    <div
      className={`flex items-end gap-2 ${isMeneer ? "" : "justify-end"}`}
      aria-hidden
    >
      {isMeneer ? <InteractiveLogo className="size-8 shrink-0" interactive={false} /> : null}
      <span
        className={`inline-flex gap-1 rounded-2xl px-4 py-3 ${
          isMeneer
            ? "rounded-bl-sm bg-slate-900"
            : "rounded-br-sm border border-slate-200 bg-white"
        }`}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`size-1.5 rounded-full ${isMeneer ? "bg-[#FF5722]/80" : "bg-slate-400"}`}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14 }}
          />
        ))}
      </span>
    </div>
  );
}

interface StrategyBubbleProps {
  message: AboutMeneerStrategyMessage;
  isLast: boolean;
}

function StrategyBubble({ message, isLast }: StrategyBubbleProps) {
  const isMeneer = message.from === "meneer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className={`flex items-end gap-2 ${isMeneer ? "" : "justify-end"}`}
    >
      {isMeneer ? <InteractiveLogo className="size-8 shrink-0" interactive={false} /> : null}
      <div
        className={`relative max-w-[min(100%,17.5rem)] rounded-2xl px-3.5 py-2.5 ${
          isMeneer
            ? `rounded-bl-sm bg-slate-900 text-white shadow-[0_10px_28px_-14px_rgba(15,23,42,0.4)] ${
                isLast ? "ring-1 ring-[#FF5722]/30" : ""
              }`
            : "rounded-br-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
        }`}
      >
        {isMeneer ? (
          <span
            className="pointer-events-none absolute -bottom-[5px] left-4 size-2.5 rotate-45 border-b border-r border-slate-800 bg-slate-900"
            aria-hidden
          />
        ) : (
          <span
            className="pointer-events-none absolute -bottom-[5px] right-4 size-2.5 rotate-45 border-b border-r border-slate-200 bg-white"
            aria-hidden
          />
        )}
        <p className="text-pretty text-[13px] font-semibold leading-snug">{message.text}</p>
      </div>
    </motion.div>
  );
}

interface AboutMeneerStrategyChatProps {
  messages: readonly AboutMeneerStrategyMessage[];
  onComplete?: () => void;
}

/** Strategiegesprek Meneer ↔ klant, één voor één. */
export function AboutMeneerStrategyChat({
  messages,
  onComplete,
}: AboutMeneerStrategyChatProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-12%" });
  const [visibleCount, setVisibleCount] = useState(reduce ? messages.length : 0);
  const [typingFrom, setTypingFrom] = useState<"meneer" | "klant" | null>(null);
  const completedRef = useRef(false);
  const animStartedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (reduce) {
      setVisibleCount(messages.length);
      setTypingFrom(null);
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }

    if (!isInView) return;
    if (completedRef.current || animStartedRef.current) return;

    animStartedRef.current = true;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function schedule(fn: () => void, ms: number) {
      timeouts.push(setTimeout(fn, ms));
    }

    setVisibleCount(0);
    setTypingFrom(null);

    schedule(() => {
      if (cancelled) return;
      setVisibleCount(1);
    }, 260);

    for (let i = 1; i < messages.length; i++) {
      const nextFrom = messages[i]!.from;
      const typingAt = 260 + i * MESSAGE_GAP_MS - TYPING_MS;
      const showAt = 260 + i * MESSAGE_GAP_MS;

      schedule(() => {
        if (cancelled) return;
        setTypingFrom(nextFrom);
      }, typingAt);

      schedule(() => {
        if (cancelled) return;
        setTypingFrom(null);
        setVisibleCount(i + 1);
        if (i === messages.length - 1 && !completedRef.current) {
          completedRef.current = true;
          onCompleteRef.current?.();
        }
      }, showAt);
    }

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      if (!completedRef.current) {
        animStartedRef.current = false;
      }
    };
  }, [isInView, messages, reduce]);

  const visibleMessages = messages.slice(0, visibleCount);

  return (
    <div ref={containerRef} className="space-y-2.5" aria-live="polite">
      {visibleMessages.map((message, i) => (
        <StrategyBubble
          key={message.id}
          message={message}
          isLast={i === messages.length - 1}
        />
      ))}

      <AnimatePresence>
        {typingFrom && !reduce ? (
          <motion.div
            key={`typing-${typingFrom}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <TypingBubble align={typingFrom === "meneer" ? "left" : "right"} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

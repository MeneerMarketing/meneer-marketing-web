"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import {
  HERO_CHAT_OPTIONS,
  type HeroChatFocusOption,
  type HeroChatOption,
} from "@/data/home-hero-chat";
import type { SiteCta } from "@/lib/cta";
import {
  getHeroChatIntroLines,
  getHeroChatTimeSlot,
  HERO_CHAT_TIME_BADGE,
  type HeroChatTimeSlot,
} from "@/lib/hero-chat-time";

const EASE = [0.22, 1, 0.36, 1] as const;

type HeroChatPhase = "intro" | "topic" | "focus" | "done";

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <InteractiveLogo className="size-8 shrink-0" interactive={false} />
      <span className="inline-flex gap-1 rounded-2xl rounded-bl-sm bg-slate-900 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-slate-400"
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
    </div>
  );
}

function HeroBubble({ from, text }: { from: "meneer" | "jij"; text: string }) {
  if (!text.trim()) return null;

  const isMeneer = from === "meneer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: EASE }}
      className={`flex items-end gap-2.5 ${isMeneer ? "" : "flex-row-reverse"}`}
    >
      {isMeneer ? (
        <InteractiveLogo className="size-8 shrink-0" interactive={false} />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-[11px] font-black text-white">
          J
        </span>
      )}
      <p
        className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm font-semibold leading-snug ${
          isMeneer
            ? "rounded-bl-sm bg-slate-900 text-white"
            : "rounded-br-sm border border-slate-200 bg-slate-50 text-slate-800"
        }`}
      >
        {text}
      </p>
    </motion.div>
  );
}

function ChoicePills({
  options,
  onPick,
}: {
  options: readonly { id: string; label: string }[];
  onPick: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22 }}
      className="flex flex-wrap gap-2 pl-10"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onPick(option.id)}
          className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-[#FF5722] hover:text-[#FF5722]"
        >
          {option.label}
        </button>
      ))}
    </motion.div>
  );
}

function HeroCtaButton({ cta, onReset }: { cta: SiteCta; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3, ease: EASE }}
      className="pl-10 pt-2"
    >
      <Link
        href={cta.href}
        className="group flex items-center justify-between gap-3 rounded-2xl bg-[#FF5722] px-4 py-3.5 text-white shadow-[0_18px_40px_-16px_rgba(255,87,34,0.7)] transition hover:bg-orange-600"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-extrabold">{cta.label}</span>
          <span className="mt-0.5 block truncate text-[10px] font-semibold text-white/75">
            Laten we regelen
          </span>
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15 transition group-hover:rotate-45">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </Link>
      <button
        type="button"
        onClick={onReset}
        className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 transition hover:text-[#FF5722]"
      >
        <RotateCcw className="size-3" aria-hidden />
        Opnieuw beginnen
      </button>
    </motion.div>
  );
}

export function HeroChatCard({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(compact ? 0 : 0.28);
  const [phase, setPhase] = useState<HeroChatPhase>("intro");
  const [typing, setTyping] = useState(true);
  const [messages, setMessages] = useState<
    { id: string; from: "meneer" | "jij"; text: string }[]
  >([]);
  const [topic, setTopic] = useState<HeroChatOption | null>(null);
  const [focus, setFocus] = useState<HeroChatFocusOption | null>(null);
  const [timeSlot, setTimeSlot] = useState<HeroChatTimeSlot>(() =>
    getHeroChatTimeSlot(new Date().getHours()),
  );
  const timeBadge = HERO_CHAT_TIME_BADGE[timeSlot];

  useEffect(() => {
    if (phase !== "intro") return;

    let cancelled = false;
    const lines = [...getHeroChatIntroLines(new Date().getHours())];

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const runIntro = async () => {
      for (let i = 0; i < lines.length; i++) {
        if (cancelled) return;

        setTyping(true);
        await wait(reduce ? 0 : i === 0 ? 520 : 580);
        if (cancelled) return;

        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `intro-${i}`, from: "meneer", text: lines[i]! },
        ]);

        if (i < lines.length - 1) {
          await wait(reduce ? 0 : 320);
        }
      }

      if (!cancelled) {
        setTyping(false);
        setPhase("topic");
      }
    };

    void runIntro();
    return () => {
      cancelled = true;
    };
  }, [phase, reduce, timeSlot]);

  const addUser = (text: string) => {
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, from: "jij", text }]);
  };

  const addMeneer = (text: string, nextPhase?: HeroChatPhase) => {
    setTyping(true);
    window.setTimeout(
      () => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `m-${Date.now()}`, from: "meneer", text },
        ]);
        if (nextPhase) setPhase(nextPhase);
      },
      reduce ? 0 : 550,
    );
  };

  const pickTopic = (option: HeroChatOption) => {
    setTopic(option);
    addUser(option.userReply);
    addMeneer(option.meneerReply, "focus");
    window.setTimeout(() => {
      addMeneer(option.focusPrompt);
    }, reduce ? 0 : 700);
  };

  const pickFocus = (option: HeroChatFocusOption) => {
    setFocus(option);
    addUser(option.userReply);
    addMeneer(option.meneerReply, "done");
  };

  const reset = () => {
    setTimeSlot(getHeroChatTimeSlot(new Date().getHours()));
    setPhase("intro");
    setTyping(true);
    setMessages([]);
    setTopic(null);
    setFocus(null);
  };

  const activeCta = focus?.cta ?? topic?.cta;

  return (
    <div
      className={
        compact
          ? "relative w-full"
          : "relative w-full max-w-[440px] [perspective:1200px]"
      }
      onMouseMove={compact ? undefined : onMove}
      onMouseLeave={compact ? undefined : onLeave}
    >
      <motion.div
        style={
          compact
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        className={
          compact
            ? "relative isolate overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_48px_-24px_rgba(15,23,42,0.22)] ring-1 ring-slate-900/[0.04]"
            : "relative isolate overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_40px_80px_-32px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/[0.05]"
        }
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.028)_1px,transparent_1px)] bg-[size:28px_28px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#FF5722]/[0.07] blur-3xl"
          aria-hidden
        />

        <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3">
            <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
            <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
            <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
            <span className="ml-1 text-xs font-bold text-slate-700">Meneer Marketing</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                {timeBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                Online
              </span>
            </span>
          </div>

          <div
            className={`flex flex-col p-4 sm:p-5 ${
              compact ? "min-h-[248px]" : "min-h-[360px] sm:min-h-[380px] sm:p-6"
            }`}
          >
            <div className="flex flex-1 flex-col gap-2.5">
              {messages.map((msg) => (
                <HeroBubble key={msg.id} from={msg.from} text={msg.text} />
              ))}
              {typing ? <TypingIndicator /> : null}

              <AnimatePresence mode="wait">
                {phase === "topic" && !typing ? (
                  <ChoicePills
                    key="topic"
                    options={HERO_CHAT_OPTIONS}
                    onPick={(id) => {
                      const option = HERO_CHAT_OPTIONS.find((o) => o.id === id);
                      if (option) pickTopic(option);
                    }}
                  />
                ) : null}

                {phase === "focus" && !typing && topic ? (
                  <ChoicePills
                    key="focus"
                    options={topic.focusOptions}
                    onPick={(id) => {
                      const option = topic.focusOptions.find((o) => o.id === id);
                      if (option) pickFocus(option);
                    }}
                  />
                ) : null}
              </AnimatePresence>
            </div>

            {phase === "done" && activeCta && !typing ? (
              <HeroCtaButton cta={activeCta} onReset={reset} />
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

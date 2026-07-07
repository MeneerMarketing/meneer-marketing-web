"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import {
  DIENSTEN_CHAT_INTRO,
  DIENSTEN_CHAT_OPTIONS,
  type DienstenChatOption,
} from "@/data/diensten-hero-chat";

const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "intro" | "pick" | "done";

function TypingDots() {
  return (
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
  );
}

function Bubble({ from, text }: { from: "meneer" | "jij"; text: string }) {
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
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm font-semibold leading-snug ${
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

function scrollToAnchor(anchor: string) {
  document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function DienstenServiceChat() {
  const reduce = useReducedMotion();
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.35);
  const [phase, setPhase] = useState<Phase>("intro");
  const [introIndex, setIntroIndex] = useState(0);
  const [showTyping, setShowTyping] = useState(true);
  const [picked, setPicked] = useState<DienstenChatOption | null>(null);

  useEffect(() => {
    if (phase !== "intro" || reduce) {
      setShowTyping(false);
      if (reduce && phase === "intro") setPhase("pick");
      return;
    }
    if (introIndex >= DIENSTEN_CHAT_INTRO.length) {
      setShowTyping(false);
      setPhase("pick");
      return;
    }
    setShowTyping(true);
    const t = setTimeout(() => {
      setShowTyping(false);
      setIntroIndex((i) => i + 1);
    }, 900 + introIndex * 400);
    return () => clearTimeout(t);
  }, [phase, introIndex, reduce]);

  const reset = useCallback(() => {
    setPhase("intro");
    setIntroIndex(0);
    setShowTyping(true);
    setPicked(null);
  }, []);

  const handlePick = (option: DienstenChatOption) => {
    setPicked(option);
    setPhase("done");
    window.setTimeout(() => scrollToAnchor(option.anchor), 400);
  };

  return (
    <div
      className="relative w-full max-w-[440px] [perspective:1200px] lg:max-w-none"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-[28px] border border-slate-200/90 bg-white/95 shadow-[0_40px_80px_-32px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/[0.05] backdrop-blur-md"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.028)_1px,transparent_1px)] bg-[size:28px_28px]"
          aria-hidden
        />

        <div className="relative z-10 p-4 sm:p-5" style={{ transform: "translateZ(20px)" }}>
          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <InteractiveLogo className="size-7" interactive={false} />
              <div>
                <p className="text-xs font-extrabold text-slate-900">Meneer Marketing</p>
                <p className="text-[10px] font-semibold text-emerald-600">Online · routewijzer</p>
              </div>
            </div>
            {phase === "done" ? (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
              >
                <RotateCcw className="size-3" aria-hidden />
                Opnieuw
              </button>
            ) : null}
          </div>

          <div className="flex max-h-[min(420px,58vh)] flex-col gap-3 overflow-y-auto pr-1">
            {DIENSTEN_CHAT_INTRO.slice(0, introIndex).map((line) => (
              <Bubble key={line} from="meneer" text={line} />
            ))}

            {showTyping && phase === "intro" ? (
              <div className="flex items-end gap-2.5">
                <InteractiveLogo className="size-8 shrink-0" interactive={false} />
                <TypingDots />
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              {phase === "pick" ? (
                <motion.div
                  key="pick"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-2 pl-10"
                >
                  {DIENSTEN_CHAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handlePick(opt)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 shadow-sm transition hover:border-[#FF5722] hover:text-[#FF5722]"
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>

            {picked ? (
              <>
                <Bubble from="jij" text={picked.userReply} />
                <Bubble from="meneer" text={picked.meneerReply} />
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="pl-10 pt-1"
                >
                  <button
                    type="button"
                    onClick={() => scrollToAnchor(picked.anchor)}
                    className="group flex w-full items-center justify-between gap-3 rounded-2xl bg-[#FF5722] px-4 py-3.5 text-white shadow-[0_18px_40px_-16px_rgba(255,87,34,0.7)] transition hover:bg-orange-600"
                  >
                    <span className="text-sm font-extrabold">{picked.ctaLabel}</span>
                    <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </button>
                </motion.div>
              </>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatGptLogoMark } from "@/components/icons/ChatGptLogoMark";
import { GeminiLogoMark } from "@/components/icons/GeminiLogoMark";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";
import { GoogleWordmark } from "@/components/icons/GoogleWordmark";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

const AI_REPLY =
  "Op basis van reviews en online autoriteit valt jouw merk op als betrouwbare keuze in deze niche.";

const BRAND_IN_REPLY = "jouw merk";
const BRAND_START = AI_REPLY.indexOf(BRAND_IN_REPLY);

type Channel = "google" | "chatgpt" | "gemini";

const CHANNELS: { id: Channel; label: string; shortLabel: string }[] = [
  { id: "google", label: "Google", shortLabel: "Google" },
  { id: "chatgpt", label: "ChatGPT", shortLabel: "GPT" },
  { id: "gemini", label: "Gemini", shortLabel: "Gemini" },
];

/**
 * Dual-channel vindbaarheid: full-width, links uitgelijnd met sectie-copy.
 */
export function HomeMobileVindbaarheidVisual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12%" });
  const [channel, setChannel] = useState<Channel>("google");
  const [typed, setTyped] = useState(reduce ? AI_REPLY : "");
  const [phase, setPhase] = useState<"idle" | "typing" | "done">(reduce ? "done" : "idle");

  useEffect(() => {
    if (!isInView || reduce || channel === "google") return;
    const t = window.setTimeout(() => setPhase("typing"), 500);
    return () => window.clearTimeout(t);
  }, [isInView, reduce, channel]);

  useEffect(() => {
    if (phase !== "typing" || reduce) return;
    setTyped("");
    let i = 0;
    const tick = window.setInterval(() => {
      i += 2;
      setTyped(AI_REPLY.slice(0, i));
      if (i >= AI_REPLY.length) {
        window.clearInterval(tick);
        setPhase("done");
      }
    }, 24);
    return () => window.clearInterval(tick);
  }, [phase, reduce, channel]);

  function selectChannel(id: Channel) {
    setChannel(id);
    if (id === "google") {
      setPhase("done");
      setTyped(AI_REPLY);
      return;
    }
    if (!reduce) {
      setPhase("idle");
      setTyped("");
      window.setTimeout(() => setPhase("typing"), 280);
    }
  }

  return (
    <div ref={ref} className="w-full min-w-0">
      {/* Kanaal-tabs: full width, gelijk verdeeld */}
      <div className="mb-3 grid grid-cols-3 gap-1 rounded-2xl border border-slate-200/90 bg-slate-100/80 p-1">
        {CHANNELS.map((c) => {
          const active = channel === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => selectChannel(c.id)}
              className={`flex min-w-0 items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-[10px] font-extrabold tracking-tight transition-all duration-300 sm:gap-1.5 sm:px-2 ${
                active
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {c.id === "google" ? (
                <GoogleLogoMark className="size-3.5 shrink-0" />
              ) : c.id === "chatgpt" ? (
                <ChatGptLogoMark className="size-3.5 shrink-0" />
              ) : (
                <GeminiLogoMark className="size-3.5 shrink-0" />
              )}
              <span className="truncate sm:hidden">{c.shortLabel}</span>
              <span className="hidden truncate sm:inline">{c.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {channel === "google" ? (
          <motion.div
            key="google"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_16px_40px_-22px_rgba(15,23,42,0.14)]"
          >
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
              <GoogleLogoMark className="size-5 shrink-0" />
              <div className="flex min-w-0 flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                <span className="truncate text-[11px] font-medium text-slate-600">
                  beste [jouw dienst] nederland
                </span>
              </div>
            </div>

            <div className="space-y-2 px-4 py-3">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35, ease: EASE }}
                className="flex gap-2.5 rounded-xl border-2 border-[#FF5722]/30 bg-orange-50/70 p-3"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-[9px] font-black leading-none text-white">
                  1
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
                    Jouw merk
                  </p>
                  <p className="mt-0.5 text-[11px] font-extrabold leading-snug text-[#1a0dab]">
                    Jouw merk · Expert in [jouw dienst]
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-slate-600">
                    meneermarketing.nl/jouw-pagina
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <InteractiveLogo className="size-4 shrink-0" interactive={false} />
                    <span className="text-[9px] font-bold text-slate-500">Geciteerd door Google</span>
                  </div>
                </div>
              </motion.div>

              <div className="rounded-xl px-1 py-1 opacity-40">
                <p className="text-[10px] font-bold text-slate-400">2 · Concurrent.nl</p>
                <p className="truncate text-[10px] text-slate-400">
                  Generieke pagina zonder autoriteit...
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2.5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                <Check className="size-3.5 shrink-0" strokeWidth={3} aria-hidden />
                Positie 1 · organisch
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={channel}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_16px_40px_-22px_rgba(15,23,42,0.14)]"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
              {channel === "chatgpt" ? (
                <ChatGptLogoMark className="size-6 shrink-0" />
              ) : (
                <GeminiLogoMark className="size-6 shrink-0" />
              )}
              <span className="text-[11px] font-extrabold text-slate-800">
                {channel === "chatgpt" ? "ChatGPT" : "Gemini"}
              </span>
              <span className="ml-auto size-2 shrink-0 rounded-full bg-emerald-400" aria-hidden />
            </div>

            <div className="space-y-2.5 px-4 py-3">
              <div className="flex justify-end">
                <p className="max-w-[90%] rounded-2xl rounded-br-sm bg-slate-900 px-3 py-2 text-[10px] font-semibold leading-snug text-white">
                  Welk bedrijf raad je aan voor [jouw dienst]?
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  {channel === "chatgpt" ? (
                    <ChatGptLogoMark className="size-7" />
                  ) : (
                    <GeminiLogoMark className="size-7" />
                  )}
                </span>
                <div className="min-w-0 flex-1 rounded-2xl rounded-bl-sm border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-medium leading-relaxed text-slate-700">
                    {typed.slice(0, BRAND_START)}
                    {typed.length > BRAND_START ? (
                      <span className="font-extrabold text-[#FF5722]">
                        {typed.slice(BRAND_START, BRAND_START + BRAND_IN_REPLY.length)}
                      </span>
                    ) : null}
                    {typed.slice(BRAND_START + BRAND_IN_REPLY.length)}
                    {phase === "typing" ? (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.75, repeat: Infinity }}
                        className="ml-0.5 inline-block h-2.5 w-0.5 bg-slate-400 align-middle"
                        aria-hidden
                      />
                    ) : null}
                  </p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {phase === "done" ? (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-[#FF5722]/20 bg-[#FF5722]/5 px-4 py-2.5"
                >
                  <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FF5722]">
                    <Check className="size-3.5 shrink-0" strokeWidth={3} aria-hidden />
                    Jij staat in het antwoord
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3 text-left text-[10px] font-bold leading-relaxed tracking-tight text-slate-500">
        <GoogleWordmark className="text-[11px] font-extrabold" />
        <span className="mx-1 text-slate-300">·</span>
        <span className="text-slate-700">ChatGPT</span>
        <span className="mx-1 text-slate-300">·</span>
        <span className="text-slate-700">Gemini</span>
        <span className="mx-1 text-slate-300">·</span>
        <span className="text-[#FF5722]">SEO & AI, één strategie</span>
      </p>
    </div>
  );
}

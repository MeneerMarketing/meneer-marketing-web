"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const SOURCES = ["FAQ", "Productfeed", "Policies"] as const;

const REPLIES = [
  { q: "Wat is de levertijd?", a: "2-3 werkdagen binnen NL. Gratis vanaf €50.", sources: [0, 2] },
  { q: "Past dit bij gevoelige huid?", a: "Clinical-grade ontwerp. Check het LED Passport voor jouw protocol.", sources: [0, 1] },
] as const;

/**
 * Chat-interface met RAG-bronnen en menselijke escalatie.
 */
export function HeroChatRagWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [msgIdx, setMsgIdx] = useState(0);
  const [typing, setTyping] = useState(false);
  const [showAnswer, setShowAnswer] = useState(reduce);
  const [escalated, setEscalated] = useState(false);

  useEffect(() => {
    if (!isInView || reduce) return;
    setTyping(true);
    setShowAnswer(false);
    const t1 = window.setTimeout(() => {
      setTyping(false);
      setShowAnswer(true);
    }, 900);
    const t2 = window.setTimeout(() => {
      setMsgIdx((i) => (i + 1) % REPLIES.length);
      setEscalated((e) => !e);
    }, 4500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [isInView, reduce, msgIdx]);

  const current = REPLIES[msgIdx];

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full items-center justify-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex w-full max-w-[300px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          style={{ transform: "translateZ(38px)" }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#FF5722]/10 text-[#FF5722]">
                <Bot className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Support AI</p>
                <p className="text-[9px] text-emerald-600">● Getraind op jouw data</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEscalated((e) => !e)}
              className={`rounded-full px-2 py-1 text-[8px] font-bold transition-colors ${
                escalated
                  ? "bg-violet-100 text-violet-700"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {escalated ? "Mens actief" : "Escalatie"}
            </button>
          </div>

          <div className="space-y-3 p-4">
            <div className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-md bg-slate-900 px-3 py-2 text-[11px] font-medium text-white">
                {current.q}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {typing && !reduce ? (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="flex size-6 items-center justify-center rounded-full bg-orange-50 text-[#FF5722]">
                    <Bot className="size-3" aria-hidden />
                  </span>
                  <span className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }}
                        className="size-1.5 rounded-full bg-slate-400"
                      />
                    ))}
                  </span>
                </motion.div>
              ) : showAnswer ? (
                <motion.div
                  key="answer"
                  initial={reduce ? undefined : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#FF5722]">
                    {escalated ? <User className="size-3" aria-hidden /> : <Bot className="size-3" aria-hidden />}
                  </span>
                  <div>
                    <p className="max-w-[220px] rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2 text-[11px] font-medium text-slate-800">
                      {current.a}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {SOURCES.map((src, i) => (
                        <span
                          key={src}
                          className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                            current.sources.some((s) => s === i)
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-50 text-slate-400"
                          }`}
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

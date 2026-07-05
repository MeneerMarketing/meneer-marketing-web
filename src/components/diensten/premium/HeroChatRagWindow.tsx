"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const SOURCES = ["FAQ", "Productfeed", "Policies"] as const;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: readonly number[];
  human?: boolean;
}

const CONVERSATION: ChatMessage[] = [
  {
    id: "u1",
    role: "user",
    text: "Leveren jullie ook op zaterdag?",
  },
  {
    id: "a1",
    role: "assistant",
    text: "Ma-vr. Bestel voor 22:00 en het staat de volgende werkdag ingepland.",
    sources: [0, 2],
  },
  {
    id: "u2",
    role: "user",
    text: "Welke maat past bij een boxspring van 180?",
  },
  {
    id: "a2",
    role: "assistant",
    text: "180×200. Ik check je productfeed: het Studio model is op voorraad.",
    sources: [0, 1],
    human: true,
  },
];

/**
 * Chat-interface met RAG-bronnen en menselijke escalatie.
 */
export function HeroChatRagWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [visibleCount, setVisibleCount] = useState(reduce ? CONVERSATION.length : 2);
  const [typing, setTyping] = useState(false);
  const [escalated, setEscalated] = useState(false);

  useEffect(() => {
    if (!isInView || reduce) return;

    if (visibleCount >= CONVERSATION.length) {
      const reset = window.setTimeout(() => {
        setVisibleCount(2);
        setEscalated(false);
      }, 5200);
      return () => window.clearTimeout(reset);
    }

    const next = CONVERSATION[visibleCount];
    const isAssistant = next?.role === "assistant";

    if (isAssistant) {
      setTyping(true);
      const typingTimer = window.setTimeout(() => {
        setTyping(false);
        setVisibleCount((c) => c + 1);
        if (next?.human) setEscalated(true);
      }, 850);
      return () => window.clearTimeout(typingTimer);
    }

    const userTimer = window.setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, 700);
    return () => window.clearTimeout(userTimer);
  }, [isInView, reduce, visibleCount]);

  const visibleMessages = CONVERSATION.slice(0, visibleCount);

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
          className="flex w-full max-w-[340px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          style={{ transform: "translateZ(38px)" }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#FF5722]/10 text-[#FF5722]">
                <Bot className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">Support AI</p>
                <p className="text-[10px] text-emerald-600">● Getraind op jouw data</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEscalated((e) => !e)}
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold transition-colors ${
                escalated
                  ? "bg-violet-100 text-violet-700"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {escalated ? "Mens actief" : "Escalatie"}
            </button>
          </div>

          <div className="min-h-[260px] space-y-3.5 p-4 sm:p-5">
            <AnimatePresence initial={false}>
              {visibleMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={reduce ? undefined : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={message.role === "user" ? "flex justify-end" : "flex gap-2.5"}
                >
                  {message.role === "user" ? (
                    <p className="max-w-[88%] rounded-2xl rounded-br-md bg-slate-900 px-3.5 py-2.5 text-[11px] font-medium leading-relaxed text-white sm:text-xs">
                      {message.text}
                    </p>
                  ) : (
                    <>
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#FF5722]">
                        {message.human || escalated ? (
                          <User className="size-3.5" aria-hidden />
                        ) : (
                          <Bot className="size-3.5" aria-hidden />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="max-w-[240px] rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2.5 text-[11px] font-medium leading-relaxed text-slate-800 sm:text-xs">
                          {message.text}
                        </p>
                        {message.sources ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {SOURCES.map((src, i) => (
                              <span
                                key={src}
                                className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                                  message.sources?.some((s) => s === i)
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-50 text-slate-400"
                                }`}
                              >
                                {src}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && !reduce ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2.5"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-orange-50 text-[#FF5722]">
                  <Bot className="size-3.5" aria-hidden />
                </span>
                <span className="flex gap-1 rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-3">
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
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowUpRight, Mic, Plus } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatGptIcon } from "@/components/icons/ChatGptIcon";
import { GeminiIcon } from "@/components/icons/GeminiIcon";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HOME_MOBILE_AI_BILLBOARD } from "@/data/home-mobile-editorial";

const EASE = [0.22, 1, 0.36, 1] as const;
const COPY = HOME_MOBILE_AI_BILLBOARD;

type AiPlatform = "chatgpt" | "gemini";
type Phase = "idle" | "input" | "sent" | "ai-typing" | "ai-reply" | "done";

const PLATFORMS: readonly { id: AiPlatform; label: string }[] = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "gemini", label: "Gemini" },
] as const;

function AiTypingDots({ variant }: { variant: AiPlatform }) {
  const dotClass =
    variant === "gemini" ? "bg-blue-300/80" : "bg-slate-400";

  return (
    <span className="inline-flex gap-1 py-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={`size-1.5 rounded-full ${dotClass}`}
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
          transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14 }}
        />
      ))}
    </span>
  );
}

function useAiChatDemo(active: boolean, reduce: boolean) {
  const [phase, setPhase] = useState<Phase>(reduce ? "done" : "idle");
  const [inputText, setInputText] = useState(reduce ? COPY.userQuestion : "");
  const fullAiReply = `${COPY.aiReplyLead}${COPY.aiReplyHighlight}${COPY.aiReplyTail}`;
  const [aiText, setAiText] = useState(reduce ? fullAiReply : "");

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setPhase("done");
      setInputText(COPY.userQuestion);
      setAiText(fullAiReply);
      return;
    }

    setPhase("idle");
    setInputText("");
    setAiText("");

    const t = window.setTimeout(() => setPhase("input"), 350);
    return () => window.clearTimeout(t);
  }, [active, reduce, fullAiReply]);

  useEffect(() => {
    if (!active || phase !== "input" || reduce) return;

    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setInputText(COPY.userQuestion.slice(0, i));
      if (i >= COPY.userQuestion.length) {
        window.clearInterval(tick);
        window.setTimeout(() => setPhase("sent"), 420);
      }
    }, 32);

    return () => window.clearInterval(tick);
  }, [active, phase, reduce]);

  useEffect(() => {
    if (!active || phase !== "sent" || reduce) return;
    const t = window.setTimeout(() => setPhase("ai-typing"), 500);
    return () => window.clearTimeout(t);
  }, [active, phase, reduce]);

  useEffect(() => {
    if (!active || phase !== "ai-typing" || reduce) return;
    const t = window.setTimeout(() => setPhase("ai-reply"), 900);
    return () => window.clearTimeout(t);
  }, [active, phase, reduce]);

  useEffect(() => {
    if (!active || phase !== "ai-reply" || reduce) return;

    let i = 0;
    const tick = window.setInterval(() => {
      i += 2;
      setAiText(fullAiReply.slice(0, i));
      if (i >= fullAiReply.length) {
        window.clearInterval(tick);
        setPhase("done");
      }
    }, 22);

    return () => window.clearInterval(tick);
  }, [active, phase, reduce, fullAiReply]);

  return { phase, inputText, aiText, fullAiReply };
}

function AiReplyText({ aiText }: { aiText: string }) {
  const aiLeadLen = COPY.aiReplyLead.length;
  const aiHighlightEnd = aiLeadLen + COPY.aiReplyHighlight.length;

  return (
    <p className="text-[12px] font-medium leading-relaxed text-white/85">
      {aiText.slice(0, aiLeadLen)}
      {aiText.length > aiLeadLen ? (
        <span className="font-bold text-[#FF5722]">
          {aiText.slice(aiLeadLen, Math.min(aiText.length, aiHighlightEnd))}
        </span>
      ) : null}
      {aiText.length > aiHighlightEnd ? aiText.slice(aiHighlightEnd) : null}
    </p>
  );
}

function GeminiReplyText({ aiText }: { aiText: string }) {
  const aiLeadLen = COPY.aiReplyLead.length;
  const aiHighlightEnd = aiLeadLen + COPY.aiReplyHighlight.length;

  return (
    <p className="text-[12px] font-normal leading-relaxed text-[#e8eaed]">
      {aiText.slice(0, aiLeadLen)}
      {aiText.length > aiLeadLen ? (
        <span className="bg-gradient-to-r from-[#4285F4] via-[#9B72F2] to-[#D96570] bg-clip-text font-semibold text-transparent">
          {aiText.slice(aiLeadLen, Math.min(aiText.length, aiHighlightEnd))}
        </span>
      ) : null}
      {aiText.length > aiHighlightEnd ? aiText.slice(aiHighlightEnd) : null}
    </p>
  );
}

interface AiChatPanelProps {
  platform: AiPlatform;
  active: boolean;
  reduce: boolean;
}

function ChatGptPanel({ active, reduce }: AiChatPanelProps) {
  const { phase, inputText, aiText } = useAiChatDemo(active, reduce);

  const showUserBubble = phase !== "idle" && phase !== "input";
  const showAiBubble = phase === "ai-typing" || phase === "ai-reply" || phase === "done";
  const inputActive = phase === "input";
  const inputSubmitted = phase !== "idle" && phase !== "input";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#1a1a1a] shadow-[0_28px_64px_-28px_rgba(0,0,0,0.65)]">
      <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-4 py-3">
        <ChatGptIcon size={28} className="size-7 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">ChatGPT</p>
          <p className="text-[10px] font-medium text-white/40">{COPY.liveStatus}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
          Live
        </span>
      </div>

      <div className="flex min-h-[15.5rem] flex-1 flex-col space-y-3 px-4 py-4">
        <div
          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors duration-300 ${
            inputActive
              ? "border-[#FF5722]/40 bg-white/[0.06] ring-1 ring-[#FF5722]/20"
              : inputSubmitted
                ? "border-white/8 bg-white/[0.03]"
                : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="text-[11px] text-white/30" aria-hidden>
            ›
          </span>
          <p className="min-w-0 flex-1 truncate text-[12px] font-medium text-white/85">
            {inputActive ? (
              <>
                {inputText}
                <motion.span
                  className="ml-0.5 inline-block h-[0.9em] w-px bg-[#FF5722]"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  aria-hidden
                />
              </>
            ) : inputSubmitted ? (
              <span className="text-white/45">{COPY.userQuestion}</span>
            ) : (
              <span className="text-white/35">Stel een vraag…</span>
            )}
          </p>
          <ChatGptIcon size={16} className="size-4 shrink-0 opacity-90" />
        </div>

        <AnimatePresence>
          {showUserBubble ? (
            <motion.div
              key="user"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="flex justify-end"
            >
              <p className="max-w-[92%] rounded-2xl rounded-br-sm bg-white px-3.5 py-2.5 text-[12px] font-semibold leading-snug text-slate-900">
                {COPY.userQuestion}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showAiBubble ? (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="flex items-start gap-2.5"
            >
              <ChatGptIcon size={28} className="size-7 shrink-0" />
              <div className="min-w-0 flex-1 rounded-2xl rounded-bl-sm border border-white/[0.08] bg-white/[0.06] px-3.5 py-2.5">
                {phase === "ai-typing" ? (
                  <AiTypingDots variant="chatgpt" />
                ) : (
                  <AiReplyText aiText={aiText} />
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GeminiPanel({ active, reduce }: AiChatPanelProps) {
  const { phase, inputText, aiText } = useAiChatDemo(active, reduce);

  const showUserBubble = phase !== "idle" && phase !== "input";
  const showAiBubble = phase === "ai-typing" || phase === "ai-reply" || phase === "done";
  const inputActive = phase === "input";
  const inputSubmitted = phase !== "idle" && phase !== "input";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/[0.06] bg-[#131314] shadow-[0_28px_64px_-28px_rgba(0,0,0,0.65)]">
      <div
        className="h-px w-full shrink-0 bg-[linear-gradient(90deg,#4285F4,#9B72F2,#D96570,#F4B400)]"
        aria-hidden
      />

      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-3">
        <GeminiIcon size={26} className="size-6 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#e8eaed]">Gemini</p>
          <p className="text-[10px] font-medium text-[#9aa0a6]">{COPY.liveStatus}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-semibold text-[#bdc1c6]">
          {COPY.geminiModelLabel}
        </span>
      </div>

      <div className="flex min-h-[15.5rem] flex-1 flex-col justify-between px-4 py-4">
        <div className="space-y-3">
          <AnimatePresence>
            {showUserBubble ? (
              <motion.div
                key="user"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="flex justify-end"
              >
                <p className="max-w-[92%] rounded-[1.25rem] bg-[#282a2c] px-3.5 py-2.5 text-[12px] font-normal leading-snug text-[#e8eaed]">
                  {COPY.userQuestion}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {showAiBubble ? (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="flex items-start gap-2.5"
              >
                <GeminiIcon size={22} className="mt-0.5 size-[22px] shrink-0" />
                <div className="min-w-0 flex-1">
                  {phase === "ai-typing" ? (
                    <AiTypingDots variant="gemini" />
                  ) : (
                    <GeminiReplyText aiText={aiText} />
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-4 shrink-0">
          <div className="rounded-[1.35rem] bg-[linear-gradient(90deg,#4285F4,#9B72F2,#D96570,#F4B400)] p-[1.5px]">
            <div className="flex items-center gap-2 rounded-[1.28rem] bg-[#1e1f20] px-3 py-2.5">
              <Plus className="size-4 shrink-0 text-[#9aa0a6]" aria-hidden />
              <p className="min-w-0 flex-1 truncate text-[12px] text-[#9aa0a6]">
                {inputActive ? (
                  <>
                    <span className="text-[#e8eaed]">{inputText}</span>
                    <motion.span
                      className="ml-0.5 inline-block h-[0.9em] w-px bg-[#8ab4f8]"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      aria-hidden
                    />
                  </>
                ) : inputSubmitted ? (
                  <span className="text-[#5f6368]">{COPY.userQuestion}</span>
                ) : (
                  "Vraag het Gemini"
                )}
              </p>
              <Mic className="size-4 shrink-0 text-[#9aa0a6]" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Interactief AI-billboard: swipe tussen ChatGPT en Gemini. */
export function HomeMobileAiBillboard() {
  const reduce = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLUListElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const [activePlatform, setActivePlatform] = useState<AiPlatform>("chatgpt");

  const scrollToPlatform = useCallback((platform: AiPlatform) => {
    const el = scrollRef.current;
    if (!el) return;
    const gap = 12;
    const idx = platform === "chatgpt" ? 0 : 1;
    el.scrollTo({
      left: idx * (el.clientWidth + gap),
      behavior: reduce ? "auto" : "smooth",
    });
    setActivePlatform(platform);
  }, [reduce]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const gap = 12;
    const slideWidth = el.clientWidth;
    const idx = Math.round(el.scrollLeft / (slideWidth + gap));
    setActivePlatform(idx >= 1 ? "gemini" : "chatgpt");
  }, []);

  return (
    <section
      ref={containerRef}
      aria-labelledby="mobile-ai-billboard-title"
      className="relative overflow-x-clip bg-slate-950 py-14"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-12 top-8 size-48 rounded-full bg-[#FF5722]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-12 size-56 rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full min-w-0 max-w-6xl px-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <p className="text-[11px] font-bold tracking-[0.12em] text-[#FF5722]">
            AI-zoek · ChatGPT, Gemini &amp; meer
          </p>
          <h2
            id="mobile-ai-billboard-title"
            className="mt-3 text-pretty text-[clamp(1.65rem,7.5vw,2.15rem)] font-extrabold leading-[1.08] tracking-tight text-white"
          >
            {COPY.title}{" "}
            <span className="text-[#FF5722]">{COPY.titleAccent}</span>
          </h2>
          <p className="mt-3 max-w-lg text-pretty text-[15px] leading-relaxed text-slate-400">
            {COPY.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.08, duration: 0.5, ease: EASE }}
          className="mt-6"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
              {PLATFORMS.map((item) => {
                const active = activePlatform === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToPlatform(item.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                      active
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-white/55 hover:text-white/85"
                    }`}
                  >
                    {item.id === "chatgpt" ? (
                      <ChatGptIcon size={14} className="size-3.5" />
                    ) : (
                      <GeminiIcon size={14} className="size-3.5" />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] font-semibold text-white/35">{COPY.swipeHint} →</p>
          </div>

          <div className="-mx-4 overflow-x-clip px-4">
            <ul
              ref={scrollRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onScroll={handleScroll}
            >
              <li className="w-full min-w-full shrink-0 snap-center">
                <ChatGptPanel
                  platform="chatgpt"
                  active={isInView && activePlatform === "chatgpt"}
                  reduce={reduce}
                />
              </li>
              <li className="w-full min-w-full shrink-0 snap-center">
                <GeminiPanel
                  platform="gemini"
                  active={isInView && activePlatform === "gemini"}
                  reduce={reduce}
                />
              </li>
            </ul>
          </div>

          <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
            {PLATFORMS.map((item) => (
              <span
                key={item.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activePlatform === item.id
                    ? "w-5 bg-[#FF5722]"
                    : "w-1.5 bg-white/25"
                }`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, duration: 0.45, ease: EASE }}
          className="mt-5 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5"
        >
          <InteractiveLogo className="size-8 shrink-0" interactive={false} />
          <p className="min-w-0 flex-1 text-[11px] font-bold leading-snug text-white/80">
            {COPY.footer}
          </p>
          <Link
            href="/vindbaarheid"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-white transition hover:bg-orange-600"
            aria-label="Meer over vindbaarheid en AI-zoek"
          >
            <ArrowUpRight className="size-4" strokeWidth={2.5} aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

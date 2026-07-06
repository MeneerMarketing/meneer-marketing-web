"use client";

import { Mic, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChatGptIcon } from "@/components/icons/ChatGptIcon";
import { GeminiIcon } from "@/components/icons/GeminiIcon";
import { HOME_MOBILE_AI_BILLBOARD } from "@/data/home-mobile-editorial";

export const AI_BILLBOARD_COPY = HOME_MOBILE_AI_BILLBOARD;
const COPY = AI_BILLBOARD_COPY;
const EASE = [0.22, 1, 0.36, 1] as const;

export type AiPlatform = "chatgpt" | "gemini";
type Phase = "idle" | "input" | "sent" | "ai-typing" | "ai-reply" | "done";

export const AI_PLATFORMS: readonly { id: AiPlatform; label: string }[] = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "gemini", label: "Gemini" },
] as const;

function AiTypingDots({ variant }: { variant: AiPlatform }) {
  const dotClass = variant === "gemini" ? "bg-blue-300/80" : "bg-slate-400";

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

  return { phase, inputText, aiText };
}

function AiReplyText({ aiText }: { aiText: string }) {
  const aiLeadLen = COPY.aiReplyLead.length;
  const aiHighlightEnd = aiLeadLen + COPY.aiReplyHighlight.length;

  return (
    <p className="text-[12px] font-medium leading-relaxed text-white/85 lg:text-[13px]">
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
    <p className="text-[12px] font-normal leading-relaxed text-[#e8eaed] lg:text-[13px]">
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

export interface AiChatPanelProps {
  platform: AiPlatform;
  active: boolean;
  reduce: boolean;
}

export function ChatGptPanel({ active, reduce }: AiChatPanelProps) {
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

      <div className="flex min-h-[15.5rem] flex-1 flex-col space-y-3 px-4 py-4 lg:min-h-[17rem]">
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

export function GeminiPanel({ active, reduce }: AiChatPanelProps) {
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

      <div className="flex min-h-[15.5rem] flex-1 flex-col justify-between px-4 py-4 lg:min-h-[17rem]">
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

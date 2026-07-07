"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { DIENSTEN_GROUP_CHAT } from "@/data/diensten-hub";

const EASE = [0.22, 1, 0.36, 1] as const;

function ChatBubble({
  sender,
  text,
  role,
}: {
  sender: string;
  text: string;
  role: "agency" | "user" | "meneer";
}) {
  const isMeneer = role === "meneer";
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {isMeneer ? (
        <InteractiveLogo className="size-8 shrink-0" interactive={false} />
      ) : (
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
            isUser ? "bg-[#FF5722] text-white" : "bg-slate-700 text-slate-300"
          }`}
        >
          {sender.charAt(0)}
        </span>
      )}
      <div className={`max-w-[85%] ${isUser ? "text-right" : ""}`}>
        <p className="text-[10px] font-bold text-slate-500">{sender}</p>
        <p
          className={`mt-0.5 rounded-2xl px-3.5 py-2.5 text-sm font-semibold leading-snug ${
            isMeneer
              ? "rounded-bl-sm bg-[#FF5722] text-white"
              : isUser
                ? "rounded-br-sm border border-slate-200 bg-slate-50 text-slate-800"
                : "rounded-bl-sm bg-slate-800 text-slate-200"
          }`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export function DienstenWakeUpCall() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [shown, setShown] = useState(reduce ? DIENSTEN_GROUP_CHAT.messages.length : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    if (shown >= DIENSTEN_GROUP_CHAT.messages.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [inView, shown, reduce]);

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      aria-labelledby="diensten-wakeup-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-14">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              {DIENSTEN_GROUP_CHAT.eyebrow}
            </p>
            <h2
              id="diensten-wakeup-heading"
              className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
            >
              {DIENSTEN_GROUP_CHAT.title}{" "}
              <span className="text-[#FF5722]">{DIENSTEN_GROUP_CHAT.titleAccent}</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              {DIENSTEN_GROUP_CHAT.lead}
            </p>
          </Reveal>

          <div ref={ref} className="mt-10 lg:mt-0">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_32px_64px_-32px_rgba(15,23,42,0.2)]">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <span className="size-2.5 rounded-full bg-emerald-400" />
                <p className="text-xs font-extrabold text-slate-800">
                  {DIENSTEN_GROUP_CHAT.groupName}
                </p>
                <span className="ml-auto text-[10px] font-bold text-slate-400">7 deelnemers</span>
              </div>
              <div className="flex max-h-[380px] flex-col gap-3 overflow-y-auto p-4 sm:p-5">
                {DIENSTEN_GROUP_CHAT.messages.slice(0, shown).map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <ChatBubble sender={msg.sender} text={msg.text} role={msg.role} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

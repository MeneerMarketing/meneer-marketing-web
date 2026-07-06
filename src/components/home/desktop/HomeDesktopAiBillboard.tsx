"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import {
  AI_BILLBOARD_COPY,
  AI_PLATFORMS,
  ChatGptPanel,
  GeminiPanel,
  type AiPlatform,
} from "@/components/home/ai/HomeAiBillboardPanels";
import { ChatGptIcon } from "@/components/icons/ChatGptIcon";
import { GeminiIcon } from "@/components/icons/GeminiIcon";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

const COPY = AI_BILLBOARD_COPY;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Desktop AI-billboard: één chat met schakelaar ChatGPT ↔ Gemini. */
export function HomeDesktopAiBillboard() {
  const reduce = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-12%" });
  const [platform, setPlatform] = useState<AiPlatform>("chatgpt");

  return (
    <section
      ref={sectionRef}
      aria-labelledby="desktop-ai-billboard-title"
      className="relative overflow-x-clip border-b border-slate-800 bg-slate-950 py-20 lg:py-28"
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
        className="pointer-events-none absolute -right-16 top-10 size-64 rounded-full bg-[#FF5722]/14 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-16 size-72 rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-[#FF5722]">
              AI-zoek · ChatGPT, Gemini &amp; meer
            </p>
            <h2
              id="desktop-ai-billboard-title"
              className="mt-4 text-pretty text-4xl font-extrabold leading-[1.06] tracking-tight text-white xl:text-[2.75rem]"
            >
              {COPY.title}{" "}
              <span className="text-[#FF5722]">{COPY.titleAccent}</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-400">
              {COPY.subtitle}
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5">
              <InteractiveLogo className="size-9 shrink-0" interactive={false} />
              <p className="min-w-0 flex-1 text-sm font-bold leading-snug text-white/85">
                {COPY.footer}
              </p>
              <Link
                href="/vindbaarheid"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-white transition hover:bg-orange-600"
                aria-label="Meer over vindbaarheid en AI-zoek"
              >
                <ArrowUpRight className="size-4" strokeWidth={2.5} aria-hidden />
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md lg:max-w-none lg:justify-self-end">
            <div
              className="mb-4 flex gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1"
              role="tablist"
              aria-label="Kies AI-platform"
            >
              {AI_PLATFORMS.map((item) => {
                const active = platform === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setPlatform(item.id)}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                      active
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-white/55 hover:text-white/90"
                    }`}
                  >
                    {item.id === "chatgpt" ? (
                      <ChatGptIcon size={18} className="size-[18px]" />
                    ) : (
                      <GeminiIcon size={18} className="size-[18px]" />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={platform}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                {platform === "chatgpt" ? (
                  <ChatGptPanel platform="chatgpt" active={isInView} reduce={reduce} />
                ) : (
                  <GeminiPanel platform="gemini" active={isInView} reduce={reduce} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

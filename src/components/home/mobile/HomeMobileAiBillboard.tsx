"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
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

const EASE = [0.22, 1, 0.36, 1] as const;
const COPY = AI_BILLBOARD_COPY;

/** Interactief AI-billboard: swipe tussen ChatGPT en Gemini. */
export function HomeMobileAiBillboard() {
  const reduce = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLUListElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const [activePlatform, setActivePlatform] = useState<AiPlatform>("chatgpt");

  const scrollToPlatform = useCallback(
    (platform: AiPlatform) => {
      const el = scrollRef.current;
      if (!el) return;
      const gap = 12;
      const idx = platform === "chatgpt" ? 0 : 1;
      el.scrollTo({
        left: idx * (el.clientWidth + gap),
        behavior: reduce ? "auto" : "smooth",
      });
      setActivePlatform(platform);
    },
    [reduce],
  );

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
              {AI_PLATFORMS.map((item) => {
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
            {AI_PLATFORMS.map((item) => (
              <span
                key={item.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activePlatform === item.id ? "w-5 bg-[#FF5722]" : "w-1.5 bg-white/25"
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

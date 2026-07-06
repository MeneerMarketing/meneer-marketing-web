"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  AI_BILLBOARD_COPY,
  ChatGptPanel,
  GeminiPanel,
} from "@/components/home/ai/HomeAiBillboardPanels";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

const COPY = AI_BILLBOARD_COPY;

/** Desktop AI-billboard: ChatGPT en Gemini naast elkaar, zelfde copy als mobiel. */
export function HomeDesktopAiBillboard() {
  const reduce = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-12%" });
  const [geminiActive, setGeminiActive] = useState(reduce);

  useEffect(() => {
    if (!isInView || reduce) {
      setGeminiActive(true);
      return;
    }
    const t = window.setTimeout(() => setGeminiActive(true), 1200);
    return () => window.clearTimeout(t);
  }, [isInView, reduce]);

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

          <div className="grid gap-4 sm:grid-cols-2">
            <ChatGptPanel platform="chatgpt" active={isInView} reduce={reduce} />
            <GeminiPanel platform="gemini" active={isInView && geminiActive} reduce={reduce} />
          </div>
        </div>
      </div>
    </section>
  );
}

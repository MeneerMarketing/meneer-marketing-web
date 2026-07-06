"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Lock } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { HOME_CASES } from "@/data/home-cases";
import type { HomeCase } from "@/data/home-cases";
import {
  HOME_MOBILE_BOUWEN_CASE_IDS,
  HOME_MOBILE_BOUWEN_CASE_LABELS,
  type BouwenCaseId,
} from "@/data/home-mobile-bouwen";

const EASE = [0.22, 1, 0.36, 1] as const;
const CARD_GAP = 12;

const BOUEN_CASES = HOME_MOBILE_BOUWEN_CASE_IDS.map(
  (id) => HOME_CASES.find((c) => c.id === id)!,
).filter(Boolean);

interface HomeMobileBouwenCaseVisualProps {
  /** Scroll naar deze case als tool-tab wisselt */
  preferredCaseId?: BouwenCaseId;
  onActiveCaseChange?: (caseId: BouwenCaseId) => void;
}

function CaseBrowser({ caseItem }: { caseItem: HomeCase }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12%" });

  const { previewVideo, previewPoster, previewImage, previewObjectPosition, website, palette } =
    caseItem;
  const hostname = website?.hostname ?? caseItem.client.toLowerCase();
  const videoAutoplay = Boolean(previewVideo) && !reduce && isInView;

  return (
    <div ref={ref} className="relative w-full min-w-0">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-50 blur-3xl"
        style={{ backgroundColor: `${palette.accent}44` }}
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#14111a] shadow-[0_28px_70px_-32px_rgba(0,0,0,0.75)]">
        <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
          <span className="size-2 shrink-0 rounded-full bg-[#FF5F57]" aria-hidden />
          <span className="size-2 shrink-0 rounded-full bg-[#FEBC2E]" aria-hidden />
          <span className="size-2 shrink-0 rounded-full bg-[#28C840]" aria-hidden />
          <div className="ml-1 flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1">
            <Lock className="size-2.5 shrink-0 text-emerald-400/90" aria-hidden />
            <span className="truncate font-mono text-[10px] font-medium text-white/55">
              {hostname}
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-[#FF5722] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
            Live
          </span>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden bg-[#0f0d14]">
          {previewVideo ? (
            <video
              key={previewVideo}
              src={previewVideo}
              poster={previewPoster}
              autoPlay={videoAutoplay}
              muted
              loop={videoAutoplay}
              playsInline
              preload={isInView ? "auto" : "none"}
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: previewObjectPosition ?? "center top" }}
              aria-label={`${caseItem.client} preview`}
            />
          ) : null}

          {previewImage && !previewVideo ? (
            <Image
              src={previewImage}
              alt={`${caseItem.client} preview`}
              fill
              unoptimized
              className="object-cover"
              style={{ objectPosition: previewObjectPosition ?? "top" }}
              sizes="(max-width: 768px) 100vw, 640px"
            />
          ) : null}

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent"
            aria-hidden
          />
        </div>

        <div className="border-t border-white/[0.08] bg-black/25 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold text-white/90">
            <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
            <span className="text-emerald-400/95">Nu live</span>
            <span className="text-white/30" aria-hidden>
              ·
            </span>
            <span>{caseItem.client}</span>
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {(HOME_MOBILE_BOUWEN_CASE_LABELS[caseItem.id as BouwenCaseId] ?? []).map(
              (label) => (
                <li
                  key={label}
                  className="rounded-full border border-white/12 bg-white/[0.06] px-2 py-0.5 text-[9px] font-bold tracking-tight text-white/70"
                >
                  {label}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Swipe-carousel met live cases (SkinComplete ↔ Hills Pilates). */
export function HomeMobileBouwenCaseVisual({
  preferredCaseId,
  onActiveCaseChange,
}: HomeMobileBouwenCaseVisualProps) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const activeCase = BOUEN_CASES[active] ?? BOUEN_CASES[0]!;

  const scrollToIndex = useCallback(
    (index: number) => {
      const list = listRef.current;
      const card = list?.children[index] as HTMLElement | undefined;
      if (!list || !card) return;
      list.scrollTo({ left: card.offsetLeft - list.offsetLeft, behavior: "smooth" });
      setActive(index);
      const caseId = BOUEN_CASES[index]?.id as BouwenCaseId | undefined;
      if (caseId) onActiveCaseChange?.(caseId);
    },
    [onActiveCaseChange],
  );

  useEffect(() => {
    if (!preferredCaseId) return;
    const idx = BOUEN_CASES.findIndex((c) => c.id === preferredCaseId);
    if (idx >= 0) scrollToIndex(idx);
  }, [preferredCaseId, scrollToIndex]);

  return (
    <div className="w-full min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
          <span
            className="size-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            aria-hidden
          />
          Echte cases
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
          Swipe →
        </span>
      </div>

      <div className="-mx-4 overflow-x-clip px-4">
        <ul
          ref={listRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            const card = el.querySelector("li");
            if (!card) return;
            const idx = Math.round(el.scrollLeft / (card.clientWidth + CARD_GAP));
            const next = Math.min(idx, BOUEN_CASES.length - 1);
            setActive(next);
            const caseId = BOUEN_CASES[next]?.id as BouwenCaseId | undefined;
            if (caseId) onActiveCaseChange?.(caseId);
          }}
        >
          {BOUEN_CASES.map((caseItem, index) => (
            <motion.li
              key={caseItem.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: EASE }}
              className="relative w-[min(92vw,22rem)] shrink-0 snap-center"
            >
              <CaseBrowser caseItem={caseItem} />
            </motion.li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-center gap-2" aria-hidden>
          {BOUEN_CASES.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-[#FF5722]" : "w-1.5 bg-white/25"
              }`}
              aria-label={`Case ${c.client}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCase.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <Link
            href={activeCase.href}
            className="group mt-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-tight text-[#FF5722]"
          >
            Bekijk {activeCase.client}
            <ArrowUpRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { GripVertical, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { PillarAssemblerSection } from "@/data/pillar-premium";

function HeroPreview() {
  return (
    <div className="space-y-2 p-3">
      <span className="block h-3 w-3/4 rounded-full bg-slate-900" aria-hidden />
      <span className="block h-2 w-1/2 rounded-full bg-slate-300" aria-hidden />
      <span className="mt-2 inline-block h-6 w-20 rounded-full bg-[#FF5722]" aria-hidden />
    </div>
  );
}

function TekstPreview() {
  return (
    <div className="space-y-1.5 p-3">
      {[1, 0.85, 0.7].map((w) => (
        <span
          key={w}
          className="block h-1.5 rounded-full bg-slate-200"
          style={{ width: `${w * 100}%` }}
          aria-hidden
        />
      ))}
    </div>
  );
}

function GridPreview() {
  return (
    <div className="grid grid-cols-3 gap-1.5 p-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-1 rounded-lg border border-slate-100 bg-slate-50 p-1.5">
          <span className="block aspect-square rounded bg-slate-200" aria-hidden />
          <span className="block h-1 w-4/5 rounded-full bg-slate-300" aria-hidden />
        </div>
      ))}
    </div>
  );
}

function ReviewsPreview() {
  return (
    <div className="flex items-center gap-2 p-3">
      <span className="text-sm text-amber-400" aria-hidden>
        ★★★★★
      </span>
      <span className="h-1.5 w-16 rounded-full bg-slate-200" aria-hidden />
    </div>
  );
}

function CtaPreview() {
  return (
    <div className="p-3">
      <span className="block h-8 w-full rounded-xl bg-[#FF5722]" aria-hidden />
    </div>
  );
}

const PREVIEWS: Record<string, () => ReactNode> = {
  hero: HeroPreview,
  tekst: TekstPreview,
  grid: GridPreview,
  reviews: ReviewsPreview,
  cta: CtaPreview,
};

interface BuildSectionPlaygroundProps {
  title: string;
  subtitle: string;
  sections: PillarAssemblerSection[];
}

export function BuildSectionPlayground({
  title,
  subtitle,
  sections,
}: BuildSectionPlaygroundProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(rootRef, { once: true, margin: "-80px" });

  const [slots, setSlots] = useState<(string | null)[]>(() =>
    sections.map(() => null),
  );
  const [palette, setPalette] = useState<string[]>(() =>
    sections.map((s) => s.id),
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [userTouched, setUserTouched] = useState(false);
  const userTouchedRef = useRef(false);

  const filledCount = slots.filter(Boolean).length;
  const complete = filledCount === sections.length;

  useEffect(() => {
    userTouchedRef.current = userTouched;
  }, [userTouched]);

  const reset = useCallback(() => {
    setSlots(sections.map(() => null));
    setPalette(sections.map((s) => s.id));
    setUserTouched(false);
  }, [sections]);

  const placeInSlot = useCallback((sectionId: string, slotIndex: number) => {
    setSlots((prev) => {
      if (prev[slotIndex]) return prev;
      const next = [...prev];
      next[slotIndex] = sectionId;
      return next;
    });
    setPalette((prev) => prev.filter((id) => id !== sectionId));
  }, []);

  const placeNextEmpty = useCallback(
    (sectionId: string) => {
      setSlots((prev) => {
        const emptyIndex = prev.findIndex((s) => s === null);
        if (emptyIndex === -1) return prev;
        const next = [...prev];
        next[emptyIndex] = sectionId;
        return next;
      });
      setPalette((prev) => prev.filter((id) => id !== sectionId));
    },
    [],
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setSlots(sections.map((s) => s.id));
      setPalette([]);
      return;
    }
    if (userTouchedRef.current) return;

    const timers = sections.map((section, i) =>
      window.setTimeout(() => {
        if (userTouchedRef.current) return;
        setSlots((prev) => {
          const emptyIndex = prev.findIndex((s) => s === null);
          if (emptyIndex === -1) return prev;
          const next = [...prev];
          next[emptyIndex] = section.id;
          return next;
        });
        setPalette((prev) => prev.filter((id) => id !== section.id));
      }, 600 + i * 450),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce, sections]);

  function handleDragEnd(sectionId: string, clientX: number, clientY: number) {
    setDraggingId(null);
    for (let i = 0; i < slotRefs.current.length; i++) {
      const el = slotRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        setUserTouched(true);
        placeInSlot(sectionId, i);
        return;
      }
    }
  }

  const labelFor = (id: string) =>
    sections.find((s) => s.id === id)?.label ?? id;

  return (
    <section
      ref={rootRef}
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white"
      aria-labelledby="assembler-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2
          id="assembler-heading"
          className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">{subtitle}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_32px_64px_-28px_rgba(15,23,42,0.22)]">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
              <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
              <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
              <span className="ml-3 flex-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-400">
                jouw-site.nl
              </span>
              <AnimatePresence>
                {complete ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600"
                  >
                    <Sparkles className="size-3" aria-hidden />
                    Live
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="min-h-[320px] space-y-2 p-4">
              {sections.map((section, index) => {
                const placedId = slots[index];
                const Preview = placedId ? PREVIEWS[placedId] : null;
                return (
                  <div
                    key={section.id}
                    ref={(el) => {
                      slotRefs.current[index] = el;
                    }}
                    className={`relative min-h-[52px] rounded-xl border-2 border-dashed transition-colors duration-300 ${
                      placedId
                        ? "border-transparent bg-slate-50/80"
                        : draggingId
                          ? "border-[#FF5722]/50 bg-[#FF5722]/[0.04]"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {placedId && Preview ? (
                        <motion.div
                          key={placedId}
                          initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 320, damping: 22 }}
                        >
                          <Preview />
                        </motion.div>
                      ) : (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex h-[52px] items-center justify-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300"
                        >
                          Sleep {section.label.toLowerCase()} hier
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sectie-palet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Sleep naar een vak, of klik om de volgende plek te vullen.
              </p>
              <ul className="mt-4 space-y-2">
                {palette.map((id) => (
                  <motion.li
                    key={id}
                    drag={reduce ? false : true}
                    dragSnapToOrigin
                    dragElastic={0.12}
                    whileDrag={
                      reduce
                        ? undefined
                        : {
                            scale: 1.04,
                            zIndex: 50,
                            boxShadow: "0 12px 32px rgba(15,23,42,0.18)",
                          }
                    }
                    onDragStart={() => setDraggingId(id)}
                    onDragEnd={(_, info) =>
                      handleDragEnd(id, info.point.x, info.point.y)
                    }
                    className="flex cursor-grab items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 active:cursor-grabbing"
                  >
                    <GripVertical className="size-4 shrink-0 text-slate-400" aria-hidden />
                    <button
                      type="button"
                      onClick={() => {
                        setUserTouched(true);
                        placeNextEmpty(id);
                      }}
                      className="flex-1 text-left text-sm font-bold text-slate-800"
                    >
                      {labelFor(id)}
                    </button>
                  </motion.li>
                ))}
                {palette.length === 0 ? (
                  <li className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-700">
                    Alles geplaatst. Site klaar.
                  </li>
                ) : null}
              </ul>
            </div>

            <button
              type="button"
              onClick={reset}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
            >
              <RotateCcw className="size-4" aria-hidden />
              Opnieuw bouwen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

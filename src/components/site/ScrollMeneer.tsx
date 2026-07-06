"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { MessageSquareText, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { useScrollSections } from "@/hooks/useScrollSections";
import {
  readScrollHintsEnabled,
  writeScrollHintsEnabled,
} from "@/lib/scroll-hints-preference";

/** Hoogte (px) van het mascotte-hoofd op de rail */
const HEAD_SIZE_MOBILE = 30;
const HEAD_SIZE_DESKTOP = 38;
const DESKTOP_BUBBLE_MQ = "(min-width: 1024px)";

/**
 * Speelse scrollbar: het hoofd rijdt mee met scroll, is sleepbaar en
 * klikbaar op de rail. Op desktop verschijnt een wolkje met de actieve sectie.
 * Op mobiel en tablet verborgen: native scroll, geen overlay aan de rand.
 */
export function ScrollMeneer() {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const [trackHeight, setTrackHeight] = useState(0);
  const [headSize, setHeadSize] = useState(HEAD_SIZE_DESKTOP);
  const [scrollable, setScrollable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showBubbles, setShowBubbles] = useState(false);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [hintsReady, setHintsReady] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.6,
  });

  const progress = reduce ? scrollYProgress : smooth;
  const headY = useTransform(progress, (v) => v * Math.max(trackHeight, 0));
  const trailScale = useTransform(progress, (v) => Math.max(v, 0.001));

  const velocity = useVelocity(smooth);
  const tiltTarget = useTransform(velocity, [-1.6, 0, 1.6], [-16, 0, 16]);
  const tilt = useSpring(tiltTarget, { stiffness: 220, damping: 16 });

  const { activeSection } = useScrollSections(showBubbles && hintsEnabled && hintsReady);

  const dismissHints = useCallback(() => {
    setHintsEnabled(false);
    writeScrollHintsEnabled(false);
  }, []);

  const restoreHints = useCallback(() => {
    setHintsEnabled(true);
    writeScrollHintsEnabled(true);
  }, []);

  useMotionValueEvent(progress, "change", (v) => {
    setProgressPercent(Math.round(v * 100));
  });

  const progressFromClientY = useCallback(
    (clientY: number) => {
      const rail = railRef.current;
      if (!rail || trackHeight <= 0) return 0;
      const rect = rail.getBoundingClientRect();
      const y = clientY - rect.top - headSize / 2;
      return Math.max(0, Math.min(1, y / trackHeight));
    },
    [headSize, trackHeight],
  );

  const scrollToProgress = useCallback((value: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: value * Math.max(maxScroll, 0), behavior: "auto" });
  }, []);

  const syncSpring = useCallback(() => {
    if (reduce) return;
    smooth.jump(scrollYProgress.get());
  }, [reduce, scrollYProgress, smooth]);

  const applyProgress = useCallback(
    (value: number) => {
      scrollToProgress(value);
      if (!reduce) smooth.jump(value);
    },
    [reduce, scrollToProgress, smooth],
  );

  useEffect(() => {
    function measure() {
      const doc = document.documentElement;
      setScrollable(doc.scrollHeight > window.innerHeight + 48);
      const size =
        window.innerWidth < 640 ? HEAD_SIZE_MOBILE : HEAD_SIZE_DESKTOP;
      setHeadSize(size);
      const rail = railRef.current;
      if (rail) setTrackHeight(rail.clientHeight - size);
    }

    measure();
    window.addEventListener("resize", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_BUBBLE_MQ);
    const update = () => setShowBubbles(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setHintsEnabled(readScrollHintsEnabled());
    setHintsReady(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    function onPointerMove(e: PointerEvent) {
      if (!draggingRef.current) return;
      applyProgress(progressFromClientY(e.clientY));
    }

    function endDrag(e: PointerEvent) {
      if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) {
        return;
      }
      draggingRef.current = false;
      pointerIdRef.current = null;
      setIsDragging(false);
      syncSpring();
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [applyProgress, isDragging, progressFromClientY, syncSpring]);

  function handleTrackPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (draggingRef.current) return;
    applyProgress(progressFromClientY(e.clientY));
  }

  function handleHeadPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    pointerIdRef.current = e.pointerId;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!reduce) smooth.stop();
    applyProgress(progressFromClientY(e.clientY));
  }

  function handleHeadPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== e.pointerId) return;
    draggingRef.current = false;
    pointerIdRef.current = null;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    syncSpring();
  }

  function handleHeadKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.key === "PageDown" ? 0.12 : e.key === "PageUp" ? -0.12 : 0;
    if (step === 0) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(1, progress.get() + step));
    applyProgress(next);
  }

  const sectionLabel = activeSection?.label ?? "";

  return (
    <div
      ref={railRef}
      className={`fixed bottom-6 right-0 top-24 z-40 hidden w-9 overflow-visible transition-opacity duration-500 lg:block lg:w-11 ${
        scrollable ? "opacity-100" : "opacity-0"
      }`}
      role="scrollbar"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressPercent}
      aria-label={
        sectionLabel
          ? `Paginascroll. Je bent bij: ${sectionLabel}`
          : "Paginascroll"
      }
    >
      {/* Klikbare rail */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 cursor-pointer touch-none bg-transparent lg:w-10"
        onPointerDown={handleTrackPointerDown}
      />

      {/* Stippellijn-route */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 border-l-2 border-dotted border-mm-border/90"
        aria-hidden
      />

      {/* Oranje spoor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-300 to-mm-accent"
        style={{
          height: trackHeight + headSize / 2,
          scaleY: trailScale,
        }}
      />

      {/* Finish-vlaggetje */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border-2 border-mm-accent bg-white"
        aria-hidden
      />

      {/* Sleepbaar hoofd + desktop-wolkje */}
      <motion.div
        data-scroll-head
        className={`absolute left-1/2 top-0 z-10 w-0 overflow-visible touch-none select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          y: headY,
          rotate: reduce || isDragging ? undefined : tilt,
        }}
        onPointerDown={handleHeadPointerDown}
        onPointerUp={handleHeadPointerUp}
        onKeyDown={handleHeadKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
        aria-label="Sleep om te scrollen"
      >
        <div
          className={`absolute left-1/2 top-0 -translate-x-1/2 drop-shadow-[0_2px_6px_rgba(15,23,42,0.18)] transition-transform ${
            isDragging ? "scale-110" : "hover:scale-105"
          }`}
          style={{ width: headSize, height: headSize }}
        >
          <InteractiveLogo className="h-full w-full pointer-events-none" />

          <AnimatePresence mode="wait">
            {showBubbles && hintsEnabled && sectionLabel && !isDragging ? (
              <motion.div
                key={sectionLabel}
                initial={{ opacity: 0, x: 6, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 4, scale: 0.96 }}
                transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-full top-1/2 z-20 mr-1.5 hidden w-max min-w-[10rem] max-w-[min(16rem,calc(100vw-5rem))] -translate-y-1/2 lg:block"
              >
                <div className="relative rounded-2xl border border-slate-200/90 bg-white px-3.5 py-2 pr-8 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.22)]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissHints();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Sectie-hints uitzetten"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                  <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                    Je bent hier
                  </p>
                  <p className="mt-0.5 text-pretty text-sm font-extrabold leading-snug text-slate-900">
                    {sectionLabel}
                  </p>
                  <span
                    className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rotate-45 border-r border-t border-slate-200/90 bg-white"
                    aria-hidden
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {showBubbles && hintsReady && !hintsEnabled ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                restoreHints();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute right-full top-1/2 z-20 mr-2 hidden w-max -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-[11px] font-extrabold tracking-tight text-slate-700 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.28)] transition hover:border-[#FF5722]/45 hover:bg-orange-50/90 hover:text-[#FF5722] lg:inline-flex"
              aria-label="Sectie-hints weer aanzetten"
            >
              <MessageSquareText className="size-3.5 shrink-0 text-[#FF5722]" aria-hidden />
              <span>Hints aan</span>
            </button>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

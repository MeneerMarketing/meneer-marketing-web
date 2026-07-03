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
import { useCallback, useEffect, useRef, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { useScrollSections } from "@/hooks/useScrollSections";

/** Hoogte (px) van het mascotte-hoofd op de rail */
const HEAD_SIZE_MOBILE = 30;
const HEAD_SIZE_DESKTOP = 38;
const DESKTOP_BUBBLE_MQ = "(min-width: 1024px)";

/**
 * Speelse scrollbar: het hoofd rijdt mee met scroll, is sleepbaar en
 * klikbaar op de rail. Op desktop verschijnt een wolkje met de actieve sectie.
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

  const { activeSection } = useScrollSections(showBubbles);

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
      className={`fixed bottom-6 right-0 top-24 z-40 w-11 transition-opacity duration-500 sm:right-0.5 ${
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
        className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 cursor-pointer touch-none bg-transparent"
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
        className={`absolute left-1/2 top-0 z-10 -translate-x-1/2 touch-none select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          y: headY,
          rotate: reduce || isDragging ? undefined : tilt,
          width: headSize,
          height: headSize,
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
          className={`drop-shadow-[0_2px_6px_rgba(15,23,42,0.18)] transition-transform ${
            isDragging ? "scale-110" : "hover:scale-105"
          }`}
        >
          <InteractiveLogo className="h-full w-full pointer-events-none" />
        </div>

        <AnimatePresence mode="wait">
          {showBubbles && sectionLabel && !isDragging ? (
            <motion.div
              key={sectionLabel}
              initial={{ opacity: 0, x: 10, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 z-20 hidden max-w-[min(240px,calc(100vw-4rem))] -translate-y-1/2 lg:block"
            >
              <div className="relative rounded-2xl border border-slate-200/90 bg-white px-3.5 py-2 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.22)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                  Je bent hier
                </p>
                <p className="mt-0.5 text-xs font-extrabold leading-snug text-slate-900">
                  {sectionLabel}
                </p>
                <span
                  className="absolute -right-1.5 top-1/2 size-2.5 -translate-y-1/2 rotate-45 border-r border-t border-slate-200/90 bg-white"
                  aria-hidden
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

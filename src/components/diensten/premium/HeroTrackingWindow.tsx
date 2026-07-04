"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const EVENTS = [
  { name: "page_view", detail: "jouw-site.nl/checkout" },
  { name: "add_to_cart", detail: "SKU · Premium pakket" },
  { name: "begin_checkout", detail: "waarde € 249" },
  { name: "purchase", detail: "transactie OK" },
] as const;

/**
 * Event-stream / dataLayer: events vuren sequentieel op.
 */
export function HeroTrackingWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [step, setStep] = useState(reduce ? EVENTS.length : 0);

  useEffect(() => {
    if (!isInView || reduce) return;
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setStep(Math.min(i, EVENTS.length));
      if (i >= EVENTS.length) window.clearInterval(tick);
    }, 650);
    return () => window.clearInterval(tick);
  }, [isInView, reduce]);

  const visible = EVENTS.slice(0, step);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute right-4 top-16 size-40 rounded-full bg-sky-200/20 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-2.5">
            <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
            <span className="font-mono text-[10px] font-semibold text-slate-400">dataLayer.push</span>
          </div>

          <div className="max-h-[220px] space-y-1 overflow-y-auto p-3 font-mono text-[10px]">
            <AnimatePresence initial={false}>
              {visible.map((ev, i) => (
                <motion.div
                  key={ev.name}
                  initial={reduce ? undefined : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="flex items-start gap-2 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-2"
                >
                  <Check className="mt-0.5 size-3 shrink-0 text-emerald-400" aria-hidden />
                  <div className="min-w-0">
                    <p className="font-bold text-emerald-300">{ev.name}</p>
                    <p className="truncate text-slate-500">{ev.detail}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-[8px] text-slate-600">#{i + 1}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-slate-700 px-4 py-2">
            <p className="text-[9px] text-slate-500">
              {step >= EVENTS.length ? "✓ GTM · GA4 · Ads synced" : "Events firing…"}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          animate={step >= EVENTS.length ? { opacity: 1 } : { opacity: 0.4 }}
          className="mt-5 flex gap-2"
          style={{ transform: "translateZ(32px)" }}
        >
          {["GTM", "GA4", "Google Ads"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold text-slate-600 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

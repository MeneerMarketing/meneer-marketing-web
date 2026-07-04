"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGES = [
  { id: "lead", label: "Lead", color: "border-sky-300 bg-sky-50" },
  { id: "qualified", label: "Qualified", color: "border-violet-300 bg-violet-50" },
  { id: "deal", label: "Deal", color: "border-emerald-300 bg-emerald-50" },
] as const;

const INCOMING = [
  { name: "Tom", company: "B2B SaaS", stage: 0 },
  { name: "Eva", company: "Webshop", stage: 1 },
  { name: "Raj", company: "Agency", stage: 2 },
] as const;

/**
 * Pipeline-board: leads vallen in kolommen.
 */
export function HeroLeadsWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.65);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [visible, setVisible] = useState(reduce ? 3 : 0);

  useEffect(() => {
    if (!isInView || reduce) return;
    const timers = INCOMING.map((_, i) =>
      window.setTimeout(() => setVisible(i + 1), 500 + i * 700),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [isInView, reduce]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center px-2"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="w-full max-w-[340px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
          style={{ transform: "translateZ(35px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Pipeline · live
          </p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {STAGES.map((col, colIdx) => (
              <div key={col.id} className="flex min-h-[180px] flex-col">
                <p className="mb-2 text-center text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  {col.label}
                </p>
                <div className={`flex flex-1 flex-col gap-1.5 rounded-xl border border-dashed p-1.5 ${col.color}`}>
                  <AnimatePresence>
                    {INCOMING.slice(0, visible).map(
                      (lead, i) =>
                        lead.stage === colIdx ? (
                          <motion.div
                            key={lead.name}
                            initial={reduce ? undefined : { opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="rounded-lg border border-white bg-white px-2 py-1.5 shadow-sm"
                          >
                            <p className="text-[10px] font-extrabold text-slate-900">{lead.name}</p>
                            <p className="truncate text-[8px] font-medium text-slate-500">{lead.company}</p>
                          </motion.div>
                        ) : null,
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          animate={visible >= 3 ? { opacity: 1 } : { opacity: 0.5 }}
          className="mt-4 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[10px] font-bold text-emerald-700"
          style={{ transform: "translateZ(45px)" }}
        >
          CRM sync ✓ · geen inbox-chaos
        </motion.div>
      </motion.div>
    </div>
  );
}

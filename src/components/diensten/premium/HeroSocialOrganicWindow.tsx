"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const DAYS = ["Ma", "Di", "Wo", "Do", "Vr"] as const;
const POSTS = [
  { day: 0, label: "Tip" },
  { day: 2, label: "Case" },
  { day: 4, label: "BTS" },
] as const;

/**
 * Content-kalender: posts verschijnen op vaste dagen.
 */
export function HeroSocialOrganicWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.65);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [visible, setVisible] = useState(reduce ? 3 : 0);

  useEffect(() => {
    if (!isInView || reduce) return;
    const timers = POSTS.map((_, i) =>
      window.setTimeout(() => setVisible(i + 1), 500 + i * 600),
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
        className="relative flex h-full flex-col items-center justify-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
          style={{ transform: "translateZ(35px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Contentritme · deze week
          </p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {DAYS.map((day, col) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-slate-500">{day}</span>
                <div className="flex min-h-[72px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80">
                  {POSTS.map(
                    (post, i) =>
                      post.day === col && i < visible ? (
                        <motion.div
                          key={post.label}
                          initial={reduce ? undefined : { scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                          className="size-10 rounded-lg bg-gradient-to-br from-[#FF5722]/20 to-sky-100 flex items-center justify-center"
                        >
                          <span className="text-[8px] font-bold text-slate-700">{post.label}</span>
                        </motion.div>
                      ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          animate={visible >= 3 ? { opacity: 1 } : { opacity: 0.5 }}
          className="mt-4 text-[11px] font-bold text-slate-500"
          style={{ transform: "translateZ(28px)" }}
        >
          Ritme dat je team volhoudt
        </motion.p>
      </motion.div>
    </div>
  );
}

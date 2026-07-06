"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";
import { InstagramLogoMark } from "@/components/icons/InstagramLogoMark";

const EASE = [0.22, 1, 0.36, 1] as const;

const GRID_TILES = [
  "from-orange-200 via-pink-200 to-rose-300",
  "from-sky-200 via-violet-200 to-fuchsia-200",
  "from-amber-200 via-orange-200 to-pink-200",
] as const;

/**
 * Instagram-achtige creator-kaart met oplopende engagement + deal-badge.
 */
export function HeroInfluencerWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const engagement = useMotionValue(reduce ? 8.4 : 2.1);
  const [display, setDisplay] = useState(reduce ? 8.4 : 2.1);

  useMotionValueEvent(engagement, "change", (v) => setDisplay(Math.round(v * 10) / 10));

  useEffect(() => {
    if (!isInView) return;
    if (reduce) {
      engagement.set(8.4);
      return;
    }
    const controls = animate(engagement, 8.4, { duration: 1.4, ease: EASE, delay: 0.3 });
    return () => controls.stop();
  }, [isInView, reduce, engagement]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center gap-4"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          style={{ transform: "translateZ(38px)" }}
        >
          {/* Instagram top bar */}
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <InstagramLogoMark className="size-5 shrink-0" />
              <span className="text-xs font-extrabold tracking-tight text-slate-900">
                creatorspot
              </span>
            </div>
            <div className="flex gap-1" aria-hidden>
              <span className="size-1 rounded-full bg-slate-400" />
              <span className="size-1 rounded-full bg-slate-400" />
              <span className="size-1 rounded-full bg-slate-400" />
            </div>
          </div>

          <div className="px-3 py-3">
            {/* Profielrij zoals IG */}
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#E1306C] to-[#833AB4] p-[2.5px]">
                <span className="flex size-[3.25rem] items-center justify-center rounded-full bg-white p-[2px]">
                  <span className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-pink-200 text-sm font-black text-slate-800">
                    LU
                  </span>
                </span>
              </div>
              <div className="grid flex-1 grid-cols-3 gap-1 text-center">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">124</p>
                  <p className="text-[9px] font-medium text-slate-500">posts</p>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">24,3k</p>
                  <p className="text-[9px] font-medium text-slate-500">volgers</p>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">891</p>
                  <p className="text-[9px] font-medium text-slate-500">volgend</p>
                </div>
              </div>
            </div>

            <div className="mt-2.5">
              <p className="text-sm font-extrabold text-slate-900">@lisa.ugc</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
                UGC &amp; reels · content die niet schreeuwt &quot;koop nu&quot;
              </p>
            </div>

            <div className="mt-2.5 flex gap-1.5">
              <span className="flex flex-1 items-center justify-center rounded-lg bg-[#0095F6] py-1.5 text-[11px] font-bold text-white">
                Volgen
              </span>
              <span className="flex flex-1 items-center justify-center rounded-lg border border-slate-200 py-1.5 text-[11px] font-bold text-slate-900">
                Bericht
              </span>
            </div>
          </div>

          {/* Creator metrics */}
          <div className="grid grid-cols-3 gap-1.5 border-t border-slate-100 bg-slate-50/90 px-3 py-2.5">
            <div className="rounded-xl border border-slate-100 bg-white px-1 py-2 text-center">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                Stop-scroll
              </p>
              <p className="text-sm font-extrabold text-emerald-600" aria-live="polite">
                {display}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-1 py-2 text-center">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                Bereik
              </p>
              <p className="text-sm font-extrabold text-slate-900">18k</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-1 py-2 text-center">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                Code
              </p>
              <p className="text-sm font-extrabold text-[#FF5722]">FAVORIET20</p>
            </div>
          </div>

          {/* Mini feed-grid */}
          <div className="grid grid-cols-3 gap-px border-t border-slate-100 bg-slate-100">
            {GRID_TILES.map((gradient, i) => (
              <div
                key={gradient}
                className={`relative aspect-square bg-gradient-to-br ${gradient}`}
              >
                {i === 1 ? (
                  <div className="absolute inset-0 flex items-end justify-between p-1.5 text-white drop-shadow-sm">
                    <div className="flex items-center gap-0.5 text-[8px] font-bold">
                      <Heart className="size-2.5 fill-white" aria-hidden />
                      2,4k
                    </div>
                    <MessageCircle className="size-2.5" aria-hidden />
                  </div>
                ) : null}
                {i === 2 ? (
                  <div className="absolute right-1 top-1">
                    <Bookmark className="size-2.5 fill-white text-white drop-shadow" aria-hidden />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          animate={display > 6 ? { opacity: 1 } : { opacity: 0.4 }}
          className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[10px] font-bold text-emerald-700"
          style={{ transform: "translateZ(45px)" }}
        >
          <InstagramLogoMark className="size-3.5 shrink-0" />
          <span>Creator match · meetbare deal</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const DAYS = ["Ma", "Di", "Wo", "Do", "Vr"] as const;

type Platform = "instagram" | "tiktok" | "facebook";

interface WeekPost {
  id: string;
  day: number;
  label: string;
  format: string;
  platform: Platform;
  reach: string;
}

const WEEK_POSTS: WeekPost[] = [
  { id: "1", day: 0, label: "Tip", format: "Reel", platform: "instagram", reach: "2.4k" },
  { id: "2", day: 0, label: "Story", format: "Poll", platform: "instagram", reach: "680" },
  { id: "3", day: 1, label: "BTS", format: "TikTok", platform: "tiktok", reach: "8.1k" },
  { id: "4", day: 2, label: "Case", format: "Carousel", platform: "instagram", reach: "1.2k" },
  { id: "5", day: 2, label: "Teaser", format: "Story", platform: "instagram", reach: "340" },
  { id: "6", day: 3, label: "FAQ", format: "Post", platform: "facebook", reach: "890" },
  { id: "7", day: 3, label: "Clip", format: "Reel", platform: "facebook", reach: "1.6k" },
  { id: "8", day: 4, label: "Winst", format: "TikTok", platform: "tiktok", reach: "5.6k" },
  { id: "9", day: 4, label: "Review", format: "Post", platform: "facebook", reach: "420" },
];

const PLATFORM_META: Record<
  Platform,
  { name: string; chip: string; ring: string; bg: string }
> = {
  instagram: {
    name: "Instagram",
    chip: "bg-gradient-to-br from-[#F77737]/15 via-[#E1306C]/15 to-[#833AB4]/15 text-[#C13584]",
    ring: "ring-[#E1306C]/25",
    bg: "from-[#F77737]/10 to-[#833AB4]/10",
  },
  tiktok: {
    name: "TikTok",
    chip: "bg-slate-900/8 text-slate-800",
    ring: "ring-slate-900/15",
    bg: "from-slate-900/5 to-cyan-400/10",
  },
  facebook: {
    name: "Facebook",
    chip: "bg-[#1877F2]/10 text-[#1877F2]",
    ring: "ring-[#1877F2]/20",
    bg: "from-[#1877F2]/8 to-[#1877F2]/5",
  },
};

function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  const cn = className ?? "size-4 shrink-0";

  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={cn} aria-hidden>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="#E1306C" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="#E1306C" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="#E1306C" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" className={cn} aria-hidden>
        <path
          fill="#25F4EE"
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.31-4.64 2.93 2.93 0 0 1 .85.13V8.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 4 14.58 6.34 6.34 0 1 0 17.42 8.3v-1.6a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.13z"
        />
        <path
          fill="#FE2C55"
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.31-4.64 2.93 2.93 0 0 1 .85.13V8.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 4 14.58 6.34 6.34 0 1 0 17.42 8.3v-1.6a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.13z"
          transform="translate(0.45 0.45)"
        />
        <path
          fill="#000"
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.31-4.64 2.93 2.93 0 0 1 .85.13V8.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 4 14.58 6.34 6.34 0 1 0 17.42 8.3v-1.6a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.13z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={cn} aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path
        fill="#fff"
        transform="translate(12 12.2) scale(0.82) translate(-12 -12)"
        d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.560h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.585 0-4.356 1.58-4.356 4.749v2.693H7.332v3.209h2.513v8.195h3.552z"
      />
    </svg>
  );
}

function PostChip({ post, show }: { post: WeekPost; show: boolean }) {
  const meta = PLATFORM_META[post.platform];

  return (
    <motion.div
      initial={show ? false : { opacity: 0, scale: 0.88, y: 6 }}
      animate={show ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 6 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`flex w-full flex-col gap-1 rounded-xl border border-slate-200/80 bg-gradient-to-br ${meta.bg} p-1.5 ring-1 ${meta.ring} shadow-sm`}
    >
      <div className="flex items-center justify-between gap-1">
        <PlatformIcon platform={post.platform} className="size-3.5" />
        <span className="truncate text-[7px] font-bold uppercase tracking-wide text-slate-400">
          {post.format}
        </span>
      </div>
      <p className="truncate text-[9px] font-extrabold leading-none text-slate-800">{post.label}</p>
      <div className="flex items-center gap-1 text-[7px] font-bold text-slate-500">
        <TrendingUp className="size-2.5 text-[#FF5722]" aria-hidden />
        {post.reach}
      </div>
    </motion.div>
  );
}

/**
 * Content-kalender: posts verschijnen op vaste dagen per kanaal.
 */
export function HeroSocialOrganicWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.65);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [visibleCount, setVisibleCount] = useState(reduce ? WEEK_POSTS.length : 0);

  useEffect(() => {
    if (!isInView || reduce) return;
    const timers = WEEK_POSTS.map((_, i) =>
      window.setTimeout(() => setVisibleCount(i + 1), 400 + i * 380),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [isInView, reduce]);

  const allVisible = visibleCount >= WEEK_POSTS.length;

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[520px] w-full max-w-[440px] [perspective:1400px]"
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
          transition={{ duration: 0.45, ease: EASE }}
          className="w-full max-w-[360px] rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_28px_56px_-24px_rgba(15,23,42,0.22)] sm:p-5"
          style={{ transform: "translateZ(35px)" }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Contentritme · deze week
              </p>
              <p className="mt-0.5 text-xs font-bold text-slate-700">9 posts · 3 kanalen</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden />
              Live
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {(["instagram", "tiktok", "facebook"] as const).map((platform) => {
              const meta = PLATFORM_META[platform];
              const count = WEEK_POSTS.filter((p) => p.platform === platform).length;
              return (
                <span
                  key={platform}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold ${meta.chip}`}
                >
                  <PlatformIcon platform={platform} className="size-3" />
                  {meta.name}
                  <span className="opacity-60">· {count}</span>
                </span>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {DAYS.map((day, col) => {
              const dayPosts = WEEK_POSTS.filter((p) => p.day === col);
              return (
                <div key={day} className="flex min-w-0 flex-col items-center gap-1.5">
                  <span className="text-[9px] font-bold text-slate-500">{day}</span>
                  <div className="flex min-h-[148px] w-full flex-col gap-1.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-1">
                    {dayPosts.map((post) => {
                      const postIndex = WEEK_POSTS.findIndex((p) => p.id === post.id);
                      return (
                        <PostChip
                          key={post.id}
                          post={post}
                          show={visibleCount > postIndex}
                        />
                      );
                    })}
                    {dayPosts.length === 0 ? (
                      <span className="flex flex-1 items-center justify-center text-[8px] font-semibold text-slate-300">
                        —
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <motion.div
            animate={allVisible ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 4 }}
            className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-slate-50/90 p-2.5"
          >
            <div className="flex flex-col items-center gap-0.5 text-center">
              <Heart className="size-3.5 text-[#FF5722]" aria-hidden />
              <span className="text-[10px] font-extrabold text-slate-800">+18%</span>
              <span className="text-[8px] font-semibold text-slate-500">bereik</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-center">
              <MessageCircle className="size-3.5 text-sky-500" aria-hidden />
              <span className="text-[10px] font-extrabold text-slate-800">47</span>
              <span className="text-[8px] font-semibold text-slate-500">reacties</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-center">
              <Share2 className="size-3.5 text-[#1877F2]" aria-hidden />
              <span className="text-[10px] font-extrabold text-slate-800">12</span>
              <span className="text-[8px] font-semibold text-slate-500">shares</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          animate={allVisible ? { opacity: 1 } : { opacity: 0.45 }}
          className="mt-5 text-xs font-bold text-slate-600"
          style={{ transform: "translateZ(28px)" }}
        >
          Ritme dat je team volhoudt
        </motion.p>
      </motion.div>
    </div>
  );
}

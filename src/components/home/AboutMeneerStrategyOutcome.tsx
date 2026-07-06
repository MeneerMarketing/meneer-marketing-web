"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bookmark,
  Grid3X3,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Play,
  Send,
  Share2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { InstagramLogoMark } from "@/components/icons/InstagramLogoMark";
import { TiktokIcon } from "@/components/icons/TiktokIcon";
import { HOME_ABOUT_MENEER_STRATEGY_OUTCOME } from "@/data/home-about-meneer";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Eén telefoon, swipe tussen TikTok en Reels. */
const PHONE_WIDTH = "w-[11.5rem]";
const PHONE_CLASS = `h-[23rem] ${PHONE_WIDTH} shrink-0`;

const PREVIEW_AREA =
  "relative z-0 flex min-h-[27rem] w-full flex-col items-center justify-center";

type UgcPlatform = "tiktok" | "reels";

const UGC_PLATFORMS: readonly { id: UgcPlatform; label: string }[] = [
  { id: "tiktok", label: "TikTok" },
  { id: "reels", label: "Instagram Reels" },
] as const;

const CREATOR_HANDLE = "@lisa.ugc";
const CREATOR_NAME = "Lisa · UGC creator";

type OutcomeTab = "influencer" | "ugc";

const IG_HIGHLIGHTS = ["Reviews", "Unboxing", "Routine"] as const;

const IG_GRID = [
  "from-rose-200 to-orange-200",
  "from-sky-200 to-indigo-200",
  "from-amber-100 to-orange-200",
] as const;

const IG_REEL_HOOKS = [
  "Eerlijk: na 2 weken merk ik verschil.",
  "Geen script. Gewoon thuis gefilmd.",
] as const;

const TIKTOK_AUDIO = "origineel geluid · hergebruik in Meta ads";
const REELS_AUDIO = "lisa.ugc · origineel geluid · hergebruik in ads";

function MarqueeAudio({ text, reduce }: { text: string; reduce: boolean }) {
  return (
    <div className="mt-1 flex min-w-0 items-center gap-1 overflow-hidden">
      <Music2 className="size-3 shrink-0 text-white/90" aria-hidden />
      <div className="relative min-w-0 flex-1 overflow-hidden">
        {reduce ? (
          <p className="truncate text-[9px] font-medium text-white/85">{text}</p>
        ) : (
          <motion.div
            className="flex w-max whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          >
            <span className="pr-4 text-[9px] font-medium text-white/85">{text}</span>
            <span className="pr-4 text-[9px] font-medium text-white/85">{text}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PhoneShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="isolate flex flex-col items-center">
      <div
        className={`relative isolate ${PHONE_CLASS} overflow-hidden rounded-[1.45rem] border-[3px] border-slate-800 bg-slate-800 p-[2.5px] shadow-[0_18px_40px_-16px_rgba(15,23,42,0.5)]`}
      >
        <div className="pointer-events-none absolute -left-[3px] top-[4.5rem] z-[1] h-8 w-[2.5px] rounded-full bg-slate-700" aria-hidden />
        <div className="pointer-events-none absolute -right-[3px] top-14 z-[1] h-11 w-[2.5px] rounded-full bg-slate-700" aria-hidden />
        <div className="relative h-full w-full overflow-hidden rounded-[1.15rem] bg-black">
          <div
            className="pointer-events-none absolute left-1/2 top-1.5 z-10 h-3.5 w-12 -translate-x-1/2 rounded-full bg-black"
            aria-hidden
          />
          {children}
        </div>
      </div>
      <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
    </div>
  );
}

function AnimatedVideoBg({
  reduce,
  variant,
}: {
  reduce: boolean;
  variant: "tiktok" | "reels";
}) {
  const tiktok = "from-violet-950 via-fuchsia-900/95 to-orange-950";
  const reels = "from-rose-950 via-fuchsia-900/90 to-slate-950";

  return (
    <>
      <div
        className={`absolute inset-0 bg-gradient-to-b ${variant === "tiktok" ? tiktok : reels}`}
      />
      <motion.div
        className="absolute inset-0 opacity-50"
        aria-hidden
        animate={reduce ? undefined : { opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage:
            variant === "tiktok"
              ? "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.14), transparent 45%), radial-gradient(circle at 70% 65%, rgba(255,87,34,0.22), transparent 48%)"
              : "radial-gradient(circle at 65% 25%, rgba(225,48,108,0.28), transparent 50%), radial-gradient(circle at 25% 70%, rgba(131,58,180,0.2), transparent 45%)",
        }}
      />
    </>
  );
}

function CompactInfluencerCard() {
  return (
    <div className="flex min-h-[23rem] w-[11.5rem] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-2.5 py-2">
        <InstagramLogoMark className="size-4 shrink-0" />
        <span className="text-[10px] font-extrabold text-slate-900">{CREATOR_HANDLE}</span>
        <MoreHorizontal className="size-3.5 text-slate-700" aria-hidden />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 px-2.5 py-2.5">
          <div className="shrink-0 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#E1306C] to-[#833AB4] p-[2px]">
            <span className="flex size-11 items-center justify-center rounded-full bg-white p-[2px]">
              <span className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-pink-200 text-[11px] font-black text-slate-800">
                LU
              </span>
            </span>
          </div>
          <div className="grid flex-1 grid-cols-3 gap-1 text-center">
            <div>
              <p className="text-xs font-extrabold text-slate-900">186</p>
              <p className="text-[8px] font-medium text-slate-500">posts</p>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">24,3k</p>
              <p className="text-[8px] font-medium text-slate-500">volgers</p>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">412</p>
              <p className="text-[8px] font-medium text-slate-500">volgend</p>
            </div>
          </div>
        </div>

        <div className="px-2.5 pb-2">
          <p className="text-[10px] font-extrabold text-slate-900">{CREATOR_NAME}</p>
          <p className="mt-0.5 text-[9px] leading-snug text-slate-600">
            UGC &amp; reels voor merken · briefings, geen stiff scripts
          </p>
        </div>

        <div className="flex gap-1.5 px-2.5 pb-2">
          <span className="flex flex-1 items-center justify-center rounded-lg bg-[#0095F6] py-1 text-[9px] font-bold text-white">
            Volgen
          </span>
          <span className="flex flex-1 items-center justify-center rounded-lg border border-slate-200 py-1 text-[9px] font-bold text-slate-900">
            Bericht
          </span>
          <span className="flex items-center justify-center rounded-lg border border-slate-200 px-2 py-1">
            <Grid3X3 className="size-3 text-slate-700" aria-hidden />
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto px-2.5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {IG_HIGHLIGHTS.map((highlight) => (
            <div key={highlight} className="flex shrink-0 flex-col items-center gap-0.5">
              <span className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-gradient-to-br from-orange-50 to-pink-50">
                <span className="size-7 rounded-full bg-gradient-to-br from-orange-200 to-pink-200" />
              </span>
              <span className="max-w-[3rem] truncate text-[7px] font-medium text-slate-600">
                {highlight}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-px border-t border-slate-100 bg-slate-100">
          {IG_GRID.map((gradient, i) => (
            <div key={gradient} className={`relative aspect-square bg-gradient-to-br ${gradient}`}>
              {i === 1 ? (
                <span className="absolute right-1 top-1">
                  <Grid3X3 className="size-2.5 text-white drop-shadow" aria-hidden />
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-emerald-50/90 px-2.5 py-1.5">
        <span className="text-[8px] font-bold uppercase tracking-wide text-emerald-700">
          Creator match
        </span>
        <span className="text-[9px] font-extrabold text-emerald-700">8,4% engagement</span>
      </div>
    </div>
  );
}

interface RailButtonProps {
  icon: LucideIcon;
  count?: string;
  filled?: boolean;
  active?: boolean;
  onClick?: () => void;
  label: string;
}

function RailButton({ icon: Icon, count, filled, active, onClick, label }: RailButtonProps) {
  const body = (
    <>
      <Icon
        className={`size-4 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] ${
          filled || active ? "fill-white" : ""
        }`}
        strokeWidth={1.8}
        aria-hidden
      />
      {count ? (
        <span className="text-[8px] font-bold leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
          {count}
        </span>
      ) : null}
    </>
  );

  const className = "flex flex-col items-center gap-px";

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        className={className}
        aria-label={label}
      >
        {body}
      </motion.button>
    );
  }

  return (
    <div className={className} aria-hidden>
      {body}
    </div>
  );
}

function CreatorAvatar({ size = "sm" }: { size?: "sm" | "xs" }) {
  const dim = size === "sm" ? "size-7" : "size-5";
  const text = size === "sm" ? "text-[8px]" : "text-[7px]";

  return (
    <span
      className={`flex ${dim} shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-gradient-to-br from-orange-200 to-pink-300`}
    >
      <span className={`${text} font-black text-slate-800`}>LU</span>
    </span>
  );
}

function TikTokScreen() {
  const reduce = useReducedMotion() ?? false;
  const [activeTab, setActiveTab] = useState<"volgend" | "voor-jou">("voor-jou");
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex h-full w-full flex-col pt-4">
        <div className="relative z-20 flex shrink-0 items-center justify-between gap-1 px-2 pb-1.5">
          <TiktokIcon variant="light" size={14} className="size-3.5 shrink-0" />
          <div className="flex min-w-0 items-center justify-center gap-2.5 whitespace-nowrap text-[10px] font-bold leading-none">
            <button
              type="button"
              onClick={() => setActiveTab("volgend")}
              className={`shrink-0 ${activeTab === "volgend" ? "text-white" : "text-white/40"}`}
            >
              Volgend
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("voor-jou")}
              className={`shrink-0 ${activeTab === "voor-jou" ? "text-white" : "text-white/40"}`}
            >
              Voor jou
            </button>
          </div>
          <span className="size-3.5 shrink-0" aria-hidden />
        </div>

        <div className="relative min-h-0 flex-1">
          <AnimatedVideoBg reduce={reduce} variant="tiktok" />

          <span className="absolute left-2 top-1.5 z-10 rounded-[4px] bg-[#FF5722] px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
            Gesponsord
          </span>

          <motion.span
            className="absolute left-1/2 top-[38%] z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/25"
            animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Play className="size-4 fill-white text-white" aria-hidden />
          </motion.span>

          <div className="absolute bottom-[5.25rem] right-1.5 z-20 flex flex-col items-center gap-2">
            <CreatorAvatar size="sm" />
            <RailButton
              icon={Heart}
              count={liked ? "24,9k" : "24,8k"}
              filled={liked}
              active={liked}
              onClick={() => setLiked((v) => !v)}
              label="Like"
            />
            <RailButton icon={MessageCircle} count="312" label="Reacties" />
            <RailButton icon={Bookmark} count="1,2k" filled label="Opslaan" />
            <RailButton icon={Share2} count="Delen" label="Delen" />
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/92 via-black/55 to-transparent pr-9 pl-2 pb-2 pt-9">
            <p className="text-[10px] font-extrabold text-white">{CREATOR_HANDLE}</p>
            <p className="mt-0.5 text-pretty text-[9px] font-semibold leading-snug text-white/95">
              Eerlijk: na 2 weken merk ik verschil. Geen script, thuis gefilmd.
            </p>
            <MarqueeAudio text={TIKTOK_AUDIO} reduce={reduce} />
          </div>
        </div>
    </div>
  );
}

function ReelsScreen() {
  const reduce = useReducedMotion() ?? false;
  const [liked, setLiked] = useState(false);
  const [hookIdx, setHookIdx] = useState(0);
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex h-full w-full flex-col pt-4">
        <div className="relative z-20 flex shrink-0 items-center justify-between px-2.5 pb-1.5">
          <span className="text-[10px] font-extrabold text-white">Reels</span>
          <InstagramLogoMark className="size-4" />
        </div>

        <div className="relative min-h-0 flex-1">
          <AnimatedVideoBg reduce={reduce} variant="reels" />

          <button
            type="button"
            onClick={() => setHookIdx((i) => (i + 1) % IG_REEL_HOOKS.length)}
            className="absolute inset-0 z-0"
            aria-label="Volgende reel-hook"
          />

          <span className="absolute left-2 top-1.5 z-10 whitespace-nowrap rounded-[4px] bg-black/45 px-1.5 py-0.5 text-[7px] font-bold uppercase leading-none text-white backdrop-blur-sm">
            Betaald partnerschap
          </span>

          <motion.span
            className="absolute left-1/2 top-[38%] z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/25"
            animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Play className="size-4 fill-white text-white" aria-hidden />
          </motion.span>

          <div className="absolute bottom-[6rem] right-1.5 z-20 flex flex-col items-center gap-2">
            <RailButton
              icon={Heart}
              count={liked ? "3,2k" : "3,1k"}
              filled={liked}
              active={liked}
              onClick={() => setLiked((v) => !v)}
              label="Like"
            />
            <RailButton icon={MessageCircle} count="89" label="Reacties" />
            <RailButton icon={Send} label="Delen" />
            <RailButton icon={Bookmark} label="Opslaan" />
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/92 via-black/55 to-transparent pr-9 pl-2 pb-2 pt-8">
            <div className="flex min-w-0 items-center gap-1.5">
              <CreatorAvatar size="xs" />
              <p className="min-w-0 truncate text-[10px] font-extrabold text-white">
                {CREATOR_HANDLE}
              </p>
              <button
                type="button"
                onClick={() => setFollowing((v) => !v)}
                className={`ml-auto shrink-0 rounded px-2 py-0.5 text-[8px] font-bold leading-none ${
                  following
                    ? "border border-white/35 bg-white/10 text-white"
                    : "bg-white text-slate-900"
                }`}
              >
                {following ? "Volgend" : "Volgen"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={hookIdx}
                initial={reduce ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.18 }}
                className="mt-0.5 text-pretty text-[9px] font-semibold leading-snug text-white/95"
              >
                {IG_REEL_HOOKS[hookIdx]}
              </motion.p>
            </AnimatePresence>

            <MarqueeAudio text={REELS_AUDIO} reduce={reduce} />
          </div>
        </div>
    </div>
  );
}

function SwipeableUgcPhone() {
  const reduce = useReducedMotion() ?? false;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePlatform, setActivePlatform] = useState<UgcPlatform>("tiktok");

  const scrollToPlatform = useCallback(
    (platform: UgcPlatform) => {
      const el = scrollRef.current;
      if (!el) return;
      const idx = platform === "tiktok" ? 0 : 1;
      el.scrollTo({
        left: idx * el.clientWidth,
        behavior: reduce ? "auto" : "smooth",
      });
      setActivePlatform(platform);
    },
    [reduce],
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActivePlatform(idx >= 1 ? "reels" : "tiktok");
  }, []);

  const activeLabel =
    UGC_PLATFORMS.find((p) => p.id === activePlatform)?.label ?? "TikTok";

  return (
    <div className={PREVIEW_AREA}>
      <div className={`flex flex-col items-stretch ${PHONE_WIDTH}`}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex gap-1 rounded-xl border border-slate-200/90 bg-white p-1 shadow-sm">
            {UGC_PLATFORMS.map((item) => {
              const active = activePlatform === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToPlatform(item.id)}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold transition ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {item.id === "tiktok" ? "TikTok" : "Reels"}
                </button>
              );
            })}
          </div>
          <p className="shrink-0 text-[9px] font-semibold text-slate-400">Swipe →</p>
        </div>

        <PhoneShell label={activeLabel}>
          <div
            ref={scrollRef}
            className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={handleScroll}
          >
            <div className="h-full w-full shrink-0 snap-center">
              <TikTokScreen />
            </div>
            <div className="h-full w-full shrink-0 snap-center">
              <ReelsScreen />
            </div>
          </div>
        </PhoneShell>

        <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
          {UGC_PLATFORMS.map((item) => (
            <span
              key={item.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activePlatform === item.id ? "w-5 bg-[#FF5722]" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CompactUgcCard() {
  return <SwipeableUgcPhone />;
}

interface AboutMeneerStrategyOutcomeProps {
  visible: boolean;
  /** Geen vertraagde mount: direct zichtbaar, geen slide-in (desktop). */
  immediate?: boolean;
}

export function AboutMeneerStrategyOutcome({
  visible,
  immediate = false,
}: AboutMeneerStrategyOutcomeProps) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<OutcomeTab>("influencer");

  if (!visible) return null;

  return (
    <motion.div
      initial={immediate || reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: immediate ? 0 : 0.45, ease: EASE }}
      className="overflow-hidden rounded-2xl border border-dashed border-[#FF5722]/35 bg-gradient-to-b from-orange-50/60 to-white p-3 shadow-sm sm:p-4"
    >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
              {HOME_ABOUT_MENEER_STRATEGY_OUTCOME.eyebrow}
            </p>
            <span className="rounded-full border border-[#FF5722]/30 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#FF5722]">
              {HOME_ABOUT_MENEER_STRATEGY_OUTCOME.exampleLabel}
            </span>
          </div>
          <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
            {HOME_ABOUT_MENEER_STRATEGY_OUTCOME.title}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {HOME_ABOUT_MENEER_STRATEGY_OUTCOME.body}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl border border-slate-200/80 bg-white p-1">
            {(
              [
                { id: "influencer" as const, label: "Influencer" },
                { id: "ugc" as const, label: "UGC" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-lg py-1.5 text-[11px] font-extrabold transition ${
                  tab === item.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-3 min-h-[27rem]">
            <p className="mb-2 text-center text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
              {HOME_ABOUT_MENEER_STRATEGY_OUTCOME.previewCaption}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="flex min-h-[25rem] items-center justify-center"
              >
                {tab === "influencer" ? <CompactInfluencerCard /> : <CompactUgcCard />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
  );
}

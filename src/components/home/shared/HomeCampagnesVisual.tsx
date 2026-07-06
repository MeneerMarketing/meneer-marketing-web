"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";
import { GoogleShoppingIcon } from "@/components/icons/GoogleShoppingIcon";
import { MetaIcon } from "@/components/icons/MetaIcon";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

type Channel = "google" | "meta";
type CampagnesVisualSize = "mobile" | "desktop";

export const CAMPAGNES_CHANNEL_BUBBLES: Record<Channel, string> = {
  google:
    "Klein testen. Verkoopt het? Budget erbij. Verkoopt het niet? Uit. Geen gokken met jouw geld.",
  meta: "Instagram én Facebook. Eén plan. Geen losse eilandjes waar budget in verdwijnt.",
};

interface HomeCampagnesVisualProps {
  size?: CampagnesVisualSize;
  /** Desktop: bubble wordt buiten de visual gerenderd (linkerkolom). */
  bubblePlacement?: "inline" | "external";
  channel?: Channel;
  onChannelChange?: (channel: Channel) => void;
}

function MeneerBubble({
  children,
  size,
}: {
  children: string;
  size: CampagnesVisualSize;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <InteractiveLogo
        className={`shrink-0 ${size === "desktop" ? "size-9" : "size-8"}`}
        interactive={false}
      />
      <p
        className={`rounded-2xl rounded-bl-sm bg-white/[0.08] font-bold leading-snug text-white/90 ${
          size === "desktop" ? "px-4 py-3 text-sm" : "px-3.5 py-2.5 text-[13px]"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

function GoogleAdsPanel({
  reduce,
  size,
  showBubble,
}: {
  reduce: boolean;
  size: CampagnesVisualSize;
  showBubble: boolean;
}) {
  const shoppingSize = size === "desktop" ? 56 : 48;
  const imageAspect = size === "desktop" ? "aspect-[4/3]" : "aspect-[5/4]";

  return (
    <motion.div
      key="google-ads"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="space-y-3"
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5 sm:px-4 sm:py-3">
          <GoogleLogoMark className={`shrink-0 ${size === "desktop" ? "size-6" : "size-5"}`} />
          <p className="min-w-0 truncate text-[11px] font-extrabold text-slate-900 sm:text-xs">
            jouwshop.nl
          </p>
          <span className="ml-auto shrink-0 text-[9px] font-bold text-slate-400 sm:text-[10px]">
            Gesponsord
          </span>
        </div>

        <div
          className={`relative flex ${imageAspect} items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4`}
        >
          <GoogleShoppingIcon
            size={shoppingSize}
            className={size === "desktop" ? "size-14" : "size-12"}
          />
        </div>

        <div className="border-t border-slate-100 px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-[12px] font-extrabold leading-snug text-[#1a0dab] sm:text-sm">
            Jouw product · Bestseller
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-base font-extrabold text-slate-900 sm:text-lg">€49,00</span>
            <span className="text-[10px] font-medium text-slate-400 line-through sm:text-xs">
              €69,00
            </span>
          </div>
          <p className="mt-1 text-[10px] font-medium text-slate-500 sm:text-xs">
            Google Shopping · jouwshop.nl · Gratis verzending
          </p>
          <p className="mt-1.5 text-[10px] font-bold text-emerald-600 sm:text-xs">
            ★ 4,9 · Snelle levering
          </p>
        </div>
      </div>

      {showBubble ? (
        <MeneerBubble size={size}>{CAMPAGNES_CHANNEL_BUBBLES.google}</MeneerBubble>
      ) : null}

      <ul className={`space-y-1.5 px-1 font-bold ${size === "desktop" ? "text-xs" : "text-[13px]"}`}>
        <li className="flex items-center gap-2 text-white">
          <span className="text-[#FF5722]" aria-hidden>
            ✓
          </span>
          Jouw advertentie blijft aan
        </li>
        <li className="flex items-center gap-2 text-white/45">
          <span aria-hidden>✗</span>
          <span className="line-through decoration-white/30">Slechte advertentie gaat eruit</span>
        </li>
      </ul>
    </motion.div>
  );
}

function MetaFeedPanel({
  reduce,
  size,
  showBubble,
}: {
  reduce: boolean;
  size: CampagnesVisualSize;
  showBubble: boolean;
}) {
  const imageAspect = size === "desktop" ? "aspect-[4/3]" : "aspect-[5/4]";
  return (
    <motion.div
      key="meta-ads"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="space-y-3"
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5 sm:px-4 sm:py-3">
          <MetaIcon
            size={size === "desktop" ? 24 : 20}
            className={`shrink-0 ${size === "desktop" ? "size-6" : "size-5"}`}
          />
          <p className="text-[11px] font-extrabold text-slate-900 sm:text-xs">jouwmerk.nl</p>
          <span className="ml-auto text-[9px] font-bold text-slate-400 sm:text-[10px]">Gesponsord</span>
        </div>
        <div
          className={`flex ${imageAspect} flex-col items-center justify-center gap-2 bg-slate-950 px-4`}
        >
          <InteractiveLogo
            className={size === "desktop" ? "size-11" : "size-9"}
            interactive={false}
          />
          <p className="text-center text-sm font-extrabold leading-snug text-white sm:text-base">
            Ziet eruit als content. Voelt niet als reclame.
          </p>
        </div>
      </div>

      {showBubble ? (
        <MeneerBubble size={size}>{CAMPAGNES_CHANNEL_BUBBLES.meta}</MeneerBubble>
      ) : null}

      <div
        className={`flex items-center gap-2 px-1 font-bold text-white/45 ${
          size === "desktop" ? "text-[10px]" : "text-[11px]"
        }`}
      >
        <MetaIcon size={16} className="size-4 shrink-0" />
        <span>Meta = beide kanalen, één strategie</span>
      </div>
    </motion.div>
  );
}

/** Google Ads + Meta toggle met product/post mockups. */
export function HomeCampagnesVisual({
  size = "mobile",
  bubblePlacement = "inline",
  channel: controlledChannel,
  onChannelChange,
}: HomeCampagnesVisualProps) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref, { once: true, margin: "-12%" });
  const [internalChannel, setInternalChannel] = useState<Channel>("google");
  const channel = controlledChannel ?? internalChannel;
  const showBubble = bubblePlacement === "inline" && size !== "mobile";

  function selectChannel(next: Channel) {
    if (controlledChannel === undefined) {
      setInternalChannel(next);
    }
    onChannelChange?.(next);
  }

  const tabClass = (active: boolean) =>
    `flex items-center justify-center gap-2 rounded-xl transition-all duration-300 ${
      size === "desktop" ? "px-4 py-3" : "px-2 py-2.5"
    } ${
      active
        ? "bg-white text-slate-900 shadow-md"
        : "text-white/55 hover:text-white/80"
    }`;

  const tabLabelClass =
    size === "desktop" ? "text-xs font-extrabold sm:text-sm" : "text-[11px] font-extrabold";

  return (
    <div ref={ref} className="w-full min-w-0">
      <div
        className={`mb-3 grid grid-cols-2 gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] p-1 ${
          size === "desktop" ? "p-1.5" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => selectChannel("google")}
          className={tabClass(channel === "google")}
        >
          <GoogleLogoMark className={`shrink-0 ${size === "desktop" ? "size-5" : "size-4"}`} />
          <span className={tabLabelClass}>Google</span>
        </button>
        <button
          type="button"
          onClick={() => selectChannel("meta")}
          className={tabClass(channel === "meta")}
        >
          <MetaIcon
            size={size === "desktop" ? 20 : 16}
            className={`shrink-0 ${size === "desktop" ? "size-5" : "size-4"}`}
          />
          <span className={tabLabelClass}>Meta</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {channel === "google" ? (
          <GoogleAdsPanel key="google" reduce={reduce} size={size} showBubble={showBubble} />
        ) : (
          <MetaFeedPanel key="meta" reduce={reduce} size={size} showBubble={showBubble} />
        )}
      </AnimatePresence>

      {size === "desktop" && bubblePlacement === "external" ? (
        <p className="mt-2 text-[10px] font-medium text-white/30">
          <span className="text-[#FF5722]/90">Resultaat</span>, geen jargon.
        </p>
      ) : (
        <p
          className={`mt-3 text-pretty font-bold leading-snug text-white/40 ${
            size === "desktop" ? "text-xs sm:text-sm" : "text-[11px]"
          }`}
        >
          Geen moeilijke termen. Wel resultaat.{" "}
          <span className="text-[#FF5722]">Dat is het verschil.</span>
        </p>
      )}
    </div>
  );
}

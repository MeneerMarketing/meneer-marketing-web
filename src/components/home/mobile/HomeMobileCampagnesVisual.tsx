"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { FacebookLogoMark } from "@/components/icons/FacebookLogoMark";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";
import { InstagramLogoMark } from "@/components/icons/InstagramLogoMark";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

type Channel = "google" | "meta";

function MeneerBubble({ children }: { children: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <InteractiveLogo className="size-8 shrink-0" interactive={false} />
      <p className="rounded-2xl rounded-bl-sm bg-white/[0.08] px-3.5 py-2.5 text-[13px] font-bold leading-snug text-white/90">
        {children}
      </p>
    </div>
  );
}

function GoogleAdsPanel({ reduce }: { reduce: boolean }) {
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
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
          <GoogleLogoMark className="size-5 shrink-0" />
          <p className="min-w-0 truncate text-[11px] font-extrabold text-slate-900">jouwshop.nl</p>
          <span className="ml-auto shrink-0 text-[9px] font-bold text-slate-400">Gesponsord</span>
        </div>

        <div className="relative flex aspect-[5/4] items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
          <InteractiveLogo className="size-12" interactive={false} />
        </div>

        <div className="border-t border-slate-100 px-3 py-2.5">
          <p className="text-[12px] font-extrabold leading-snug text-[#1a0dab]">
            Jouw product · Bestseller
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-base font-extrabold text-slate-900">€49,00</span>
            <span className="text-[10px] font-medium text-slate-400 line-through">€69,00</span>
          </div>
          <p className="mt-1 text-[10px] font-medium text-slate-500">
            Google Shopping · jouwshop.nl · Gratis verzending
          </p>
          <p className="mt-1.5 text-[10px] font-bold text-emerald-600">★ 4,9 · Snelle levering</p>
        </div>
      </div>

      <MeneerBubble>
        Klein testen. Verkoopt het? Budget erbij. Verkoopt het niet? Uit. Geen gokken met jouw geld.
      </MeneerBubble>

      <ul className="space-y-2 px-1 text-[13px] font-bold">
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

function MetaFeedPanel({ reduce }: { reduce: boolean }) {
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
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
          <InstagramLogoMark className="size-5 shrink-0" />
          <p className="text-[11px] font-extrabold text-slate-900">jouwmerk.nl</p>
          <span className="ml-auto text-[9px] font-bold text-slate-400">Gesponsord</span>
        </div>
        <div className="flex aspect-[5/4] flex-col items-center justify-center gap-2 bg-slate-950 px-4">
          <InteractiveLogo className="size-9" interactive={false} />
          <p className="text-center text-sm font-extrabold leading-snug text-white">
            Ziet eruit als content. Voelt niet als reclame.
          </p>
        </div>
      </div>

      <MeneerBubble>
        Instagram én Facebook. Eén plan. Geen losse eilandjes waar budget in verdwijnt.
      </MeneerBubble>

      <div className="flex items-center gap-2 px-1 text-[11px] font-bold text-white/45">
        <FacebookLogoMark className="size-4 shrink-0" />
        <span>Meta = beide kanalen, één strategie</span>
      </div>
    </motion.div>
  );
}

/** Google Ads + Meta: simpel, grappig, geen dashboard-jargon. */
export function HomeMobileCampagnesVisual() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref, { once: true, margin: "-12%" });
  const [channel, setChannel] = useState<Channel>("google");

  return (
    <div ref={ref} className="w-full min-w-0">
      <div className="mb-3 grid grid-cols-2 gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
        <button
          type="button"
          onClick={() => setChannel("google")}
          className={`flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 transition-all duration-300 ${
            channel === "google"
              ? "bg-white text-slate-900 shadow-md"
              : "text-white/55 hover:text-white/80"
          }`}
        >
          <GoogleLogoMark className="size-4 shrink-0" />
          <span className="text-[11px] font-extrabold">Google</span>
        </button>
        <button
          type="button"
          onClick={() => setChannel("meta")}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 transition-all duration-300 ${
            channel === "meta"
              ? "bg-white text-slate-900 shadow-md"
              : "text-white/55 hover:text-white/80"
          }`}
        >
          <InstagramLogoMark className="size-4 shrink-0" />
          <FacebookLogoMark className="size-4 shrink-0" />
          <span className="text-[11px] font-extrabold">Meta</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {channel === "google" ? (
          <GoogleAdsPanel key="google" reduce={reduce} />
        ) : (
          <MetaFeedPanel key="meta" reduce={reduce} />
        )}
      </AnimatePresence>

      <p className="mt-3 text-pretty text-[11px] font-bold leading-snug text-white/40">
        Geen moeilijke termen. Wel resultaat.{" "}
        <span className="text-[#FF5722]">Dat is het verschil.</span>
      </p>
    </div>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type ChannelId = "google" | "meta" | "creators";

interface ChannelData {
  id: ChannelId;
  label: string;
  roas: string;
  cpa: string;
  spend: string;
  ctr: string;
  accent: string;
  adTitle: string;
  adHook: string;
}

const CHANNELS: ChannelData[] = [
  {
    id: "google",
    label: "Google Ads",
    roas: "4,8×",
    cpa: "€ 31",
    spend: "€ 2.400",
    ctr: "6,2%",
    accent: "#4285F4",
    adTitle: "Shopify expert · from scratch",
    adHook: "Custom build from scratch die converteert.",
  },
  {
    id: "meta",
    label: "Meta Ads",
    roas: "3,6×",
    cpa: "€ 44",
    spend: "€ 1.800",
    ctr: "2,8%",
    accent: "#E1306C",
    adTitle: "UGC video · 15 sec hook",
    adHook: "Echte klant, echte resultaten. Swipe voor meer.",
  },
  {
    id: "creators",
    label: "Creators",
    roas: "5,2×",
    cpa: "€ 26",
    spend: "€ 900",
    ctr: "4,1%",
    accent: "#FF5722",
    adTitle: "Creator review · 15 sec",
    adHook: "Echt mens, echt product. Jouw beelden, geen stock.",
  },
];

const BUDGET_SPLIT: Record<ChannelId, [number, number, number]> = {
  google: [58, 32, 10],
  meta: [35, 48, 17],
  creators: [28, 22, 50],
};

const AUTO_CYCLE_MS = 9000;

/**
 * Hero voor Campagnes: live ads-dashboard met kanaalwissel en ROAS-metrics.
 */
export function CampagnesHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ChannelId>("google");
  const userTouched = useRef(false);

  const channel = CHANNELS.find((c) => c.id === active) ?? CHANNELS[0];
  const split = BUDGET_SPLIT[active];

  const cycle = useCallback(() => {
    setActive((prev) => {
      const idx = CHANNELS.findIndex((c) => c.id === prev);
      return CHANNELS[(idx + 1) % CHANNELS.length].id;
    });
  }, []);

  useEffect(() => {
    if (reduce || userTouched.current) return;
    const t = window.setInterval(cycle, AUTO_CYCLE_MS);
    return () => window.clearInterval(t);
  }, [cycle, reduce]);

  function selectChannel(id: ChannelId) {
    userTouched.current = true;
    setActive(id);
  }

  return (
    <div className="relative mx-auto w-full max-w-[420px] select-none">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_56px_-24px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ads.command
            </p>
            <p className="text-xs font-extrabold text-slate-800">Live dashboard</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            <span className="text-[10px] font-bold text-emerald-700">Actief</span>
          </span>
        </div>

        <div className="flex gap-1 border-b border-slate-100 p-2">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => selectChannel(ch.id)}
              className={`flex-1 rounded-xl px-2 py-2 text-center text-[10px] font-bold transition-all duration-300 ${
                active === ch.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {ch.label.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "ROAS", value: channel.roas, highlight: true },
                  { label: "CPA", value: channel.cpa, highlight: false },
                  { label: "Spend", value: channel.spend, highlight: false },
                ].map((m) => (
                  <div
                    key={m.label}
                    className={`rounded-xl border px-2.5 py-2 ${
                      m.highlight
                        ? "border-[#FF5722]/30 bg-[#FF5722]/5"
                        : "border-slate-100 bg-slate-50/80"
                    }`}
                  >
                    <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                      {m.label}
                    </p>
                    <p
                      className={`mt-0.5 text-sm font-extrabold ${
                        m.highlight ? "text-[#FF5722]" : "text-slate-900"
                      }`}
                    >
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex items-start gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: channel.accent }}
                    aria-hidden
                  >
                    <Play className="size-4 fill-white" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400">Winning creative</p>
                    <p className="truncate text-xs font-extrabold text-slate-900">
                      {channel.adTitle}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-600">
                      {channel.adHook}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                    CTR {channel.ctr}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span>Budgetverdeling</span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="size-3" aria-hidden />
                    Schaalbaar
                  </span>
                </div>
                <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                  {split.map((pct, i) => (
                    <span
                      key={i}
                      className={`h-full transition-[width] duration-500 ease-out ${
                        i === 0
                          ? "bg-[#4285F4]"
                          : i === 1
                            ? "bg-[#E1306C]"
                            : "bg-[#FF5722]"
                      }`}
                      style={{ width: `${pct}%` }}
                      aria-hidden
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between text-[9px] text-slate-400">
                  <span>Zoek</span>
                  <span>Social</span>
                  <span>UGC</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="border-t border-slate-100 px-4 py-2 text-center text-[10px] text-slate-400">
          Tik een kanaal · dashboard wisselt mee
        </p>
      </div>
    </div>
  );
}

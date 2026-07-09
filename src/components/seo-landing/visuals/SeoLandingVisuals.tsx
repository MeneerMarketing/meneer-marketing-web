"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { HomeCampagnesVisual } from "@/components/home/shared/HomeCampagnesVisual";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";
import { GoogleShoppingIcon } from "@/components/icons/GoogleShoppingIcon";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { Check, TrendingUp } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface SeoLandingSerpVisualProps {
  keyword: string;
}

/** Compacte SERP-demo voor SEO-landingspagina's. */
export function SeoLandingSerpVisual({ keyword }: SeoLandingSerpVisualProps) {
  const reduce = useReducedMotion() ?? false;
  const [rank, setRank] = useState(1);
  const isWinner = rank === 1;

  return (
    <div className="w-full max-w-md">
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <GoogleLogoMark className="size-4 shrink-0" />
        <span className="truncate text-sm text-slate-600">{keyword}</span>
      </div>
      <div className="mb-3 flex gap-2">
        {[9, 3, 1].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRank(r)}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
              rank === r
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500 hover:text-slate-800"
            }`}
          >
            #{r}
          </button>
        ))}
      </div>
      <motion.div
        key={rank}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={`rounded-xl border-2 p-4 ${
          isWinner ? "border-[#FF5722]/40 bg-orange-50/80" : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${
              isWinner ? "bg-[#FF5722]" : "bg-slate-400"
            }`}
          >
            {rank}
          </span>
          <div>
            <p className={`text-[10px] font-bold uppercase ${isWinner ? "text-[#FF5722]" : "text-slate-400"}`}>
              Jouw merk
            </p>
            <p className={`mt-1 text-sm font-extrabold ${isWinner ? "text-[#1a0dab]" : "text-slate-600"}`}>
              Meneer Marketing · {keyword}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Custom build, SEO en ads onder één dak. From scratch.
            </p>
          </div>
        </div>
        {isWinner ? (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <Check className="size-3.5" aria-hidden />
            Positie 1 · organisch
          </p>
        ) : (
          <p className="mt-3 text-[11px] font-medium text-slate-500">
            Tik #1 en zie het verschil.
          </p>
        )}
      </motion.div>
    </div>
  );
}

export function SeoLandingGoogleAdsVisual() {
  return (
    <div className="w-full max-w-lg">
      <HomeCampagnesVisual size="desktop" bubblePlacement="external" />
    </div>
  );
}

export function SeoLandingMetaAdsVisual() {
  return (
    <div className="w-full max-w-lg">
      <HomeCampagnesVisual size="desktop" bubblePlacement="external" channel="meta" />
    </div>
  );
}

export function SeoLandingBuildVisual() {
  const reduce = useReducedMotion() ?? false;
  const lines = [
    "export function JouwSite() {",
    "  return <Landingspagina converteert />",
    "}",
  ];

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-[10px] font-mono text-white/40">page.tsx</span>
      </div>
      <div className="space-y-1 p-4 font-mono text-[12px] leading-relaxed">
        {lines.map((line, i) => (
          <motion.p
            key={line}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, ease: EASE }}
            className="text-emerald-300"
          >
            {line}
          </motion.p>
        ))}
        <motion.p
          animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-[#FF5722]"
        >
          // From scratch.
        </motion.p>
      </div>
    </div>
  );
}

export function SeoLandingWebshopVisual() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <GoogleShoppingIcon className="size-8" />
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          Shopping live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["Product A", "Product B", "Bundle", "B2B kit"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-slate-100 bg-gradient-to-br from-orange-50 to-slate-50 p-3"
          >
            <div className="mb-2 aspect-square rounded-lg bg-white shadow-inner" />
            <p className="text-[11px] font-bold text-slate-800">{label}</p>
            <p className="text-[10px] text-slate-500">Klaar voor ads</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeoLandingPortalVisual() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">B2B portaal</p>
        <p className="text-sm font-extrabold text-slate-900">Klantlogin · prijzen · herbestellen</p>
      </div>
      <div className="space-y-2 p-4">
        {["Order #1842 · opnieuw bestellen", "Prijslijst salon · zichtbaar", "Factuur · gedownload"].map(
          (row) => (
            <div
              key={row}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-[11px] font-semibold text-slate-700"
            >
              {row}
              <Check className="size-3.5 text-emerald-500" aria-hidden />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export function SeoLandingContentVisual() {
  const topics = [
    { label: "FAQ pagina", icon: "?" },
    { label: "Gids", icon: "◎" },
    { label: "Vergelijking", icon: "⇄" },
    { label: "Case", icon: "★" },
  ] as const;
  return (
    <div className="w-full max-w-md space-y-2">
      {topics.map((topic) => (
        <div
          key={topic.label}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-orange-50 text-xs font-black text-[#FF5722]">
            {topic.icon}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">{topic.label}</p>
            <p className="text-[11px] text-slate-500">Rankt op echte vragen</p>
          </div>
          <TrendingUp className="ml-auto size-4 text-emerald-500" aria-hidden />
        </div>
      ))}
    </div>
  );
}

interface SeoLandingAiVisualProps {
  keyword: string;
}

export function SeoLandingAiVisual({ keyword }: SeoLandingAiVisualProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-2xl">
      <div className="mb-3 flex items-center gap-2">
        <InteractiveLogo className="size-8" interactive={false} />
        <div>
          <p className="text-xs font-bold text-white">AI-antwoord</p>
          <p className="text-[10px] text-white/40">ChatGPT · Gemini</p>
        </div>
      </div>
      <p className="rounded-xl bg-white/10 px-3 py-2 text-[11px] text-white/70">
        Welk bureau voor {keyword}?
      </p>
      <p className="mt-2 rounded-xl bg-[#FF5722]/15 px-3 py-2.5 text-sm font-medium leading-relaxed text-white">
        Op basis van cases en reviews val ik voor{" "}
        <span className="font-extrabold text-[#FF5722]">Meneer Marketing</span>. Ze bouwen
        from scratch en pakken vindbaarheid én ads aan.
      </p>
    </div>
  );
}

const EMAIL_FLOWS = [
  { id: "welkom", label: "Welkom", detail: "Na aanmelding", active: false },
  { id: "abandon", label: "Cart recovery", detail: "Na 2 uur", active: true },
  { id: "winback", label: "Win-back", detail: "Na 60 dagen", active: false },
] as const;

/** Mailreeksen-visual voor behoud-landings. */
export function SeoLandingEmailFlowVisual() {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState<(typeof EMAIL_FLOWS)[number]["id"]>("abandon");

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          klant.flow
        </p>
        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
          LTV live
        </span>
      </div>
      <div className="space-y-2">
        {EMAIL_FLOWS.map((flow) => {
          const isActive = active === flow.id;
          return (
            <button
              key={flow.id}
              type="button"
              onClick={() => setActive(flow.id)}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition ${
                isActive
                  ? "border-[#FF5722]/40 bg-orange-50 shadow-sm"
                  : "border-slate-100 bg-slate-50/80 hover:border-slate-200"
              }`}
            >
              <span>
                <span className="block text-sm font-extrabold text-slate-900">{flow.label}</span>
                <span className="text-[11px] text-slate-500">{flow.detail}</span>
              </span>
              {isActive ? (
                <motion.span
                  layoutId="email-flow-dot"
                  className="size-2 rounded-full bg-[#FF5722]"
                  aria-hidden
                />
              ) : (
                <span className="size-2 rounded-full bg-slate-200" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
      <motion.p
        key={active}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-600"
      >
        {active === "abandon"
          ? "Gemiddeld 10% van verlaten carts komt terug via mail. Zonder flow: 0%."
          : active === "welkom"
            ? "Eerste indruk telt. Welkom mail direct na aanmelding."
            : "Slapende klanten wakker maken zonder kortingscode-spam."}
      </motion.p>
    </div>
  );
}

const STACK_LAYERS = [
  { label: "Site & shop", emoji: "🛠️", width: 100 },
  { label: "SEO & AI", emoji: "🔍", width: 86 },
  { label: "Google & Meta", emoji: "📣", width: 72 },
  { label: "E-mail & flows", emoji: "✉️", width: 58 },
] as const;

/** Strategie-stack voor bureau-landings. */
export function SeoLandingStrategyStackVisual() {
  const reduce = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 shadow-xl">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
        groei.stack
      </p>
      <p className="mt-1 text-sm font-extrabold text-slate-900">Eén plan, vier lagen</p>
      <div className="mt-5 flex flex-col items-center gap-1.5">
        {STACK_LAYERS.map((layer) => {
          const isActive = hovered === layer.label;
          return (
            <motion.div
              key={layer.label}
              onMouseEnter={() => setHovered(layer.label)}
              onMouseLeave={() => setHovered(null)}
              animate={
                reduce
                  ? undefined
                  : { scale: isActive ? 1.03 : 1, y: isActive ? -2 : 0 }
              }
              className={`flex h-11 items-center justify-between gap-2 rounded-xl border px-3 transition-colors ${
                isActive
                  ? "border-[#FF5722]/45 bg-[#FF5722]/10"
                  : "border-slate-200 bg-white"
              }`}
              style={{ width: `${layer.width}%` }}
            >
              <span className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                <span aria-hidden>{layer.emoji}</span>
                {layer.label}
              </span>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-wider text-emerald-600">
        Omzet (als de volgorde klopt)
      </p>
    </div>
  );
}

const METRIC_ROWS = [
  { label: "ROAS", value: "4.2×", trend: "+18%", hot: true },
  { label: "CPA", value: "€14", trend: "−9%", hot: false },
  { label: "Omzet", value: "€48k", trend: "+22%", hot: true },
] as const;

/** Dashboard-visual voor scene breaks (niet hero). */
export function SeoLandingMetricsVisual() {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState<(typeof METRIC_ROWS)[number]["label"]>("ROAS");

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          live.dashboard
        </p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          Deze week
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {METRIC_ROWS.map((row) => {
          const isActive = active === row.label;
          return (
            <button
              key={row.label}
              type="button"
              onClick={() => setActive(row.label)}
              className={`rounded-xl border px-2 py-2.5 text-left transition ${
                isActive
                  ? "border-[#FF5722]/40 bg-orange-50"
                  : "border-slate-100 bg-slate-50 hover:border-slate-200"
              }`}
            >
              <p className="text-[10px] font-bold uppercase text-slate-400">{row.label}</p>
              <p className="text-lg font-black text-slate-900">{row.value}</p>
              <p
                className={`text-[10px] font-bold ${
                  row.trend.startsWith("+") || row.trend.startsWith("−")
                    ? "text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                {row.trend}
              </p>
            </button>
          );
        })}
      </div>
      <motion.div
        key={active}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 h-16 rounded-xl bg-gradient-to-r from-slate-100 via-orange-100 to-emerald-100 p-3"
      >
        <div className="flex h-full items-end gap-1">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm bg-[#FF5722]/70"
              initial={reduce ? false : { height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.04, ease: EASE }}
            />
          ))}
        </div>
      </motion.div>
      <p className="mt-2 text-center text-[10px] font-medium text-slate-500">
        Budget naar winnaars. Niet naar gokken.
      </p>
    </div>
  );
}

const LOCAL_RESULTS = [
  { rank: 1, name: "Jouw bedrijf", rating: "4.9", reviews: 128 },
  { rank: 2, name: "Concurrent A", rating: "4.2", reviews: 34 },
  { rank: 3, name: "Concurrent B", rating: "4.0", reviews: 19 },
] as const;

/** Maps / lokaal-visual voor SEO scenes. */
export function SeoLandingLocalMapsVisual() {
  const reduce = useReducedMotion() ?? false;
  const [winner, setWinner] = useState(true);

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
        <GoogleLogoMark className="size-4 shrink-0" />
        <span className="text-xs font-semibold text-slate-600">salon apeldoorn</span>
      </div>
      <button
        type="button"
        onClick={() => setWinner((v) => !v)}
        className="mb-2 text-[10px] font-bold text-[#FF5722] hover:underline"
      >
        {winner ? "Bekijk zonder jou" : "Bekijk met jou op #1"}
      </button>
      <div className="space-y-2">
        {LOCAL_RESULTS.map((row) => {
          const isYou = row.rank === 1 && winner;
          const hidden = row.rank === 1 && !winner;
          if (hidden) return null;
          return (
            <motion.div
              key={row.name}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                isYou
                  ? "border-[#FF5722]/40 bg-orange-50"
                  : "border-slate-100 bg-white"
              }`}
            >
              <span
                className={`flex size-6 items-center justify-center rounded-full text-[10px] font-black text-white ${
                  isYou ? "bg-[#FF5722]" : "bg-slate-300"
                }`}
              >
                {isYou ? 1 : row.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-slate-900">{row.name}</p>
                <p className="text-[10px] text-slate-500">
                  ★ {row.rating} · {row.reviews} reviews
                </p>
              </div>
              {isYou ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  Maps #1
                </span>
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const TRACKING_TAGS = [
  { label: "GA4 purchase", status: "live" },
  { label: "GTM container", status: "live" },
  { label: "Meta pixel", status: "check" },
  { label: "Consent mode", status: "live" },
] as const;

/** Tracking / GTM lab-visual. */
export function SeoLandingTrackingVisual() {
  const reduce = useReducedMotion() ?? false;
  const [pulse, setPulse] = useState(0);

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
          tracking.lab
        </p>
        <button
          type="button"
          onClick={() => setPulse((p) => p + 1)}
          className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-white hover:bg-white/20"
        >
          Test event
        </button>
      </div>
      <div className="space-y-2 p-4">
        {TRACKING_TAGS.map((tag, i) => (
          <motion.div
            key={tag.label}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, ease: EASE }}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <span className="font-mono text-[11px] text-white/80">{tag.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                tag.status === "live"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {tag.status}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.p
        key={pulse}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-t border-white/10 px-4 py-2 font-mono text-[10px] text-emerald-400"
      >
        → purchase_event fired · value €89.00
      </motion.p>
    </div>
  );
}

const COMPARE_OPTIONS = [
  { id: "a", label: "Optie A", detail: "Snel resultaat", pick: false },
  { id: "b", label: "Optie B", detail: "Duurzame marge", pick: true },
] as const;

/** Split-keuze visual voor vergelijk-pagina's. */
export function SeoLandingCompareVisual() {
  const reduce = useReducedMotion() ?? false;
  const [selected, setSelected] = useState<(typeof COMPARE_OPTIONS)[number]["id"]>("b");

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 shadow-xl">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
        keuze.split
      </p>
      <p className="mt-1 text-sm font-extrabold text-slate-900">Tik en zie het verschil</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {COMPARE_OPTIONS.map((opt) => {
          const isActive = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              className={`rounded-xl border p-3 text-left transition ${
                isActive
                  ? "border-[#FF5722]/50 bg-orange-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="text-xs font-extrabold text-slate-900">{opt.label}</p>
              <p className="mt-1 text-[10px] text-slate-500">{opt.detail}</p>
            </button>
          );
        })}
      </div>
      <motion.p
        key={selected}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-xl border border-slate-100 bg-white px-3 py-2 text-[11px] font-medium text-slate-600"
      >
        {selected === "a"
          ? "Ads of snelle traffic als je site al converteert."
          : "SEO of content als je marge ruimte heeft voor compound groei."}
      </motion.p>
    </div>
  );
}

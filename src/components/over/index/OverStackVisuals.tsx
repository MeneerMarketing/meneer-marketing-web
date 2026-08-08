"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Heart,
  MessageCircle,
  MousePointerClick,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";
import { StackBrandIcon } from "@/components/over/index/StackBrandIcon";
import type { StackBrandId } from "@/components/over/index/StackBrandIcon";

interface StackVisualProps {
  itemId: string;
  accent: string;
}

function VisualShell({
  children,
  accent,
  label,
  stackId,
}: {
  children: ReactNode;
  accent: string;
  label: string;
  stackId: StackBrandId;
}) {
  return (
    <div className="relative flex min-h-[300px] flex-col p-4 sm:p-5 lg:min-h-[340px]">
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full blur-3xl"
        style={{ backgroundColor: `${accent}22` }}
        aria-hidden
      />
      <div className="relative mb-4 flex items-center gap-2.5">
        <span
          className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-inner"
          style={{ boxShadow: `0 0 24px -8px ${accent}66` }}
        >
          <StackBrandIcon id={stackId} size={18} />
        </span>
        <p
          className="text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: accent }}
        >
          {label}
        </p>
      </div>
      <div className="relative flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}

function BrowserChrome({
  url,
  brandId,
  children,
}: {
  url: string;
  brandId?: StackBrandId;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="size-2 rounded-full bg-red-400/90" aria-hidden />
        <span className="size-2 rounded-full bg-amber-400/90" aria-hidden />
        <span className="size-2 rounded-full bg-emerald-400/90" aria-hidden />
        <div className="ml-1 flex flex-1 items-center gap-1.5 truncate rounded-md bg-white/5 px-2 py-0.5">
          {brandId ? <StackBrandIcon id={brandId} size={12} /> : null}
          <span className="truncate font-mono text-[9px] text-slate-400">{url}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function ShopifyVisual({ accent }: { accent: string }) {
  const reduce = useReducedMotion();

  return (
    <VisualShell accent={accent} label="B2B-portaal · live voorbeeld" stackId="shopify">
      <BrowserChrome url="portal.skincomplete.nl" brandId="shopify">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StackBrandIcon id="shopify" size={16} />
              <p className="text-[10px] font-bold text-white">Salon bestelt zelf</p>
            </div>
            <motion.span
              animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
              className="rounded-full bg-[#96BF48]/20 px-2 py-0.5 text-[9px] font-bold text-[#96BF48]"
            >
              24/7 open
            </motion.span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["LED-Mask", "Neck", "Refill"].map((product, i) => (
              <motion.div
                key={product}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                whileHover={reduce ? undefined : { y: -2 }}
                className="rounded-lg border border-white/10 bg-white/5 p-2 transition-shadow hover:shadow-[0_8px_24px_-8px_#96BF4866]"
              >
                <div className="aspect-square rounded-md bg-gradient-to-br from-[#96BF48]/35 to-slate-800" />
                <p className="mt-1.5 truncate text-[8px] font-bold text-slate-300">{product}</p>
                <p className="flex items-center gap-0.5 text-[8px] text-emerald-400">
                  <Check className="size-2" aria-hidden />
                  Op voorraad
                </p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-3 flex items-center justify-between rounded-lg border border-[#96BF48]/30 bg-[#96BF48]/10 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-3.5 text-[#96BF48]" aria-hidden />
              <span className="text-[10px] font-bold text-white">3 producten · €2.840</span>
            </div>
            <span className="rounded-full bg-[#96BF48] px-2.5 py-1 text-[9px] font-bold text-white">
              Bestellen
            </span>
          </motion.div>
          <p className="mt-2 text-center text-[8px] font-bold text-slate-500">
            Direct antwoord in plaats van Excel of &ldquo;bel me maandag&rdquo;.
          </p>
        </div>
      </BrowserChrome>
    </VisualShell>
  );
}

function NextjsVisual({ accent }: { accent: string }) {
  const reduce = useReducedMotion();

  return (
    <VisualShell accent={accent} label="Core Web Vitals · productie" stackId="nextjs">
      <div className="grid w-full max-w-md gap-3 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/90">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <StackBrandIcon id="nextjs" size={14} />
            <span className="font-mono text-[9px] text-slate-400">layout.tsx</span>
            <span className="ml-auto rounded bg-emerald-500/20 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400">
              TS
            </span>
          </div>
          <div className="p-3 font-mono text-[9px]">
            <p className="text-slate-500">// geen template, wel snel</p>
            <p className="mt-1 text-violet-300">export default function Page()</p>
            <p className="text-white">{"{"}</p>
            <p className="pl-2 text-emerald-300">return &lt;Hero /&gt;</p>
            <p className="text-white">{"}"}</p>
            <motion.div
              initial={reduce ? false : { width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"
            >
              <motion.span
                animate={reduce ? undefined : { x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                className="block h-full w-1/3 rounded-full bg-emerald-400/80"
              />
            </motion.div>
            <p className="mt-1 flex items-center gap-1 text-emerald-400">
              <Check className="size-2.5" aria-hidden />
              build ✓ 4.2s
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { label: "LCP", value: "0.8s", ok: true },
            { label: "CLS", value: "0.02", ok: true },
            { label: "INP", value: "45ms", ok: true },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={reduce ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <span className="text-[10px] font-bold text-slate-400">{metric.label}</span>
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-400">
                {metric.value}
                <Check className="size-3" aria-hidden />
              </span>
            </motion.div>
          ))}
          <div className="relative mt-1 flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="size-20" aria-hidden>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <motion.circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke="#34D399"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="201"
                initial={reduce ? undefined : { strokeDashoffset: 201 }}
                animate={{ strokeDashoffset: 16 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                transform="rotate(-90 40 40)"
              />
            </svg>
            <span className="absolute text-lg font-black text-white">98</span>
            <StackBrandIcon id="nextjs" size={14} className="absolute -bottom-1 -right-1 opacity-60" />
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

function SeoVisual({ accent }: { accent: string }) {
  const reduce = useReducedMotion();

  return (
    <VisualShell accent={accent} label="Google + AI-antwoorden" stackId="seo">
      <div className="grid w-full max-w-md gap-3 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-white/10 bg-white p-3 shadow-lg">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
            <StackBrandIcon id="seo" size={14} />
            <Search className="size-3 text-slate-400" aria-hidden />
            <span className="text-[9px] font-medium text-slate-600">led mask salon inkoop</span>
          </div>
          <div className="mt-2 space-y-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-[#00BCD4]/30 bg-cyan-50/80 p-2 ring-2 ring-[#00BCD4]/20"
            >
              <p className="flex items-center gap-1 text-[9px] font-bold text-[#00838F]">
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                jouwmerk.nl
              </p>
              <p className="text-[8px] leading-snug text-slate-600">
                Professioneel LED-mask voor salons. B2B-portaal, training inbegrepen.
              </p>
            </motion.div>
            {[1, 2].map((n) => (
              <div key={n} className="rounded-lg bg-slate-50 p-2 opacity-40">
                <p className="h-2 w-16 rounded bg-slate-200" />
                <p className="mt-1.5 h-1.5 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { ai: "ChatGPT", icon: "/icons/chatgpt-mark.png" },
            { ai: "Gemini", icon: "/icons/gemini-mark.png" },
          ].map(({ ai, icon }, i) => (
            <motion.div
              key={ai}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="rounded-xl border border-white/10 bg-slate-900/80 p-2.5"
            >
              <p className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-slate-400">
                <Image src={icon} alt="" width={14} height={14} className="rounded-sm" unoptimized />
                {ai}
                <Sparkles className="ml-auto size-2.5" style={{ color: accent }} aria-hidden />
              </p>
              <p className="mt-1 text-[8px] leading-snug text-slate-300">
                Voor salons: <span className="font-bold text-cyan-300">JouwMerk</span> levert
                professionele LED-systemen met B2B-portaal.
              </p>
            </motion.div>
          ))}
          <div className="flex items-end gap-1 px-1 pt-1">
            {[40, 55, 72, 88].map((h, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { height: 0 }}
                animate={{ height: h * 0.35 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="w-4 rounded-t-sm bg-gradient-to-t from-[#00BCD4] to-cyan-300"
              />
            ))}
            <span className="mb-0.5 text-[8px] font-bold text-slate-500">autoriteit ↑</span>
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

function GoogleAdsVisual({ accent }: { accent: string }) {
  const reduce = useReducedMotion();

  return (
    <VisualShell accent={accent} label="Campagne · eerst converteren" stackId="google-ads">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-900/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StackBrandIcon id="google-ads" size={18} />
            <p className="text-[10px] font-bold text-white">Search · NL</p>
          </div>
          <motion.span
            animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400"
          >
            ROAS 4.2x
          </motion.span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "Klikken", value: "2.4k", h: 48, dim: true },
            { label: "Conversies", value: "186", h: 72, dim: false },
            { label: "Omzet", value: "€31k", h: 88, dim: false },
          ].map((bar, i) => (
            <div key={bar.label} className="flex flex-col items-center">
              <div className="flex h-20 w-full items-end justify-center">
                <motion.div
                  initial={reduce ? false : { height: 0 }}
                  animate={{ height: bar.h * 0.75 }}
                  transition={{ delay: 0.08 * i, type: "spring", stiffness: 200 }}
                  className={`w-8 rounded-t-md ${bar.dim ? "bg-slate-600" : "bg-[#4285F4]"}`}
                  style={!bar.dim ? { boxShadow: `0 0 20px ${accent}44` } : undefined}
                />
              </div>
              <p className="mt-1 text-[8px] font-bold text-slate-400">{bar.label}</p>
              <p className="text-[10px] font-extrabold text-white">{bar.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#FF5722]/25 bg-[#FF5722]/10 px-3 py-2">
          <MousePointerClick className="size-3.5 text-[#FF5722]" aria-hidden />
          <p className="text-[9px] font-bold text-[#FF5722]">
            Landingspagina scoorde eerst. Ads daarna. Meten en bijsturen.
          </p>
        </div>
      </div>
    </VisualShell>
  );
}

function MetaAdsVisual({ accent }: { accent: string }) {
  const reduce = useReducedMotion();

  return (
    <VisualShell accent={accent} label="Feed · Reels · Stories" stackId="meta-ads">
      <div className="flex w-full max-w-sm items-center gap-4">
        <div className="w-[120px] shrink-0 overflow-hidden rounded-[1.25rem] border-2 border-slate-700 bg-slate-900 shadow-xl">
          <div className="flex items-center justify-between bg-slate-800 px-2 py-1">
            <span className="text-[8px] font-bold text-white">9:41</span>
            <StackBrandIcon id="meta-ads" size={12} />
          </div>
          <div className="relative aspect-[9/14] bg-gradient-to-b from-pink-500/40 via-purple-600/30 to-slate-900 p-2">
            <span className="rounded bg-[#E1306C] px-1.5 py-0.5 text-[7px] font-bold text-white">
              Gesponsord
            </span>
            <p className="mt-2 text-[9px] font-extrabold leading-tight text-white">
              Matras die echt ademt.
            </p>
            <motion.div
              initial={reduce ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg bg-white/95 px-2 py-1.5"
            >
              <span className="text-[8px] font-bold text-slate-900">Shop now</span>
              <ArrowRight className="size-3 text-[#E1306C]" aria-hidden />
            </motion.div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {[
            { icon: Heart, label: "Engagement", value: "3.8%", color: "#E1306C" },
            { icon: MousePointerClick, label: "CTR", value: "2.1%", color: "#833AB4" },
            { icon: BarChart3, label: "ROAS", value: "3.4x", color: accent },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <span
                className="flex size-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${stat.color}22`, color: stat.color }}
              >
                <stat.icon className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-[8px] font-bold uppercase text-slate-500">{stat.label}</p>
                <p className="text-sm font-extrabold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
          <p className="text-[9px] font-bold leading-snug text-slate-400">
            Creatief + data. Niet alleen mooi, ook meetbaar.
          </p>
        </div>
      </div>
    </VisualShell>
  );
}

function AutomationVisual({ accent }: { accent: string }) {
  const reduce = useReducedMotion();

  const nodes = [
    { id: "order", label: "Shopify order", brandId: "shopify" as const, className: "left-0 top-2" },
    { id: "hub", label: "n8n flow", brandId: "automation" as const, className: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" },
    { id: "mail", label: "Klaviyo mail", icon: MessageCircle, className: "right-0 top-0" },
    { id: "crm", label: "CRM update", icon: BarChart3, className: "right-0 bottom-2" },
  ] as const;

  return (
    <VisualShell accent={accent} label="Koppelingen · zero copy-paste" stackId="automation">
      <div className="relative h-[220px] w-full max-w-md">
        <svg viewBox="0 0 320 200" className="absolute inset-0 size-full" aria-hidden>
          <motion.path
            d="M 70 50 C 110 50, 130 95, 155 100"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeOpacity="0.45"
            initial={reduce ? undefined : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          <motion.path
            d="M 165 100 C 195 75, 225 55, 255 45"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeOpacity="0.45"
            initial={reduce ? undefined : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          />
          <motion.path
            d="M 165 105 C 195 130, 225 155, 255 165"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeOpacity="0.45"
            initial={reduce ? undefined : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          />
          {!reduce ? (
            <motion.circle
              r="3"
              fill={accent}
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              style={{ offsetPath: "path('M 70 50 C 110 50, 130 95, 155 100')" }}
            />
          ) : null}
        </svg>

        {nodes.map((node, i) => {
          const isHub = node.id === "hub";
          return (
            <motion.div
              key={node.id}
              initial={reduce ? false : { opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * i }}
              className={`absolute flex w-[88px] flex-col items-center rounded-xl border border-white/10 bg-slate-900/95 p-2.5 ${node.className} ${
                isHub ? "z-10 border-[#FF5722]/40 bg-[#FF5722]/10 shadow-[0_0_28px_-8px_#FF5722]" : ""
              }`}
            >
              <span
                className="flex size-9 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: isHub ? `${accent}33` : "rgba(255,255,255,0.06)",
                }}
              >
                {"brandId" in node && node.brandId ? (
                  <StackBrandIcon id={node.brandId} size={20} />
                ) : "icon" in node && node.icon ? (
                  <node.icon className="size-4 text-slate-400" aria-hidden />
                ) : (
                  <Package className="size-4 text-slate-400" aria-hidden />
                )}
              </span>
              <p className="mt-1.5 text-center text-[8px] font-bold leading-tight text-slate-300">
                {node.label}
              </p>
              {isHub ? (
                <motion.span
                  animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="mt-1 rounded-full bg-[#FF5722] px-2 py-0.5 text-[7px] font-bold text-white"
                >
                  live
                </motion.span>
              ) : null}
            </motion.div>
          );
        })}

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="absolute inset-x-0 bottom-0 text-center text-[9px] font-bold text-slate-400"
        >
          Order binnen → mail uit → CRM bijgewerkt. Jij: koffie.
        </motion.p>
      </div>
    </VisualShell>
  );
}

export function OverStackVisual({ itemId, accent }: StackVisualProps) {
  switch (itemId) {
    case "shopify":
      return <ShopifyVisual accent={accent} />;
    case "nextjs":
      return <NextjsVisual accent={accent} />;
    case "seo":
      return <SeoVisual accent={accent} />;
    case "google-ads":
      return <GoogleAdsVisual accent={accent} />;
    case "meta-ads":
      return <MetaAdsVisual accent={accent} />;
    case "automation":
      return <AutomationVisual accent={accent} />;
    default:
      return <AutomationVisual accent={accent} />;
  }
}

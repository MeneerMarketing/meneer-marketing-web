"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  Hammer,
  Megaphone,
  Search,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { PillarSlug } from "@/lib/navigation";
import {
  PillarHubCanvas,
  PillarHubSection,
} from "@/components/pillars/premium/PillarHubSection";

interface RouteNode {
  id: PillarSlug;
  label: string;
  short: string;
  href: string;
  x: number;
  y: number;
}

const VIEW_W = 1440;
const VIEW_H = 560;

const NODES: RouteNode[] = [
  { id: "strategie", label: "Strategie & groei", short: "Plan", href: "/strategie", x: 10, y: 72 },
  { id: "bouwen", label: "Bouwen from scratch", short: "Bouw", href: "/bouwen", x: 28, y: 38 },
  { id: "vindbaarheid", label: "Vindbaarheid", short: "SEO", href: "/vindbaarheid", x: 50, y: 58 },
  { id: "campagnes", label: "Acquisitie", short: "Ads", href: "/campagnes", x: 72, y: 32 },
  { id: "behoud", label: "Behoud", short: "Mail", href: "/behoud", x: 90, y: 62 },
];

function nodeToSvg(node: RouteNode) {
  return { x: (node.x / 100) * VIEW_W, y: (node.y / 100) * VIEW_H };
}

/** Vloeiende spline die exact door elk knooppunt loopt */
function buildRoutePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

const ROUTE_PATH = buildRoutePath(NODES.map(nodeToSvg));

const NODE_ICONS: Record<PillarSlug, typeof Target> = {
  strategie: Target,
  bouwen: Hammer,
  vindbaarheid: Search,
  campagnes: Megaphone,
  behoud: Heart,
};

/**
 * Interactieve groeiroute: vijf hoofdblokken als pad dat je kunt aanklikken.
 */
export function HomeGrowthRouteMap() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<PillarSlug | null>(null);
  const activeNode = active ? NODES.find((n) => n.id === active) : null;

  return (
    <PillarHubSection aria-labelledby="home-route-heading">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Je groeiroute
        </p>
        <h2
          id="home-route-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          Vijf blokken. Eén lijn. Geen losse eindjes.
        </h2>
        <p className="mt-2 max-w-xl text-slate-400">
          Strategie, bouw, vindbaarheid, campagnes en behoud horen bij elkaar. Klik
          een stap en spring naar dat hoofdblok.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <PillarHubCanvas barTitle="groeiroute.map" barStatus="live" aspectClass="aspect-[16/10]">
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 size-full" aria-hidden>
              <motion.path
                d={ROUTE_PATH}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <motion.path
                d={ROUTE_PATH}
                fill="none"
                stroke="#FF5722"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </svg>
            {NODES.map((node) => {
              const isActive = active === node.id;
              const isDimmed = active !== null && !isActive;
              const Icon = NODE_ICONS[node.id];
              return (
                <Link
                  key={node.id}
                  href={node.href}
                  onMouseEnter={() => setActive(node.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(node.id)}
                  onBlur={() => setActive(null)}
                  className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] ${
                    isDimmed ? "scale-90 opacity-30" : "opacity-100"
                  } ${isActive ? "z-10 scale-110" : ""}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <span
                    className={`flex size-12 items-center justify-center rounded-2xl border shadow-lg transition-colors ${
                      isActive
                        ? "border-[#FF5722] bg-[#FF5722] text-white"
                        : "border-white/15 bg-white/10 text-white backdrop-blur"
                    }`}
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isActive ? "bg-[#FF5722] text-white" : "bg-slate-950/80 text-slate-300"
                    }`}
                  >
                    {node.short}
                  </span>
                </Link>
              );
            })}
          </PillarHubCanvas>

          <ul className="flex flex-col gap-2">
            {NODES.map((node, index) => {
              const Icon = NODE_ICONS[node.id];
              const isActive = active === node.id;
              return (
                <motion.li
                  key={node.id}
                  initial={reduce ? false : { opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                  className="flex flex-1"
                >
                  <Link
                    href={node.href}
                    onMouseEnter={() => setActive(node.id)}
                    onMouseLeave={() => setActive(null)}
                    className={`group flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
                      isActive
                        ? "border-[#FF5722]/40 bg-white/[0.08]"
                        : "border-white/[0.08] bg-white/[0.03] hover:border-white/15"
                    }`}
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isActive ? "bg-[#FF5722] text-white" : "bg-white/10 text-slate-300"
                      }`}
                    >
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold text-white">{node.label}</span>
                    </span>
                    <ArrowUpRight
                      className={`size-4 shrink-0 ${isActive ? "text-[#FF5722]" : "text-slate-500"}`}
                    />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {activeNode ? (
          <p className="mt-6 text-center text-sm text-slate-400 lg:text-left">
            Geselecteerd:{" "}
            <span className="font-bold text-white">{activeNode.label}</span>
          </p>
        ) : null}
      </div>
    </PillarHubSection>
  );
}

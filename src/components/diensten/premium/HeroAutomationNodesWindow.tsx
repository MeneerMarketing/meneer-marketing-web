"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const NODES = [
  { id: "shopify", label: "Shopify", x: 8, y: 45 },
  { id: "n8n", label: "n8n", x: 42, y: 12 },
  { id: "crm", label: "CRM", x: 78, y: 38 },
  { id: "slack", label: "Slack", x: 55, y: 72 },
] as const;

const EDGES: [string, string][] = [
  ["shopify", "n8n"],
  ["n8n", "crm"],
  ["n8n", "slack"],
];

/**
 * Node-graph met pulserende data tussen systemen.
 */
export function HeroAutomationNodesWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.75);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!isInView || reduce) return;
    const t = window.setInterval(() => setPulse((p) => p + 1), 1400);
    return () => window.clearInterval(t);
  }, [isInView, reduce]);

  function nodePos(id: string) {
    const n = NODES.find((x) => x.id === id);
    return n ? { x: n.x, y: n.y } : { x: 50, y: 50 };
  }

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full items-center justify-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-[280px] w-full max-w-[320px] rounded-2xl border border-slate-200 bg-slate-950 p-4 shadow-xl"
          style={{ transform: "translateZ(38px)" }}
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
            automation.map
          </p>
          <p className="text-xs font-extrabold text-white">Order → CRM → alert</p>

          <svg className="absolute inset-4 mt-8 h-[calc(100%-3rem)] w-[calc(100%-2rem)]" aria-hidden>
            {EDGES.map(([from, to], i) => {
              const a = nodePos(from);
              const b = nodePos(to);
              const active = pulse % EDGES.length === i;
              return (
                <g key={`${from}-${to}`}>
                  <line
                    x1={`${a.x}%`}
                    y1={`${a.y}%`}
                    x2={`${b.x}%`}
                    y2={`${b.y}%`}
                    stroke={active ? "#FF5722" : "#334155"}
                    strokeWidth={active ? 2.5 : 1.5}
                    strokeDasharray={active ? undefined : "4 4"}
                  />
                  {active && !reduce ? (
                    <motion.circle
                      r="4"
                      fill="#FF5722"
                      initial={{ cx: `${a.x}%`, cy: `${a.y}%` }}
                      animate={{ cx: `${b.x}%`, cy: `${b.y}%` }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {NODES.map((node, i) => {
            const lit = pulse % NODES.length === i;
            return (
              <motion.div
                key={node.id}
                animate={{ scale: lit ? 1.08 : 1 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <span
                  className={`flex min-w-[72px] items-center justify-center rounded-lg border px-2 py-1.5 text-[10px] font-bold ${
                    lit
                      ? "border-[#FF5722]/50 bg-[#FF5722]/20 text-[#FF5722]"
                      : "border-slate-600 bg-slate-800 text-slate-300"
                  }`}
                >
                  {node.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2"
          style={{ transform: "translateZ(48px)" }}
        >
          <p className="text-[9px] font-bold uppercase text-emerald-600">Saved / week</p>
          <p className="text-sm font-extrabold text-emerald-700">6 uur handwerk</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

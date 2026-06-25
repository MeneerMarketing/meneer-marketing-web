"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  MessageSquare,
  ShoppingBag,
  Target,
  Workflow,
  Zap,
} from "lucide-react";

interface NodeDefinition {
  id: string;
  label: string;
  Icon: typeof ShoppingBag;
  angle: number;
  color: string;
}

const NODES: NodeDefinition[] = [
  { id: "shop", label: "Shopify", Icon: ShoppingBag, angle: -90, color: "#95BF47" },
  { id: "auto", label: "n8n flows", Icon: Workflow, angle: -18, color: "#EA4B71" },
  { id: "ads", label: "Ads", Icon: Target, angle: 54, color: "#FF5722" },
  { id: "chat", label: "AI chat", Icon: Bot, angle: 126, color: "#00BCD4" },
  { id: "mail", label: "Mail", Icon: MessageSquare, angle: 198, color: "#0F172A" },
];

const STATUS_NODES: { id: string; label: string; state: "live" | "sync" | "idle" }[] = [
  { id: "shopify", label: "Shopify", state: "live" },
  { id: "n8n", label: "n8n", state: "sync" },
  { id: "ads", label: "Ads", state: "live" },
  { id: "chat", label: "Chat", state: "live" },
];

export function SystemNerveCenter() {
  const reduce = useReducedMotion();
  const [revenue, setRevenue] = useState(47382);
  const [elapsed, setElapsed] = useState(0);
  const sparkPath = useRef(generateSparkPath(42, 120, 44, 18));

  useEffect(() => {
    if (reduce) return;
    const revenueTick = setInterval(() => {
      setRevenue((r) => r + Math.floor(Math.random() * 27) + 4);
    }, 2400);
    const timeTick = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => {
      clearInterval(revenueTick);
      clearInterval(timeTick);
    };
  }, [reduce]);

  const elapsedLabel = formatElapsed(elapsed);
  const revenueLabel = formatEuro(revenue);

  return (
    <div className="relative w-full max-w-[520px]">
      <OrbitField reduce={reduce ?? false} />

      <motion.div
        className="relative isolate overflow-hidden rounded-[28px] border border-slate-900/10 bg-white/80 p-6 shadow-[0_28px_80px_-28px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-8"
        animate={
          reduce
            ? undefined
            : {
                y: [0, -4, 0, 3, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : { duration: 9, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 0% 0%, rgba(0,188,212,0.08), transparent 55%), radial-gradient(circle at 100% 100%, rgba(255,87,34,0.07), transparent 60%)",
          }}
        />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              {!reduce ? (
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
              ) : null}
              <span className="relative size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900">
              Live systeem
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tabular-nums text-slate-500">
            <Zap className="size-3 text-[#FF5722]" strokeWidth={2.4} />
            {elapsedLabel}
          </div>
        </div>

        <div className="relative mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Omzet vannacht
          </p>
          <div className="mt-1.5 flex items-baseline gap-3">
            <span className="text-5xl font-extrabold tracking-tighter tabular-nums text-slate-900 sm:text-[3.25rem]">
              {revenueLabel}
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
              <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
                <path
                  d="M3 7 L6 4 L9 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              12,4%
            </span>
          </div>
        </div>

        <div className="relative mt-6">
          <Sparkline path={sparkPath.current} reduce={reduce ?? false} />
        </div>

        <div className="relative mt-7 grid grid-cols-4 gap-2.5">
          {STATUS_NODES.map((node, i) => (
            <StatusChip key={node.id} node={node} delay={i * 0.12} reduce={reduce ?? false} />
          ))}
        </div>

        <div className="relative mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-[11px] font-semibold text-slate-500">
          <span className="inline-flex items-center gap-1.5 tracking-tight">
            <span className="size-1.5 rounded-full bg-[#FF5722]" />
            02:14 AM
          </span>
          <span className="inline-flex items-center gap-1.5 tracking-tight">
            Laatste sync 00:00:03
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function OrbitField({ reduce }: { reduce: boolean }) {
  const size = 520;
  const cx = size / 2;
  const cy = 260;
  const radii = [210, 260];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ width: "100%", height: "100%" }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {radii.map((r) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(15, 23, 42, 0.08)"
            strokeDasharray="2 6"
            strokeWidth="1"
          />
        ))}
      </svg>

      {NODES.map((node, i) => (
        <OrbitNode
          key={node.id}
          node={node}
          index={i}
          total={NODES.length}
          reduce={reduce}
        />
      ))}
    </div>
  );
}

function OrbitNode({
  node,
  index,
  reduce,
}: {
  node: NodeDefinition;
  index: number;
  total: number;
  reduce: boolean;
}) {
  const radius = index % 2 === 0 ? 210 : 255;
  const rad = (node.angle * Math.PI) / 180;
  const x = 50 + (Math.cos(rad) * radius) / 5.2;
  const y = 50 + (Math.sin(rad) * radius) / 5.2;

  return (
    <motion.div
      className="absolute flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-md"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
      animate={
        reduce
          ? undefined
          : {
              y: [0, -6, 0, 4, 0],
              x: [0, 3, 0, -2, 0],
            }
      }
      transition={
        reduce
          ? undefined
          : {
              duration: 7 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }
      }
    >
      <span
        className="flex size-5 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: node.color }}
        aria-hidden
      >
        <node.Icon className="size-3" strokeWidth={2.4} />
      </span>
      <span className="text-[11px] font-bold tracking-tight text-slate-900">
        {node.label}
      </span>
    </motion.div>
  );
}

function Sparkline({
  path,
  reduce,
}: {
  path: { d: string; points: { x: number; y: number }[] };
  reduce: boolean;
}) {
  const last = path.points[path.points.length - 1];

  return (
    <div className="relative h-[88px] w-full">
      <svg
        viewBox="0 0 420 88"
        className="absolute inset-0 size-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5722" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${path.d} L 420 88 L 0 88 Z`}
          fill="url(#spark-fill)"
          stroke="none"
        />
        <motion.path
          d={path.d}
          fill="none"
          stroke="#FF5722"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.8, ease: "easeOut" }}
        />
        {!reduce ? (
          <motion.circle
            cx={(last.x / 42) * 420}
            cy={last.y}
            r="4"
            fill="#FF5722"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
        <circle
          cx={(last.x / 42) * 420}
          cy={last.y}
          r="3"
          fill="#FFFFFF"
          stroke="#FF5722"
          strokeWidth="1.8"
        />
      </svg>
    </div>
  );
}

function StatusChip({
  node,
  delay,
  reduce,
}: {
  node: { id: string; label: string; state: "live" | "sync" | "idle" };
  delay: number;
  reduce: boolean;
}) {
  const color =
    node.state === "live"
      ? "#10B981"
      : node.state === "sync"
        ? "#0EA5E9"
        : "#94A3B8";

  return (
    <div className="flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 backdrop-blur-md">
      <span className="flex items-center gap-1.5">
        <span className="relative flex size-2">
          {!reduce ? (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: color }}
              animate={{ scale: [1, 2.4, 1], opacity: [0.65, 0, 0.65] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeOut",
                delay,
              }}
            />
          ) : null}
          <span
            className="relative size-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </span>
      </span>
      <span className="text-[11px] font-bold tracking-tight text-slate-900">
        {node.label}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {node.state === "live" ? "online" : node.state === "sync" ? "sync" : "idle"}
      </span>
    </div>
  );
}

function generateSparkPath(points: number, width: number, height: number, baseline: number) {
  const pts: { x: number; y: number }[] = [];
  let seed = 13;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  let y = baseline;
  for (let i = 0; i < points; i++) {
    const drift = (rand() - 0.45) * 12;
    y = Math.max(8, Math.min(height + baseline - 10, y + drift - i * 0.18));
    pts.push({ x: i, y });
  }
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(p.x / (points - 1)) * 420} ${p.y}`)
    .join(" ");
  return { d, points: pts };
}

function formatEuro(n: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600) + 7;
  const m = Math.floor((seconds % 3600) / 60) + 23;
  const s = seconds % 60;
  const pad = (v: number) => v.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)} actief`;
}

"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

const NODES = [
  { id: "doelen", label: "Doelen", angle: -90, color: "#0F172A" },
  { id: "data", label: "Data", angle: 0, color: "#38BDF8" },
  { id: "kanalen", label: "Kanalen", angle: 90, color: "#FF5722" },
  { id: "budget", label: "Budget", angle: 180, color: "#34D399" },
] as const;

type NodeId = (typeof NODES)[number]["id"];

const BASE_X = 8;
const BASE_Z = -6;

/**
 * Hero voor Strategie: interactief groeikompas met vier ankerpunten
 * (doelen, data, kanalen, budget) die oplichten en verbindingen tonen.
 */
export function StrategieHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<NodeId | null>("doelen");

  const mx = useMotionValue(BASE_X);
  const my = useMotionValue(BASE_Z);
  const tiltX = useSpring(mx, { stiffness: 120, damping: 18 });
  const tiltZ = useSpring(my, { stiffness: 120, damping: 18 });

  function onMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(BASE_X + py * -6);
    my.set(BASE_Z + px * 8);
  }

  function onLeave() {
    mx.set(BASE_X);
    my.set(BASE_Z);
  }

  const radius = 118;

  return (
    <div
      className="relative mx-auto w-full max-w-[440px] select-none"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute -left-6 top-4 size-40 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-4 -right-4 size-36 rounded-full bg-sky-300/20 blur-3xl"
        aria-hidden
      />

      <div className="relative h-[360px] [perspective:1200px]">
        <motion.div
          style={{
            rotateX: reduce ? BASE_X : tiltX,
            rotateZ: reduce ? BASE_Z : tiltZ,
            transformStyle: "preserve-3d",
          }}
          className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2"
        >
          {/* Orbit ring */}
          <div
            className="absolute inset-6 rounded-full border border-dashed border-slate-200/80"
            aria-hidden
          />

          {/* Verbindingslijnen naar centrum */}
          <svg
            viewBox="0 0 300 300"
            className="absolute inset-0 size-full"
            aria-hidden
          >
            {NODES.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const cx = 150 + Math.cos(rad) * radius;
              const cy = 150 + Math.sin(rad) * radius;
              const isActive = active === node.id;
              return (
                <motion.line
                  key={node.id}
                  x1="150"
                  y1="150"
                  x2={cx}
                  y2={cy}
                  stroke={isActive ? node.color : "#E2E8F0"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray={isActive ? "0" : "4 4"}
                  animate={{ opacity: isActive ? 1 : 0.45 }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </svg>

          {/* Centrum */}
          <motion.div
            animate={
              reduce
                ? undefined
                : { boxShadow: ["0 0 0 0 rgba(255,87,34,0)", "0 0 0 12px rgba(255,87,34,0.08)", "0 0 0 0 rgba(255,87,34,0)"] }
            }
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-[#FF5722]/30 bg-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.35)]"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
              Kern
            </span>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">
              Groeiplan
            </span>
          </motion.div>

          {/* Nodes */}
          {NODES.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const isActive = active === node.id;
            return (
              <motion.button
                key={node.id}
                type="button"
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: isActive ? 1.08 : 1 }}
                transition={{ delay: 0.1 * i, type: "spring", stiffness: 260, damping: 18 }}
                onMouseEnter={() => setActive(node.id)}
                onFocus={() => setActive(node.id)}
                onClick={() =>
                  setActive((prev) => (prev === node.id ? null : node.id))
                }
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border px-3 py-2.5 transition-shadow duration-300 ${
                  isActive
                    ? "border-transparent bg-white shadow-[0_16px_32px_-12px_rgba(15,23,42,0.35)] ring-2 ring-offset-1"
                    : "border-slate-200 bg-white/90 hover:border-slate-300"
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  ...(isActive ? { boxShadow: `0 0 0 2px ${node.color}44` } : {}),
                }}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: node.color }}
                  aria-hidden
                />
                <span className="text-[11px] font-extrabold text-slate-800">
                  {node.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="relative -mt-2 flex flex-wrap items-center justify-center gap-2">
        {NODES.map((node) => (
          <button
            key={node.id}
            type="button"
            onMouseEnter={() => setActive(node.id)}
            onMouseLeave={() => setActive(null)}
            onClick={() =>
              setActive((prev) => (prev === node.id ? null : node.id))
            }
            className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
              active === node.id
                ? "border-[#FF5722]/40 bg-[#FF5722]/5 text-[#FF5722]"
                : "border-slate-200 text-slate-500"
            }`}
          >
            {node.label}
          </button>
        ))}
      </div>

      <motion.div
        animate={reduce ? undefined : { y: [-4, 4] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror" }}
        className="absolute right-0 top-6 rounded-xl border border-emerald-200 bg-white px-3 py-2 shadow-lg"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Volgorde
        </p>
        <p className="text-sm font-extrabold text-emerald-500">Eerst plan</p>
      </motion.div>

      <motion.div
        animate={reduce ? undefined : { y: [5, -5] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        className="absolute left-0 top-20 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 shadow-lg"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Kanalen
        </p>
        <p className="text-sm font-extrabold text-white">Max. 3</p>
      </motion.div>
    </div>
  );
}

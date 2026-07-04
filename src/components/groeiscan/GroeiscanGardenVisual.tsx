"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GROEISCAN_CHANNELS, TOWER_FLOORS } from "@/lib/groeiscan-playground";

interface GroeiscanGardenVisualProps {
  activeFloors: boolean[];
  score: number;
  growthLabel: string;
  frictionHours: number;
  channelIds: ReadonlySet<string>;
  waterPulse?: number;
  compact?: boolean;
}

function weedCount(hours: number): number {
  if (hours <= 2) return 0;
  if (hours <= 8) return 2;
  if (hours <= 18) return 4;
  return 6;
}

/**
 * Interactieve groeituin: plant, wortels, onkruid en zonlicht.
 */
export function GroeiscanGardenVisual({
  activeFloors,
  score,
  growthLabel,
  frictionHours,
  channelIds,
  waterPulse = 0,
  compact = false,
}: GroeiscanGardenVisualProps) {
  const reduce = useReducedMotion() ?? false;
  const stemH = compact ? 28 + score * 0.55 : 38 + score * 0.72;
  const leafCount = activeFloors.filter(Boolean).length;
  const weeds = weedCount(frictionHours);
  const activeChannels = GROEISCAN_CHANNELS.filter((c) => channelIds.has(c.id));

  return (
    <div
      className={`relative flex flex-col items-center ${compact ? "py-2" : "py-4"}`}
      aria-hidden
    >
      <div className={`relative w-full ${compact ? "max-w-[210px]" : "max-w-[280px]"}`}>
        <div className="mb-3 flex items-end justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Groeikracht
          </span>
          <motion.span
            key={score}
            initial={reduce ? undefined : { scale: 0.85, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-black tabular-nums text-[#FF5722] ${compact ? "text-2xl" : "text-4xl"}`}
          >
            {score}
          </motion.span>
        </div>

        <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-[#FF5722] to-orange-300"
            initial={false}
            animate={{ width: `${score}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />
        </div>

        <motion.p
          key={growthLabel}
          initial={reduce ? undefined : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center text-xs font-extrabold text-slate-700"
        >
          Fase: {growthLabel}
        </motion.p>

        <div className={`relative mx-auto mt-4 ${compact ? "h-[200px]" : "h-[260px]"}`}>
          {/* Zonlicht per kanaal */}
          {activeChannels.map((ch, i) => (
            <motion.span
              key={ch.id}
              initial={reduce ? undefined : { opacity: 0, scale: 0 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
              className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[8px] font-bold text-amber-800 shadow-sm"
              style={{ top: `${8 + i * 22}px` }}
            >
              <span className="size-1.5 rounded-full bg-amber-400" />
              {ch.label.split(" ")[0]}
            </motion.span>
          ))}

          <svg
            viewBox="0 0 200 240"
            className="size-full"
            role="img"
            aria-label="Groeiplant visualisatie"
          >
            {/* Pot */}
            <path
              d="M55 195 Q100 188 145 195 L138 228 Q100 236 62 228 Z"
              fill="#F5F0EA"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />
            <rect x="58" y="228" width="84" height="8" rx="3" fill="#E2E8F0" />

            {/* Wortels / verdiepingen */}
            {TOWER_FLOORS.map((floor, i) => {
              const active = activeFloors[i];
              const y = 198 + i * 5;
              return (
                <motion.g
                  key={floor.id}
                  animate={{ opacity: active ? 1 : 0.25 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <line
                    x1={100 - 20 + i * 3}
                    y1={195}
                    x2={100 - 32 + i * 8}
                    y2={y}
                    stroke={active ? "#FF5722" : "#94A3B8"}
                    strokeWidth={active ? 2 : 1}
                    strokeLinecap="round"
                  />
                  <line
                    x1={100 + 20 - i * 3}
                    y1={195}
                    x2={100 + 32 - i * 8}
                    y2={y}
                    stroke={active ? "#FF5722" : "#94A3B8"}
                    strokeWidth={active ? 2 : 1}
                    strokeLinecap="round"
                  />
                </motion.g>
              );
            })}

            {/* Stengel */}
            <motion.line
              x1="100"
              y1="195"
              x2="100"
              initial={{ y2: 170 }}
              animate={{ y2: 195 - stemH }}
              transition={{ type: "spring", stiffness: 70, damping: 16 }}
              stroke="#22C55E"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Bladeren */}
            {Array.from({ length: leafCount }).map((_, i) => {
              const side = i % 2 === 0 ? -1 : 1;
              const yLeaf = 195 - stemH + 18 + i * (stemH / Math.max(leafCount, 1)) * 0.65;
              return (
                <motion.ellipse
                  key={`leaf-${i}`}
                  cx={100 + side * 22}
                  cy={yLeaf}
                  rx="16"
                  ry="9"
                  fill="#4ADE80"
                  stroke="#16A34A"
                  strokeWidth="1"
                  initial={reduce ? undefined : { scale: 0, rotate: side * 30 }}
                  animate={{ scale: 1, rotate: side * 18 }}
                  transition={{ delay: 0.1 + i * 0.07, type: "spring", stiffness: 260, damping: 18 }}
                />
              );
            })}

            {/* Top bloem / knop bij hoge score */}
            {score >= 52 ? (
              <motion.circle
                cx="100"
                cy={195 - stemH - 8}
                r="10"
                fill="#FF5722"
                initial={reduce ? undefined : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 16 }}
              />
            ) : (
              <motion.circle
                cx="100"
                cy={195 - stemH - 4}
                r="6"
                fill="#86EFAC"
                initial={reduce ? undefined : { scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}

            {/* Onkruid */}
            {Array.from({ length: weeds }).map((_, i) => {
              const x = 42 + (i % 3) * 38 + (i > 2 ? 10 : 0);
              const y = 210 + (i % 2) * 6;
              return (
                <motion.g
                  key={`weed-${i}`}
                  initial={reduce ? undefined : { y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <path
                    d={`M${x} ${y + 14} Q${x - 4} ${y} ${x} ${y - 10} Q${x + 5} ${y} ${x} ${y + 14}`}
                    fill="none"
                    stroke="#64748B"
                    strokeWidth="1.5"
                  />
                  <path
                    d={`M${x} ${y - 2} Q${x - 8} ${y - 8} ${x - 6} ${y - 14}`}
                    fill="none"
                    stroke="#64748B"
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${x} ${y - 2} Q${x + 8} ${y - 8} ${x + 6} ${y - 14}`}
                    fill="none"
                    stroke="#64748B"
                    strokeWidth="1.2"
                  />
                </motion.g>
              );
            })}
          </svg>

          {/* Waterdruppel bij stap */}
          {waterPulse > 0 && !reduce ? (
            <motion.div
              key={waterPulse}
              initial={{ opacity: 0, y: -20, x: "50%" }}
              animate={{ opacity: [0, 1, 0], y: 40 }}
              transition={{ duration: 0.9, ease: "easeIn" }}
              className="pointer-events-none absolute left-1/2 top-8 size-3 -translate-x-1/2 rounded-full bg-sky-400 shadow-md"
            />
          ) : null}
        </div>

        <div className="mt-1 flex flex-wrap justify-center gap-1">
          {TOWER_FLOORS.map((floor, i) => (
            <span
              key={floor.id}
              className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${
                activeFloors[i]
                  ? "bg-[#FF5722]/10 text-[#FF5722]"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {floor.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

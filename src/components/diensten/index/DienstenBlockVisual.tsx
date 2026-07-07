"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PillarSlug } from "@/lib/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;

function StrategieVisual({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col justify-end gap-2 p-4">
      <div className="flex gap-2">
        {["ROAS", "CAC", "LTV"].map((k, i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 * i, ease: EASE }}
            className="flex-1 rounded-xl border border-slate-200/80 bg-white/90 px-2 py-2 text-center"
          >
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{k}</p>
            <p className="mt-0.5 text-sm font-black tabular-nums" style={{ color: accent }}>
              {i === 0 ? "4.2×" : i === 1 ? "€38" : "€890"}
            </p>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
        className="h-1.5 origin-left rounded-full"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

function BouwenVisual() {
  return (
    <div className="p-4 font-mono text-[10px] leading-relaxed">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-emerald-500"
      >
        ✓ next build · CWV groen
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-1 text-slate-400"
      >
        <span className="text-[#FF5722]">export</span> default Site
      </motion.p>
      <motion.div
        initial={{ width: "12%" }}
        whileInView={{ width: "92%" }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
        className="mt-3 h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-[#FF5722]"
      />
    </div>
  );
}

function VindbaarheidVisual() {
  return (
    <div className="space-y-2 p-4">
      <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
        <p className="text-[9px] text-slate-400">meneermarketing.nl › vindbaarheid</p>
        <p className="mt-1 text-xs font-bold text-[#1a0dab]">SEO from scratch · Meneer Marketing</p>
        <p className="mt-0.5 text-[10px] leading-snug text-slate-600">
          Organisch vóór paid. Techniek, content, AI-antwoorden.
        </p>
      </div>
      <motion.span
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 }}
        className="inline-flex rounded-full bg-cyan-500/15 px-2 py-0.5 text-[9px] font-bold text-cyan-700"
      >
        ook in ChatGPT
      </motion.span>
    </div>
  );
}

function CampagnesVisual({ accent }: { accent: string }) {
  return (
    <div className="flex h-full items-center justify-center gap-3 p-4">
      {["Google", "Meta"].map((label, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 * i }}
          className={`rounded-2xl px-4 py-3 text-center text-xs font-extrabold shadow-sm ${
            i === 0 ? "text-white" : "border border-slate-200 bg-white text-slate-700"
          }`}
          style={i === 0 ? { backgroundColor: accent } : undefined}
        >
          {label}
          <span className="mt-1 block text-[9px] font-semibold opacity-80">
            {i === 0 ? "Search · Shopping" : "Feed · Reels"}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function BehoudVisual() {
  const nodes = ["Bezoeker", "Mail", "Flow", "Klant"];
  return (
    <div className="flex items-center justify-center gap-1.5 p-4">
      {nodes.map((n, i) => (
        <motion.div
          key={n}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 * i }}
          className="flex flex-col items-center"
        >
          <span
            className={`size-2.5 rounded-full ${i === nodes.length - 1 ? "bg-[#FF5722]" : "bg-slate-300"}`}
          />
          <span className="mt-1 max-w-[3.5rem] text-center text-[8px] font-bold text-slate-500">
            {n}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export function DienstenBlockVisual({
  slug,
  accent,
}: {
  slug: PillarSlug;
  accent: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative min-h-[120px] overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white"
      aria-hidden
    >
      {!reduce ? (
        <motion.div
          className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: accent }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
      {slug === "strategie" ? <StrategieVisual accent={accent} /> : null}
      {slug === "bouwen" ? <BouwenVisual /> : null}
      {slug === "vindbaarheid" ? <VindbaarheidVisual /> : null}
      {slug === "campagnes" ? <CampagnesVisual accent={accent} /> : null}
      {slug === "behoud" ? <BehoudVisual /> : null}
    </div>
  );
}

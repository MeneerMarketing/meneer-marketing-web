"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { MeterTechnicalFinding, MeterFindingStatus } from "@/lib/meter/types";

interface MeterTechnicalReportProps {
  findings: MeterTechnicalFinding[];
}

const STATUS_LABEL: Record<MeterFindingStatus, string> = {
  pass: "OK",
  warn: "Let op",
  fail: "Lek",
  info: "Info",
};

const STATUS_CLASS: Record<MeterFindingStatus, string> = {
  pass: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  fail: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-slate-200 bg-slate-50 text-slate-700",
};

const CATEGORY_ORDER = [
  "Transport",
  "Markup",
  "Indexering",
  "Structured data",
  "Performance stack",
  "Conversie stack",
  "CMS & stack",
] as const;

export function MeterTechnicalReport({ findings }: MeterTechnicalReportProps) {
  const reduce = useReducedMotion() ?? false;

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: findings.filter((f) => f.category === category),
  })).filter((group) => group.items.length > 0);

  const failCount = findings.filter((f) => f.status === "fail").length;
  const warnCount = findings.filter((f) => f.status === "warn").length;
  const passCount = findings.filter((f) => f.status === "pass").length;

  return (
    <section aria-labelledby="meter-tech-heading" className="mx-auto mt-10 max-w-5xl">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Technische snapshot
            </p>
            <h2
              id="meter-tech-heading"
              className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
            >
              Wat ik in de HTML response zie
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Geen checklist van buzzwords. Concrete signalen uit de DOM, head tags, render stack
              en integraties. Dit is wat crawlers en browsers ook zien.
            </p>
          </div>
          <dl className="flex shrink-0 gap-3 text-center">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                OK
              </dt>
              <dd className="font-black tabular-nums text-2xl text-emerald-800">{passCount}</dd>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Let op
              </dt>
              <dd className="font-black tabular-nums text-2xl text-amber-900">{warnCount}</dd>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                Lek
              </dt>
              <dd className="font-black tabular-nums text-2xl text-rose-800">{failCount}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 space-y-8">
          {grouped.map((group, groupIndex) => (
            <div key={group.category}>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {group.category}
              </h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((finding, index) => (
                  <motion.li
                    key={`${finding.label}-${index}`}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : groupIndex * 0.04 + index * 0.03 }}
                    className={`rounded-2xl border px-4 py-3 ${STATUS_CLASS[finding.status]}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-bold tracking-tight">{finding.label}</p>
                      <span className="rounded-full border border-current/20 bg-white/50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                        {STATUS_LABEL[finding.status]}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed opacity-90">{finding.detail}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

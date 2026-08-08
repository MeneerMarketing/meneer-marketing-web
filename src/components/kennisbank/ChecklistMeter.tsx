"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type {
  ChecklistMeterCheck,
  ChecklistMeterTier,
} from "@/data/kennisbank/types";
import { siteCtas } from "@/lib/cta";

interface ChecklistMeterProps {
  eyebrow?: string;
  title: string;
  intro: string;
  storageKey: string;
  eventName: string;
  sharePath: string;
  scoreNoun?: string;
  checks: ChecklistMeterCheck[];
  tiers: ChecklistMeterTier[];
  ctaHref?: string;
  ctaLabel?: string;
}

function scoreFromCount(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

function tierForScore(
  score: number,
  tiers: ChecklistMeterTier[],
): ChecklistMeterTier {
  return (
    tiers.find((t) => score >= t.min && score <= t.max) ??
    tiers[tiers.length - 1]!
  );
}

function pushAnalytics(eventName: string, score: number, tier: string): void {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({
    event: eventName,
    score,
    tier,
  });
}

export function ChecklistMeter({
  eyebrow = "Interactieve test",
  title,
  intro,
  storageKey,
  eventName,
  sharePath,
  scoreNoun = "score",
  checks,
  tiers,
  ctaHref = "/diensten/strategie",
  ctaLabel = "Strategie & groei",
}: ChecklistMeterProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setChecked(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked, hydrated, storageKey]);

  const count = useMemo(
    () => checks.filter((c) => checked[c.id]).length,
    [checked, checks],
  );
  const score = scoreFromCount(count, checks.length);
  const tier = tierForScore(score, tiers);
  const topFixes = useMemo(
    () => checks.filter((c) => checked[c.id]).slice(0, 3),
    [checked, checks],
  );

  function toggle(id: string): void {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    setCopied(false);
  }

  function reset(): void {
    setChecked({});
    setCopied(false);
  }

  async function copyScore(): Promise<void> {
    const lines = [
      `Mijn ${title} ${scoreNoun}: ${score}/100`,
      `Label: ${tier.label}`,
      tier.quip,
      `Test: https://meneermarketing.nl${sharePath}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      pushAnalytics(eventName, score, tier.id);
    } catch {
      setCopied(false);
    }
  }

  const headingId = `${storageKey}-heading`;

  return (
    <section
      className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]"
      aria-labelledby={headingId}
    >
      <div className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          {eyebrow}
        </p>
        <h3
          id={headingId}
          className="mt-2 text-2xl font-extrabold tracking-tight"
        >
          {title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-300">
          {intro}
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.35fr_0.85fr]">
        <ul className="divide-y divide-slate-100 p-2 sm:p-3">
          {checks.map((item) => {
            const on = Boolean(checked[item.id]);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={on}
                  className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3.5 text-left transition ${
                    on ? "bg-orange-50/80" : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border-2 text-xs font-extrabold transition ${
                      on
                        ? "border-[#FF5722] bg-[#FF5722] text-white"
                        : "border-slate-300 bg-white text-transparent"
                    }`}
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span className="min-w-0 text-sm font-semibold leading-snug text-slate-800 sm:text-[15px]">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6 lg:border-l lg:border-t-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Jouw {scoreNoun}
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-extrabold tracking-tight text-slate-900">
              {score}
            </span>
            <span className="mb-2 text-sm font-bold text-slate-500">/ 100</span>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
            aria-label={title}
          >
            <div
              className="h-full rounded-full bg-[#FF5722] transition-[width] duration-300 ease-out motion-reduce:transition-none"
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="mt-4 text-lg font-extrabold text-slate-900">
            {tier.label}
          </p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
            {tier.quip}
          </p>

          {topFixes.length > 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                Eerst dit fixen
              </p>
              <ol className="mt-3 space-y-3">
                {topFixes.map((item) => (
                  <li
                    key={item.id}
                    className="text-sm leading-relaxed text-slate-700"
                  >
                    <span className="font-bold text-slate-900">{item.fix}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="mt-5 text-sm font-medium text-slate-500">
              Vink aan wat je herkent. Ik zeg eerlijk hoe erg het is.
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-slate-900"
            >
              Opnieuw
            </button>
            <button
              type="button"
              onClick={() => void copyScore()}
              className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:border-[#FF5722] hover:bg-[#FF5722]"
            >
              {copied ? "Gekopieerd" : "Kopieer mijn score"}
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              {ctaLabel}
            </Link>
            <Link
              href={siteCtas.startIntake.href}
              className="inline-flex items-center justify-center rounded-full bg-[#FF5722] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
            >
              {siteCtas.startIntake.label}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Gem, HelpCircle } from "lucide-react";

import type { VerticalInterestId } from "@/data/verticals/types";
import {
  verticalSectionClass,
  verticalSectionCompactClass,
} from "@/components/verticals/form/vertical-form-styles";

export type VerticalPackageBilling = "monthly" | "one_time" | "advisory";

export interface VerticalPackageOption {
  id: VerticalInterestId;
  label: string;
  short: string;
  hint: string;
  recommended?: boolean;
  billing?: VerticalPackageBilling;
}

interface VerticalPackagePickerProps {
  legend: string;
  options: readonly VerticalPackageOption[];
  value: VerticalInterestId;
  onChange: (id: VerticalInterestId) => void;
  onFocusStart?: () => void;
  compact?: boolean;
}

function priceSuffix(billing: VerticalPackageBilling | undefined): string {
  if (billing === "one_time") return "ex. btw · eenmalig";
  if (billing === "advisory") return "";
  return "ex. btw/m";
}

export function VerticalPackagePicker({
  legend,
  options,
  value,
  onChange,
  onFocusStart,
  compact = false,
}: VerticalPackagePickerProps) {
  const reduce = useReducedMotion() ?? false;

  const subscriptions = options.filter(
    (opt) => !opt.billing || opt.billing === "monthly",
  );
  const signature = options.find((opt) => opt.billing === "one_time");
  const advisory = options.find((opt) => opt.billing === "advisory");

  const sectionClass = compact ? verticalSectionCompactClass : verticalSectionClass;

  return (
    <div className={sectionClass}>
      <fieldset>
        <legend className="text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">
          {legend}
        </legend>
        {!compact ? (
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Abonnementen hieronder. Signature is een apart eenmalig traject.
          </p>
        ) : null}

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {subscriptions.map((opt) => {
            const selected = value === opt.id;
            return (
              <motion.label
                key={opt.id}
                whileHover={reduce ? undefined : { y: selected ? 0 : -1 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className={
                  selected
                    ? "relative cursor-pointer rounded-xl border-2 border-[#FF5722] bg-gradient-to-br from-orange-50 to-white p-3 shadow-[0_10px_28px_-16px_rgba(255,87,34,0.5)]"
                    : "relative cursor-pointer rounded-xl border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:shadow-sm"
                }
              >
                {opt.recommended ? (
                  <span className="absolute -top-2 left-3 rounded-full bg-slate-900 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                    Populair
                  </span>
                ) : null}
                <input
                  type="radio"
                  name="interest"
                  value={opt.id}
                  checked={selected}
                  onChange={() => onChange(opt.id)}
                  onFocus={onFocusStart}
                  className="sr-only"
                />
                <span className="block text-sm font-extrabold text-slate-900">
                  {opt.label}
                </span>
                <span className="mt-0.5 block font-mono text-sm font-bold text-[#FF5722]">
                  {opt.short.replace(/^Vanaf\s+/i, "")}
                  <span className="ml-1 font-sans text-[10px] font-semibold text-slate-400">
                    {priceSuffix(opt.billing)}
                  </span>
                </span>
                <span className="mt-1.5 block text-[11px] leading-snug text-slate-500">
                  {opt.hint}
                </span>
              </motion.label>
            );
          })}
        </div>

        {signature ? (
          <motion.label
            whileHover={reduce ? undefined : { scale: value === signature.id ? 1 : 1.005 }}
            className={
              value === signature.id
                ? "relative mt-3 flex cursor-pointer gap-3 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-3.5 text-white shadow-[0_16px_40px_-20px_rgba(15,23,42,0.65)] sm:items-center sm:p-4"
                : "relative mt-3 flex cursor-pointer gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3.5 transition hover:border-slate-400 hover:bg-slate-100/80 sm:items-center sm:p-4"
            }
          >
            <input
              type="radio"
              name="interest"
              value={signature.id}
              checked={value === signature.id}
              onChange={() => onChange(signature.id)}
              onFocus={onFocusStart}
              className="sr-only"
            />
            <span
              className={
                value === signature.id
                  ? "flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300"
                  : "flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm"
              }
            >
              <Gem className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-extrabold">{signature.label}</span>
                <span
                  className={
                    value === signature.id
                      ? "rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-200"
                      : "rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600"
                  }
                >
                  Eenmalig afkopen
                </span>
                <span
                  className={
                    value === signature.id
                      ? "rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-300"
                      : "rounded-full bg-slate-200/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600"
                  }
                >
                  Alleen website · jij beheert
                </span>
              </span>
              <span
                className={
                  value === signature.id
                    ? "mt-1 block font-mono text-lg font-bold text-amber-300"
                    : "mt-1 block font-mono text-lg font-bold text-slate-900"
                }
              >
                {signature.short.replace(/^Vanaf\s+/i, "")}
                <span
                  className={
                    value === signature.id
                      ? "ml-2 font-sans text-xs font-semibold text-slate-400"
                      : "ml-2 font-sans text-xs font-semibold text-slate-500"
                  }
                >
                  ex. btw · eenmalig project
                </span>
              </span>
              <span
                className={
                  value === signature.id
                    ? "mt-1 block text-xs leading-snug text-slate-300"
                    : "mt-1 block text-xs leading-snug text-slate-600"
                }
              >
                {signature.hint}
              </span>
            </span>
          </motion.label>
        ) : null}

        {advisory ? (
          <label
            className={
              value === advisory.id
                ? "mt-2 flex cursor-pointer items-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-3 py-2.5 text-white"
                : "mt-2 flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-700 transition hover:border-slate-300"
            }
          >
            <input
              type="radio"
              name="interest"
              value={advisory.id}
              checked={value === advisory.id}
              onChange={() => onChange(advisory.id)}
              onFocus={onFocusStart}
              className="sr-only"
            />
            <HelpCircle className="size-4 shrink-0 opacity-70" aria-hidden />
            <span className="text-sm font-bold">{advisory.label}</span>
            <span className="text-xs opacity-70">{advisory.hint}</span>
          </label>
        ) : null}
      </fieldset>
    </div>
  );
}

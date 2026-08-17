"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { VerticalInterestId } from "@/data/verticals/types";
import { verticalSectionClass } from "@/components/verticals/form/vertical-form-styles";

export interface VerticalPackageOption {
  id: VerticalInterestId;
  label: string;
  short: string;
  hint: string;
  recommended?: boolean;
}

interface VerticalPackagePickerProps {
  legend: string;
  options: readonly VerticalPackageOption[];
  value: VerticalInterestId;
  onChange: (id: VerticalInterestId) => void;
  onFocusStart?: () => void;
}

export function VerticalPackagePicker({
  legend,
  options,
  value,
  onChange,
  onFocusStart,
}: VerticalPackagePickerProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className={verticalSectionClass}>
      <fieldset>
        <legend className="text-base font-extrabold tracking-tight text-slate-900">
          {legend}
        </legend>
        <p className="mt-1 text-sm text-slate-500">
          Tik erop. Je ziet meteen wat je kiest.
        </p>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {options.map((opt) => {
            const selected = value === opt.id;
            return (
              <motion.label
                key={opt.id}
                whileHover={reduce ? undefined : { y: selected ? 0 : -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={
                  selected
                    ? "relative cursor-pointer rounded-2xl border-2 border-[#FF5722] bg-gradient-to-br from-orange-50 to-white p-4 shadow-[0_12px_32px_-18px_rgba(255,87,34,0.45)] ring-2 ring-[#FF5722]/10"
                    : "relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-md"
                }
              >
                {opt.recommended ? (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
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
                <span className="mt-1 block font-mono text-sm font-bold text-[#FF5722]">
                  {opt.short.replace(/^Vanaf\s+/i, "")}
                  <span className="ml-1 font-sans text-xs font-semibold text-slate-400">
                    ex. btw/m
                  </span>
                </span>
                <span className="mt-2 block text-xs leading-snug text-slate-500">
                  {opt.hint}
                </span>
              </motion.label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

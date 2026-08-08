"use client";

import { useState } from "react";
import type { HotTakeOption } from "@/data/kennisbank/types";

interface HotTakePickerProps {
  eyebrow?: string;
  title: string;
  prompt: string;
  options: HotTakeOption[];
}

const TONE_STYLES: Record<
  NonNullable<HotTakeOption["tone"]>,
  string
> = {
  win: "border-[#FF5722]/40 bg-orange-50 text-slate-900",
  meh: "border-amber-300/60 bg-amber-50 text-slate-900",
  ouch: "border-rose-300/70 bg-rose-50 text-slate-900",
};

export function HotTakePicker({
  eyebrow = "Speel even mee",
  title,
  prompt,
  options,
}: HotTakePickerProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const selected = options.find((o) => o.id === picked) ?? null;

  return (
    <section
      className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]"
      aria-labelledby="hot-take-heading"
    >
      <div className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5 py-5 text-white sm:px-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          {eyebrow}
        </p>
        <h3
          id="hot-take-heading"
          className="mt-2 text-2xl font-extrabold tracking-tight"
        >
          {title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-300">
          {prompt}
        </p>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
        {options.map((option, index) => {
          const on = picked === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setPicked(option.id)}
              aria-pressed={on}
              className={`group relative overflow-hidden rounded-2xl border-2 px-4 py-4 text-left transition duration-300 will-change-transform ${
                on
                  ? "border-[#FF5722] bg-orange-50 shadow-[0_12px_28px_-18px_rgba(255,87,34,0.55)]"
                  : "border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Optie {String.fromCharCode(65 + index)}
              </span>
              <span className="mt-2 block text-base font-extrabold leading-snug text-slate-900">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={`mx-4 mb-4 rounded-2xl border px-5 py-4 transition sm:mx-6 sm:mb-6 ${
          selected
            ? TONE_STYLES[selected.tone ?? "meh"]
            : "border-dashed border-slate-300 bg-slate-50 text-slate-500"
        }`}
        aria-live="polite"
      >
        {selected ? (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
              Meneer zegt
            </p>
            <p className="mt-2 text-base font-semibold leading-relaxed">
              {selected.verdict}
            </p>
          </>
        ) : (
          <p className="text-sm font-medium">
            Kies er één. Ik hou mijn mening niet voor me.
          </p>
        )}
      </div>
    </section>
  );
}

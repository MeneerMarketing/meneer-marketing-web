"use client";

import { MessageCircle, Rocket } from "lucide-react";

import { verticalSectionCompactClass } from "@/components/verticals/form/vertical-form-styles";

export type VerticalFormIntent = "pay" | "talk";

interface VerticalIntentTabsProps {
  intent: VerticalFormIntent;
  payEligible: boolean;
  onIntentChange: (intent: VerticalFormIntent) => void;
  compact?: boolean;
}

export function VerticalIntentTabs({
  intent,
  payEligible,
  onIntentChange,
  compact = false,
}: VerticalIntentTabsProps) {
  return (
    <div className={verticalSectionCompactClass}>
      <p className="text-sm font-extrabold tracking-tight text-slate-900">
        Hoe wil je verder?
      </p>
      {!compact ? (
        <p className="mt-0.5 text-xs text-slate-500">
          Zelfverzekerd? Start direct. Twijfel? Ik praat je erdoorheen.
        </p>
      ) : null}

      <div
        className="mt-3 grid gap-2"
        role="tablist"
        aria-label="Kies je route"
      >
        <button
          type="button"
          role="tab"
          aria-selected={intent === "pay"}
          disabled={!payEligible}
          onClick={() => onIntentChange("pay")}
          className={
            intent === "pay"
              ? "flex items-center gap-3 rounded-xl border-2 border-[#FF5722] bg-[#FF5722] px-3.5 py-3 text-left text-white shadow-[0_12px_28px_-14px_rgba(255,87,34,0.55)]"
              : payEligible
                ? "flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left transition hover:border-[#FF5722]/40"
                : "flex cursor-not-allowed items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3.5 py-3 text-left opacity-50"
          }
        >
          <Rocket className="size-5 shrink-0" aria-hidden />
          <span>
            <span className="block text-sm font-extrabold">Direct starten</span>
            <span
              className={
                intent === "pay"
                  ? "block text-[11px] text-orange-100"
                  : "block text-[11px] text-slate-500"
              }
            >
              iDEAL + incasso · kick-off meteen
            </span>
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={intent === "talk"}
          onClick={() => onIntentChange("talk")}
          className={
            intent === "talk"
              ? "flex items-center gap-3 rounded-xl border-2 border-slate-900 bg-slate-900 px-3.5 py-3 text-left text-white"
              : "flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left transition hover:border-slate-400"
          }
        >
          <MessageCircle className="size-5 shrink-0" aria-hidden />
          <span>
            <span className="block text-sm font-extrabold">Eerst praten</span>
            <span
              className={
                intent === "talk"
                  ? "block text-[11px] text-slate-300"
                  : "block text-[11px] text-slate-500"
              }
            >
              Vragen of Signature? Ik bel of mail.
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

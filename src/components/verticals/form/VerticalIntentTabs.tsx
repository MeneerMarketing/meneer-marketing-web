"use client";

import { MessageCircle, Rocket } from "lucide-react";

import { verticalSectionClass } from "@/components/verticals/form/vertical-form-styles";

export type VerticalFormIntent = "pay" | "talk";

interface VerticalIntentTabsProps {
  intent: VerticalFormIntent;
  payEligible: boolean;
  onIntentChange: (intent: VerticalFormIntent) => void;
}

export function VerticalIntentTabs({
  intent,
  payEligible,
  onIntentChange,
}: VerticalIntentTabsProps) {
  return (
    <div className={verticalSectionClass}>
      <p className="text-base font-extrabold tracking-tight text-slate-900">
        Hoe wil je verder?
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Zelfverzekerd? Start direct. Twijfel? Ik praat je erdoorheen.
      </p>

      <div
        className="mt-5 grid gap-3 sm:grid-cols-2"
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
              ? "group flex items-start gap-3 rounded-2xl border-2 border-[#FF5722] bg-[#FF5722] px-4 py-4 text-left text-white shadow-[0_16px_36px_-14px_rgba(255,87,34,0.55)]"
              : payEligible
                ? "flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-[#FF5722]/40 hover:shadow-md"
                : "flex cursor-not-allowed items-start gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-left opacity-55"
          }
        >
          <span
            className={
              intent === "pay"
                ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15"
                : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF5722]"
            }
          >
            <Rocket className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-extrabold">Direct starten</span>
            <span
              className={
                intent === "pay"
                  ? "mt-0.5 block text-xs leading-snug text-orange-100"
                  : "mt-0.5 block text-xs leading-snug text-slate-500"
              }
            >
              iDEAL, daarna incasso. Ik plan meteen je kick-off.
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
              ? "flex items-start gap-3 rounded-2xl border-2 border-slate-900 bg-slate-900 px-4 py-4 text-left text-white shadow-lg"
              : "flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-slate-400 hover:shadow-md"
          }
        >
          <span
            className={
              intent === "talk"
                ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10"
                : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700"
            }
          >
            <MessageCircle className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-extrabold">Eerst praten</span>
            <span
              className={
                intent === "talk"
                  ? "mt-0.5 block text-xs leading-snug text-slate-300"
                  : "mt-0.5 block text-xs leading-snug text-slate-500"
              }
            >
              Vragen, twijfel of Signature? Stuur door, ik bel of mail.
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

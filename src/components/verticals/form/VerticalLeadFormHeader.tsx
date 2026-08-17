"use client";

import { VerticalFormProgress } from "@/components/verticals/form/VerticalFormProgress";

interface VerticalLeadFormHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  promoNote?: string | null;
  packageChosen: boolean;
  contactReady: boolean;
  routeChosen: boolean;
}

export function VerticalLeadFormHeader({
  eyebrow,
  title,
  subtitle,
  promoNote,
  packageChosen,
  contactReady,
  routeChosen,
}: VerticalLeadFormHeaderProps) {
  return (
    <div className="border-b border-orange-100/80 bg-gradient-to-r from-orange-50 via-white to-sky-50/30 px-4 py-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
            {eyebrow}
          </p>
          <p className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
        </div>
        {promoNote ? (
          <span className="shrink-0 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/10 px-2.5 py-1 text-[10px] font-bold text-[#C2410C]">
            {promoNote}
          </span>
        ) : null}
      </div>
      <VerticalFormProgress
        packageChosen={packageChosen}
        contactReady={contactReady}
        routeChosen={routeChosen}
      />
    </div>
  );
}

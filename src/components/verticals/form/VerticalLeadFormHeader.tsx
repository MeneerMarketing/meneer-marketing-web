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
    <div className="border-b border-orange-100/80 bg-gradient-to-br from-orange-50 via-white to-sky-50/40 px-6 py-5 sm:px-8 sm:py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
            {eyebrow}
          </p>
          <p className="mt-1.5 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600">
            {subtitle}
          </p>
        </div>
        {promoNote ? (
          <span className="shrink-0 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/10 px-3 py-1 text-[11px] font-bold text-[#C2410C]">
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

"use client";

import { useState } from "react";
import type { StudioService } from "@/types/studio";

interface Props {
  services: StudioService[];
  accentClass?: string;
}

/** Figma-style stacked rows: one open at a time, huge type, clinical rhythm. */
export function FigmaServices({ services }: Props) {
  const [openId, setOpenId] = useState(services[0]?.id ?? "");

  return (
    <ul className="border-t border-black/10">
      {services.map((service) => {
        const open = openId === service.id;
        return (
          <li key={service.id} className="border-b border-black/10">
            <button
              type="button"
              onClick={() => setOpenId(open ? "" : service.id)}
              className="flex w-full items-center gap-4 py-6 text-left transition-colors hover:bg-black/[0.02] sm:gap-8 sm:py-8"
              aria-expanded={open}
            >
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--fc-accent)]"
                aria-hidden
              />
              <span className="min-w-0 flex-1 font-[family-name:var(--font-figma-display)] text-[clamp(1.5rem,4vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.06em]">
                {service.name}
              </span>
              <span className="hidden shrink-0 text-[12px] tracking-[0.14em] uppercase text-black/40 sm:inline">
                {service.duration_minutes ? `${service.duration_minutes} min` : ""}
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 text-lg transition-transform duration-300 ${
                  open ? "rotate-45 bg-black text-white" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-4 pb-8 pl-6 sm:flex-row sm:items-end sm:justify-between sm:pl-8">
                  <p className="max-w-xl text-[15px] leading-7 text-black/60">
                    {service.description}
                  </p>
                  {service.highlight && (
                    <span className="inline-flex w-fit rounded-full bg-[var(--fc-accent-soft)] px-4 py-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--fc-ink)]">
                      Primair
                    </span>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { CasePalette, CaseService, CaseServiceId } from "@/data/home-cases";

function ServiceMiniIcon({
  id,
  accent,
}: {
  id: CaseServiceId;
  accent: string;
}) {
  const common = "size-full";
  switch (id) {
    case "portal":
      return (
        <svg viewBox="0 0 48 48" className={common} aria-hidden>
          <rect x="6" y="10" width="36" height="28" rx="4" fill={`${accent}22`} stroke={accent} strokeWidth="1.5" />
          <rect x="12" y="18" width="24" height="4" rx="1" fill={accent} opacity="0.35" />
          <rect x="12" y="26" width="16" height="4" rx="1" fill={accent} opacity="0.25" />
          <rect x="30" y="26" width="6" height="6" rx="1.5" fill={accent} />
        </svg>
      );
    case "seo":
      return (
        <svg viewBox="0 0 48 48" className={common} aria-hidden>
          <circle cx="20" cy="20" r="10" stroke={accent} strokeWidth="2" fill="none" />
          <path d="M27 27l10 10" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 22l4 4 8-8" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 48 48" className={common} aria-hidden>
          <rect x="8" y="14" width="32" height="22" rx="3" fill={`${accent}18`} stroke={accent} strokeWidth="1.5" />
          <path d="M8 16l16 12 16-12" stroke={accent} strokeWidth="1.5" fill="none" />
          <circle cx="36" cy="12" r="5" fill={accent} />
        </svg>
      );
    case "google-ads":
      return (
        <svg viewBox="0 0 48 48" className={common} aria-hidden>
          <rect x="8" y="8" width="32" height="32" rx="8" fill={`${accent}15`} />
          <text x="24" y="30" textAnchor="middle" fill={accent} fontSize="16" fontWeight="800" fontFamily="system-ui">
            G
          </text>
        </svg>
      );
    case "meta-ads":
      return (
        <svg viewBox="0 0 48 48" className={common} aria-hidden>
          <rect x="8" y="8" width="32" height="32" rx="8" fill={`${accent}15`} />
          <path d="M14 30c4-10 8-10 10 0 2-10 6-10 10 0" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "ugc":
      return (
        <svg viewBox="0 0 48 48" className={common} aria-hidden>
          <rect x="14" y="8" width="20" height="32" rx="4" fill={`${accent}20`} stroke={accent} strokeWidth="1.5" />
          <circle cx="24" cy="18" r="5" stroke={accent} strokeWidth="1.5" fill="none" />
          <rect x="18" y="28" width="12" height="3" rx="1" fill={accent} opacity="0.5" />
        </svg>
      );
    case "shopify":
      return (
        <svg viewBox="0 0 48 48" className={common} aria-hidden>
          <path d="M26 8l12 4v28l-12 4-12-4V12l12-4z" fill={`${accent}20`} stroke={accent} strokeWidth="1.5" />
          <path d="M22 20c0-3 2-5 4-5s4 2 4 5-2 5-4 5-4-2-4-5z" fill={accent} />
        </svg>
      );
    case "website":
      return (
        <svg viewBox="0 0 48 48" className={common} aria-hidden>
          <rect x="6" y="10" width="36" height="28" rx="4" fill={`${accent}15`} stroke={accent} strokeWidth="1.5" />
          <rect x="6" y="10" width="36" height="7" rx="4" fill={accent} opacity="0.25" />
          <rect x="12" y="24" width="20" height="3" rx="1" fill={accent} opacity="0.4" />
          <rect x="12" y="30" width="14" height="3" rx="1" fill={accent} opacity="0.25" />
        </svg>
      );
    case "app":
      return (
        <svg viewBox="0 0 48 48" className={common} aria-hidden>
          <rect x="12" y="6" width="24" height="36" rx="5" fill={`${accent}18`} stroke={accent} strokeWidth="1.5" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x="16" y={16 + i * 8} width="16" height="5" rx="1.5" fill={accent} opacity={0.3 + i * 0.15} />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

interface CaseServiceGridProps {
  services: readonly CaseService[];
  palette: CasePalette;
}

/** Interactief raster: hover op een dienst toont korte uitleg. */
export function CaseServiceGrid({ services, palette }: CaseServiceGridProps) {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(services[0]?.id ?? "portal");
  const active = services.find((s) => s.id === activeId) ?? services[0];

  return (
    <div className="border-t border-slate-200/80 bg-white/60 p-4 sm:p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        Wat ik bouwde &amp; draaide
      </p>
      <div
        className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"
        role="tablist"
        aria-label="Diensten in deze case"
      >
        {services.map((service) => {
          const isActive = service.id === activeId;
          return (
            <button
              key={service.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onMouseEnter={() => setActiveId(service.id)}
              onFocus={() => setActiveId(service.id)}
              onClick={() => setActiveId(service.id)}
              className={`group flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 ${
                isActive
                  ? "border-slate-300 bg-white shadow-md"
                  : "border-slate-200/80 bg-white/80 hover:border-slate-300 hover:shadow-sm"
              }`}
              style={
                isActive
                  ? { boxShadow: `0 8px 24px -12px ${palette.accent}55` }
                  : undefined
              }
            >
              <span className="size-10 shrink-0">
                <ServiceMiniIcon id={service.id} accent={palette.accent} />
              </span>
              <span className="text-[11px] font-extrabold leading-tight text-slate-800">
                {service.label}
              </span>
            </button>
          );
        })}
      </div>

      {active ? (
        <motion.p
          key={active.id}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl px-3 py-2 text-sm font-bold leading-snug text-slate-700"
          style={{ backgroundColor: `${palette.accent}12` }}
        >
          <span style={{ color: palette.accent }}>{active.label}:</span>{" "}
          {active.blurb}
        </motion.p>
      ) : null}
    </div>
  );
}

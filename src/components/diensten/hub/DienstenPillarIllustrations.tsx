"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PillarSlug } from "@/lib/navigation";

interface DienstenPillarIllustrationProps {
  slug: PillarSlug;
  accent: string;
  className?: string;
}

export function DienstenPillarIllustration({
  slug,
  accent,
  className = "",
}: DienstenPillarIllustrationProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`relative size-full ${className}`}
      whileHover={reduce ? undefined : { scale: 1.04, rotate: -1 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      {slug === "strategie" && <StrategieScene accent={accent} />}
      {slug === "bouwen" && <BouwenScene accent={accent} />}
      {slug === "vindbaarheid" && <VindbaarheidScene accent={accent} />}
      {slug === "campagnes" && <CampagnesScene accent={accent} />}
      {slug === "behoud" && <BehoudScene accent={accent} />}
    </motion.div>
  );
}

function StrategieScene({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 72 72" className="size-full" aria-hidden>
      <rect x="8" y="48" width="56" height="8" rx="4" fill={accent} opacity="0.12" />
      <path
        d="M14 50 C22 38, 30 42, 38 30 S54 22, 58 16"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 4"
      />
      <circle cx="58" cy="16" r="5" fill={accent} />
      <circle cx="58" cy="16" r="8" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.35" />
      <rect x="12" y="18" width="22" height="16" rx="4" fill="white" stroke={accent} strokeWidth="1.5" opacity="0.9" />
      <path d="M16 24h14M16 28h10" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <text x="17" y="31" fontSize="7" fontWeight="800" fill={accent}>
        plan
      </text>
    </svg>
  );
}

function BouwenScene({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 72 72" className="size-full" aria-hidden>
      <rect x="10" y="14" width="52" height="40" rx="6" fill="#0F172A" opacity="0.92" />
      <rect x="10" y="14" width="52" height="9" rx="6" fill={accent} opacity="0.35" />
      <circle cx="16" cy="18.5" r="1.5" fill="#F87171" />
      <circle cx="21" cy="18.5" r="1.5" fill="#FBBF24" />
      <circle cx="26" cy="18.5" r="1.5" fill="#34D399" />
      <text x="36" y="30" fontSize="11" fontWeight="800" fill={accent} fontFamily="monospace">
        {"</>"}
      </text>
      <rect x="18" y="36" width="36" height="4" rx="2" fill="white" opacity="0.2" />
      <rect x="18" y="43" width="24" height="3" rx="1.5" fill="white" opacity="0.12" />
      <rect x="14" y="50" width="18" height="10" rx="3" fill={accent} opacity="0.55" />
      <rect x="26" y="46" width="18" height="14" rx="3" fill={accent} opacity="0.75" />
      <rect x="38" y="52" width="18" height="8" rx="3" fill={accent} opacity="0.4" />
    </svg>
  );
}

function VindbaarheidScene({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 72 72" className="size-full" aria-hidden>
      <rect x="10" y="16" width="52" height="40" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="24" cy="30" r="7" fill="none" stroke={accent} strokeWidth="2" />
      <path d="M29 35l5 5" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <rect x="36" y="24" width="20" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="36" y="30" width="14" height="2" rx="1" fill="#E2E8F0" />
      <rect x="14" y="44" width="44" height="6" rx="3" fill={accent} opacity="0.15" />
      <text x="18" y="49" fontSize="6" fontWeight="800" fill={accent}>
        #1 jij
      </text>
      <circle cx="54" cy="20" r="8" fill="#4285F4" opacity="0.15" />
      <text x="50.5" y="23" fontSize="9" fontWeight="900" fill="#4285F4">
        G
      </text>
    </svg>
  );
}

function CampagnesScene({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 72 72" className="size-full" aria-hidden>
      <path d="M14 28h20l10-8v32l-10-8H14z" fill={accent} opacity="0.85" />
      <path d="M44 24c4 3 4 17 0 20" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <rect x="16" y="48" width="40" height="14" rx="4" fill="#0F172A" opacity="0.08" />
      <path d="M20 56 L26 50 L32 54 L40 46 L48 56" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="46" r="2" fill="#22C55E" />
      <text x="20" y="44" fontSize="6" fontWeight="800" fill={accent}>
        ROAS ↑
      </text>
    </svg>
  );
}

function BehoudScene({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 72 72" className="size-full" aria-hidden>
      <rect x="16" y="18" width="40" height="30" rx="5" fill="white" stroke={accent} strokeWidth="1.5" opacity="0.9" />
      <path d="M16 24h40" stroke={accent} strokeWidth="1" opacity="0.25" />
      <rect x="22" y="30" width="28" height="3" rx="1.5" fill={accent} opacity="0.35" />
      <rect x="22" y="36" width="20" height="2" rx="1" fill="#CBD5E1" />
      <path
        d="M36 52c-8-4-14-10-14-16 0-4 3-7 7-7 3 0 5 2 7 4 2-2 4-4 7-4 4 0 7 3 7 7 0 6-6 12-14 16z"
        fill={accent}
        opacity="0.75"
      />
      <circle cx="50" cy="22" r="9" fill={accent} opacity="0.12" />
      <text x="46" y="25" fontSize="8" fontWeight="800" fill={accent}>
        @
      </text>
    </svg>
  );
}

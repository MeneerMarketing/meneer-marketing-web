"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CaseSceneId } from "@/data/home-cases";

interface CaseSceneIllustrationProps {
  scene: CaseSceneId;
  accent: string;
  className?: string;
}

export function CaseSceneIllustration({
  scene,
  accent,
  className,
}: CaseSceneIllustrationProps) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {scene === "skincomplete" && (
        <SkinCompleteScene accent={accent} reduce={!!reduce} />
      )}
      {scene === "bestrest" && (
        <BestRestScene accent={accent} reduce={!!reduce} />
      )}
      {scene === "hills-pilates" && (
        <HillsPilatesScene accent={accent} reduce={!!reduce} />
      )}
    </svg>
  );
}

function SkinCompleteScene({
  accent,
  reduce,
}: {
  accent: string;
  reduce: boolean;
}) {
  return (
    <>
      <rect x="20" y="24" width="360" height="212" rx="12" fill="#0F172A" />
      <rect x="20" y="24" width="360" height="28" rx="12" fill="#1E293B" />
      <circle cx="36" cy="38" r="4" fill="#EF4444" opacity="0.8" />
      <circle cx="48" cy="38" r="4" fill="#FBBF24" opacity="0.8" />
      <circle cx="60" cy="38" r="4" fill="#22C55E" opacity="0.8" />
      <text x="200" y="42" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">
        B2B-portaal · SEO · Ads
      </text>

      <rect x="36" y="64" width="150" height="156" rx="8" fill="#1E293B" />
      <text x="48" y="84" fill="#94A3B8" fontSize="9" fontWeight="700">
        SALON PORTAAL
      </text>
      <rect x="48" y="94" width="126" height="10" rx="4" fill="#334155" />
      <rect x="48" y="112" width="126" height="10" rx="4" fill="#334155" />
      <rect x="48" y="136" width="126" height="22" rx="6" fill={accent} />
      <text x="111" y="151" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">
        Bestellen
      </text>
      {["SEO", "E-mail", "UGC"].map((label, i) => (
        <g key={label}>
          <rect x={48 + i * 42} y={172} width="36" height="36" rx="6" fill="#334155" />
          <text x={66 + i * 42} y="194" textAnchor="middle" fill={accent} fontSize="7" fontWeight="700">
            {label}
          </text>
        </g>
      ))}

      <rect x="200" y="64" width="164" height="156" rx="8" fill="white" opacity="0.95" />
      <text x="216" y="84" fill="#0F172A" fontSize="9" fontWeight="800">
        KANALEN
      </text>
      {[
        { label: "Google Ads", y: 96 },
        { label: "Meta Ads", y: 128 },
        { label: "Influencers", y: 160 },
      ].map((row, i) => (
        <motion.g
          key={row.label}
          initial={reduce ? false : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.12 }}
        >
          <rect x="216" y={row.y} width="132" height="24" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
          <circle cx="228" cy={row.y + 12} r="4" fill={accent} />
          <text x="240" y={row.y + 16} fill="#334155" fontSize="9" fontWeight="700">
            {row.label}
          </text>
        </motion.g>
      ))}

      <motion.path
        d="M 186 140 L 200 140"
        stroke={accent}
        strokeWidth="2"
        strokeDasharray="4 3"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </>
  );
}

function BestRestScene({
  accent,
  reduce,
}: {
  accent: string;
  reduce: boolean;
}) {
  return (
    <>
      <rect x="20" y="30" width="360" height="200" rx="12" fill="#F5F0EA" stroke="#D6C9BC" strokeWidth="1.5" />
      <rect x="36" y="48" width="328" height="24" rx="6" fill="white" stroke="#D6C9BC" />
      <text x="200" y="64" textAnchor="middle" fill={accent} fontSize="10" fontWeight="800">
        bestrest.nl · custom Shopify
      </text>

      <motion.g
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 16 }}
      >
        <rect x="48" y="88" width="140" height="120" rx="8" fill="white" stroke={accent} strokeWidth="2" />
        <text x="118" y="112" textAnchor="middle" fill={accent} fontSize="12" fontWeight="900">
          Topper
        </text>
        <rect x="68" y="124" width="100" height="8" rx="2" fill="#E8DFD4" />
        <rect x="68" y="138" width="72" height="8" rx="2" fill="#E8DFD4" />
        <rect x="78" y="158" width="80" height="20" rx="6" fill={accent} opacity="0.2" />
        <text x="118" y="172" textAnchor="middle" fill={accent} fontSize="8" fontWeight="700">
          In winkelwagen
        </text>
      </motion.g>

      <rect x="204" y="88" width="144" height="120" rx="8" fill="white" stroke="#D6C9BC" />
      {["SEO", "E-mail", "Ads"].map((label, i) => (
        <motion.g
          key={label}
          initial={reduce ? false : { opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 + i * 0.1 }}
        >
          <rect x="216" y={98 + i * 34} width="120" height="26" rx="6" fill="#F5F0EA" />
          <text x="228" y={115 + i * 34} fill={accent} fontSize="9" fontWeight="700">
            {label}
          </text>
          <rect x="300" y={106 + i * 34} width="28" height="10" rx="3" fill={accent} opacity="0.25" />
        </motion.g>
      ))}
    </>
  );
}

function HillsPilatesScene({
  accent,
  reduce,
}: {
  accent: string;
  reduce: boolean;
}) {
  return (
    <>
      <rect x="20" y="30" width="200" height="200" rx="12" fill="#FAFAFE" stroke="#E4E0F7" strokeWidth="1.5" />
      <text x="36" y="54" fill={accent} fontSize="10" fontWeight="800">
        Website
      </text>
      <rect x="36" y="64" width="168" height="10" rx="3" fill="#E4E0F7" />
      <rect x="36" y="82" width="120" height="8" rx="2" fill="#EDE9FE" />
      <rect x="36" y="100" width="80" height="24" rx="6" fill={accent} opacity="0.2" />
      <text x="76" y="116" textAnchor="middle" fill={accent} fontSize="8" fontWeight="700">
        Boek les
      </text>

      <motion.g
        initial={reduce ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
      >
        <rect x="236" y="30" width="144" height="200" rx="16" fill="#1E1B2E" stroke={accent} strokeWidth="2" />
        <rect x="252" y="48" width="112" height="8" rx="4" fill="#2D2A40" />
        <text x="308" y="72" textAnchor="middle" fill="white" fontSize="9" fontWeight="800">
          Hills Pilates App
        </text>

        {["Ma", "Di", "Wo", "Do"].map((day, i) => (
          <rect
            key={day}
            x={252 + i * 28}
            y="84"
            width="22"
            height="18"
            rx="4"
            fill={i === 1 ? accent : "#2D2A40"}
          />
        ))}

        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="252" y={112 + i * 36} width="112" height="28" rx="6" fill="#2D2A40" />
            <circle cx="264" cy={126 + i * 36} r="4" fill={accent} />
            <rect x="274" y={120 + i * 36} width="64" height="6" rx="2" fill="#4C4868" />
          </g>
        ))}

        <rect x="252" y="196" width="112" height="22" rx="6" fill={accent} />
        <text x="308" y="210" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">
          Agenda
        </text>
      </motion.g>

      <motion.path
        d="M 220 120 L 236 120"
        stroke={accent}
        strokeWidth="2"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }}
      />
      <text x="200" y="200" fill="#94A3B8" fontSize="8" fontWeight="700">
        E-mail flows
      </text>
      <motion.circle
        cx="60"
        cy="200"
        r="5"
        fill={accent}
        animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </>
  );
}

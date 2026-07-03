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
      {scene === "b2b-portal" && (
        <B2bPortalScene accent={accent} reduce={!!reduce} />
      )}
      {scene === "seo-first" && (
        <SeoFirstScene accent={accent} reduce={!!reduce} />
      )}
      {scene === "bestrest" && (
        <BestRestScene accent={accent} reduce={!!reduce} />
      )}
    </svg>
  );
}

function B2bPortalScene({
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
        skincomplete.shop/b2b
      </text>

      <rect x="40" y="68" width="120" height="148" rx="8" fill="#1E293B" />
      <text x="52" y="88" fill="#94A3B8" fontSize="9" fontWeight="700">
        SALON LOGIN
      </text>
      <rect x="52" y="98" width="96" height="10" rx="4" fill="#334155" />
      <rect x="52" y="116" width="96" height="10" rx="4" fill="#334155" />
      <rect x="52" y="140" width="96" height="22" rx="6" fill={accent} />
      <text x="100" y="155" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">
        Inloggen
      </text>

      <rect x="180" y="68" width="180" height="148" rx="8" fill="white" opacity="0.95" />
      <text x="196" y="90" fill="#0F172A" fontSize="10" fontWeight="800">
        Jouw salonprijzen
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="196" y={100 + i * 36} width="148" height="28" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
          <rect x="204" y={108 + i * 36} width="60" height="6" rx="2" fill="#CBD5E1" />
          <rect x="300" y={110 + i * 36} width="36" height="12" rx="4" fill={accent} opacity="0.2" />
        </g>
      ))}

      {["S1", "S2", "S3"].map((s, i) => (
        <motion.g
          key={s}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.15 }}
        >
          <motion.circle
            cx={196 + i * 50}
            cy={218}
            r="14"
            fill={accent}
            opacity="0.15"
            animate={reduce ? undefined : { scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
          <text
            x={196 + i * 50}
            y={222}
            textAnchor="middle"
            fill={accent}
            fontSize="8"
            fontWeight="700"
          >
            {s}
          </text>
        </motion.g>
      ))}

      <motion.path
        d="M 100 200 Q 200 180 300 200"
        stroke={accent}
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      />
    </>
  );
}

function SeoFirstScene({
  accent,
  reduce,
}: {
  accent: string;
  reduce: boolean;
}) {
  const bars = [
    { label: "SEO", h: 120, x: 60, active: true },
    { label: "E-mail", h: 90, x: 150, active: true },
    { label: "Ads", h: 40, x: 240, active: false },
  ];

  return (
    <>
      <rect x="20" y="30" width="360" height="200" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <text x="40" y="56" fill="#64748B" fontSize="10" fontWeight="700">
        VOLGORDE DIE WERKT
      </text>

      {bars.map((bar, i) => (
        <g key={bar.label}>
          <motion.rect
            x={bar.x}
            y={200 - bar.h}
            width="56"
            height={bar.h}
            rx="6"
            fill={bar.active ? accent : "#E2E8F0"}
            initial={reduce ? false : { height: 0, y: 200 }}
            animate={{ height: bar.h, y: 200 - bar.h }}
            transition={{ delay: 0.2 + i * 0.2, type: "spring", stiffness: 100, damping: 14 }}
          />
          <text
            x={bar.x + 28}
            y={220}
            textAnchor="middle"
            fill={bar.active ? accent : "#94A3B8"}
            fontSize="11"
            fontWeight="800"
          >
            {bar.label}
          </text>
          {!bar.active ? (
            <motion.g
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <rect x={bar.x + 8} y={168} width="40" height="16" rx="4" fill="#FEF3C7" stroke="#FBBF24" />
              <text x={bar.x + 28} y="179" textAnchor="middle" fill="#B45309" fontSize="7" fontWeight="700">
                later
              </text>
            </motion.g>
          ) : null}
        </g>
      ))}

      <motion.path
        d="M 88 80 Q 200 50 312 70"
        stroke={accent}
        strokeWidth="2.5"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <motion.circle
        cx="88"
        cy="80"
        r="6"
        fill={accent}
        animate={reduce ? undefined : { cx: [88, 200, 312], cy: [80, 50, 70] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <rect x="280" y="44" width="80" height="36" rx="8" fill="white" stroke="#E2E8F0" />
      <text x="292" y="58" fill="#22C55E" fontSize="8" fontWeight="700">
        ● Organisch
      </text>
      <text x="292" y="72" fill="#64748B" fontSize="8" fontWeight="700">
        omzet eerst
      </text>
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

      {[0, 1, 2, 3, 4].map((i) => (
        <motion.rect
          key={i}
          x={40 + i * 68}
          y={160}
          width="48"
          height={40 + (i % 2) * 20}
          rx="4"
          fill="#E8DFD4"
          stroke="#D6C9BC"
          initial={reduce ? false : { opacity: 0.3 }}
          animate={{ opacity: i === 2 ? 1 : 0.35 }}
          transition={{ delay: 0.1 * i }}
        />
      ))}

      <motion.g
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 180, damping: 16 }}
      >
        <rect x="130" y="70" width="140" height="80" rx="10" fill="white" stroke={accent} strokeWidth="2.5" />
        <text x="200" y="100" textAnchor="middle" fill={accent} fontSize="14" fontWeight="900">
          BestRest
        </text>
        <text x="200" y="118" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="700">
          toppers · matrassen
        </text>
        <rect x="155" y="128" width="90" height="14" rx="4" fill={accent} opacity="0.15" />
        <text x="200" y="138" textAnchor="middle" fill={accent} fontSize="8" fontWeight="700">
          eigen koers
        </text>
      </motion.g>

      <motion.path
        d="M 200 50 L 200 68"
        stroke={accent}
        strokeWidth="2"
        markerEnd="url(#arrow)"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.7 }}
      />
      <polygon points="200,44 196,52 204,52" fill={accent} />

      {["Ruis", "Budget", "Me-too"].map((label, i) => (
        <text
          key={label}
          x={60 + i * 120}
          y={58}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="8"
          fontWeight="700"
          opacity="0.6"
        >
          {label}
        </text>
      ))}
    </>
  );
}

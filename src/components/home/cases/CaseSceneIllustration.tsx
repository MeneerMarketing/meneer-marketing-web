"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CaseSceneId } from "@/data/home-cases";

interface CaseSceneIllustrationProps {
  scene: CaseSceneId;
  accent: string;
  deep?: string;
  className?: string;
}

export function CaseSceneIllustration({
  scene,
  accent,
  deep = "#0F172A",
  className,
}: CaseSceneIllustrationProps) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 400 280"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {scene === "skincomplete" && (
        <SkinCompleteScene accent={accent} deep={deep} reduce={!!reduce} />
      )}
      {scene === "bestrest" && (
        <BestRestScene accent={accent} deep={deep} reduce={!!reduce} />
      )}
      {scene === "hills-pilates" && (
        <HillsPilatesScene accent={accent} deep={deep} reduce={!!reduce} />
      )}
    </svg>
  );
}

function SkinCompleteScene({
  accent,
  deep,
  reduce,
}: {
  accent: string;
  deep: string;
  reduce: boolean;
}) {
  return (
    <>
      <rect x="16" y="16" width="368" height="248" rx="14" fill={deep} />
      <rect x="16" y="16" width="368" height="32" rx="14" fill={accent} opacity="0.85" />
      <circle cx="32" cy="32" r="4" fill="#FEFCFC" opacity="0.5" />
      <circle cx="44" cy="32" r="4" fill="#FEFCFC" opacity="0.35" />
      <circle cx="56" cy="32" r="4" fill="#FEFCFC" opacity="0.35" />
      <text x="200" y="36" textAnchor="middle" fill="#FEFCFC" fontSize="10" fontWeight="700" fontFamily="system-ui">
        skincomplete.eu · B2B-portaal
      </text>

      <rect x="32" y="60" width="160" height="188" rx="10" fill={`${accent}33`} stroke={accent} strokeWidth="1" />
      <text x="48" y="82" fill="#F5F0EA" fontSize="9" fontWeight="800" fontFamily="system-ui">
        SALON PORTAAL
      </text>
      <rect x="48" y="92" width="128" height="10" rx="3" fill="#F5F0EA" opacity="0.2" />
      <rect x="48" y="108" width="128" height="10" rx="3" fill="#F5F0EA" opacity="0.15" />
      <rect x="48" y="132" width="128" height="28" rx="8" fill={accent} />
      <text x="112" y="150" textAnchor="middle" fill="#FEFCFC" fontSize="10" fontWeight="800" fontFamily="system-ui">
        Bestellen
      </text>

      <rect x="208" y="60" width="160" height="88" rx="10" fill="#F5F0EA" opacity="0.95" />
      <text x="224" y="82" fill={deep} fontSize="9" fontWeight="800" fontFamily="system-ui">
        SEO · stijgende lijn
      </text>
      <motion.polyline
        points="224,130 248,118 272,122 296,98 320,88 352,72"
        stroke={accent}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      <rect x="208" y="156" width="76" height="92" rx="10" fill="#F5F0EA" opacity="0.95" />
      <text x="220" y="176" fill={deep} fontSize="8" fontWeight="800" fontFamily="system-ui">
        E-mail
      </text>
      <rect x="220" y="184" width="52" height="8" rx="2" fill={accent} opacity="0.3" />
      <rect x="220" y="198" width="40" height="8" rx="2" fill={accent} opacity="0.2" />
      <motion.circle
        cx="252"
        cy="228"
        r="6"
        fill={accent}
        animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <rect x="292" y="156" width="76" height="92" rx="10" fill="#F5F0EA" opacity="0.95" />
      <text x="304" y="176" fill={deep} fontSize="8" fontWeight="800" fontFamily="system-ui">
        UGC
      </text>
      <rect x="304" y="186" width="52" height="36" rx="6" fill={deep} opacity="0.15" />
      <circle cx="330" cy="204" r="8" stroke={accent} strokeWidth="1.5" fill="none" />

      {["G", "M"].map((label, i) => (
        <motion.g
          key={label}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.1 }}
        >
          <rect x={32 + i * 84} y="228" width="72" height="28" rx="8" fill={accent} opacity={0.85} />
          <text x={68 + i * 84} y="246" textAnchor="middle" fill="#FEFCFC" fontSize="9" fontWeight="800" fontFamily="system-ui">
            {label === "G" ? "Google Ads" : "Meta Ads"}
          </text>
        </motion.g>
      ))}
    </>
  );
}

function BestRestScene({
  accent,
  deep,
  reduce,
}: {
  accent: string;
  deep: string;
  reduce: boolean;
}) {
  return (
    <>
      <rect x="16" y="20" width="368" height="240" rx="14" fill="#FFF7ED" stroke={accent} strokeWidth="1.5" opacity="0.5" />
      <rect x="32" y="36" width="336" height="28" rx="8" fill="white" stroke={accent} strokeWidth="1" />
      <text x="200" y="54" textAnchor="middle" fill={accent} fontSize="11" fontWeight="800" fontFamily="system-ui">
        bestrest.nl · custom Shopify
      </text>

      <motion.g
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 180, damping: 16 }}
      >
        <rect x="40" y="80" width="150" height="160" rx="10" fill="white" stroke={accent} strokeWidth="2" />
        <text x="115" y="108" textAnchor="middle" fill={deep} fontSize="13" fontWeight="900" fontFamily="system-ui">
          Topper
        </text>
        <rect x="60" y="120" width="110" height="8" rx="2" fill="#FFEDD5" />
        <rect x="60" y="136" width="80" height="8" rx="2" fill="#FFEDD5" />
        <rect x="70" y="158" width="90" height="24" rx="8" fill={accent} />
        <text x="115" y="174" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">
          In winkelwagen
        </text>
      </motion.g>

      <rect x="204" y="80" width="164" height="76" rx="10" fill="white" stroke="#FFEDD5" />
      <text x="220" y="100" fill={deep} fontSize="9" fontWeight="800" fontFamily="system-ui">
        SEO per productlijn
      </text>
      <motion.polyline
        points="220,140 250,128 280,132 310,108 350,96"
        stroke={accent}
        strokeWidth="2"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3 }}
      />

      <rect x="204" y="164" width="164" height="76" rx="10" fill="white" stroke="#FFEDD5" />
      {["E-mail auto", "Google Ads", "Meta Ads"].map((label, i) => (
        <motion.g
          key={label}
          initial={reduce ? false : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 + i * 0.08 }}
        >
          <rect x="216" y={176 + i * 18} width="140" height="14" rx="4" fill="#FFF7ED" />
          <text x="224" y={186 + i * 18} fill={accent} fontSize="8" fontWeight="700" fontFamily="system-ui">
            {label}
          </text>
        </motion.g>
      ))}
    </>
  );
}

function HillsPilatesScene({
  accent,
  deep,
  reduce,
}: {
  accent: string;
  deep: string;
  reduce: boolean;
}) {
  return (
    <>
      <rect x="16" y="20" width="188" height="240" rx="14" fill="#F5F0EA" stroke={accent} strokeWidth="1.5" />
      <text x="32" y="48" fill={deep} fontSize="10" fontWeight="800" fontFamily="system-ui">
        Website
      </text>
      <rect x="32" y="58" width="156" height="10" rx="3" fill={accent} opacity="0.25" />
      <rect x="32" y="76" width="100" height="8" rx="2" fill={accent} opacity="0.15" />
      <rect x="32" y="96" width="88" height="26" rx="8" fill={accent} />
      <text x="76" y="113" textAnchor="middle" fill="#FEFCFC" fontSize="9" fontWeight="700" fontFamily="system-ui">
        Boek les
      </text>
      <text x="32" y="200" fill={accent} fontSize="9" fontWeight="700" fontFamily="system-ui">
        E-mail automatisering
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={32 + i * 52} y={210} width="44" height="32" rx="6" fill="white" stroke={accent} strokeWidth="1" opacity={0.9} />
      ))}

      <motion.g
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 200, damping: 18 }}
      >
        <rect x="220" y="20" width="164" height="240" rx="18" fill={deep} stroke={accent} strokeWidth="2" />
        <text x="302" y="48" textAnchor="middle" fill="#F5F0EA" fontSize="10" fontWeight="800" fontFamily="system-ui">
          Hills Pilates App
        </text>
        {["Ma", "Di", "Wo", "Do"].map((day, i) => (
          <rect
            key={day}
            x={232 + i * 34}
            y="58"
            width="28"
            height="20"
            rx="5"
            fill={i === 1 ? accent : `${accent}44`}
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="232" y={88 + i * 34} width="140" height="26" rx="6" fill={`${accent}33`} />
            <circle cx="244" cy={101 + i * 34} r="4" fill={accent} />
            <rect x="254" y={96 + i * 34} width="80" height="5" rx="2" fill="#F5F0EA" opacity="0.3" />
          </g>
        ))}
        <rect x="232" y="228" width="140" height="24" rx="8" fill={accent} />
        <text x="302" y="244" textAnchor="middle" fill="#FEFCFC" fontSize="9" fontWeight="700" fontFamily="system-ui">
          Agenda
        </text>
      </motion.g>

      <motion.path
        d="M 204 140 L 220 140"
        stroke={accent}
        strokeWidth="2"
        strokeDasharray="4 3"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.45 }}
      />
    </>
  );
}

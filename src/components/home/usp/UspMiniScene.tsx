import type { UspSceneId } from "@/data/home-usps";
import { GOOGLE_WORDMARK_LETTERS } from "@/components/icons/GoogleWordmark";

interface UspMiniSceneProps {
  scene: UspSceneId;
  className?: string;
}

/** Kleine cartoon-illustratie per USP, geen standaard icon-blokjes */
export function UspMiniScene({ scene, className }: UspMiniSceneProps) {
  return (
    <svg
      viewBox="0 0 120 72"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {scene === "contact" && <ContactScene />}
      {scene === "plan" && <PlanScene />}
      {scene === "build" && <BuildScene />}
      {scene === "ads" && <AdsScene />}
      {scene === "discover" && <DiscoverScene />}
    </svg>
  );
}

function ContactScene() {
  return (
    <>
      <rect x="8" y="12" width="104" height="52" rx="8" fill="#FFF7ED" stroke="#FFCCBC" strokeWidth="1.5" />
      <circle cx="38" cy="36" r="14" fill="#FFCCBC" />
      <circle cx="38" cy="33" r="10" fill="#FFE0B2" />
      <path d="M28 44c2 4 8 6 10 6s8-2 10-6" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="34" cy="32" rx="1.8" ry="2.2" fill="#3E2723" />
      <ellipse cx="42" cy="32" rx="1.8" ry="2.2" fill="#3E2723" />
      <path d="M58 28h42a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H58a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4Z" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      <path d="M58 36h46" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="62" y="42" width="28" height="3" rx="1.5" fill="#FF5722" opacity="0.85" />
      <rect x="62" y="48" width="20" height="3" rx="1.5" fill="#CBD5E1" />
      <path d="M52 22c6-6 14-4 16 2" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
      <circle cx="68" cy="18" r="2" fill="#FF5722" />
    </>
  );
}

function PlanScene() {
  return (
    <>
      {/* Plan: clipboard met checklist */}
      <rect x="8" y="18" width="40" height="44" rx="5" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      <rect x="22" y="13" width="12" height="9" rx="2.5" fill="#94A3B8" />
      <path d="M8 28h40" stroke="#E2E8F0" strokeWidth="1.2" />
      <text x="14" y="26" fill="#64748B" fontSize="5.5" fontWeight="700">
        PLAN
      </text>
      {[34, 42, 50].map((y, i) => (
        <g key={y}>
          <circle cx="16" cy={y} r="3.5" fill={i < 2 ? "#DCFCE7" : "#F1F5F9"} stroke={i < 2 ? "#22C55E" : "#CBD5E1"} strokeWidth="1" />
          {i < 2 ? (
            <path d={`M14.2 ${y}l1.1 1.1 2.6-2.8`} stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          ) : null}
          <rect x="22" y={y - 1.5} width={i === 0 ? 20 : i === 1 ? 16 : 18} height="3" rx="1.5" fill="#E2E8F0" />
        </g>
      ))}

      {/* Pijl: plan → uitvoering */}
      <path d="M52 40h16" stroke="#FF5722" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66 40l-6-5M66 40l-6 5" stroke="#FF5722" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Uitvoering: live dashboard */}
      <rect x="72" y="16" width="40" height="48" rx="6" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
      <circle cx="78" cy="24" r="2.5" fill="#22C55E" />
      <text x="83" y="26" fill="#4ADE80" fontSize="5.5" fontWeight="700">
        LIVE
      </text>
      <path
        d="M78 54 L86 46 L94 50 L102 38 L108 42"
        stroke="#FF5722"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="108" cy="42" r="2.5" fill="#FF5722" />
      <rect x="78" y="56" width="28" height="2" rx="1" fill="#334155" />
    </>
  );
}

function BuildScene() {
  return (
    <>
      <rect x="16" y="14" width="88" height="50" rx="6" fill="#0F172A" />
      <rect x="16" y="14" width="88" height="10" rx="6" fill="#1E293B" />
      <circle cx="22" cy="19" r="1.5" fill="#FF5722" />
      <circle cx="28" cy="19" r="1.5" fill="#FBBF24" />
      <circle cx="34" cy="19" r="1.5" fill="#34D399" />
      <text x="24" y="38" fill="#38BDF8" fontFamily="monospace" fontSize="8">
        {"</>"}
      </text>
      <rect x="42" y="32" width="36" height="3" rx="1.5" fill="#FF5722" opacity="0.8" />
      <rect x="42" y="38" width="48" height="3" rx="1.5" fill="#475569" />
      <rect x="42" y="44" width="40" height="3" rx="1.5" fill="#475569" />
      <rect x="42" y="50" width="28" height="3" rx="1.5" fill="#475569" />
      <path d="M88 54l10 8H78l10-8Z" fill="#FF5722" opacity="0.25" />
      <path d="M93 58h8v4H85" stroke="#FF5722" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  );
}

function AdsScene() {
  return (
    <>
      {/* Google Ads preview */}
      <rect x="6" y="14" width="50" height="46" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="6" y="14" width="50" height="8" rx="6" fill="#F8FAFC" />
      <circle cx="12" cy="18" r="2" fill="#EA4335" />
      <circle cx="17" cy="18" r="2" fill="#FBBC04" />
      <circle cx="22" cy="18" r="2" fill="#34A853" />
      <circle cx="27" cy="18" r="2" fill="#4285F4" />
      <text x="10" y="36" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">
        {GOOGLE_WORDMARK_LETTERS.map((letter, i) => (
          <tspan key={i} fill={letter.color}>
            {letter.char}
          </tspan>
        ))}
      </text>
      <rect x="28" y="28" width="22" height="3" rx="1.5" fill="#1E293B" />
      <rect x="28" y="34" width="18" height="2" rx="1" fill="#94A3B8" />
      <rect x="28" y="39" width="14" height="2" rx="1" fill="#CBD5E1" />
      <rect x="10" y="46" width="16" height="6" rx="3" fill="#4285F4" opacity="0.15" />
      <text x="13" y="51" fill="#64748B" fontSize="4.5" fontWeight="700">
        Ad
      </text>

      {/* Meta Ads preview */}
      <rect x="62" y="14" width="50" height="46" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="62" y="14" width="50" height="8" rx="6" fill="#0081FB" opacity="0.12" />
      <path
        d="M72 32c4-6 8-6 12 0s8 6 12 0"
        stroke="#0081FB"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="70" y="38" width="22" height="3" rx="1.5" fill="#1E293B" />
      <rect x="70" y="44" width="16" height="2" rx="1" fill="#94A3B8" />
      <rect x="66" y="50" width="18" height="6" rx="3" fill="#0081FB" opacity="0.15" />
      <text x="69" y="55" fill="#0081FB" fontSize="4.5" fontWeight="700">
        Ad
      </text>

      {/* Stijgende resultaten */}
      <rect x="38" y="54" width="6" height="8" rx="1.5" fill="#FF5722" opacity="0.35" />
      <rect x="46" y="50" width="6" height="12" rx="1.5" fill="#FF5722" opacity="0.55" />
      <rect x="54" y="44" width="6" height="18" rx="1.5" fill="#FF5722" />
      <path d="M40 58l20-14" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" opacity="0.5" />
    </>
  );
}

function DiscoverScene() {
  return (
    <>
      <circle cx="46" cy="38" r="18" fill="white" stroke="#00BCD4" strokeWidth="2" />
      <circle cx="46" cy="38" r="12" stroke="#B2EBF2" strokeWidth="1.5" />
      <path d="M58 50l10 8" stroke="#00BCD4" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 38h12M46 32v12" stroke="#00BCD4" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="88" cy="24" r="8" fill="#0F172A" opacity="0.08" />
      <text x="84" y="27" fill="#0F172A" fontSize="7" fontWeight="700">
        G
      </text>
      <circle cx="98" cy="44" r="7" fill="#FF5722" opacity="0.15" />
      <text x="95" y="47" fill="#FF5722" fontSize="6" fontWeight="700">
        AI
      </text>
      <path d="M78 30c4 2 8 8 8 14" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M62 28c6 0 12 4 14 10" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
    </>
  );
}

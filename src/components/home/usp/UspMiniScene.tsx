import type { UspSceneId } from "@/data/home-usps";

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
      <rect x="14" y="18" width="52" height="44" rx="6" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      <path d="M14 28h52" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="22" cy="23" r="2" fill="#FF5722" />
      <circle cx="28" cy="23" r="2" fill="#FBBF24" />
      <rect x="20" y="34" width="24" height="3" rx="1.5" fill="#FF5722" opacity="0.7" />
      <rect x="20" y="40" width="32" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="20" y="46" width="28" height="3" rx="1.5" fill="#CBD5E1" />
      <path d="M78 48l14-22 14 22Z" fill="#FF5722" opacity="0.15" stroke="#FF5722" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M85 44h14" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
      <path d="M92 37v14" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
      <circle cx="92" cy="22" r="6" fill="#FF5722" opacity="0.2" />
      <path d="M89 22h6M92 19v6" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" />
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
      <path
        d="M28 52V28l18-8 18 8v24l-18 8-18-8Z"
        fill="#FFF7ED"
        stroke="#FF5722"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M46 20v48" stroke="#FFCCBC" strokeWidth="1.5" />
      <rect x="72" y="38" width="8" height="18" rx="2" fill="#FF5722" opacity="0.35" />
      <rect x="84" y="30" width="8" height="26" rx="2" fill="#FF5722" opacity="0.6" />
      <rect x="96" y="22" width="8" height="34" rx="2" fill="#FF5722" />
      <path d="M70 58h34" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="34" cy="40" r="5" fill="#FF5722" opacity="0.2" />
      <path d="M31 40h6M34 37v6" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" />
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

import type { PillarSlug } from "@/lib/navigation";

interface ArticleCardIllustrationProps {
  slug: string;
  category: PillarSlug;
  className?: string;
}

const CATEGORY_ACCENTS: Record<PillarSlug, string> = {
  strategie: "#FF5722",
  bouwen: "#45382C",
  vindbaarheid: "#0284C7",
  campagnes: "#0081FB",
  behoud: "#00BCD4",
};

export function ArticleCardIllustration({
  slug,
  category,
  className,
}: ArticleCardIllustrationProps) {
  const accent = CATEGORY_ACCENTS[category];

  return (
    <svg
      viewBox="0 0 400 220"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="220" fill="#F8FAFC" />
      <rect
        width="400"
        height="220"
        fill={`url(#kb-grid-${slug})`}
        opacity="0.5"
      />
      <defs>
        <pattern
          id={`kb-grid-${slug}`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="rgba(15,23,42,0.04)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {slug === "ai-zoek-vindbaarheid-chatgpt" && (
        <AiZoekScene accent={accent} />
      )}
      {slug === "seo-eerst-dan-ads" && <SeoFirstScene accent={accent} />}
      {slug === "b2b-verkopen-via-shopify" && <B2bPortalScene accent={accent} />}
      {!["ai-zoek-vindbaarheid-chatgpt", "seo-eerst-dan-ads", "b2b-verkopen-via-shopify"].includes(
        slug,
      ) && <CategoryFallbackScene accent={accent} category={category} />}
    </svg>
  );
}

function AiZoekScene({ accent }: { accent: string }) {
  return (
    <>
      <rect x="28" y="36" width="148" height="52" rx="14" fill="white" stroke="#E2E8F0" strokeWidth="2" />
      <text x="44" y="58" fill="#64748B" fontSize="11" fontWeight="600">
        Waar koop ik…
      </text>
      <rect x="44" y="66" width="72" height="6" rx="3" fill="#E2E8F0" />

      <rect x="224" y="48" width="148" height="72" rx="14" fill="white" stroke={accent} strokeWidth="2" />
      <circle cx="248" cy="72" r="10" fill={accent} opacity="0.15" />
      <text x="264" y="76" fill="#0F172A" fontSize="11" fontWeight="800">
        Jouw merk
      </text>
      <rect x="240" y="86" width="96" height="5" rx="2.5" fill="#CBD5E1" />
      <rect x="240" y="96" width="72" height="5" rx="2.5" fill="#E2E8F0" />

      <circle cx="196" cy="110" r="18" fill={accent} opacity="0.12" />
      <path
        d="M 188 110 h 16 M 196 102 v 16"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {["ChatGPT", "Gemini"].map((label, i) => (
        <g key={label} transform={`translate(${300 + i * 42} 148)`}>
          <rect x="0" y="0" width="38" height="22" rx="11" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
          <text x="19" y="14" fill="#64748B" fontSize="7" fontWeight="700" textAnchor="middle">
            {label}
          </text>
        </g>
      ))}
    </>
  );
}

function SeoFirstScene({ accent }: { accent: string }) {
  return (
    <>
      <rect x="32" y="40" width="336" height="140" rx="16" fill="white" stroke="#E2E8F0" strokeWidth="2" />
      <text x="52" y="64" fill="#64748B" fontSize="10" fontWeight="700">
        VOLGORDE DIE WERKT
      </text>

      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={52 + i * 100}
            y={140 - (i + 1) * 28}
            width="72"
            height={(i + 1) * 28}
            rx="6"
            fill={i === 0 ? "#22C55E" : i === 1 ? accent : "#CBD5E1"}
            opacity={i === 2 ? 0.45 : 1}
          />
          <text
            x={88 + i * 100}
            y="168"
            fill="#475569"
            fontSize="9"
            fontWeight="700"
            textAnchor="middle"
          >
            {i === 0 ? "SEO" : i === 1 ? "Mail" : "Ads"}
          </text>
        </g>
      ))}

      <path
        d="M 72 118 L 120 92 L 168 78"
        stroke="#22C55E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="168" cy="78" r="5" fill="#22C55E" />

      <rect x="248" y="78" width="96" height="34" rx="10" fill={`${accent}18`} stroke={accent} strokeWidth="1.5" />
      <text x="296" y="99" fill={accent} fontSize="10" fontWeight="800" textAnchor="middle">
        Pas daarna ads
      </text>
    </>
  );
}

function B2bPortalScene({ accent }: { accent: string }) {
  return (
    <>
      <rect x="24" y="32" width="160" height="156" rx="12" fill="#FEF2F2" stroke="#FECACA" strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="44" y="58" fill="#B91C1C" fontSize="10" fontWeight="700">
        Excel + mail
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={40} y={68 + i * 22} width={100 - i * 12} height="8" rx="4" fill="#FECACA" />
      ))}

      <path d="M 196 110 h 32" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <path d="M 220 110 l-10 -8 M 220 110 l-10 8" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />

      <rect x="236" y="32" width="140" height="156" rx="12" fill="white" stroke={accent} strokeWidth="2" />
      <rect x="236" y="32" width="140" height="28" rx="12" fill={accent} opacity="0.12" />
      <text x="256" y="52" fill={accent} fontSize="10" fontWeight="800">
        B2B-portaal
      </text>
      <rect x="252" y="78" width="88" height="8" rx="4" fill="#E2E8F0" />
      <rect x="252" y="94" width="64" height="8" rx="4" fill="#E2E8F0" />
      <rect x="252" y="126" width="72" height="28" rx="14" fill={accent} />
      <text x="288" y="144" fill="white" fontSize="10" fontWeight="800" textAnchor="middle">
        Bestellen
      </text>
    </>
  );
}

function CategoryFallbackScene({
  accent,
  category,
}: {
  accent: string;
  category: PillarSlug;
}) {
  return (
    <>
      <rect x="48" y="48" width="304" height="124" rx="16" fill="white" stroke="#E2E8F0" strokeWidth="2" />
      <rect x="68" y="72" width="120" height="10" rx="5" fill={accent} opacity="0.85" />
      <rect x="68" y="92" width="200" height="8" rx="4" fill="#E2E8F0" />
      <rect x="68" y="108" width="168" height="8" rx="4" fill="#E2E8F0" />
      <rect x="68" y="132" width="88" height="24" rx="12" fill={`${accent}22`} stroke={accent} strokeWidth="1.5" />
      <text x="112" y="148" fill={accent} fontSize="10" fontWeight="800" textAnchor="middle">
        {category}
      </text>
    </>
  );
}

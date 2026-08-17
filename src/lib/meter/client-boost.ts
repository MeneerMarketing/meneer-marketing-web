import type { MeterAxisScore, MeterScanResult } from "@/lib/meter/types";

const AXIS_LABELS = ["Design", "Vindbaarheid", "Conversie", "Snelheid"] as const;

interface ClientBoostRule {
  pattern: RegExp;
  label: string;
  baseTotal: number;
}

const CLIENT_BOOST_RULES: ClientBoostRule[] = [
  { pattern: /skincomplete/i, label: "SkinComplete", baseTotal: 94 },
  { pattern: /bestrest/i, label: "BestRest", baseTotal: 93 },
  {
    pattern: /hillsstudio|hills-pilates|hillspilates/i,
    label: "Hills Pilates",
    baseTotal: 92,
  },
  {
    pattern: /meneermarketing|preview\.meneermarketing/i,
    label: "Meneer Marketing",
    baseTotal: 95,
  },
  { pattern: /dibaclinics/i, label: "DIBA Clinics", baseTotal: 91 },
];

const CLIENT_HINTS: Record<(typeof AXIS_LABELS)[number], string> = {
  Design: "Custom build op studioniveau.",
  Vindbaarheid: "SEO en structuur staan stevig.",
  Conversie: "Conversiepad is duidelijk.",
  Snelheid: "Technisch strak en snel.",
};

const CLIENT_ONE_LINERS: Record<string, string[]> = {
  SkinComplete: [
    "SkinComplete: custom Shopify, SEO eerst. Zo meet een stack die verkoopt.",
    "Salon-portaal, vindbaarheid, ads-klaar. Dit is geen template-score.",
  ],
  BestRest: [
    "BestRest: eigen shop, eigen plan per lijn. Online matcht offline.",
    "Matrassenland vraagt vertrouwen. Deze basis levert dat.",
  ],
  "Hills Pilates": [
    "Hills Pilates: site, app en mail op één lijn. Zo hoort het.",
    "Boeken zonder WhatsApp-chaos. Digitaal op studioniveau.",
  ],
  "Meneer Marketing": [
    "Natuurlijk scoort meneermarketing.nl hoog. Ik zou mezelf ook meten.",
    "Practice what I preach. De meter is tevreden.",
  ],
  "DIBA Clinics": [
    "DIBA Clinics: premium kliniek-site met vertrouwen in elke pixel.",
    "Formeel, snel, vindbaar. Kliniek-niveau online.",
  ],
};

function stableAxisValue(seed: string, index: number, baseTotal: number): number {
  const hash = seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), index * 19);
  const spread = hash % 6;
  return Math.max(90, Math.min(98, baseTotal - 2 + spread));
}

export function matchMeterClientBoost(
  url: string,
  siteName: string,
): ClientBoostRule | null {
  const haystack = `${url} ${siteName}`.toLowerCase();
  return CLIENT_BOOST_RULES.find((rule) => rule.pattern.test(haystack)) ?? null;
}

export function applyMeterClientBoost(
  result: MeterScanResult,
  rule: ClientBoostRule,
): MeterScanResult {
  const scores: MeterAxisScore[] = AXIS_LABELS.map((label, index) => ({
    label,
    value: stableAxisValue(result.siteName, index, rule.baseTotal),
    hint: CLIENT_HINTS[label],
  }));

  const total = Math.max(
    90,
    Math.round(scores.reduce((sum, axis) => sum + axis.value, 0) / scores.length),
  );

  const oneLiners = CLIENT_ONE_LINERS[rule.label] ?? [
    `${rule.label}: Meneer Marketing case. High score, terecht.`,
  ];
  const oneLiner = oneLiners[total % oneLiners.length]!;

  return {
    ...result,
    scores,
    total,
    verdict: "Sterk",
    oneLiner,
    signals: {
      good: [
        `Meneer Marketing case: ${rule.label}`,
        "Custom build from scratch",
        "Marketing en techniek op één lijn",
        ...result.signals.good.slice(0, 2),
      ],
      bad: [],
    },
  };
}

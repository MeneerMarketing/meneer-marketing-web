import type { MeterAxisScore } from "@/lib/meter/types";

interface VerdictTier {
  min: number;
  verdict: string;
  oneLiners: string[];
}

const TIERS: VerdictTier[] = [
  {
    min: 86,
    verdict: "Sterk",
    oneLiners: [
      "Geen paniek. Wel micrometers waar je winst laat liggen.",
      "Dit is geen ramp. Dit is een site die nét niet domineert.",
      "Je bent dichtbij. De laatste procenten zijn vaak het duurste.",
    ],
  },
  {
    min: 73,
    verdict: "Solide",
    oneLiners: [
      "Het werkt. Alleen werken is geen groeistrategie.",
      "Redelijk netjes. Redelijk verkoopt zelden proeflessen.",
      "Je site doet zijn best. Je concurrent ook.",
    ],
  },
  {
    min: 56,
    verdict: "Matig",
    oneLiners: [
      "Functioneert. Overtuigt niet. Dat verschil kost je elke week leads.",
      "Bezoekers komen. Bezoekers twijfelen. Twijfel is gratis afhaken.",
      "Dit voelt als een site die nog moet bewijzen waarom iemand nu boekt.",
    ],
  },
  {
    min: 36,
    verdict: "Zwak",
    oneLiners: [
      "Je homepage is een digitale brochure met verkeerslichten op rood.",
      "Google vindt je misschien. Bezoekers geloven je waarschijnlijk niet meteen.",
      "Hier gaat vertrouwen verloren voordat iemand je telefoonnummer ziet.",
    ],
  },
  {
    min: 0,
    verdict: "Kritiek",
    oneLiners: [
      "Dit is geen siteprobleem meer. Dit is een omzetlek met ssl.",
      "Je URL werkt. Je verhaal online nog niet echt.",
      "Ik zou hier niet adverteren tot de basis niet meer schreeuwt '2017'.",
    ],
  },
];

const AXIS_ROASTS: Record<string, string[]> = {
  Design: [
    "Design lijkt op een template uit de la van gratis.",
    "Mobiel ziet eruit alsof desktop boos is geworden.",
    "Visueel vertrouwen? Nog niet op niveau van je echte werk.",
  ],
  Vindbaarheid: [
    "Google krijgt weinig houvast. Jij ook, als je zoekt.",
    "Title en meta doen alsof SEO een hobby is.",
    "Vindbaarheid staat op stilstand terwijl je markt wel beweegt.",
  ],
  Conversie: [
    "Bezoekers moeten zelf bedenken wat de volgende stap is. Dat doen ze niet.",
    "Boeken online voelt hier als detectivewerk.",
    "CTA's zijn er. Een duidelijk pad naar klant ook niet.",
  ],
  Snelheid: [
    "Laadtijd voelt zwaarder dan je aanbod.",
    "Elke seconde wachten is een proefles die je cadeau geeft.",
    "Snelheid is hier geen technisch detail. Het is eerste indruk.",
  ],
};

function pick<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length]!;
}

export function buildMeterVerdict(
  total: number,
  scores: MeterAxisScore[],
  siteName: string,
): { verdict: string; oneLiner: string } {
  const tier = TIERS.find((t) => total >= t.min) ?? TIERS[TIERS.length - 1]!;
  const weakest = [...scores].sort((a, b) => a.value - b.value)[0];
  const seed = siteName.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), total);

  const axisRoast = weakest
    ? pick(AXIS_ROASTS[weakest.label] ?? tier.oneLiners, seed)
    : pick(tier.oneLiners, seed);

  return {
    verdict: tier.verdict,
    oneLiner: axisRoast,
  };
}

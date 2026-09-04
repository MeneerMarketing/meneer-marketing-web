import type { BrandProfile, ExtractedService, ImageCandidate, TemplateSelection, WebsiteIntelligence } from "./types";
import type { TemplateVariant } from "@/types/studio";

export function selectTemplate(input: {
  brand: BrandProfile;
  services: ExtractedService[];
  images: ImageCandidate[];
  intelligence: WebsiteIntelligence;
  primaryService: string;
}): TemplateSelection {
  const blob = [
    input.primaryService,
    ...input.services.map((s) => s.service_name),
    ...input.intelligence.raw_headings,
    ...input.brand.visual_keywords,
  ]
    .join(" ")
    .toLowerCase();

  let editorial = 0;
  let reformer = 0;
  let soft = 0;
  let atelier = 0;
  const reasons: string[] = [];

  if (/reformer/.test(blob)) {
    reformer += 35;
    reasons.push("Reformer-aanbod gevonden");
  }
  if (/botox|filler|laser|hydrafacial|microneedling|peeling|huidanalyse|kliniek|dermatolog|aesthetic/.test(blob)) {
    atelier += 32;
    reasons.push("Huidkliniek / medisch-esthetisch signaal");
  }
  if (/boutique|luxe|premium|editorial|fashion|exclusief/.test(blob)) {
    editorial += 30;
    atelier += 18;
    reasons.push("Premium/boutique signalen");
  }
  if (/wellness|holistic|zacht|warm|yoga|movement|flow|mindful/.test(blob)) {
    soft += 28;
    reasons.push("Warm/wellness positionering");
  }

  const dark = input.brand.visual_keywords.includes("dark");
  if (dark) {
    reformer += 10;
    editorial += 8;
  }
  if (input.brand.visual_keywords.includes("warm-accent") || input.brand.visual_keywords.includes("light-bg")) {
    soft += 12;
    editorial += 6;
  }

  const reformerImages = input.images.filter((i) => i.semantic_type === "reformer").length;
  if (reformerImages > 0) {
    reformer += 20;
    reasons.push(`${reformerImages} reformer-beelden`);
  }

  if (input.brand.confidence >= 0.6 && input.brand.logo_url) {
    editorial += 8;
  }

  const scores: Array<{ variant: TemplateVariant; score: number }> = [
    { variant: "editorial" as const, score: editorial },
    { variant: "reformer-minimal" as const, score: reformer },
    { variant: "soft-movement" as const, score: soft },
    { variant: "clinical-atelier" as const, score: atelier },
  ].sort((a, b) => b.score - a.score);

  const winner = scores[0]!;
  const total = scores.reduce((s, x) => s + x.score, 0) || 1;
  const confidence = Math.min(0.95, Math.max(0.4, winner.score / total));

  if (winner.score === 0) {
    return {
      variant: "soft-movement",
      confidence: 0.45,
      reasoning: "Onvoldoende signalen; default Soft Movement (warm wellness).",
    };
  }

  return {
    variant: winner.variant,
    confidence,
    reasoning: `${winner.variant} gekozen. ${reasons.join(" · ") || "Deterministische score"}`,
  };
}

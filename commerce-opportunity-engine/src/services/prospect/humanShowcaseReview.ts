/**
 * Milestone 9.9.6 — human-readable showcase review synthesis (no new vision).
 */

export type BeforeAfterObvious =
  | "YES_STRONG"
  | "YES"
  | "MAYBE"
  | "NO";

export type MaterialQualityClass =
  | "EXCELLENT_MATERIAL"
  | "GOOD_MATERIAL"
  | "ENOUGH_MATERIAL"
  | "WEAK_MATERIAL";

export type HumanFinalClassification =
  | "AUDIT_NEXT"
  | "KEEP_AS_BACKUP"
  | "REJECT_TOO_GOOD_VISUALLY"
  | "REJECT_BUSINESS_FIT"
  | "REJECT_MATERIAL"
  | "REJECT_PDP_INVALID";

type ReviewInput = {
  domain: string;
  productTitle: string | null;
  heroPrice: number | null;
  showcasePageEntityType: string;
  captureHealth: string;
  visionScoreAllowed: boolean;
  businessModel: string;
  refinedBusinessModel: string;
  brandOwnershipConfidence: number | null;
  brandOwnershipEvidence: string[];
  companyScaleFit: number | null;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  externalBrandBreadth: number | null;
  businessMaturityScore: number | null;
  currentVisualQualityScore: number | null;
  visualGap: number | null;
  purchaseGap: number | null;
  mobileGap: number | null;
  materialFeasibility: number | null;
  assetQuality: number | null;
  contentAvailable: number | null;
  currentSiteImpression: string | null;
  manualRationale: {
    currentLook?: string;
    whyVisuallyWeak?: string;
    whyBusinessGood?: string;
    whatWeCouldTransform?: string;
  } | null;
  crossDomainProductMatch?: string | null;
  whyGoodProspect?: string | null;
};

export function classifyMaterialQuality(input: ReviewInput): MaterialQualityClass {
  const material = input.materialFeasibility ?? 0;
  const assets = input.assetQuality ?? 0;
  const content = input.contentAvailable ?? 0;
  const composite = material * 0.5 + assets * 0.25 + content * 0.25;
  if (composite >= 90) return "EXCELLENT_MATERIAL";
  if (composite >= 75) return "GOOD_MATERIAL";
  if (composite >= 60) return "ENOUGH_MATERIAL";
  return "WEAK_MATERIAL";
}

export function assessBeforeAfterObvious(input: ReviewInput): BeforeAfterObvious {
  const cvq = input.currentVisualQualityScore;
  const impression = input.currentSiteImpression ?? "";
  const material = input.materialFeasibility ?? 0;

  if (!input.visionScoreAllowed || cvq == null) return "MAYBE";

  if (cvq >= 58 && impression !== "CLEARLY_UNDERDESIGNED") return "NO";
  if (cvq >= 55 && impression === "BASIC_BUT_ACCEPTABLE") return "MAYBE";
  if (cvq <= 40 && impression === "CLEARLY_UNDERDESIGNED" && material >= 80) {
    return "YES_STRONG";
  }
  if (cvq <= 45 && impression === "CLEARLY_UNDERDESIGNED") return "YES";
  if (cvq <= 52 && impression === "CLEARLY_UNDERDESIGNED") return "YES";
  if (impression === "BASIC_BUT_ACCEPTABLE") return "MAYBE";
  return "MAYBE";
}

export function synthesizeHomepageReview(input: ReviewInput): string {
  const look = input.manualRationale?.currentLook ?? "";
  const cvq = input.currentVisualQualityScore;
  const scale = input.companyScaleFit ?? 0;
  const parts: string[] = [];

  if (/dated|template|generic|basic|plain|functional/i.test(look)) {
    parts.push("Homepage oogt functioneel en template-achtig, niet premium editorial.");
  } else if (look.length > 20) {
    parts.push("Homepage leest als standaard ecommerce, weinig merk-art direction.");
  } else {
    parts.push("Homepage: generiek shop-gevoel, geen sterke premium signatuur.");
  }

  if (scale >= 70) parts.push("Schaal oogt professioneel genoeg om serieus te benaderen.");
  else if (scale >= 45) parts.push("Middelgrote shop, professioneel maar niet corporate.");
  else parts.push("Kleinere operator; check of budget en urgentie passen.");

  if (cvq != null && cvq < 45) parts.push("Visueel niveau homepage past bij een zwakkere PDP.");
  return parts.join(" ");
}

export function synthesizePdpReview(input: ReviewInput): {
  templateVsCustom: string;
  hierarchy: string;
  gallery: string;
  buyblock: string;
  typography: string;
  spacing: string;
  trust: string;
  storytelling: string;
  sections: string;
  mobile: string;
  summary: string;
} {
  const look = input.manualRationale?.currentLook ?? "";
  const template =
    /template|shopify|woocommerce|generic|standard|plain|basic/i.test(look)
      ? "Standaard template / theme-layout"
      : "Custom elementen, maar nog niet premium";
  const gallery =
    /gallery|thumbnail|single angle|plain product image/i.test(look)
      ? "Basic gallery, weinig zoom/lifestyle of editorial diepte"
      : "Functionele productbeelden, weinig premium presentatie";
  const typography =
    /typography|hierarchy|sans-serif|utilitarian/i.test(look)
      ? "Zwakke typografie-hiërarchie, generieke fonts"
      : "Typografie functioneel, niet distinctive";
  const buyblock =
    /buyblock|cta|yellow button|option selectors/i.test(look)
      ? "Plain buyblock, standaard CTA, weinig visual anchor"
      : "Buyblock werkt, maar zonder premium styling";
  const trust = /cookie|social share|dated/i.test(look)
    ? "Trust/social proof voelt dated of onderbelicht"
    : "Trust-elementen aanwezig maar niet sterk designed";
  const storytelling =
    /no visual storytelling|no lifestyle|no hero|minimal art direction/i.test(look)
      ? "Weinig product storytelling of lifestyle context"
      : "Content aanwezig, art direction blijft dun";
  const mobile =
    input.mobileGap != null && input.mobileGap >= 50
      ? "Mobile gap hoog: mobile buy experience heeft zichtbare ruimte"
      : "Mobile layout functioneel, premium mobile polish ontbreekt";

  const summary =
    look.length > 40
      ? look.slice(0, 220).trim()
      : `${template}. ${gallery}. ${typography}.`;

  return {
    templateVsCustom: template,
    hierarchy: typography,
    gallery,
    buyblock,
    typography,
    spacing: /spacing|padding|cramped|flat/i.test(look)
      ? "Spacing vlak en utilitair"
      : "Spacing functioneel, weinig ritme",
    trust,
    storytelling,
    sections: /sections|blocks|description is funct/i.test(look)
      ? "Section design basic, weinig premium modules"
      : "Sections standaard ecommerce-blocks",
    mobile,
    summary,
  };
}

export function listRedesignChanges(input: ReviewInput): string[] {
  const changes: string[] = [];
  const look = input.manualRationale?.currentLook ?? "";

  if (/hero|lifestyle|art direction|storytelling/i.test(look) || input.visualGap != null && input.visualGap >= 40) {
    changes.push("Editorial hero + product storytelling boven de fold");
  }
  if (/gallery|thumbnail|image/i.test(look)) {
    changes.push("Premium gallery met zoom, lifestyle shots en betere hiërarchie");
  }
  if (/buyblock|cta|button/i.test(look)) {
    changes.push("Custom buyblock met sterkere CTA en variant-presentatie");
  }
  if (/typography|hierarchy/i.test(look)) {
    changes.push("Typografie-systeem en spacing die premium DTC voelen");
  }
  if (/trust|social|proof/i.test(look) || (input.purchaseGap ?? 0) >= 55) {
    changes.push("Trust/social proof blocks met betere visual hierarchy");
  }
  if ((input.mobileGap ?? 0) >= 45) {
    changes.push("Mobile-first purchase flow met strakkere sticky buy");
  }

  if (changes.length < 3) {
    changes.push("Visual benefit sections met iconografie en copy rhythm");
    changes.push("Sterkere art direction over homepage + PDP");
  }

  return changes.slice(0, 5);
}

export function assessBusinessRisk(input: ReviewInput): string {
  const ownership = input.brandOwnershipConfidence ?? 0;
  const focus = input.catalogFocus ?? 50;
  const material = classifyMaterialQuality(input);
  const cvq = input.currentVisualQualityScore ?? 60;

  if (input.crossDomainProductMatch === "LIKELY" || input.crossDomainProductMatch === "CONFIRMED") {
    return "Private label / cross-domain product match: merkpositionering kan diffuus zijn.";
  }
  if (ownership < 60) {
    return "Ownership confidence onder 60%: eigen merk niet hard genoeg bevestigd.";
  }
  if (focus < 35) {
    return "Catalog focus laag: assortiment mogelijk te breed voor één hero showcase.";
  }
  if (material === "WEAK_MATERIAL") {
    return "Materiaal te zwak: redesign riskeert verzonnen assets.";
  }
  if (cvq >= 55) {
    return "Huidige PDP al te verzorgd voor een dramatisch before/after.";
  }
  if ((input.companyScaleFit ?? 0) < 50) {
    return "Bedrijf relatief klein: commerciële urgentie onzeker.";
  }
  return "Commercieel product (handzeep/kantoorstoel/camping) niet altijd sexy als eerste showcase.";
}

export function wouldApproachBusiness(input: ReviewInput): {
  answer: "YES" | "MAYBE" | "NO";
  note: string;
} {
  const scale = input.companyScaleFit ?? 0;
  const ownership = input.brandOwnershipConfidence ?? 0;
  const maturity = input.businessMaturityScore ?? 0;
  const model = input.refinedBusinessModel;

  if (
    model === "GENERAL_RESELLER" ||
    model === "GENERAL_RETAILER" ||
    model === "FOCUSED_SPECIALIST_RESELLER"
  ) {
    return { answer: "NO", note: "Reseller/retailer model past niet bij eerste showcase pitch." };
  }
  if (ownership >= 65 && scale >= 60 && maturity >= 25) {
    return {
      answer: "YES",
      note: "Professionele mid-market shop met eigen merk-signalen. Benaderbaar.",
    };
  }
  if (ownership >= 55 && scale >= 45) {
    return {
      answer: "MAYBE",
      note: "Past qua schaal, maar ownership of focus vraagt extra check.",
    };
  }
  return { answer: "NO", note: "Te klein of ownership te onduidelijk voor eerste outreach." };
}

export function classifyMaterialBreakdown(input: ReviewInput): Record<string, string> {
  const assets = input.assetQuality ?? 0;
  const content = input.contentAvailable ?? 0;
  return {
    productPhotography:
      assets >= 75 ? "Productfoto's bruikbaar als basis" : "Productfoto's basic, lifestyle ontbreekt",
    lifestylePhotography:
      assets >= 80 ? "Enige lifestyle potentie" : "Weinig lifestyle beelden zichtbaar",
    brandAssets: content >= 85 ? "Content/brand assets rijk genoeg" : "Brand assets dun",
    productInformation: content >= 80 ? "Specs en productinfo aanwezig" : "Productinfo functioneel",
    benefitsFeatures: content >= 75 ? "Benefits/features te herwerken" : "Features onderbelicht",
    reviewsProof:
      (input.purchaseGap ?? 0) >= 55 ? "Proof/trust kan visueel sterker" : "Reviews/proof niet prominent",
    technicalContent: content >= 70 ? "Technische content bruikbaar" : "Specs basic",
  };
}

export function assignFinalClassification(
  candidates: Array<{
    domain: string;
    pdpValid: boolean;
    beforeAfter: BeforeAfterObvious;
    material: MaterialQualityClass;
    approach: "YES" | "MAYBE" | "NO";
    visualFitScore: number;
  }>
): Array<{ domain: string; classification: HumanFinalClassification; reason: string }> {
  const results: Array<{ domain: string; classification: HumanFinalClassification; reason: string }> = [];

  for (const c of candidates) {
    if (!c.pdpValid) {
      results.push({
        domain: c.domain,
        classification: "REJECT_PDP_INVALID",
        reason: "Geen geldige PRODUCT_DETAIL capture",
      });
      continue;
    }
    if (c.approach === "NO") {
      results.push({
        domain: c.domain,
        classification: "REJECT_BUSINESS_FIT",
        reason: "Business fit te zwak voor benadering",
      });
      continue;
    }
    if (c.beforeAfter === "NO") {
      results.push({
        domain: c.domain,
        classification: "REJECT_TOO_GOOD_VISUALLY",
        reason: "Before/after niet duidelijk genoeg",
      });
      continue;
    }
    if (c.material === "WEAK_MATERIAL") {
      results.push({
        domain: c.domain,
        classification: "REJECT_MATERIAL",
        reason: "Te weinig materiaal voor premium redesign",
      });
      continue;
    }
    results.push({
      domain: c.domain,
      classification: "KEEP_AS_BACKUP",
      reason: "Valide backup tot handmatige eindselectie",
    });
  }

  const auditCandidates = candidates
    .filter((c) => {
      const r = results.find((x) => x.domain === c.domain);
      return r?.classification === "KEEP_AS_BACKUP";
    })
    .sort((a, b) => b.visualFitScore - a.visualFitScore);

  if (auditCandidates.length > 0) {
    const pick = auditCandidates[0];
    const row = results.find((r) => r.domain === pick.domain);
    if (row) {
      row.classification = "AUDIT_NEXT";
      row.reason = "Sterkste before/after + business fit voor handmatige eindreview";
    }
  }

  return results;
}

export function visualFitScoreForRanking(input: ReviewInput): number {
  const before = assessBeforeAfterObvious(input);
  const beforeWeight =
    before === "YES_STRONG" ? 40 : before === "YES" ? 28 : before === "MAYBE" ? 12 : 0;
  const cvq = input.currentVisualQualityScore ?? 55;
  const gap = input.visualGap ?? 0;
  const material = input.materialFeasibility ?? 0;
  const ownership = input.brandOwnershipConfidence ?? 0;
  return (
    beforeWeight +
    Math.max(0, 55 - cvq) * 0.6 +
    gap * 0.25 +
    material * 0.15 +
    ownership * 0.1
  );
}

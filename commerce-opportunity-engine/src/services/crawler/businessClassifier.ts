import type { BusinessClassificationResult, PageExtractedSignals } from "../../types/crawler.js";
import type { EcommerceDetectionResult } from "../../types/crawler.js";
import { structuralDomainClass } from "../prospect/prospectPipelineGate.js";
import { computeBreadthSignals, qualifiesAsMassRetailer } from "./breadthSignals.js";

/**
 * Bump this whenever the classification logic changes. Brands carrying an older
 * version are picked up by the recompute job instead of being patched by hand.
 *
 * v2-prospect-aware: consults the structural domain verdict before any website
 * heuristic, so chains and comparison sites can no longer be scored as
 * specialist webshops on the strength of a clean homepage.
 * v2.1: breadth only counts across categories, so a focused specialist bidding
 * on many keywords in one niche is no longer mistaken for a chain.
 * v2.2: hreflang breadth marks international operators.
 * v2.3: corporate-division language marks enterprises, and vertical matching
 * uses word boundaries so "automatisch" no longer counts as the auto vertical.
 * v2.4: international reach, category breadth and retailer breadth are measured
 * separately. Only assortment width produces MASS_RETAILER, so an international
 * specialist keeps its brand or specialist classification.
 */
export const BUSINESS_CLASSIFIER_VERSION = "v2.4-breadth-aware";

/** Investor relations plus a professional division: a corporation, not a shop. */
const INVESTOR_RELATIONS_PATTERN =
  /\b(investeerders|investor relations|aandeelhouders|jaarverslag|annual report|newsroom|persberichten)\b/i;
const PROFESSIONAL_DIVISION_PATTERN =
  /\b(b2b|zakelijke markt|business solutions|professionele gezondheidszorg|for professionals|zakelijke oplossingen)\b/i;

export function classifyBusinessFromWebsite(
  domain: string,
  signals: PageExtractedSignals,
  ecommerce: EcommerceDetectionResult
): BusinessClassificationResult {
  const breadth = computeBreadthSignals(signals);
  const decide = (
    businessType: string,
    businessTypeConfidence: number,
    businessTypeReasoning: string
  ): BusinessClassificationResult => ({
    businessType,
    businessTypeConfidence,
    businessTypeReasoning,
    usedHaikuFallback: false,
    internationalPresenceScore: breadth.internationalPresenceScore,
    categoryBreadthScore: breadth.categoryBreadthScore,
    retailerBreadthScore: breadth.retailerBreadthScore,
    breadthEvidence: breadth.evidence,
  });

  // Structural verdict wins. A chain that sells products still has a polished,
  // specialist-looking homepage; the domain tells us what it really is.
  const structural = structuralDomainClass(domain);
  if (structural) {
    return decide(
      structural.businessType,
      0.95,
      `Structureel domeinoordeel: ${structural.matchedSignal}`
    );
  }

  // Service-first orgs (membership, insurance, roadside) even if they also sell products
  if (signals.insuranceServiceMentions >= 2) {
    const serviceDominant =
      !ecommerce.isEcommerce ||
      ecommerce.ecommerceConfidence < 0.7 ||
      signals.storeLocatorMentions >= 1 ||
      countCorporateServiceHints(signals.bodyTextSample) >= 2;

    if (serviceDominant) {
      return decide(
        "SERVICE_BUSINESS",
        ecommerce.isEcommerce ? 0.78 : 0.88,
        "Sterke service/verzekering/membership signalen; eventuele shop is secundair."
      );
    }
  }

  if (!ecommerce.isEcommerce && ecommerce.ecommerceConfidence < 0.35) {
    return decide(
      "NON_ECOMMERCE",
      0.75,
      "Geen betrouwbare ecommerce signalen op de website."
    );
  }

  let comparisonScore = 0;
  let marketplaceScore = 0;
  let generalRetailerScore = 0;
  let brandScore = 0;
  let specialistScore = 0;
  const reasons: string[] = [];

  if (signals.compareMentions >= 2) {
    comparisonScore += 0.45;
    reasons.push("vergelijk-patronen");
  }
  if (signals.sellerMentions >= 2) {
    marketplaceScore += 0.4;
    reasons.push("seller/marketplace terminologie");
  }

  // Store locator is a strong general-retailer signal
  if (signals.storeLocatorMentions >= 2) {
    generalRetailerScore += 0.4;
    reasons.push("meerdere store-locator signalen");
  } else if (signals.storeLocatorMentions >= 1) {
    generalRetailerScore += 0.2;
    reasons.push("store locator aanwezig");
  }

  // Nav-link volume alone is weak on Shopify (collection menus look huge).
  // Only contribute modestly unless combined with other scale signals.
  const navBreadth =
    signals.estimatedCategoryLinks >= 40
      ? 0.15
      : signals.estimatedCategoryLinks >= 20
        ? 0.08
        : 0;
  if (navBreadth > 0) {
    generalRetailerScore += navBreadth;
    reasons.push("brede navigatie");
  }

  const verticalHits = breadth.verticalHits;
  if (verticalHits >= 4) {
    generalRetailerScore += 0.35;
    reasons.push("meerdere productverticals");
  } else if (verticalHits >= 3) {
    generalRetailerScore += 0.2;
    reasons.push("brede vertical mix");
  }

  // Warehouse / big-box / chain language
  if (
    /grootste|europe'?s largest|filialen|vestigingen|warenhuis|hypermarkt|keten|landelijke dekking/i.test(
      signals.bodyTextSample
    )
  ) {
    generalRetailerScore += 0.3;
    reasons.push("grote keten / warehouse schaal-taal");
  }

  // Large multi-brand outdoor/camping warehouse profile
  const titleMeta = `${signals.title ?? ""} ${signals.metaDescription ?? ""}`.toLowerCase();
  if (
    /kampeerwinkel|campingwinkel|outdoorwinkel|kampeer specialist/i.test(titleMeta) ||
    (/(kampeer|camping).{0,60}(assortiment|winkel)/i.test(signals.bodyTextSample) &&
      /grootste|europa|filiaal|vestiging/i.test(signals.bodyTextSample + titleMeta))
  ) {
    generalRetailerScore += 0.45;
    reasons.push("grote kampeer/outdoor retailer schaal");
  }

  const domainLower = domain.toLowerCase();
  if (
    domainLower.includes("vergelijk") ||
    domainLower.includes("beslist") ||
    domainLower.includes("kieskeurig")
  ) {
    comparisonScore += 0.5;
    reasons.push("domeinnaam comparison patroon");
  }
  if (
    domainLower.includes("marktplaats") ||
    domainLower.includes("bol.com") ||
    domainLower.includes("amazon")
  ) {
    marketplaceScore += 0.6;
    reasons.push("bekend marketplace domein");
  }

  if (ecommerce.isEcommerce) {
    specialistScore += 0.35;
    reasons.push("ecommerce aanwezig");

    // Niche focus: limited vertical breadth
    if (verticalHits <= 2 && signals.storeLocatorMentions === 0) {
      specialistScore += 0.25;
      reasons.push("niche vertical focus");
    }
    if (signals.jsonLdProducts.length > 0 && verticalHits <= 2) {
      brandScore += 0.2;
      reasons.push("product structured data met niche focus");
    }
    if (signals.title && signals.title.split(/\s+/).length <= 6) {
      brandScore += 0.1;
      reasons.push("compacte merknaam in title");
    }
  }

  const scores = [
    { type: "COMPARISON_SITE", score: comparisonScore },
    { type: "MARKETPLACE", score: marketplaceScore },
    { type: "GENERAL_RETAILER", score: generalRetailerScore },
    { type: "BRAND", score: brandScore },
    { type: "SPECIALIST_WEBSHOP", score: specialistScore },
  ].sort((a, b) => b.score - a.score);

  const best = scores[0];

  if (
    INVESTOR_RELATIONS_PATTERN.test(signals.bodyTextSample) &&
    PROFESSIONAL_DIVISION_PATTERN.test(signals.bodyTextSample)
  ) {
    return decide(
      "MASS_RETAILER",
      0.9,
      "Investor relations naast een zakelijke divisie: corporate onderneming, geen webshop-prospect"
    );
  }

  // Mass retail is an assortment verdict. A niche brand selling the same range
  // in twenty countries stays a specialist, however many locales it serves.
  if (qualifiesAsMassRetailer(breadth)) {
    return decide(
      "MASS_RETAILER",
      0.85,
      [`assortimentsbreedte ${breadth.retailerBreadthScore}/100`, ...breadth.evidence].join("; ")
    );
  }

  // Require stronger evidence for GENERAL_RETAILER vs specialist default
  if (best && best.type === "GENERAL_RETAILER" && best.score >= 0.5) {
    return decide(
      "GENERAL_RETAILER",
      Math.min(best.score, 0.95),
      reasons.join("; ") || "GENERAL_RETAILER"
    );
  }

  if (best && best.type !== "GENERAL_RETAILER" && best.score >= 0.45) {
    return decide(
      best.type,
      Math.min(best.score, 0.95),
      reasons.join("; ") || `Score ${best.type}`
    );
  }

  if (ecommerce.isEcommerce) {
    // Prefer specialist over weak general_retailer
    if (generalRetailerScore >= 0.5 && generalRetailerScore > specialistScore) {
      return decide(
        "GENERAL_RETAILER",
        Math.min(generalRetailerScore, 0.95),
        reasons.join("; ")
      );
    }
    return decide(
      "SPECIALIST_WEBSHOP",
      Math.max(0.55, specialistScore),
      reasons.join("; ") ||
        "Ecommerce shop zonder sterke marketplace/retailer/comparison signalen."
    );
  }

  return decide(
    "UNKNOWN",
    0.4,
    "Onvoldoende sterke website signalen voor harde classificatie."
  );
}

export function needsHaikuFallback(classification: BusinessClassificationResult): boolean {
  return (
    classification.businessTypeConfidence < 0.55 ||
    classification.businessType === "UNKNOWN"
  );
}

function countCorporateServiceHints(text: string): number {
  const phrases = [
    "lid worden",
    "membership",
    "vereniging",
    "pechhulp",
    "wegenwacht",
    "verzekering",
    "polis",
    "ledenvoordeel",
  ];
  let hits = 0;
  for (const phrase of phrases) {
    if (text.includes(phrase)) hits += 1;
  }
  return hits;
}


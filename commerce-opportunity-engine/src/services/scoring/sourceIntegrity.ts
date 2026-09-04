import {
  PRIMARY_KEYWORD_WEIGHTS,
  SOURCE_QUALITY_SCORE_CAPS,
  SOURCE_TYPE_SCORE_CAPS,
  type FindingValidationStatus,
  type SourceType,
} from "../../config/sourceIntegrityWeights.js";

export type IntegrityAd = {
  id: string;
  keywordId: string | null;
  keyword: string | null;
  category: string | null;
  headline: string | null;
  description: string | null;
  landingUrl: string | null;
  serpItemType: string | null;
  adSignalType: string | null;
  confirmationSource: string | null;
};

export type IntegrityPage = {
  productName: string | null;
  url: string | null;
  finalUrl: string | null;
  productResolutionConfidence: number | null;
};

export type PrimaryKeywordResult = {
  keywordId: string | null;
  keyword: string | null;
  category: string | null;
  confidence: number;
  reason: string;
  candidates: Array<{ keywordId: string; keyword: string; score: number }>;
};

export type SourceQualityResult = {
  sourceQualityScore: number;
  sourceType: SourceType;
  discoverySerpItemType: string | null;
  discoveryConfirmationSource: string | null;
  notes: Record<string, unknown>;
  adProductMatch: number;
  keywordProductMatch: number;
};

function tokenize(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s/_-]+/)
    .filter((t) => t.length >= 3);
}

function overlapRatio(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  const hits = a.filter((t) => setB.has(t)).length;
  return hits / Math.max(a.length, 1);
}

function slugTokens(url: string | null | undefined): string[] {
  if (!url) return [];
  try {
    const path = new URL(url).pathname;
    return tokenize(path.replace(/\//g, " "));
  } catch {
    return tokenize(url);
  }
}

export function scoreKeywordCandidate(input: {
  ad: IntegrityAd;
  page: IntegrityPage | null;
  isPrimaryAd: boolean;
}): number {
  const w = PRIMARY_KEYWORD_WEIGHTS;
  let score = 0;
  if (input.isPrimaryAd) score += w.linkedToPrimaryAd;
  if (input.ad.adSignalType === "CONFIRMED_PAID") score += w.confirmedPaidSignal;
  else if (input.ad.adSignalType === "PAID_CANDIDATE") score += w.paidCandidateSignal;
  if (input.ad.landingUrl) score += w.landingUrlPresent;

  const keywordTokens = tokenize(input.ad.keyword);
  const productTokens = tokenize(input.page?.productName ?? null);
  const headlineTokens = tokenize(input.ad.headline);
  const urlTokens = slugTokens(input.page?.finalUrl ?? input.page?.url);

  const kwProduct = overlapRatio(keywordTokens, productTokens);
  const kwHeadline = overlapRatio(keywordTokens, headlineTokens);
  const slug = overlapRatio(keywordTokens, urlTokens);

  score += kwProduct * w.productTitleOverlap;
  score += kwHeadline * w.headlineOverlap;
  score += slug * w.urlSlugOverlap;

  const conf = input.page?.productResolutionConfidence;
  if (conf != null) score += Math.min(w.productResolutionConfidence, conf * w.productResolutionConfidence);

  return Math.round(Math.min(100, score));
}

export function selectPrimaryKeyword(input: {
  ads: IntegrityAd[];
  primaryAdId: string | null;
  page: IntegrityPage | null;
}): PrimaryKeywordResult {
  const byKeyword = new Map<
    string,
    { keywordId: string; keyword: string; category: string | null; best: number }
  >();

  for (const ad of input.ads) {
    if (!ad.keywordId || !ad.keyword) continue;
    const score = scoreKeywordCandidate({
      ad,
      page: input.page,
      isPrimaryAd: ad.id === input.primaryAdId,
    });
    const existing = byKeyword.get(ad.keywordId);
    if (!existing || score > existing.best) {
      byKeyword.set(ad.keywordId, {
        keywordId: ad.keywordId,
        keyword: ad.keyword,
        category: ad.category,
        best: score,
      });
    }
  }

  const candidates = [...byKeyword.values()]
    .map((c) => ({ keywordId: c.keywordId, keyword: c.keyword, score: c.best }))
    .sort((a, b) => b.score - a.score);

  const winner = candidates[0];
  if (!winner) {
    return {
      keywordId: null,
      keyword: null,
      category: null,
      confidence: 0,
      reason: "no_linked_keywords",
      candidates: [],
    };
  }

  const meta = byKeyword.get(winner.keywordId)!;
  const reasons: string[] = [];
  if (input.ads.some((a) => a.id === input.primaryAdId && a.keywordId === winner.keywordId)) {
    reasons.push("primary_ad_keyword");
  }
  if (winner.score >= 70) reasons.push("strong_product_or_headline_overlap");
  else if (winner.score >= 45) reasons.push("moderate_relevance");
  else reasons.push("weak_relevance_best_available");

  return {
    keywordId: winner.keywordId,
    keyword: winner.keyword,
    category: meta.category,
    confidence: winner.score,
    reason: reasons.join("+"),
    candidates: candidates.slice(0, 5),
  };
}

export function classifySourceType(ad: IntegrityAd | null): SourceType {
  if (!ad) return "UNKNOWN";
  const serp = (ad.serpItemType ?? "").toLowerCase();
  const conf = (ad.confirmationSource ?? "").toLowerCase();

  if (serp === "paid" || conf === "serp_paid_text") return "LIVE_PAID_SERP";
  if (
    serp === "google_shopping_paid" ||
    conf.includes("google_shopping_paid") ||
    conf.includes("shopping_paid_exact")
  ) {
    return "GOOGLE_SHOPPING_PAID_EXACT";
  }
  if (
    conf.includes("shopping_exact_listing") ||
    conf.includes("google_shopping_exact")
  ) {
    return "GOOGLE_SHOPPING_EXACT_LISTING";
  }
  if (conf.includes("free_shopping") || conf.includes("free_listing")) {
    return "GOOGLE_SHOPPING_FREE_LISTING";
  }
  if (conf.includes("labs") || conf.includes("ranked_keywords")) return "LABS_PAID_KEYWORD";
  if (serp === "popular_products" || conf.includes("popular_products")) {
    return "POPULAR_PRODUCTS_CANDIDATE";
  }
  if (
    serp === "shopping" ||
    serp.includes("sponsored_carousel") ||
    conf.includes("shopping")
  ) {
    return "EXPLICIT_SPONSORED_SHOPPING";
  }
  if (conf.includes("transparency")) return "TRANSPARENCY_CONFIRMED";
  if (ad.adSignalType === "PAID_CANDIDATE") return "PAID_CANDIDATE";
  if (ad.adSignalType === "CONFIRMED_PAID") return "TRANSPARENCY_CONFIRMED";
  return "UNKNOWN";
}

export function computeSourceQuality(input: {
  primaryAd: IntegrityAd | null;
  page: IntegrityPage | null;
  primaryKeyword: PrimaryKeywordResult;
}): SourceQualityResult {
  const ad = input.primaryAd;
  const sourceType = classifySourceType(ad);

  const headlineTokens = tokenize(ad?.headline);
  const productTokens = tokenize(input.page?.productName);
  const keywordTokens = tokenize(input.primaryKeyword.keyword);
  const adProductMatch = overlapRatio(headlineTokens, productTokens);
  const keywordProductMatch = overlapRatio(keywordTokens, productTokens);
  const hasLanding = Boolean(ad?.landingUrl);

  let score = 10;
  switch (sourceType) {
    case "LIVE_PAID_SERP":
      score = hasLanding ? 95 : 70;
      break;
    case "GOOGLE_SHOPPING_PAID_EXACT":
      score = hasLanding ? 93 : 60;
      break;
    case "GOOGLE_SHOPPING_EXACT_LISTING":
      score = hasLanding ? 78 : 40;
      break;
    case "GOOGLE_SHOPPING_FREE_LISTING":
      score = hasLanding ? 55 : 30;
      break;
    case "GOOGLE_SHOPPING_CANDIDATE":
      score = hasLanding ? 35 : 22;
      break;
    case "LABS_PAID_KEYWORD":
      score = hasLanding ? 88 : 55;
      break;
    case "EXPLICIT_SPONSORED_SHOPPING":
      score = hasLanding ? 86 : 45;
      break;
    case "TRANSPARENCY_CONFIRMED":
      // Brand-level only — do NOT treat as exact keyword→landing proof
      score = 55;
      break;
    case "POPULAR_PRODUCTS_CANDIDATE":
      score = hasLanding ? 35 : 22;
      break;
    case "PAID_CANDIDATE":
      score = hasLanding ? 40 : 25;
      break;
    default:
      score = 10;
  }

  if (
    hasLanding &&
    (sourceType === "LIVE_PAID_SERP" ||
      sourceType === "LABS_PAID_KEYWORD" ||
      sourceType === "GOOGLE_SHOPPING_PAID_EXACT")
  ) {
    if (keywordProductMatch >= 0.4 || adProductMatch >= 0.4) score += 5;
  }

  // Transparency must NEVER upgrade a popular_products association
  if (sourceType === "POPULAR_PRODUCTS_CANDIDATE") {
    score = Math.min(score, 38);
  }
  if (sourceType === "TRANSPARENCY_CONFIRMED") {
    score = Math.min(score, 68);
  }

  const brokenAssociation =
    Boolean(ad?.headline) &&
    Boolean(input.page?.productName) &&
    adProductMatch < 0.15 &&
    keywordProductMatch < 0.15;
  if (brokenAssociation) {
    score = Math.min(score, 32);
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    sourceQualityScore: score,
    sourceType,
    discoverySerpItemType: ad?.serpItemType ?? null,
    discoveryConfirmationSource: ad?.confirmationSource ?? null,
    adProductMatch: Math.round(adProductMatch * 100),
    keywordProductMatch: Math.round(keywordProductMatch * 100),
    notes: {
      brokenAssociation,
      hasLandingUrl: hasLanding,
      hasProductPage: Boolean(input.page?.productName),
      primaryKeywordConfidence: input.primaryKeyword.confidence,
      primaryKeywordReason: input.primaryKeyword.reason,
      brandLevelOnly: sourceType === "TRANSPARENCY_CONFIRMED",
    },
  };
}

export function applySourceQualityCap(
  opportunityScore: number,
  sourceQualityScore: number,
  sourceType?: string | null
): { cappedScore: number; capApplied: number | null } {
  const caps = SOURCE_QUALITY_SCORE_CAPS;
  let capped = opportunityScore;
  let capApplied: number | null = null;

  if (sourceType && SOURCE_TYPE_SCORE_CAPS[sourceType] != null) {
    const typeCap = SOURCE_TYPE_SCORE_CAPS[sourceType];
    if (capped > typeCap) {
      capped = typeCap;
      capApplied = typeCap;
    }
  }

  if (sourceQualityScore >= caps.unrestrictedMin) {
    return { cappedScore: capped, capApplied };
  }
  if (sourceQualityScore >= caps.softCapMinQuality) {
    const soft = Math.min(capped, caps.softCapMaxScore);
    return {
      cappedScore: soft,
      capApplied: soft < opportunityScore ? caps.softCapMaxScore : capApplied,
    };
  }
  if (sourceQualityScore >= caps.mediumCapMinQuality) {
    const mid = Math.min(capped, caps.mediumCapMaxScore);
    return {
      cappedScore: mid,
      capApplied: mid < opportunityScore ? caps.mediumCapMaxScore : capApplied,
    };
  }
  const hard = Math.min(capped, caps.hardCapMaxScore);
  return {
    cappedScore: hard,
    capApplied: hard < opportunityScore ? caps.hardCapMaxScore : capApplied,
  };
}

export function explainOpportunityScore(
  components: Record<string, number>,
  penalty: number,
  weightOverrides?: Record<string, number>
): {
  lines: Array<{ label: string; value: number; weight: number; contribution: number }>;
  weightedSum: number;
  final: number;
} {
  const defaultWeights: Record<string, number> = {
    paidAcquisitionStrength: 0.15,
    confirmedPaidBrandStrength: 0.15,
    businessMaturity: 0.15,
    croGap: 0.2,
    productPageCroGap: 0.25,
    adLandingGap: 0.15,
    rebuildPotential: 0.1,
    platformFit: 0.1,
    productCommercialSignal: 0.05,
    designTrustGap: 0.05,
    sourceQuality: 0.05,
    targetSourceConfidence: 0.05,
  };
  const weights = weightOverrides ?? defaultWeights;

  const lines = Object.keys(components).map((key) => {
    const weight = weights[key] ?? weightOverrides?.[key] ?? 0;
    const value = components[key] ?? 0;
    return {
      label: key,
      value,
      weight,
      contribution: Math.round(value * weight * 100) / 100,
    };
  });
  const weightedSum = lines.reduce((s, l) => s + l.contribution, 0);
  return {
    lines,
    weightedSum: Math.round(weightedSum * 100) / 100,
    final: Math.round(Math.max(0, Math.min(100, weightedSum - penalty))),
  };
}

export function validateConversionLeaks(input: {
  leaks: Array<Record<string, unknown>>;
  pageRepresentation: Record<string, unknown> | null;
  adHeadline: string | null;
  productName: string | null;
  keyword: string | null;
}): Array<{
  title: string;
  status: FindingValidationStatus;
  reason: string;
}> {
  const blob = JSON.stringify(input.pageRepresentation ?? {}).toLowerCase();
  const product = (input.productName ?? "").toLowerCase();
  const headline = (input.adHeadline ?? "").toLowerCase();
  const keyword = (input.keyword ?? "").toLowerCase();

  return input.leaks.map((leak) => {
    const title = String(leak.title ?? "");
    const evidence = String(leak.evidence ?? "").toLowerCase();
    const titleLower = title.toLowerCase();

    // Ad/landing mismatch claims
    if (
      titleLower.includes("mismatch") ||
      titleLower.includes("ad-landing") ||
      titleLower.includes("ad →") ||
      titleLower.includes("wrong product")
    ) {
      const mismatch =
        overlapRatio(tokenize(headline), tokenize(product)) < 0.2 &&
        Boolean(headline) &&
        Boolean(product);
      return {
        title,
        status: (mismatch ? "SUPPORTED" : "QUESTIONABLE") as FindingValidationStatus,
        reason: mismatch
          ? "Ad headline tokens do not overlap product title"
          : "Mismatch claimed but titles still share tokens",
      };
    }

    // Evidence grounded in extracted page JSON
    const evidenceTokens = tokenize(evidence).slice(0, 8);
    const grounded = evidenceTokens.filter((t) => blob.includes(t)).length;
    if (grounded >= Math.min(3, evidenceTokens.length) && evidenceTokens.length > 0) {
      return {
        title,
        status: "SUPPORTED",
        reason: `Evidence tokens found in page representation (${grounded})`,
      };
    }

    // Cookie / popup claims rely on screenshots, not HTML extract
    if (titleLower.includes("cookie") || evidence.includes("cookie")) {
      return {
        title,
        status: "QUESTIONABLE",
        reason: "Cookie/overlay claims require screenshot review; not present in HTML extract",
      };
    }

    // Price above fold: extractor often has price even if viewport hides it
    if (titleLower.includes("price") && titleLower.includes("fold")) {
      const hasPrice = blob.includes("price");
      return {
        title,
        status: hasPrice ? "QUESTIONABLE" : "SUPPORTED",
        reason: hasPrice
          ? "Price exists in extract; viewport visibility needs screenshot confirmation"
          : "Price missing from extract",
      };
    }

    if (!evidence || evidence.length < 20) {
      return {
        title,
        status: "UNSUPPORTED",
        reason: "Evidence too thin or missing",
      };
    }

    // Keyword continuity check for relevance claims
    if (keyword && evidence.includes(keyword.split(" ")[0] ?? "")) {
      return {
        title,
        status: "QUESTIONABLE",
        reason: "Partially keyword-related; limited extract grounding",
      };
    }

    return {
      title,
      status: "QUESTIONABLE",
      reason: "Could not firmly ground evidence in structured extract alone",
    };
  });
}

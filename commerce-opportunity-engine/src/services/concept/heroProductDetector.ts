/**
 * Milestone 9 — hero product detector (existing opportunity/page signals only).
 */

import { HERO_PRODUCT_MIN_CONFIDENCE } from "../../config/conceptScoring.js";

export type HeroCandidateInput = {
  productTitle: string | null;
  productUrl: string | null;
  productBrand: string | null;
  price: number | null;
  currency: string | null;
  reviewCount: number | null;
  rating: number | null;
  availability: string | null;
  adHeadline: string | null;
  keyword: string | null;
  /** When multiple discovery keywords exist, overlap against any of them. */
  keywords?: string[] | null;
  paidConfirmed: boolean;
  isResolvedPage: boolean;
  hasScreenshots: boolean;
  descriptionLength: number;
  imageCountEstimate: number | null;
};

export type HeroCandidate = {
  product_title: string;
  product_url: string | null;
  product_brand: string | null;
  price: number | null;
  currency: string | null;
  hero_product_score: number;
  hero_product_confidence: number;
  hero_product_reasoning: string;
  hero_product_evidence: string[];
};

export type HeroDetectionResult = {
  candidates: HeroCandidate[];
  primary: HeroCandidate | null;
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function scoreHeroCandidate(input: HeroCandidateInput): HeroCandidate | null {
  if (!input.productTitle?.trim()) return null;

  const evidence: string[] = [];
  let score = 25;
  let confidence = 30;

  if (input.isResolvedPage) {
    score += 18;
    confidence += 15;
    evidence.push("resolved_opportunity_page");
  }
  if (input.paidConfirmed) {
    score += 14;
    confidence += 10;
    evidence.push("paid_or_confirmed_commercial_target");
  }
  if (input.keyword && input.productTitle) {
    const k = input.keyword.toLowerCase();
    const t = input.productTitle.toLowerCase();
    if (k.split(/\s+/).some((w) => w.length > 3 && t.includes(w))) {
      score += 10;
      confidence += 8;
      evidence.push("keyword_title_overlap");
    }
  }
  const keywordList = [
    ...(input.keywords ?? []),
    ...(input.keyword ? [input.keyword] : []),
  ];
  if (keywordList.length > 0 && input.productTitle) {
    const t = input.productTitle.toLowerCase();
    let bestOverlap = 0;
    for (const keyword of keywordList) {
      const overlap = keyword
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3 && t.includes(w)).length;
      bestOverlap = Math.max(bestOverlap, overlap);
    }
    if (bestOverlap >= 2) {
      score += 14;
      confidence += 10;
      evidence.push(`multi_keyword_overlap:${bestOverlap}`);
    } else if (bestOverlap === 1) {
      score += 6;
      confidence += 4;
      evidence.push("multi_keyword_partial_overlap");
    }
  }
  if (input.adHeadline && input.productTitle) {
    const a = input.adHeadline.toLowerCase();
    const t = input.productTitle.toLowerCase();
    if (a.split(/\s+/).some((w) => w.length > 3 && t.includes(w))) {
      score += 8;
      evidence.push("ad_headline_title_overlap");
    }
  }
  if (input.reviewCount != null && input.reviewCount > 0) {
    score += Math.min(16, 4 + Math.log10(input.reviewCount + 1) * 6);
    confidence += 8;
    evidence.push(`reviews:${input.reviewCount}`);
  }
  if (input.rating != null && input.rating >= 4) {
    score += 6;
    evidence.push(`rating:${input.rating}`);
  }
  if (input.price != null) {
    if (input.price >= 75 && input.price <= 500) {
      score += 12;
      evidence.push("price_in_strong_concept_band");
    } else if (input.price >= 30) {
      score += 6;
      evidence.push("price_present");
    } else {
      score += 2;
      evidence.push("low_price_product");
    }
  }
  if (input.hasScreenshots) {
    score += 6;
    confidence += 5;
    evidence.push("audit_screenshots_available");
  }
  if (input.descriptionLength >= 120) {
    score += 5;
    evidence.push("description_present");
  }
  if (input.imageCountEstimate != null && input.imageCountEstimate >= 3) {
    score += 8;
    confidence += 6;
    evidence.push(`images_estimated:${input.imageCountEstimate}`);
  } else if (input.imageCountEstimate === null) {
    evidence.push("image_count_unknown");
  }
  if (input.availability && /in.?stock|op voorraad|available/i.test(input.availability)) {
    score += 4;
    evidence.push("availability_positive");
  }

  score = clamp(score);
  confidence = clamp(confidence);

  const reasoning = [
    `Hero score ${score} for “${input.productTitle}”.`,
    evidence.slice(0, 4).join("; "),
  ].join(" ");

  return {
    product_title: input.productTitle.trim(),
    product_url: input.productUrl,
    product_brand: input.productBrand,
    price: input.price,
    currency: input.currency,
    hero_product_score: score,
    hero_product_confidence: confidence,
    hero_product_reasoning: reasoning,
    hero_product_evidence: evidence,
  };
}

export function selectPrimaryHero(
  candidates: HeroCandidate[]
): HeroCandidate | null {
  if (!candidates.length) return null;
  const sorted = [...candidates].sort(
    (a, b) => b.hero_product_score - a.hero_product_score
  );
  const top = sorted[0]!;
  if (top.hero_product_confidence < HERO_PRODUCT_MIN_CONFIDENCE) return null;
  return top;
}

export function detectHeroProducts(
  inputs: HeroCandidateInput[]
): HeroDetectionResult {
  const candidates = inputs
    .map(scoreHeroCandidate)
    .filter((c): c is HeroCandidate => Boolean(c))
    .sort((a, b) => b.hero_product_score - a.hero_product_score)
    .slice(0, 3);
  return {
    candidates,
    primary: selectPrimaryHero(candidates),
  };
}

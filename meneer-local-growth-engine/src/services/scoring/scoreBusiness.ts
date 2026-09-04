import type { Business } from "@/types/domain";
import { getVerticalRuntime } from "@/verticals/runtime";
import {
  assertWeightsSum,
  pilatesScoringConfig,
  type PilatesScoringConfig,
} from "@/verticals/pilates/scoring";
import {
  scanWebsiteOpportunity,
  type WebsiteOpportunityResult,
} from "@/services/scoring/websiteOpportunity";

export interface ScoreComponents {
  business_quality_score: number;
  website_quality_score: number;
  website_opportunity_score: number;
  seo_opportunity_score: number;
  local_reputation_score: number;
  service_fit_score: number;
  brand_fit_score: number;
  contactability_score: number;
  competition_fit_score: number;
  lead_score: number;
  explanations: {
    positives: string[];
    negatives: string[];
  };
  website_scan?: WebsiteOpportunityResult["details"];
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function serviceTypes(business: Business, verticalSlug = "pilates"): string[] {
  const fromServices = Array.isArray(business.services)
    ? business.services.map((s) => {
        if (s && typeof s === "object" && "name" in s) {
          return String((s as { name?: string }).name ?? "").toLowerCase();
        }
        return "";
      })
    : [];
  const blob = [
    business.primary_service,
    business.google_category,
    ...(business.additional_categories ?? []),
    ...fromServices,
    business.description,
    business.tagline,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const types: string[] = [];
  if (verticalSlug === "skin-clinics") {
    if (/botox/.test(blob)) types.push("botox");
    if (/filler|fillers/.test(blob)) types.push("fillers");
    if (/laser|ipl|bbl/.test(blob)) types.push("laser");
    if (/hydrafacial/.test(blob)) types.push("hydrafacial");
    if (/microneedling|microneedle/.test(blob)) types.push("microneedling");
    if (/peeling|peel\b/.test(blob)) types.push("peeling");
    if (/huidanalyse|huid analyse|skin analysis/.test(blob)) types.push("huidanalyse");
    if (/acne/.test(blob)) types.push("acne");
    if (/pigment|melasma/.test(blob)) types.push("pigment");
    if (/intake|consult/.test(blob)) types.push("intake");
    if (/medisch\s*esthet|aesthetic/.test(blob)) types.push("medisch_esthetisch");
    if (/huidkliniek|skin clinic|cosmetisch/.test(blob) && types.length === 0) {
      types.push("huidkliniek");
    }
    return Array.from(new Set(types));
  }

  if (/reformer/.test(blob)) types.push("reformer");
  if (/mat\s*pilates|matwork/.test(blob)) types.push("mat");
  if (/private|1[\s-]?op[\s-]?1|een[\s-]?op[\s-]?een/.test(blob)) types.push("private");
  if (/duo/.test(blob)) types.push("duo");
  if (/pre[\s-]?natal|zwanger/.test(blob)) types.push("prenatal");
  if (/post[\s-]?natal/.test(blob)) types.push("postnatal");
  if (/groep|group/.test(blob)) types.push("group");
  if (/yoga/.test(blob)) types.push("yoga");
  if (/pilates/.test(blob) && types.length === 0) types.push("pilates");
  return types;
}

function scoreBusinessQuality(business: Business, types: string[]): {
  score: number;
  positives: string[];
  negatives: string[];
} {
  const positives: string[] = [];
  const negatives: string[] = [];
  let score = 35;

  const domain = business.normalized_domain ?? business.domain;
  const hosted = domain
    ? /canva\.site|wixsite|squarespace|facebook|instagram|linktr/i.test(domain)
    : true;

  if (business.website_url && domain && !hosted) {
    score += 18;
    positives.push("Professioneel eigen domein");
  } else if (business.website_url) {
    score += 5;
    negatives.push("Website op hosted/platform URL");
  } else {
    score -= 20;
    negatives.push("Geen website");
  }

  if (!/permanently_closed|closed_forever/i.test(String(business.google_status ?? ""))) {
    score += 8;
    positives.push("Actief / niet permanent gesloten");
  } else {
    score -= 40;
    negatives.push("Permanent gesloten");
  }

  const rating = Number(business.google_rating ?? business.review_rating ?? 0);
  const reviews = Number(business.google_review_count ?? business.review_count ?? 0);
  if (rating >= 4.5 && reviews >= 10) {
    score += 12;
    positives.push("Sterke reviews + volume");
  } else if (rating >= 4.2 && reviews >= 5) {
    score += 7;
  } else if (reviews < 3) {
    score -= 8;
    negatives.push("Zeer weinig reviews");
  }

  if (types.includes("reformer") || /pilates/.test(String(business.google_category ?? "").toLowerCase())) {
    score += 10;
    positives.push("Duidelijke Pilates-focus");
  }
  if (types.length >= 3) {
    score += 6;
    positives.push("Meerdere diensten/lessen");
  }

  if (business.booking_url || /boek|book/i.test(String(business.website_url ?? ""))) {
    score += 5;
    positives.push("Boekingspad aanwezig");
  }

  if (business.logo || business.google_logo_url) {
    score += 4;
    positives.push("Logo beschikbaar");
  }

  if (business.is_chain) {
    score -= 25;
    negatives.push("Keten-signaal");
  }

  for (const p of pilatesScoringConfig.preferredServiceTypes) {
    if (!types.includes(p) && p === "reformer" && /fitness|sportschool/i.test(String(business.studio_name))) {
      score -= 10;
      negatives.push("Algemeen fitness-achtig zonder Reformer");
    }
  }

  return { score: clamp(score), positives, negatives };
}

function scoreReputation(business: Business): {
  score: number;
  positives: string[];
  negatives: string[];
} {
  const positives: string[] = [];
  const negatives: string[] = [];
  const rating = Number(business.google_rating ?? business.review_rating ?? 0);
  const reviews = Number(business.google_review_count ?? business.review_count ?? 0);

  // Rating quality (0-55) + volume with diminishing returns (0-35) + claimed (10)
  let ratingPart = 0;
  if (rating >= 4.8) ratingPart = 55;
  else if (rating >= 4.5) ratingPart = 48;
  else if (rating >= 4.2) ratingPart = 38;
  else if (rating >= 4.0) ratingPart = 28;
  else if (rating > 0) ratingPart = 15;

  const volumePart = Math.min(35, Math.round(Math.log10(Math.max(reviews, 1) + 1) * 22));
  let claimed = 0;
  if (business.google_claimed) {
    claimed = 10;
    positives.push("Google claimed");
  }

  if (rating >= 4.5) positives.push(`Rating ${rating}`);
  if (reviews >= 10) positives.push(`${reviews} reviews (niet alleen volume-jacht)`);
  if (reviews < 3) negatives.push("Beperkt reviewvolume");
  if (rating > 0 && rating < 4) negatives.push("Lagere rating");

  return { score: clamp(ratingPart + volumePart + claimed), positives, negatives };
}

function scoreServiceFit(types: string[], config: PilatesScoringConfig): {
  score: number;
  positives: string[];
  negatives: string[];
} {
  const positives: string[] = [];
  const negatives: string[] = [];
  let score = 30;
  for (const t of types) {
    const boost = config.serviceBoosts[t] ?? 0;
    if (boost) {
      score += boost;
      positives.push(`Service fit: ${t} (+${boost})`);
    }
  }
  if (types.includes("reformer")) {
    positives.push("Reformer-focus past bij templates");
  } else {
    negatives.push("Geen Reformer-signaal");
    score -= 5;
  }
  if (types.length === 0) {
    score = 25;
    negatives.push("Geen herkenbare diensten");
  }
  return { score: clamp(score), positives, negatives };
}

function scoreBrandFit(business: Business): {
  score: number;
  positives: string[];
  negatives: string[];
} {
  const positives: string[] = [];
  const negatives: string[] = [];
  let score = 35;
  const brand = (business.brand_profile ?? {}) as {
    logo_url?: string | null;
    confidence?: number;
    visual_keywords?: string[];
  };
  const images = Array.isArray(business.images) ? business.images.length : 0;
  const conf = Number(brand.confidence ?? business.template_selection_confidence ?? 0);

  if (brand.logo_url || business.logo || business.google_logo_url) {
    score += 18;
    positives.push("Bruikbaar logo");
  } else {
    negatives.push("Geen logo gevonden");
  }

  if (images >= 4 || business.google_main_image_url) {
    score += 15;
    positives.push("Fotografie beschikbaar");
  } else {
    score -= 5;
    negatives.push("Beperkte fotografie");
  }

  if (conf >= 0.5) {
    score += 12;
    positives.push("Branding intelligence aanwezig");
  }

  if (business.primary_color || brand.confidence) {
    score += 8;
    positives.push("Kleuridentiteit");
  }

  if (/boutique|studio|pilates/i.test(business.studio_name)) {
    score += 5;
    positives.push("Boutique studio-naam");
  }

  return { score: clamp(score), positives, negatives };
}

function scoreContactability(business: Business): {
  score: number;
  positives: string[];
  negatives: string[];
} {
  const positives: string[] = [];
  const negatives: string[] = [];
  let score = 20;
  if (business.website_url) {
    score += 25;
    positives.push("Website");
  } else negatives.push("Geen website");
  if (business.email) {
    score += 20;
    positives.push("E-mail");
  } else negatives.push("Geen e-mail (nog)");
  if (business.phone) {
    score += 15;
    positives.push("Telefoon");
  } else negatives.push("Geen telefoon");
  if (business.instagram_url) {
    score += 12;
    positives.push("Instagram");
  }
  if (business.booking_url) {
    score += 8;
    positives.push("Booking URL");
  }
  return { score: clamp(score), positives, negatives };
}

function scoreCompetitionFit(business: Business): {
  score: number;
  positives: string[];
  negatives: string[];
} {
  const positives: string[] = [];
  const negatives: string[] = [];
  let score = 70;
  if (business.is_chain) {
    score = 15;
    negatives.push("Keten: lagere fit voor boutique outreach");
  } else {
    positives.push("Onafhankelijke studio");
  }
  if (business.lead_eligible === false) {
    score = Math.min(score, 20);
    negatives.push("Niet lead-eligible");
  }
  if (business.qualification_status === "UNQUALIFIED") {
    score = Math.min(score, 25);
  } else if (business.qualification_status === "QUALIFIED") {
    score += 15;
    positives.push("QUALIFIED");
  }
  return { score: clamp(score), positives, negatives };
}

export async function scoreBusinessLead(
  business: Business,
  config: PilatesScoringConfig = pilatesScoringConfig,
  options?: {
    skipWebsiteFetch?: boolean;
    websiteScan?: WebsiteOpportunityResult;
    verticalSlug?: string;
  },
): Promise<ScoreComponents> {
  assertWeightsSum(config.weights);
  const verticalSlug = options?.verticalSlug ?? "pilates";
  const types = serviceTypes(business, verticalSlug);
  const bq = scoreBusinessQuality(business, types);
  const rep = scoreReputation(business);
  const svc = scoreServiceFit(types, config);
  const brand = scoreBrandFit(business);
  const contact = scoreContactability(business);
  const comp = scoreCompetitionFit(business);

  const website =
    options?.websiteScan ??
    (options?.skipWebsiteFetch
      ? {
          website_quality_score: Number(business.website_quality_score ?? 50),
          website_opportunity_score: Number(business.website_opportunity_score ?? 50),
          signals: { positives: [] as string[], negatives: [] as string[] },
          details: {},
        }
      : await scanWebsiteOpportunity(business.website_url, {
          hasProfessionalBrand: Boolean(business.logo || business.google_logo_url),
        }));

  const seoOpportunity = Number(business.seo_opportunity_score ?? 0);
  const seoAnalyzed = business.seo_opportunity_score != null;

  const w = config.weights;
  // If SEO not analyzed yet, redistribute seo weight into website+business provisionally
  const seoWeight = seoAnalyzed ? w.seo_opportunity : 0;
  const provisionalBoost = seoAnalyzed ? 0 : w.seo_opportunity;
  const lead = clamp(
    bq.score * (w.business_quality + provisionalBoost * 0.4) +
      website.website_opportunity_score * (w.website_opportunity + provisionalBoost * 0.6) +
      seoOpportunity * seoWeight +
      rep.score * w.local_reputation +
      svc.score * w.service_fit +
      brand.score * w.brand_fit +
      contact.score * w.contactability +
      comp.score * w.competition_fit
  );

  const explanations = {
    positives: [
      ...bq.positives,
      ...website.signals.positives,
      ...rep.positives,
      ...svc.positives,
      ...brand.positives,
      ...contact.positives,
      ...comp.positives,
    ].slice(0, 12),
    negatives: [
      ...bq.negatives,
      ...website.signals.negatives,
      ...rep.negatives,
      ...svc.negatives,
      ...brand.negatives,
      ...contact.negatives,
      ...comp.negatives,
    ].slice(0, 12),
  };
  if (seoAnalyzed) {
    explanations.positives.unshift(`SEO opportunity ${Math.round(seoOpportunity)}`);
  } else {
    explanations.negatives.push("SEO nog niet geanalyseerd (provisional score)");
  }

  return {
    business_quality_score: bq.score,
    website_quality_score: website.website_quality_score,
    website_opportunity_score: website.website_opportunity_score,
    seo_opportunity_score: seoOpportunity,
    local_reputation_score: rep.score,
    service_fit_score: svc.score,
    brand_fit_score: brand.score,
    contactability_score: contact.score,
    competition_fit_score: comp.score,
    lead_score: lead,
    explanations,
    website_scan: website.details,
  };
}

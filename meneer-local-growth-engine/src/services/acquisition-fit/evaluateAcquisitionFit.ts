import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import type { Business } from "@/types/domain";
import { scoreBusinessLead } from "@/services/scoring/scoreBusiness";
import type { WebsiteOpportunityResult } from "@/services/scoring/websiteOpportunity";
import {
  analyzeWebsiteSignals,
  type WebsiteSignalReport,
} from "@/services/acquisition-fit/websiteSignals";
import { captureBusinessScreenshots } from "@/services/acquisition-fit/screenshotCapture";
import {
  judgeVisualTransformation,
  deterministicVisualAssessment,
  type VisualAssessment,
  type VisualAssessmentSource,
} from "@/services/acquisition-fit/visualTransformationJudge";
import {
  computeTransformationScore,
  type TransformationScoreResult,
} from "@/services/acquisition-fit/transformationScore";
import {
  classifyProspect,
  type ClassificationResult,
} from "@/services/acquisition-fit/classifyProspect";
import { getVerticalRuntime } from "@/verticals/runtime";
import { clinicFocus } from "@/services/discovery/qualifySkinClinics";
import { pilatesFocus } from "@/services/discovery/qualifyPilates";
import type { ProspectType } from "@/verticals/pilates";
import type { BusinessListingItem } from "@/services/discovery/dataforseoBusinessListings";

/**
 * Acquisition fit pipeline for a single business (M8.3).
 *
 * discovery data → deterministic website signals → cheap gates →
 * screenshots → Claude visual judge → transformation score → prospect type →
 * preview eligibility → persist.
 */

export interface AcquisitionFitOptions {
  deterministicOnly?: boolean;
  useCache?: boolean;
  costBudgetRemaining?: number;
  reuseStoredSignals?: boolean;
  verticalSlug?: string;
}

export interface AcquisitionFitResult {
  business_id: string;
  studio_name: string;
  city_name: string;
  prospect_type: ProspectType;
  prospect_type_reason: string;
  transformation_score: number;
  preview_eligible: boolean;
  preview_eligibility_reason: string;
  business_quality: number;
  contactability: number;
  local_reputation: number;
  deterministic_website_quality: number;
  deterministic_website_opportunity: number;
  effective_website_quality: number;
  effective_website_opportunity: number;
  brand_asset_usability: number;
  booking_opportunity: number;
  modernity: number;
  seo_opportunity: number | null;
  visual: VisualAssessment | null;
  visual_source: VisualAssessmentSource | "NONE";
  visual_confidence: number | null;
  visual_model: string | null;
  visual_error: string | null;
  screenshots_captured: number;
  screenshot_error: string | null;
  anthropic_cost: number;
  cache_hit: boolean;
  has_website: boolean;
  website_reachable: boolean;
  components: TransformationScoreResult["components"];
  gates_failed: string[];
  reasons: ClassificationResult["reasons"];
}

interface LoadedContext {
  business: Business;
  verticalSlug: string;
  cityName: string;
  citySlug: string;
  cityLatitude: number | null;
  cityLongitude: number | null;
  cityRadiusKm: number | null;
  cityExonymRadiusKm: number;
  seoOpportunity: number | null;
  suppressed: boolean;
  cityAvailable: boolean;
}

function toOpportunityResult(report: WebsiteSignalReport): WebsiteOpportunityResult {
  return {
    website_quality_score: report.website_quality_score,
    website_opportunity_score: report.website_opportunity_score,
    signals: { positives: report.positives, negatives: report.negatives },
    details: {
      has_website: report.reachable,
      reachable: report.reachable,
      https: report.https,
      viewport: report.technical.viewport,
      title: report.technical.title,
      meta_description: report.technical.meta_description,
      h1: report.technical.h1,
      schema: report.technical.structured_data,
      booking: report.booking.booking_anywhere,
      cta: report.booking.booking_link_in_nav,
      lessons: report.booking.schedule_visible,
      platform: report.platform?.name ?? null,
      platform_era: report.platform?.era ?? null,
      modernity: report.modernity_score,
    },
  };
}

async function loadContext(
  client: ReturnType<typeof createAdminClient>,
  businessId: string
): Promise<LoadedContext | null> {
  const { data: business } = await client
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .maybeSingle();
  if (!business) return null;

  const { data: vertical } = await client
    .from("verticals")
    .select("slug")
    .eq("id", business.vertical_id)
    .maybeSingle();
  const verticalSlug = String(vertical?.slug ?? "pilates");
  const runtime = getVerticalRuntime(verticalSlug);

  const { data: city } = await client
    .from("cities")
    .select("name, slug, latitude, longitude")
    .eq("id", business.city_id)
    .maybeSingle();

  const { data: seo } = await client
    .from("seo_opportunities")
    .select("seo_opportunity_score, analyzed_at")
    .eq("business_id", businessId)
    .maybeSingle();

  const email = (business.email ?? "").toLowerCase();
  let suppressed = false;
  if (email) {
    const { data: suppression } = await client
      .from("email_suppressions")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    suppressed = Boolean(suppression?.id);
  }

  const { data: exclusivity } = await client
    .from("city_exclusivity")
    .select("status, business_id")
    .eq("city_id", business.city_id)
    .eq("vertical_id", business.vertical_id)
    .maybeSingle();

  // A city only blocks another studio when it is genuinely taken. A reservation
  // held by a development campaign is not a commercial commitment, so it must
  // not permanently freeze the city for the redesign campaign.
  let cityAvailable = true;
  if (exclusivity && exclusivity.business_id && exclusivity.business_id !== businessId) {
    const status = String(exclusivity.status);
    if (status === "EXCLUSIVE") {
      cityAvailable = false;
    } else if (status === "RESERVED") {
      const { data: holderCampaign } = await client
        .from("campaigns")
        .select("environment, status")
        .eq("business_id", exclusivity.business_id)
        .eq("status", "ACTIVE")
        .maybeSingle();
      cityAvailable = String(holderCampaign?.environment ?? "DEVELOPMENT") !== "PRODUCTION";
    }
  }

  return {
    business: business as Business,
    verticalSlug,
    cityName: String(city?.name ?? ""),
    citySlug: String(city?.slug ?? ""),
    cityLatitude: city?.latitude != null ? Number(city.latitude) : null,
    cityLongitude: city?.longitude != null ? Number(city.longitude) : null,
    cityRadiusKm: runtime.acquisitionFitConfig.gates.cityRadiusKm,
    cityExonymRadiusKm: runtime.acquisitionFitConfig.gates.cityExonymRadiusKm,
    seoOpportunity:
      business.seo_opportunity_score != null
        ? Number(business.seo_opportunity_score)
        : seo?.seo_opportunity_score != null
          ? Number(seo.seo_opportunity_score)
          : null,
    suppressed,
    cityAvailable,
  };
}

function storedSignals(business: Business): WebsiteSignalReport | null {
  const raw = business.website_signals as unknown;
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<WebsiteSignalReport>;
  if (typeof candidate.website_quality_score !== "number") return null;
  return candidate as WebsiteSignalReport;
}

function cachedVisual(
  business: Business,
  maxAgeDays: number
): { assessment: VisualAssessment; source: VisualAssessmentSource; model: string | null } | null {
  const raw = business.visual_assessment as unknown;
  const assessedAt = business.visual_assessed_at;
  if (!raw || typeof raw !== "object" || !assessedAt) return null;
  const candidate = raw as Partial<VisualAssessment>;
  if (typeof candidate.visual_quality_score !== "number") return null;
  const ageMs = Date.now() - new Date(String(assessedAt)).getTime();
  if (ageMs > maxAgeDays * 24 * 60 * 60 * 1000) return null;
  const source = (business.visual_assessment_source ?? "CLAUDE_VISION") as VisualAssessmentSource;
  if (source !== "CLAUDE_VISION") return null;
  return {
    assessment: candidate as VisualAssessment,
    source,
    model: business.visual_assessment_model ?? null,
  };
}

function isPermanentlyClosed(business: Business): boolean {
  return /permanently_closed|closed_forever/i.test(String(business.google_status ?? ""));
}

function normalizeCityName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

/**
 * Radius-based discovery pulls in studios from neighbouring towns. They stay
 * valuable leads, but they cannot compete for another city's exclusivity slot.
 */
function listingCityMismatch(business: Business, context: LoadedContext): string | null {
  const cityName = context.cityName;
  const listing = business.raw_listing as { address_info?: { city?: string | null } } | null;
  const listingCity = listing?.address_info?.city;

  const lat = business.latitude != null ? Number(business.latitude) : null;
  const lon = business.longitude != null ? Number(business.longitude) : null;
  const distance =
    lat != null && lon != null && context.cityLatitude != null && context.cityLongitude != null
      ? distanceKm(context.cityLatitude, context.cityLongitude, lat, lon)
      : null;

  if (listingCity && cityName) {
    const found = normalizeCityName(listingCity);
    const target = normalizeCityName(cityName);
    if (found && target) {
      if (found === target || found.includes(target) || target.includes(found)) return null;
      // Different name, but on top of the city centre: an exonym, not a suburb.
      const exonymRadius = context.cityExonymRadiusKm;
      if (distance != null && distance <= exonymRadius) return null;
      return listingCity;
    }
  }

  if (distance == null) return null;
  const radius = Math.max(context.cityRadiusKm ?? 10, 10);
  return distance > radius ? `${distance.toFixed(0)} km buiten ${cityName}` : null;
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Same relevance bar as discovery: Pilates has to be a real part of the
 * offering, not one line in a sports centre's amenity list.
 */
function listingFor(business: Business): BusinessListingItem {
  const listing = business.raw_listing as Record<string, unknown> | null;
  if (listing && (listing.title || listing.category)) return listing as BusinessListingItem;
  return {
    title: business.studio_name ?? undefined,
    description: business.description ?? undefined,
    category: business.google_category ?? undefined,
    additional_categories: Array.isArray(business.additional_categories)
      ? (business.additional_categories as string[])
      : undefined,
    domain: business.normalized_domain ?? business.domain ?? undefined,
  } as BusinessListingItem;
}

function isRelevantProvider(
  business: Business,
  runtime: ReturnType<typeof getVerticalRuntime>,
): boolean {
  return runtime.isRelevantListing(listingFor(business), { minFocus: "MEDIUM" });
}

function reviewSummary(business: Business): string {
  const count = Number(business.google_review_count ?? business.review_count ?? 0);
  const rating = business.google_rating ?? business.review_rating;
  if (!count) return "Geen reviewdata beschikbaar";
  return `${count} Google reviews${rating ? ` met gemiddelde ${rating}` : ""}`;
}

export async function evaluateAcquisitionFit(
  businessId: string,
  options: AcquisitionFitOptions = {}
): Promise<AcquisitionFitResult> {
  const client = createAdminClient();
  const context = await loadContext(client, businessId);
  if (!context) throw new Error(`Business ${businessId} niet gevonden`);

  const verticalSlug = options.verticalSlug ?? context.verticalSlug;
  const runtime = getVerticalRuntime(verticalSlug);
  const config = runtime.acquisitionFitConfig;

  const { business } = context;

  // ---------- 1. deterministic website signals ----------
  let signals: WebsiteSignalReport | null = options.reuseStoredSignals
    ? storedSignals(business)
    : null;
  if (!signals) {
    signals = await analyzeWebsiteSignals(business.website_url ?? null, {
      googleLogo: business.google_logo_url ?? business.logo ?? null,
      googleImage: business.google_main_image_url ?? null,
    });
  }

  // ---------- 2. base lead scoring with the improved website read ----------
  const components = await scoreBusinessLead(business, runtime.scoringConfig, {
    websiteScan: toOpportunityResult(signals),
    verticalSlug,
  });

  // ---------- 3. cheap gates before anything expensive ----------
  const cityMismatch = listingCityMismatch(business, context);
  const hardExcluded =
    business.is_demo === true ||
    business.is_chain === true ||
    isPermanentlyClosed(business) ||
    business.lead_status === "DO_NOT_CONTACT" ||
    !isRelevantProvider(business, runtime) ||
    Boolean(cityMismatch);

  const seriousCandidate =
    !hardExcluded &&
    Boolean(business.website_url) &&
    components.business_quality_score >= config.visualJudge.minBusinessQuality &&
    signals.website_opportunity_score >= config.visualJudge.minWebsiteOpportunity &&
    signals.reachable;

  // ---------- 4. screenshots + Claude visual judge ----------
  let visual: VisualAssessment | null = null;
  let visualSource: VisualAssessmentSource | "NONE" = "NONE";
  let visualModel: string | null = null;
  let visualError: string | null = null;
  let anthropicCost = 0;
  let screenshotsCaptured = 0;
  let screenshotError: string | null = null;
  let cacheHit = false;
  let screenshotDesktop = business.screenshot_desktop_url ?? null;
  let screenshotMobile = business.screenshot_mobile_url ?? null;

  if (seriousCandidate && !options.deterministicOnly) {
    const cached = options.useCache !== false
      ? cachedVisual(business, config.visualJudge.cacheMaxAgeDays)
      : null;

    if (cached) {
      visual = cached.assessment;
      visualSource = "CLAUDE_VISION";
      visualModel = cached.model;
      cacheHit = true;
    } else {
      const capture = await captureBusinessScreenshots({
        businessId,
        websiteUrl: business.website_url ?? null,
      });
      screenshotsCaptured = capture.shots.length;
      screenshotError = capture.error;
      for (const shot of capture.shots) {
        if (shot.variant === "desktop" && shot.storage_url) screenshotDesktop = shot.storage_url;
        if (shot.variant === "mobile" && shot.storage_url) screenshotMobile = shot.storage_url;
      }

      const judged = await judgeVisualTransformation(
        {
          businessName: business.studio_name,
          city: context.cityName,
          primaryServices: Array.isArray(business.services)
            ? (business.services as unknown[]).map((s) =>
                typeof s === "string" ? s : String((s as { name?: string })?.name ?? "")
              )
            : [],
          reviewSummary: reviewSummary(business),
          signals,
          screenshots: capture.shots,
        },
        {
          businessQuality: components.business_quality_score,
          costBudgetRemaining:
            options.costBudgetRemaining ?? config.visualJudge.maxCostPerRun,
        }
      );

      visual = judged.assessment;
      visualSource = judged.source;
      visualModel = judged.model;
      visualError = judged.error;
      anthropicCost = judged.cost_usd;
    }
  } else if (!options.deterministicOnly || signals.reachable) {
    // Deterministic stand-in so every evaluated business has visual context.
    visual = deterministicVisualAssessment(signals, components.business_quality_score);
    visualSource = "DETERMINISTIC_FALLBACK";
    visualError = seriousCandidate ? "deterministic_only_mode" : "below_visual_judge_gates";
  }

  const visualIsClaude = visualSource === "CLAUDE_VISION";

  // ---------- 5. transformation score ----------
  const scoreResult = computeTransformationScore({
    website_opportunity: signals.website_opportunity_score,
    website_quality: signals.website_quality_score,
    business_quality: components.business_quality_score,
    brand_asset_usability: signals.brand_asset_usability_score,
    booking_opportunity: signals.booking_opportunity_score,
    seo_opportunity: context.seoOpportunity,
    service_fit: components.service_fit_score,
    local_reputation: components.local_reputation_score,
    visual,
    visual_is_claude: visualIsClaude,
  });

  // ---------- 6. classification ----------
  const classification = classifyProspect({
    is_demo: business.is_demo === true,
    is_chain: business.is_chain === true,
    permanently_closed: isPermanentlyClosed(business),
    do_not_contact: business.lead_status === "DO_NOT_CONTACT",
    suppressed: context.suppressed,
    lead_eligible: business.lead_eligible !== false,
    qualification_status: String(business.qualification_status ?? "UNQUALIFIED"),
    relevant_provider: isRelevantProvider(business, runtime),
    pilates_focus:
      verticalSlug === "skin-clinics"
        ? clinicFocus(listingFor(business))
        : pilatesFocus(listingFor(business)),
    has_website: Boolean(business.website_url),
    city_available: context.cityAvailable,
    city_mismatch: cityMismatch,
    business_quality: components.business_quality_score,
    local_reputation: components.local_reputation_score,
    review_count: Number(business.google_review_count ?? business.review_count ?? 0),
    contactability: components.contactability_score,
    brand_asset_usability: signals.brand_asset_usability_score,
    seo_opportunity: context.seoOpportunity,
    effective_website_quality: scoreResult.effective_website_quality,
    effective_website_opportunity: scoreResult.effective_website_opportunity,
    transformation_score: scoreResult.score,
    visual,
    visual_is_claude: visualIsClaude,
  });

  // ---------- 7. persist ----------
  const nowIso = new Date().toISOString();
  await client
    .from("businesses")
    .update({
      prospect_type: classification.prospect_type,
      prospect_type_reason: classification.prospect_type_reason,
      website_transformation_score: scoreResult.score,
      transformation_components: {
        components: scoreResult.components,
        weights_used: scoreResult.weights_used,
        visual_included: scoreResult.visual_included,
        missing_inputs: scoreResult.missing_inputs,
        effective_website_quality: scoreResult.effective_website_quality,
        effective_website_opportunity: scoreResult.effective_website_opportunity,
        deterministic_website_quality: signals.website_quality_score,
        deterministic_website_opportunity: signals.website_opportunity_score,
        business_quality: components.business_quality_score,
        contactability: components.contactability_score,
        local_reputation: components.local_reputation_score,
        service_fit: components.service_fit_score,
        seo_opportunity: context.seoOpportunity,
        gates_failed: classification.gates_failed,
        gates_snapshot: classification.gates_snapshot,
        reasons: classification.reasons,
      },
      preview_eligible: classification.preview_eligible,
      preview_eligibility_reason: classification.preview_eligibility_reason,
      acquisition_fit_updated_at: nowIso,
      acquisition_fit_version: config.version,
      brand_asset_usability_score: signals.brand_asset_usability_score,
      booking_opportunity_score: signals.booking_opportunity_score,
      website_modernity_score: signals.modernity_score,
      website_signals: signals as unknown as Record<string, unknown>,
      website_quality_score: signals.website_quality_score,
      website_opportunity_score: signals.website_opportunity_score,
      visual_quality_score: visual?.visual_quality_score ?? null,
      visual_modernity_score: visual?.modernity_score ?? null,
      visual_mobile_score: visual?.mobile_presentation_score ?? null,
      brand_potential_score: visual?.brand_potential_score ?? null,
      visual_booking_ux_score: visual?.booking_ux_score ?? null,
      business_presentation_gap_score: visual?.business_presentation_gap_score ?? null,
      redesign_impact_score: visual?.redesign_impact_score ?? null,
      visual_transformation_fit: visual?.visual_transformation_fit ?? null,
      visual_assessment: visual ? { ...visual, error: visualError } : {},
      visual_assessment_confidence: visual?.confidence ?? null,
      visual_assessment_model: visualModel,
      visual_assessment_source: visualSource === "NONE" ? null : visualSource,
      visual_assessment_cost: anthropicCost,
      visual_assessed_at: visual ? nowIso : null,
      screenshot_desktop_url: screenshotDesktop,
      screenshot_mobile_url: screenshotMobile,
      screenshot_metadata: {
        captured: screenshotsCaptured,
        error: screenshotError,
        cache_hit: cacheHit,
      },
      screenshots_captured_at: screenshotsCaptured ? nowIso : business.screenshots_captured_at,
      last_activity_at: nowIso,
    })
    .eq("id", businessId);

  await writeActivity(client, {
    business_id: businessId,
    activity_type: "ACQUISITION_FIT_EVALUATED",
    title: `Acquisition fit: ${classification.prospect_type}`,
    description: `Transformation score ${scoreResult.score} · ${classification.prospect_type_reason}`.slice(
      0,
      400
    ),
    metadata: {
      prospect_type: classification.prospect_type,
      transformation_score: scoreResult.score,
      preview_eligible: classification.preview_eligible,
      visual_source: visualSource,
      anthropic_cost: anthropicCost,
    },
  });

  return {
    business_id: businessId,
    studio_name: business.studio_name,
    city_name: context.cityName,
    prospect_type: classification.prospect_type,
    prospect_type_reason: classification.prospect_type_reason,
    transformation_score: scoreResult.score,
    preview_eligible: classification.preview_eligible,
    preview_eligibility_reason: classification.preview_eligibility_reason,
    business_quality: components.business_quality_score,
    contactability: components.contactability_score,
    local_reputation: components.local_reputation_score,
    deterministic_website_quality: signals.website_quality_score,
    deterministic_website_opportunity: signals.website_opportunity_score,
    effective_website_quality: scoreResult.effective_website_quality,
    effective_website_opportunity: scoreResult.effective_website_opportunity,
    brand_asset_usability: signals.brand_asset_usability_score,
    booking_opportunity: signals.booking_opportunity_score,
    modernity: signals.modernity_score,
    seo_opportunity: context.seoOpportunity,
    visual,
    visual_source: visualSource,
    visual_confidence: visual?.confidence ?? null,
    visual_model: visualModel,
    visual_error: visualError,
    screenshots_captured: screenshotsCaptured,
    screenshot_error: screenshotError,
    anthropic_cost: anthropicCost,
    cache_hit: cacheHit,
    has_website: Boolean(business.website_url),
    website_reachable: signals.reachable,
    components: scoreResult.components,
    gates_failed: classification.gates_failed,
    reasons: classification.reasons,
  };
}

import {
  pilatesAcquisitionFitConfig,
  type ProspectType,
  type TransformationGates,
} from "@/verticals/pilates";
import type { VisualAssessment } from "@/services/acquisition-fit/visualTransformationJudge";

/**
 * Prospect classification + preview eligibility (M8.3).
 *
 * Pure function: every database-derived fact arrives as an explicit input so
 * the decision path can be unit-tested and replayed.
 */

export interface ClassificationInput {
  /** Hard exclusions */
  is_demo: boolean;
  is_chain: boolean;
  permanently_closed: boolean;
  do_not_contact: boolean;
  suppressed: boolean;
  lead_eligible: boolean;
  qualification_status: string;
  relevant_provider: boolean;
  /** How central Pilates is to the listing: only STRONG earns an auto preview. */
  pilates_focus: "STRONG" | "MEDIUM" | "WEAK" | "NONE";
  has_website: boolean;
  city_available: boolean;
  /** Set when Google places this studio in another town than the city record. */
  city_mismatch: string | null;

  /** Scores */
  business_quality: number;
  local_reputation: number;
  review_count: number;
  contactability: number;
  brand_asset_usability: number;
  seo_opportunity: number | null;
  effective_website_quality: number;
  effective_website_opportunity: number;
  transformation_score: number;
  visual: VisualAssessment | null;
  visual_is_claude: boolean;
}

export interface ClassificationResult {
  prospect_type: ProspectType;
  prospect_type_reason: string;
  reasons: { positives: string[]; negatives: string[] };
  gates_failed: string[];
  preview_eligible: boolean;
  preview_eligibility_reason: string;
  gates_snapshot: TransformationGates;
}

function pct(value: number): string {
  return String(Math.round(value));
}

export function classifyProspect(
  input: ClassificationInput,
  gates: TransformationGates = pilatesAcquisitionFitConfig.gates
): ClassificationResult {
  const positives: string[] = [];
  const negatives: string[] = [];
  const gatesFailed: string[] = [];

  const notEligibleReasons: string[] = [];
  if (input.is_demo) notEligibleReasons.push("demo-record");
  if (input.permanently_closed) notEligibleReasons.push("permanent gesloten");
  if (input.is_chain) notEligibleReasons.push("keten");
  if (input.do_not_contact) notEligibleReasons.push("do not contact");
  if (input.suppressed) notEligibleReasons.push("op suppressielijst");
  if (!input.relevant_provider) notEligibleReasons.push("geen relevante Pilates-aanbieder");
  if (input.city_mismatch) {
    notEligibleReasons.push(`gevestigd in ${input.city_mismatch}, buiten deze stad`);
  }
  if (!input.lead_eligible && input.qualification_status === "UNQUALIFIED") {
    notEligibleReasons.push("uitgesloten bij kwalificatie");
  }

  if (notEligibleReasons.length) {
    // When location is the only blocker the business itself is still readable,
    // so we keep the verdict it would have earned in its own city.
    let shadow = "";
    if (input.city_mismatch && notEligibleReasons.length === 1) {
      const own = classifyProspect({ ...input, city_mismatch: null }, gates);
      shadow = ` In de eigen stad zou dit ${own.prospect_type} zijn: ${own.prospect_type_reason}`;
    }
    return {
      prospect_type: "NOT_ELIGIBLE",
      prospect_type_reason: `Niet geschikt: ${notEligibleReasons.join(", ")}.${shadow}`,
      reasons: { positives, negatives: notEligibleReasons },
      gates_failed: ["not_eligible"],
      preview_eligible: false,
      preview_eligibility_reason: `Geen preview: ${notEligibleReasons.join(", ")}.`,
      gates_snapshot: gates,
    };
  }

  // --- weak business: commercial substance comes before website opportunity
  const weakReasons: string[] = [];
  if (input.business_quality < gates.weakMaxBusinessQuality) {
    weakReasons.push(
      `business quality ${pct(input.business_quality)} onder ${gates.weakMaxBusinessQuality}`
    );
  }
  if (input.local_reputation < gates.weakMinLocalReputation) {
    weakReasons.push(
      `lokale reputatie ${pct(input.local_reputation)} onder ${gates.weakMinLocalReputation}`
    );
  }
  if (input.review_count < gates.weakMinReviewCount) {
    weakReasons.push(`${input.review_count} reviews, te weinig commercieel signaal`);
  }

  if (weakReasons.length) {
    return {
      prospect_type: "WEAK_BUSINESS",
      prospect_type_reason: `Bedrijf te zwak voor onze propositie: ${weakReasons.join(", ")}.`,
      reasons: { positives, negatives: weakReasons },
      gates_failed: ["weak_business"],
      preview_eligible: false,
      preview_eligibility_reason:
        "Geen preview: het bedrijf zelf levert onvoldoende commerciële basis.",
      gates_snapshot: gates,
    };
  }

  positives.push(`Business quality ${pct(input.business_quality)}`);
  if (input.review_count > 0) {
    positives.push(`${input.review_count} Google reviews`);
  }

  // --- website transformation gates
  if (input.business_quality < gates.minBusinessQuality) {
    gatesFailed.push("business_quality_below_min");
    negatives.push(
      `Business quality ${pct(input.business_quality)} onder drempel ${gates.minBusinessQuality}`
    );
  }

  if (input.effective_website_opportunity < gates.minWebsiteOpportunity) {
    gatesFailed.push("website_opportunity_below_min");
    negatives.push(
      `Website opportunity ${pct(input.effective_website_opportunity)} onder drempel ${gates.minWebsiteOpportunity}`
    );
  } else {
    positives.push(`Website opportunity ${pct(input.effective_website_opportunity)}`);
  }

  const websiteTooGood =
    input.effective_website_quality > gates.maxWebsiteQuality &&
    input.effective_website_opportunity < gates.websiteTooGoodOpportunityCeiling;
  if (websiteTooGood) {
    gatesFailed.push("website_too_good");
    negatives.push(
      `Huidige website (${pct(input.effective_website_quality)}) zit boven de redesign-drempel ${gates.maxWebsiteQuality}`
    );
  }

  if (input.brand_asset_usability < gates.minBrandUsability) {
    gatesFailed.push("brand_usability_below_min");
    negatives.push(
      `Bruikbaar merkmateriaal ${pct(input.brand_asset_usability)} onder ${gates.minBrandUsability}`
    );
  } else {
    positives.push(`Bruikbaar merkmateriaal ${pct(input.brand_asset_usability)}`);
  }

  if (input.contactability < gates.minContactability) {
    gatesFailed.push("contactability_below_min");
    negatives.push(
      `Contacteerbaarheid ${pct(input.contactability)} onder ${gates.minContactability}`
    );
  }

  if (input.visual && input.visual_is_claude) {
    positives.push(
      `Visuele beoordeling: fit ${input.visual.visual_transformation_fit}, redesign impact ${pct(input.visual.redesign_impact_score)}`
    );
    for (const reason of input.visual.reason_negative.slice(0, 3)) negatives.push(reason);
  }

  if (!gatesFailed.length) {
    const reason = [
      "Sterk bedrijf met een website die duidelijk beter kan.",
      `Business quality ${pct(input.business_quality)}`,
      `website kwaliteit ${pct(input.effective_website_quality)}`,
      `website opportunity ${pct(input.effective_website_opportunity)}`,
      `merkmateriaal ${pct(input.brand_asset_usability)}`,
      `transformation score ${pct(input.transformation_score)}`,
    ].join(" · ");

    const previewBlockers: string[] = [];
    if (input.transformation_score < gates.previewMinTransformationScore) {
      previewBlockers.push(
        `transformation score ${pct(input.transformation_score)} onder ${gates.previewMinTransformationScore}`
      );
    }
    if (input.brand_asset_usability < gates.previewMinBrandUsability) {
      previewBlockers.push("te weinig bruikbaar beeldmateriaal voor een geloofwaardige preview");
    }
    const visualConfidence = input.visual?.confidence ?? 0;
    if (visualConfidence < gates.previewMinVisualConfidence) {
      previewBlockers.push(
        `beoordelingsvertrouwen ${pct(visualConfidence)} onder ${gates.previewMinVisualConfidence}`
      );
    }
    if (!input.has_website) {
      previewBlockers.push("geen bestaande website om uit te lezen");
    }
    if (!input.city_available) {
      previewBlockers.push("stad is al vergeven of gereserveerd");
    }
    if (input.pilates_focus !== "STRONG") {
      previewBlockers.push(
        "presenteert zich niet primair als Pilates-studio, dus een Pilates-preview past nog niet"
      );
    }

    return {
      prospect_type: "WEBSITE_TRANSFORMATION",
      prospect_type_reason: reason,
      reasons: { positives, negatives },
      gates_failed: [],
      preview_eligible: previewBlockers.length === 0,
      preview_eligibility_reason: previewBlockers.length
        ? `Nog geen preview: ${previewBlockers.join(", ")}.`
        : "Voldoet aan alle voorwaarden voor een persoonlijke website-preview.",
      gates_snapshot: gates,
    };
  }

  // --- growth only: the business holds up, the website is simply not the lever
  const growthQualified = input.business_quality >= gates.growthMinBusinessQuality;

  if (growthQualified) {
    const seoPart =
      input.seo_opportunity != null
        ? ` SEO opportunity ${pct(input.seo_opportunity)} blijft commercieel interessant.`
        : "";
    const lead = websiteTooGood
      ? `Sterk bedrijf, maar de huidige website (kwaliteit ${pct(input.effective_website_quality)}) zit boven de drempel voor onze redesign-campagne.`
      : `Sterk bedrijf, maar een redesign is nu niet de duidelijkste hefboom (website opportunity ${pct(input.effective_website_opportunity)}).`;
    return {
      prospect_type: "GROWTH_ONLY",
      prospect_type_reason: `${lead}${seoPart}`,
      reasons: { positives, negatives },
      gates_failed: gatesFailed,
      preview_eligible: false,
      preview_eligibility_reason:
        "Geen redesign-preview: de website is al sterk genoeg. Groei zit hier in SEO en advertenties.",
      gates_snapshot: gates,
    };
  }

  return {
    prospect_type: "WEAK_BUSINESS",
    prospect_type_reason: `Voldoet niet aan de transformation-gates en te weinig groeipotentieel: ${gatesFailed.join(", ")}.`,
    reasons: { positives, negatives },
    gates_failed: gatesFailed,
    preview_eligible: false,
    preview_eligibility_reason: "Geen preview: valt buiten beide acquisitiegroepen.",
    gates_snapshot: gates,
  };
}

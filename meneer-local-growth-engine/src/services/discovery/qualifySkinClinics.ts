import type { BusinessListingItem } from "@/services/discovery/dataforseoBusinessListings";
import { skinClinicsVertical } from "@/verticals/skin-clinics";
import { normalizeDomain } from "@/lib/utils/normalize";
import type { QualificationStatus } from "@/types/domain";

export interface QualificationResult {
  score: number;
  status: QualificationStatus;
  evidence: {
    positives: string[];
    negatives: string[];
    is_chain_suspect: boolean;
    chain_name: string | null;
  };
  lead_eligible: boolean;
  excluded: boolean;
}

export type ClinicFocus = "STRONG" | "MEDIUM" | "WEAK" | "NONE";

const FOCUS_ORDER: ClinicFocus[] = ["NONE", "WEAK", "MEDIUM", "STRONG"];

const CLINIC_SIGNAL =
  /huidkliniek|skin\s*clinic|cosmetisch|aesthetic|medisch\s*esthet|laser\s*kliniek|beauty\s*clinic|derma\s*clinic|huid\s*instituut|huid\s*centrum/i;

const TREATMENT_SIGNAL =
  /botox|filler|laserbehandeling|hydrafacial|microneedling|peeling|huidanalyse|ipl|rf\s*behandeling|mesotherapie|profhilo|sculptra/i;

const OTHER_TRADE =
  /tandarts|fysio|fysiotherapie|huisarts|ziekenhuis|kapper|nagelstudio|tattoo|opticien|apotheek|sportschool|crossfit|pilates\s*studio/i;

const PURE_BEAUTY =
  /nagelstudio|nail\s*bar|wimperextensions|brow\s*bar|only\s*nails/i;

function textBlob(item: BusinessListingItem): string {
  return [
    item.title,
    item.description,
    item.category,
    ...(item.additional_categories ?? []),
    item.domain,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function clinicFocus(item: BusinessListingItem): ClinicFocus {
  const title = (item.title ?? "").toLowerCase();
  const categories = [item.category ?? "", ...(item.additional_categories ?? [])]
    .join(" ")
    .toLowerCase();
  const domain = (item.domain ?? "").toLowerCase();
  const blob = textBlob(item);

  if (PURE_BEAUTY.test(blob) && !CLINIC_SIGNAL.test(blob) && !TREATMENT_SIGNAL.test(blob)) {
    return "NONE";
  }
  if (!CLINIC_SIGNAL.test(blob) && !TREATMENT_SIGNAL.test(blob)) return "NONE";

  const inTitle = CLINIC_SIGNAL.test(title) || TREATMENT_SIGNAL.test(title);
  const inDomain = CLINIC_SIGNAL.test(domain);
  const isPrimaryCategory = /skin_care|medical_spa|cosmet/.test(categories);
  const competing = OTHER_TRADE.test(blob);

  if ((inTitle || inDomain || isPrimaryCategory) && !competing) return "STRONG";
  if (inTitle || inDomain || isPrimaryCategory) return "MEDIUM";
  if (TREATMENT_SIGNAL.test(blob)) return competing ? "WEAK" : "MEDIUM";
  return "WEAK";
}

export function isRelevantSkinClinicListing(
  item: BusinessListingItem,
  options: { minFocus?: ClinicFocus } = {},
): boolean {
  const minimum = options.minFocus ?? "MEDIUM";
  return FOCUS_ORDER.indexOf(clinicFocus(item)) >= FOCUS_ORDER.indexOf(minimum);
}

export function qualifySkinClinicListing(item: BusinessListingItem): QualificationResult {
  const positives: string[] = [];
  const negatives: string[] = [];
  let score = 38;

  const blob = textBlob(item);
  const domain = normalizeDomain(item.domain ?? item.url);
  const status =
    item.current_status ??
    item.work_time?.work_hours?.current_status ??
    null;
  const votes = item.rating?.votes_count ?? 0;
  const rating = item.rating?.value ?? 0;

  const focus = clinicFocus(item);
  const hasClinicSignal = focus !== "NONE";

  if (focus === "STRONG") {
    score += 24;
    positives.push("Duidelijke huidkliniek/cosmetische focus");
  } else if (focus === "MEDIUM") {
    score += 16;
    positives.push("Relevante kliniek- of behandelingssignalen");
  } else if (focus === "WEAK") {
    score += 6;
    positives.push("Beperkte clinic-signalen (brede listing)");
  } else {
    score -= 28;
    negatives.push("Geen duidelijke huidkliniek-focus");
  }

  if (TREATMENT_SIGNAL.test(blob)) {
    score += 8;
    positives.push("Concrete behandelingen in listing");
  }

  if (domain) {
    const hosted =
      /canva\.site$|facebook\.com$|instagram\.com$|linktr\.ee$|bit\.ly$|wixsite\.com$|squarespace\.com$|googleusercontent\.com$|treatwell\./i.test(
        domain,
      );
    if (hosted) {
      score -= 8;
      negatives.push(`Platform/booking URL i.p.v. eigen kliniek-domein: ${domain}`);
    } else {
      score += 14;
      positives.push(`Eigen domein: ${domain}`);
    }
  } else {
    score -= 14;
    negatives.push("Geen bruikbare website/domein");
  }

  if (status === "closed_forever" || status === "permanently_closed") {
    score -= 50;
    negatives.push("Permanently closed");
  } else if (status === "temporarily_closed") {
    score -= 10;
    negatives.push("Temporarily closed");
  } else if (status === "open" || status === "close") {
    score += 5;
    positives.push(`Status: ${status}`);
  }

  if (votes >= 15) {
    score += 12;
    positives.push(`${votes} reviews`);
  } else if (votes >= 5) {
    score += 7;
    positives.push(`${votes} reviews`);
  } else if (votes === 0) {
    score -= 4;
    negatives.push("Geen reviews");
  }

  if (rating >= 4.4 && votes >= 5) {
    score += 6;
    positives.push(`Hoge rating ${rating}`);
  }

  if (item.is_claimed) {
    score += 3;
    positives.push("Google claimed");
  }

  for (const pattern of skinClinicsVertical.negativeNamePatterns) {
    if (pattern.test(blob)) {
      score -= 22;
      negatives.push(`Negatief patroon: ${pattern.source}`);
    }
  }

  let isChainSuspect = false;
  let chainName: string | null = null;
  for (const hint of skinClinicsVertical.chainDomainHints) {
    if (domain && (domain === hint || domain.endsWith(`.${hint}`))) {
      isChainSuspect = true;
      chainName = hint;
      score -= 18;
      negatives.push(`Keten/franchise-domein: ${hint}`);
    }
  }

  if (/treatwell|booking\.com|fresha/i.test(blob)) {
    score -= 6;
    negatives.push("Sterk afhankelijk van booking-platform in listing");
  }

  score = Math.max(0, Math.min(100, score));

  let statusQ: QualificationStatus = "UNQUALIFIED";
  if (score >= 68) statusQ = "QUALIFIED";
  else if (score >= 48) statusQ = "POTENTIAL";

  const excluded =
    negatives.some((n) => n.includes("Permanently closed")) ||
    (!hasClinicSignal && score < 42) ||
    (PURE_BEAUTY.test(blob) && !hasClinicSignal) ||
    (isChainSuspect && score < 52);

  return {
    score,
    status: excluded ? "UNQUALIFIED" : statusQ,
    evidence: {
      positives,
      negatives,
      is_chain_suspect: isChainSuspect,
      chain_name: chainName,
    },
    lead_eligible: !excluded && !isChainSuspect && statusQ !== "UNQUALIFIED",
    excluded,
  };
}

import type { BusinessListingItem } from "@/services/discovery/dataforseoBusinessListings";
import { pilatesVertical } from "@/verticals/pilates";
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

export function qualifyPilatesListing(item: BusinessListingItem): QualificationResult {
  const positives: string[] = [];
  const negatives: string[] = [];
  let score = 40;

  const blob = textBlob(item);
  const domain = normalizeDomain(item.domain ?? item.url);
  const status =
    item.current_status ??
    item.work_time?.work_hours?.current_status ??
    null;
  const votes = item.rating?.votes_count ?? 0;
  const rating = item.rating?.value ?? 0;

  const hasPilatesWord = /pilates|reformer/.test(blob);
  if (hasPilatesWord) {
    score += 20;
    positives.push("Pilates/reformer in naam of categorie");
  } else {
    score -= 25;
    negatives.push("Geen duidelijke Pilates-focus in listing");
  }

  if (domain) {
    const hosted =
      /canva\.site$|facebook\.com$|instagram\.com$|linktr\.ee$|bit\.ly$|wixsite\.com$|squarespace\.com$|googleusercontent\.com$/i.test(
        domain
      );
    if (hosted) {
      score -= 10;
      negatives.push(`Hosted/platform URL i.p.v. eigen studio-domein: ${domain}`);
    } else {
      score += 15;
      positives.push(`Eigen domein: ${domain}`);
    }
  } else {
    score -= 15;
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

  if (votes >= 10) {
    score += 10;
    positives.push(`${votes} reviews`);
  } else if (votes >= 3) {
    score += 5;
    positives.push(`${votes} reviews`);
  } else if (votes === 0) {
    score -= 5;
    negatives.push("Geen reviews");
  }

  if (rating >= 4.5 && votes >= 5) {
    score += 5;
    positives.push(`Hoge rating ${rating}`);
  }

  if (item.is_claimed) {
    score += 3;
    positives.push("Google claimed");
  }

  for (const pattern of pilatesVertical.negativeNamePatterns) {
    if (pattern.test(blob)) {
      score -= 20;
      negatives.push(`Negatief patroon: ${pattern.source}`);
    }
  }

  let isChainSuspect = false;
  let chainName: string | null = null;
  for (const hint of pilatesVertical.chainDomainHints) {
    if (domain && (domain === hint || domain.endsWith(`.${hint}`))) {
      isChainSuspect = true;
      chainName = hint;
      score -= 25;
      negatives.push(`Keten-domein: ${hint}`);
    }
  }

  if (/basic.?fit|trainmore|anytime fitness|fit for free/i.test(blob)) {
    isChainSuspect = true;
    chainName = chainName ?? "fitness_chain";
    score -= 20;
    negatives.push("Fitnessketen-signaal in naam");
  }

  score = Math.max(0, Math.min(100, score));

  let statusQ: QualificationStatus = "UNQUALIFIED";
  if (score >= 70) statusQ = "QUALIFIED";
  else if (score >= 50) statusQ = "POTENTIAL";

  const excluded =
    negatives.some((n) => n.includes("Permanently closed")) ||
    (!hasPilatesWord && score < 45) ||
    (isChainSuspect && score < 55);

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

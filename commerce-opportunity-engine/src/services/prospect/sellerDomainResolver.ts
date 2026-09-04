/**
 * Milestone 9.3.2 — resolving shopping sellers to domains.
 *
 * Google Shopping items often carry only a seller name ("Kok Bedden"), and
 * those sellers are disproportionately the small specialists we are looking
 * for. Dropping them means measuring our parser instead of the market.
 *
 * The resolver builds candidate domains from the seller name and verifies each
 * one with a single HTTP fetch. A candidate only counts when the live page
 * actually identifies itself as that seller, so no guessed domain ever enters
 * the pipeline unverified. Costs nothing at DataForSEO.
 */

import { crawlWebsite } from "../crawler/websiteCrawler.js";
import { extractPageSignals } from "../crawler/pageExtractor.js";
import { inferDomainFromSeller } from "../../utils/shoppingDomainInference.js";

export interface SellerDomainResolution {
  seller: string;
  domain: string | null;
  method: "seller_text" | "probe_verified" | "probe_host_match" | null;
  candidatesTried: string[];
  rejectedReason: string | null;
}

/** Words that describe the shop, not its name. */
const NOISE_TOKENS = new Set([
  "nl",
  "be",
  "com",
  "eu",
  "nederland",
  "netherlands",
  "belgie",
  "belgië",
  "official",
  "officiele",
  "officiële",
  "store",
  "shop",
  "webshop",
  "webwinkel",
  "online",
  "bv",
  "b.v.",
  "vof",
  "the",
]);

const TLD_ORDER = ["nl", "com", "be", "eu"] as const;

function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function sellerTokens(seller: string): string[] {
  return stripDiacritics(seller.toLowerCase())
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0 && !NOISE_TOKENS.has(token));
}

export interface SellerDomainCandidate {
  domain: string;
  /** Tokens this candidate was built from, used to confirm the live page. */
  stemTokens: string[];
}

export function buildSellerDomainCandidates(seller: string): SellerDomainCandidate[] {
  const tokens = sellerTokens(seller);
  if (tokens.length === 0) return [];

  const stems: string[][] = [tokens];
  // A distinctive first word is worth one shot: "Quirumed Fournitures
  // Médicales" trades as quirumed.
  if (tokens.length > 1 && tokens[0].length >= 6) stems.push([tokens[0]]);

  const candidates: SellerDomainCandidate[] = [];
  const seen = new Set<string>();

  for (const stemTokens of stems) {
    const forms = [stemTokens.join("")];
    if (stemTokens.length > 1) forms.push(stemTokens.join("-"));

    for (const form of forms) {
      if (form.length < 3) continue;
      for (const tld of TLD_ORDER) {
        const domain = `${form}.${tld}`;
        if (seen.has(domain)) continue;
        seen.add(domain);
        candidates.push({ domain, stemTokens });
      }
    }
  }

  return candidates;
}

/** Pages that exist to sell the domain itself, never a real shop. */
const PARKED_PATTERNS = [
  "domain is for sale",
  "this domain is for sale",
  "domein te koop",
  "buy this domain",
  "koop dit domein",
  "parkeerpagina",
  "sedoparking",
  "godaddy.com/domainsearch",
  "under construction",
  "in aanbouw",
  "coming soon",
];

/** Interstitials that hide the real page behind a bot check. */
const CHALLENGE_PATTERNS = [
  "checking if you're human",
  "checking your browser",
  "just a moment",
  "security check",
  "verify you are human",
  "human verification",
  "enable javascript and cookies",
  "captcha",
  "anubis",
  "attention required",
];

/** The registrable label, so "kokbedden.nl" reduces to "kokbedden". */
function hostStem(finalHost: string): string {
  const parts = finalHost.split(".");
  const label = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
  return label.replace(/[^a-z0-9]/g, "");
}

type SellerConfirmation = "content" | "host_only" | "rejected";

/**
 * The live page must name itself as the seller we probed for. Without this a
 * parked domain or a squatter would pass as a prospect.
 *
 * Small Dutch webshops increasingly sit behind bot challenges, which strips the
 * page of every brand signal. In that case an exact hostname match on a
 * distinctive seller name is the strongest evidence available, so it counts as
 * a weaker confirmation instead of a rejection.
 */
function confirmSeller(
  stemTokens: string[],
  title: string | null,
  bodyTextSample: string,
  finalHost: string
): SellerConfirmation {
  if (stemTokens.length === 0) return "rejected";

  const compact = stemTokens.join("");
  const spaced = stemTokens.join(" ");
  const haystack = stripDiacritics(`${title ?? ""} ${bodyTextSample}`.toLowerCase());

  // The probe must not have redirected somewhere unrelated.
  if (!finalHost.replace(/[^a-z0-9]/g, "").includes(compact)) return "rejected";
  if (PARKED_PATTERNS.some((pattern) => haystack.includes(pattern))) return "rejected";

  if (haystack.includes(compact) || haystack.includes(spaced)) return "content";

  const distinctive = compact.length >= 8 || stemTokens.length > 1;
  const challenged = CHALLENGE_PATTERNS.some((pattern) => haystack.includes(pattern));
  if (distinctive && hostStem(finalHost) === compact && challenged) return "host_only";

  return "rejected";
}

export async function resolveSellerDomain(
  seller: string,
  options: { timeoutMs: number; cache?: Map<string, SellerDomainResolution> }
): Promise<SellerDomainResolution> {
  const cached = options.cache?.get(seller.toLowerCase());
  if (cached) return cached;

  const result: SellerDomainResolution = {
    seller,
    domain: null,
    method: null,
    candidatesTried: [],
    rejectedReason: null,
  };

  const direct = inferDomainFromSeller(seller);
  if (direct) {
    result.domain = direct;
    result.method = "seller_text";
    options.cache?.set(seller.toLowerCase(), result);
    return result;
  }

  for (const candidate of buildSellerDomainCandidates(seller)) {
    result.candidatesTried.push(candidate.domain);
    let crawl;
    try {
      crawl = await crawlWebsite(`https://${candidate.domain}`, options.timeoutMs);
    } catch {
      continue;
    }
    if (crawl.status !== "success") continue;

    let finalHost: string;
    try {
      finalHost = new URL(crawl.finalUrl).hostname.toLowerCase().replace(/^www\./, "");
    } catch {
      continue;
    }

    const signals = extractPageSignals(crawl.html, crawl.finalUrl);
    const confirmation = confirmSeller(
      candidate.stemTokens,
      signals.title,
      signals.bodyTextSample,
      finalHost
    );
    if (confirmation === "rejected") {
      result.rejectedReason = `${candidate.domain} bevestigt de verkopersnaam niet`;
      continue;
    }

    result.domain = finalHost;
    result.method = confirmation === "content" ? "probe_verified" : "probe_host_match";
    result.rejectedReason = null;
    break;
  }

  if (!result.domain && !result.rejectedReason) {
    result.rejectedReason = "geen kandidaat-domein bereikbaar";
  }

  options.cache?.set(seller.toLowerCase(), result);
  return result;
}

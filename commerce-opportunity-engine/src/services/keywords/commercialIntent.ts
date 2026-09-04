import { normalizeKeyword } from "./normalizeKeyword.js";

const POSITIVE_PHRASES = [
  "kopen",
  "bestellen",
  "shop",
  "webshop",
  "prijs",
  "aanbieding",
  "korting",
  "goedkoop",
  "beste",
  "vergelijken",
  "review kopen",
  "online kopen",
] as const;

const NEGATIVE_PHRASES = [
  "wat is",
  "hoe werkt",
  "zelf maken",
  "betekenis",
  "wiki",
  "vacature",
  "opleiding",
  "cursus",
  "gratis download",
  "handleiding",
  "repareren",
  "waarom",
  "symptomen",
  "oorzaak",
] as const;

const PRODUCTISH_TOKENS = new Set([
  "masker",
  "serum",
  "creme",
  "crème",
  "gel",
  "olie",
  "shampoo",
  "reiniger",
  "apparaat",
  "device",
  "matras",
  "kussen",
  "topper",
  "deken",
  "mand",
  "bed",
  "tuig",
  "fontein",
  "voerbak",
  "patch",
  "patches",
  "lamp",
  "therapie",
]);

export interface CommercialIntentResult {
  score: number;
  reasons: string[];
}

export function scoreCommercialIntent(input: {
  keyword: string;
  searchIntentMain?: string | null;
  cpc?: number | null;
  competition?: number | null;
}): CommercialIntentResult {
  const normalized = normalizeKeyword(input.keyword);
  const tokens = normalized.split(" ").filter(Boolean);
  let score = 40;
  const reasons: string[] = ["base_product_query"];

  for (const phrase of POSITIVE_PHRASES) {
    if (normalized.includes(phrase) || tokens.includes(phrase)) {
      score += phrase === "kopen" || phrase === "bestellen" ? 18 : 10;
      reasons.push(`positive:${phrase}`);
    }
  }

  for (const phrase of NEGATIVE_PHRASES) {
    if (normalized.includes(phrase)) {
      score -= 28;
      reasons.push(`negative:${phrase}`);
    }
  }

  const productHits = tokens.filter((t) => PRODUCTISH_TOKENS.has(t)).length;
  if (productHits > 0) {
    score += Math.min(22, productHits * 10);
    reasons.push(`product_tokens:${productHits}`);
  }

  // Specific multi-word product queries beat ultra-broad single tokens
  if (tokens.length >= 2 && tokens.length <= 5) {
    score += 8;
    reasons.push("focused_length");
  } else if (tokens.length === 1) {
    score -= 12;
    reasons.push("too_broad_single_token");
  } else if (tokens.length > 8) {
    score -= 8;
    reasons.push("overlong");
  }

  const intent = (input.searchIntentMain ?? "").toLowerCase();
  if (intent === "transactional") {
    score += 16;
    reasons.push("dfs_intent:transactional");
  } else if (intent === "commercial") {
    score += 12;
    reasons.push("dfs_intent:commercial");
  } else if (intent === "informational") {
    score -= 18;
    reasons.push("dfs_intent:informational");
  } else if (intent === "navigational") {
    score -= 10;
    reasons.push("dfs_intent:navigational");
  }

  // CPC / competition as supporting commercial signal only
  if (typeof input.cpc === "number" && input.cpc > 0) {
    if (input.cpc >= 1.5) {
      score += 10;
      reasons.push("cpc_high");
    } else if (input.cpc >= 0.4) {
      score += 6;
      reasons.push("cpc_moderate");
    } else {
      score += 2;
      reasons.push("cpc_present");
    }
  }

  if (typeof input.competition === "number" && input.competition > 0) {
    if (input.competition >= 0.7) {
      score += 6;
      reasons.push("competition_high");
    } else if (input.competition >= 0.3) {
      score += 3;
      reasons.push("competition_mid");
    }
  }

  return {
    score: clamp(score),
    reasons,
  };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

import { normalizeKeyword } from "./normalizeKeyword.js";

const SERVICE_TOKENS = new Set([
  "afspraak",
  "behandeling",
  "kliniek",
  "salon",
  "therapeut",
  "coach",
  "consultancy",
  "adviesgesprek",
]);

const JOB_TOKENS = new Set([
  "vacature",
  "vacatures",
  "solliciteren",
  "stage",
  "banen",
  "werk",
  "salaris",
  "fulltime",
  "parttime",
]);

const INFO_TOKENS = new Set([
  "wiki",
  "wikipedia",
  "definitie",
  "betekenis",
  "symptomen",
  "oorzaak",
  "studie",
  "onderzoek",
  "nieuws",
]);

const SOFTWARE_TOKENS = new Set([
  "software",
  "saas",
  "app download",
  "crm",
  "platform login",
]);

const PHYSICAL_PRODUCT_HINTS = new Set([
  "masker",
  "serum",
  "creme",
  "olie",
  "shampoo",
  "reiniger",
  "apparaat",
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
  "lamp",
  "bril",
  "horloge",
  "riem",
  "band",
  "mat",
]);

export interface ProductIntentResult {
  score: number;
  reasons: string[];
}

export function scoreProductIntent(keyword: string): ProductIntentResult {
  const normalized = normalizeKeyword(keyword);
  const tokens = normalized.split(" ").filter(Boolean);
  let score = 45;
  const reasons: string[] = ["base"];

  const physical = tokens.filter((t) => PHYSICAL_PRODUCT_HINTS.has(t)).length;
  if (physical > 0) {
    score += Math.min(40, physical * 16);
    reasons.push(`physical:${physical}`);
  } else if (tokens.some((t) => ["serum", "masker", "creme", "shampoo"].includes(t))) {
    score += 20;
    reasons.push("beauty_product_token");
  }

  for (const t of tokens) {
    if (SERVICE_TOKENS.has(t)) {
      score -= 30;
      reasons.push(`service:${t}`);
    }
    if (JOB_TOKENS.has(t)) {
      score -= 40;
      reasons.push(`job:${t}`);
    }
    if (INFO_TOKENS.has(t)) {
      score -= 25;
      reasons.push(`info:${t}`);
    }
    if (SOFTWARE_TOKENS.has(t)) {
      score -= 35;
      reasons.push(`software:${t}`);
    }
  }

  if (normalized.includes("opleiding") || normalized.includes("cursus")) {
    score -= 40;
    reasons.push("education");
  }

  if (tokens.length === 1 && physical === 0) {
    score -= 15;
    reasons.push("vague_single");
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons,
  };
}

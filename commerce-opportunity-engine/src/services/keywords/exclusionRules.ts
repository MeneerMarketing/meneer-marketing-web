import {
  KEYWORD_EXCLUSION_ALLOWLIST,
  KEYWORD_EXCLUSION_PHRASES,
} from "../../config/keywordCategories.js";
import { normalizeKeyword } from "./normalizeKeyword.js";

export interface ExclusionHit {
  excluded: boolean;
  reason: string | null;
  matchedPhrase: string | null;
}

function containsPhrase(haystack: string, phrase: string): boolean {
  const normPhrase = normalizeKeyword(phrase);
  if (!normPhrase) return false;
  if (normPhrase.includes(" ")) {
    return haystack.includes(normPhrase);
  }
  const tokens = new Set(haystack.split(" "));
  return tokens.has(normPhrase);
}

export function evaluateKeywordExclusion(keyword: string): ExclusionHit {
  const normalized = normalizeKeyword(keyword);

  for (const allowed of KEYWORD_EXCLUSION_ALLOWLIST) {
    if (containsPhrase(normalized, allowed)) {
      return { excluded: false, reason: null, matchedPhrase: null };
    }
  }

  for (const phrase of KEYWORD_EXCLUSION_PHRASES) {
    if (containsPhrase(normalized, phrase)) {
      return {
        excluded: true,
        reason: `exclusion_phrase:${phrase}`,
        matchedPhrase: phrase,
      };
    }
  }

  // Informational question patterns (token-aware)
  const tokens = normalized.split(" ");
  if (tokens[0] === "wat" || tokens[0] === "waarom" || tokens[0] === "wanneer") {
    return {
      excluded: true,
      reason: "informational_question",
      matchedPhrase: tokens[0],
    };
  }
  if (tokens.includes("hoe") && (tokens.includes("werkt") || tokens.includes("maken"))) {
    return {
      excluded: true,
      reason: "how_to_informational",
      matchedPhrase: "hoe",
    };
  }

  return { excluded: false, reason: null, matchedPhrase: null };
}

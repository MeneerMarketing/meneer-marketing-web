import type { SupabaseClient } from "@supabase/supabase-js";
import { advertiserBlacklist } from "../../config/blacklist.js";
import { domainBusinessTypes } from "../../config/businessTypes.js";
import { normalizeKeyword } from "./normalizeKeyword.js";

/**
 * Build retailer / marketplace / comparison brand tokens from config + live DB brands.
 * Tokens are matched as whole words / phrases inside keywords.
 */
export async function buildRetailerNameTokens(
  client: SupabaseClient
): Promise<Set<string>> {
  const tokens = new Set<string>();

  const addDomainTokens = (domain: string) => {
    const base = domain
      .toLowerCase()
      .replace(/^www\./, "")
      .replace(/\.(nl|com|eu|net|be|de|co\.uk)$/i, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    if (base.length >= 3) {
      tokens.add(base);
      // also without spaces: "la roche posay" style handled elsewhere
      tokens.add(base.replace(/\s+/g, ""));
    }
  };

  for (const domain of advertiserBlacklist.excludedDomains) {
    addDomainTokens(domain);
  }

  for (const [domain, type] of Object.entries(domainBusinessTypes)) {
    if (
      type === "GENERAL_RETAILER" ||
      type === "MARKETPLACE" ||
      type === "COMPARISON_SITE"
    ) {
      addDomainTokens(domain);
    }
  }

  // Extra NL retail / marketplace aliases commonly used in queries
  for (const alias of [
    "kruidvat",
    "douglas",
    "etos",
    "hema",
    "notino",
    "bol",
    "bol com",
    "amazon",
    "zalando",
    "marktplaats",
    "temu",
    "aliexpress",
    "wehkamp",
    "coolblue",
    "mediamarkt",
    "ikea",
    "action",
    "lidl",
    "albert heijn",
    "ah",
    "jumbo",
    "trekpleister",
    "holland barrett",
    "holland&barrett",
    "iciparisxl",
    "ici paris",
    "lookfantastic",
    "vergelijk",
    "beslist",
    "kieskeurig",
  ]) {
    tokens.add(normalizeKeyword(alias));
  }

  const { data } = await client
    .from("brands")
    .select("name, normalized_domain, business_type")
    .in("business_type", ["GENERAL_RETAILER", "MARKETPLACE", "COMPARISON_SITE"]);

  for (const row of data ?? []) {
    if (row.normalized_domain) addDomainTokens(String(row.normalized_domain));
    const name = normalizeKeyword(String(row.name ?? ""));
    if (name.length >= 3) tokens.add(name);
  }

  return tokens;
}

export async function buildProductBrandTokens(
  client: SupabaseClient
): Promise<Set<string>> {
  const tokens = new Set<string>(
    [
      "cerave",
      "la roche posay",
      "la roche-posay",
      "larocheposay",
      "kerastase",
      "kérastase",
      "caudalie",
      "the ordinary",
      "ordinary",
      "paula s choice",
      "paulas choice",
      "eucerin",
      "vichy",
      "avene",
      "avène",
      "bioderma",
      "nuxe",
      "clarins",
      "clinique",
      "estee lauder",
      "loreal",
      "l oréal",
      "garnier",
      "neutrogena",
      "olay",
      "nivea",
      "weleda",
      "the inkey list",
      "inkey",
      "anua",
      "cosrx",
      "glowora",
      "currentbody",
      "silk n",
      "silkn",
      "dr pen",
      "foreo",
    ].map((t) => normalizeKeyword(t))
  );

  const { data } = await client
    .from("brands")
    .select("name, normalized_domain, business_type")
    .in("business_type", ["BRAND"]);

  for (const row of data ?? []) {
    const name = normalizeKeyword(String(row.name ?? ""));
    if (name.length >= 3) tokens.add(name);
    const domain = String(row.normalized_domain ?? "")
      .replace(/\.(nl|com|eu)$/i, "")
      .replace(/[^a-z0-9]+/gi, " ");
    const dNorm = normalizeKeyword(domain);
    if (dNorm.length >= 3) tokens.add(dNorm);
  }

  return tokens;
}

export function findMatchingToken(
  keywordNormalized: string,
  tokens: Set<string>
): string | null {
  // Longer phrases first
  const sorted = [...tokens].sort((a, b) => b.length - a.length);
  for (const token of sorted) {
    if (!token || token.length < 2) continue;
    if (token.includes(" ")) {
      if (keywordNormalized.includes(token)) return token;
    } else {
      const re = new RegExp(`(?:^|\\s)${escapeRegExp(token)}(?:\\s|$)`);
      if (re.test(keywordNormalized)) return token;
    }
  }
  return null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

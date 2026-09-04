/**
 * Milestone 9.6.1 — early discovery exclusion before crawl budget is spent.
 */

import { isAgencyOwnedOrManagedDomain } from "../../config/agencyDomains.js";
import { isBlacklistedDomain } from "../../config/blacklist.js";

export type DiscoveryEntityClass =
  | "OFFICIAL_BRAND_CANDIDATE"
  | "MERCHANT_DOMAIN"
  | "MEDIA_PUBLISHER"
  | "SOCIAL_PLATFORM"
  | "CONTENT_PLATFORM"
  | "AGENCY_EXCLUDED"
  | "MARKETPLACE_BLACKLIST";

const MEDIA_PUBLISHER_HINTS = [
  "vogue.",
  "elle.",
  "glamour.",
  "cosmopolitan.",
  "libelle.",
  "fashionchick.",
  "gq.com",
  "harpersbazaar",
  "marieclaire",
  "beautyscene",
  "cosmeticsbusiness",
];

const SOCIAL_PLATFORM_DOMAINS = [
  "youtube.com",
  "instagram.com",
  "facebook.com",
  "tiktok.com",
  "pinterest.com",
  "linkedin.com",
  "x.com",
  "twitter.com",
];

const CONTENT_PLATFORM_HINTS = [
  "reddit.com",
  "quora.com",
  "wikipedia.org",
  "medium.com",
];

export function classifyDiscoveryDomain(normalizedDomain: string): {
  entityClass: DiscoveryEntityClass;
  hardExclude: boolean;
  reason: string | null;
} {
  const domain = normalizedDomain.toLowerCase().replace(/^www\./, "");

  if (isAgencyOwnedOrManagedDomain(domain)) {
    return {
      entityClass: "AGENCY_EXCLUDED",
      hardExclude: true,
      reason: "agency_owned_or_managed",
    };
  }

  if (isBlacklistedDomain(domain)) {
    return {
      entityClass: "MARKETPLACE_BLACKLIST",
      hardExclude: true,
      reason: "marketplace_blacklist",
    };
  }

  if (SOCIAL_PLATFORM_DOMAINS.some((entry) => domain === entry || domain.endsWith(`.${entry}`))) {
    return {
      entityClass: "SOCIAL_PLATFORM",
      hardExclude: true,
      reason: "social_platform",
    };
  }

  if (CONTENT_PLATFORM_HINTS.some((hint) => domain.includes(hint))) {
    return {
      entityClass: "CONTENT_PLATFORM",
      hardExclude: true,
      reason: "content_platform",
    };
  }

  if (MEDIA_PUBLISHER_HINTS.some((hint) => domain.includes(hint))) {
    return {
      entityClass: "MEDIA_PUBLISHER",
      hardExclude: true,
      reason: "media_publisher",
    };
  }

  return {
    entityClass: "OFFICIAL_BRAND_CANDIDATE",
    hardExclude: false,
    reason: null,
  };
}

export function isHardDiscoveryExcludedDomain(normalizedDomain: string): boolean {
  return classifyDiscoveryDomain(normalizedDomain).hardExclude;
}

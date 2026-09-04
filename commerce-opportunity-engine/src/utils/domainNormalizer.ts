/**
 * Normalizes a URL or hostname for advertiser deduplication.
 * Preserves meaningful subdomains (e.g. shop.example.nl stays shop.example.nl).
 * Strips www. prefix only; does not collapse subdomains to root domains.
 */

const BLOCKED_HOSTNAMES = new Set(["", "localhost"]);

export interface NormalizedDomainResult {
  /** Hostname with www stripped, lowercase. */
  normalizedDomain: string;
  /** Raw hostname from URL, lowercase. */
  hostname: string;
  /** Whether www was stripped during normalization. */
  strippedWww: boolean;
}

function stripWww(hostname: string): { host: string; strippedWww: boolean } {
  if (hostname.startsWith("www.")) {
    return { host: hostname.slice(4), strippedWww: true };
  }
  return { host: hostname, strippedWww: false };
}

export function normalizeDomainFromUrl(urlOrHost: string): NormalizedDomainResult | null {
  const trimmed = urlOrHost.trim();
  if (!trimmed) {
    return null;
  }

  let hostname: string;

  try {
    if (trimmed.includes("//") || trimmed.includes("/") && !trimmed.startsWith("/")) {
      const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
      hostname = parsed.hostname.toLowerCase();
    } else {
      hostname = trimmed.split("/")[0].split("?")[0].split("#")[0].toLowerCase();
    }
  } catch {
    return null;
  }

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return null;
  }

  const { host, strippedWww } = stripWww(hostname);

  if (BLOCKED_HOSTNAMES.has(host)) {
    return null;
  }

  return {
    normalizedDomain: host,
    hostname,
    strippedWww,
  };
}

export function normalizeDomainFromParts(
  landingUrl?: string | null,
  displayedUrl?: string | null,
  domainField?: string | null
): NormalizedDomainResult | null {
  if (landingUrl) {
    const fromLanding = normalizeDomainFromUrl(landingUrl);
    if (fromLanding) {
      return fromLanding;
    }
  }

  if (domainField) {
    const cleaned = domainField.replace(/^https?:\/\//i, "").split("/")[0];
    const fromDomain = normalizeDomainFromUrl(cleaned);
    if (fromDomain) {
      return fromDomain;
    }
  }

  if (displayedUrl) {
    return normalizeDomainFromUrl(displayedUrl);
  }

  return null;
}

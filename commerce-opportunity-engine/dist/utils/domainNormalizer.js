/**
 * Normalizes a URL or hostname for advertiser deduplication.
 * Preserves meaningful subdomains (e.g. shop.example.nl stays shop.example.nl).
 * Strips www. prefix only; does not collapse subdomains to root domains.
 */
const BLOCKED_HOSTNAMES = new Set(["", "localhost"]);
function stripWww(hostname) {
    if (hostname.startsWith("www.")) {
        return { host: hostname.slice(4), strippedWww: true };
    }
    return { host: hostname, strippedWww: false };
}
export function normalizeDomainFromUrl(urlOrHost) {
    const trimmed = urlOrHost.trim();
    if (!trimmed) {
        return null;
    }
    let hostname;
    try {
        if (trimmed.includes("//") || trimmed.includes("/") && !trimmed.startsWith("/")) {
            const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
            hostname = parsed.hostname.toLowerCase();
        }
        else {
            hostname = trimmed.split("/")[0].split("?")[0].split("#")[0].toLowerCase();
        }
    }
    catch {
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
export function normalizeDomainFromParts(landingUrl, displayedUrl, domainField) {
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
//# sourceMappingURL=domainNormalizer.js.map
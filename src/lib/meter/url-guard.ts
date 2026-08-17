export interface NormalizedMeterUrl {
  href: string;
  siteName: string;
}

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
]);

function isPrivateIpv4(host: string): boolean {
  const parts = host.split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b !== undefined && b >= 16 && b <= 31) return true;
  return false;
}

export function normalizeMeterUrl(raw: string): NormalizedMeterUrl | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 2048) return null;

  let href = trimmed;
  if (!/^https?:\/\//i.test(href)) {
    href = `https://${href}`;
  }

  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    const host = url.hostname.toLowerCase();
    if (!host || BLOCKED_HOSTS.has(host) || isPrivateIpv4(host)) return null;
    if (host.endsWith(".local") || host.endsWith(".internal")) return null;

    const siteName = host.replace(/^www\./, "");
    if (!siteName.includes(".")) return null;

    url.hash = "";
    return { href: url.href, siteName };
  } catch {
    return null;
  }
}

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "::1",
]);

const PRIVATE_IPV4 =
  /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|169\.254\.\d{1,3}\.\d{1,3})$/;

export interface NormalizedMeterUrl {
  href: string;
  hostname: string;
  siteName: string;
}

export function normalizeMeterUrl(raw: string): NormalizedMeterUrl | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 2048) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  const hostname = parsed.hostname.toLowerCase();
  if (!hostname || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    return null;
  }

  if (BLOCKED_HOSTS.has(hostname) || PRIVATE_IPV4.test(hostname)) {
    return null;
  }

  parsed.hash = "";
  const siteName = hostname.replace(/^www\./, "");

  return {
    href: parsed.toString(),
    hostname,
    siteName,
  };
}

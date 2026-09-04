import { resolveMx } from "node:dns/promises";
import { normalizeDomain } from "@/lib/utils/normalize";
import { normalizeEmail, isPlausibleEmail } from "@/lib/utils/emailValidation";

export type EmailConfidenceLevel = "skip" | "low" | "medium" | "high";

export interface EmailConfidenceResult {
  score: number;
  level: EmailConfidenceLevel;
  reasons: string[];
  mxValid: boolean;
  skipOutreach: boolean;
}

const STRONG_LOCAL =
  /^(studio|contact|hello|hallo|welkom|booking|boekingen|pilates|yoga|praktijk)@/i;
const GENERIC_LOCAL = /^(info|mail|team|reception|frontdesk|front-desk)@/i;
const BLOCKED_LOCAL =
  /^(noreply|no-reply|donotreply|do-not-reply|support|helpdesk|webmaster|postmaster|admin|sales|marketing|newsletter|nieuwsbrief)@/i;
const FREE_PROVIDER =
  /gmail|googlemail|hotmail|outlook|live\.|yahoo|icloud|ziggo|kpnmail|xs4all|planet\.nl/i;

function isLikelyFirstNameLocal(local: string): boolean {
  const tagged = `${local}@`;
  if (GENERIC_LOCAL.test(tagged) || STRONG_LOCAL.test(tagged) || BLOCKED_LOCAL.test(tagged)) {
    return false;
  }
  if (/^[a-zà-ü]{2,15}$/.test(local)) return true;
  if (/^[a-zà-ü]{2,12}\.[a-zà-ü]{2,15}$/.test(local)) return true;
  return false;
}

const mxCache = new Map<string, { valid: boolean; expiresAt: number }>();
const MX_CACHE_MS = 1000 * 60 * 60 * 6;

function emailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  return normalizeDomain(email.slice(at + 1));
}

function domainsMatch(emailDomainRaw: string | null, businessDomain: string | null): boolean {
  if (!emailDomainRaw || !businessDomain) return false;
  const a = emailDomainRaw.replace(/^www\./, "").toLowerCase();
  const b = businessDomain.replace(/^www\./, "").toLowerCase();
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
}

function sourceScore(source: string | null | undefined): { points: number; reason: string | null } {
  const src = String(source ?? "").toLowerCase();
  if (src.includes("/contact") || src.includes("contacteer") || src.includes("/about")) {
    return { points: 28, reason: "Gevonden op contactpagina" };
  }
  if (src.startsWith("website_page:")) {
    return { points: 18, reason: "Gevonden op subpagina" };
  }
  if (src === "business_record") {
    return { points: 14, reason: "Staat al op lead-record" };
  }
  if (src === "website_homepage" || src === "website") {
    return { points: 10, reason: "Gevonden op homepage" };
  }
  if (src === "existing_contact") {
    return { points: 12, reason: "Bestaand contact" };
  }
  return { points: 6, reason: null };
}

function localPartScore(local: string): { points: number; reason: string | null; blocked: boolean } {
  const tagged = `${local}@`;
  if (BLOCKED_LOCAL.test(tagged)) {
    return { points: -60, reason: "Generiek systeemadres (noreply/support)", blocked: true };
  }
  if (STRONG_LOCAL.test(tagged)) {
    return { points: 22, reason: "Direct studio-contactadres", blocked: false };
  }
  if (isLikelyFirstNameLocal(local)) {
    return { points: 28, reason: "Voornaam-contactadres", blocked: false };
  }
  if (GENERIC_LOCAL.test(tagged)) {
    return { points: 4, reason: "Generiek info@ of mail@", blocked: false };
  }
  if (/^[a-z0-9._-]{2,24}$/.test(local) && !/\d{4,}/.test(local)) {
    return { points: 8, reason: "Persoonlijk ogend lokaal deel", blocked: false };
  }
  return { points: 0, reason: null, blocked: false };
}

function levelFromScore(score: number, mxValid: boolean, blocked: boolean): EmailConfidenceLevel {
  if (blocked || !mxValid || score < 20) return "skip";
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export async function hasMxRecord(domain: string): Promise<boolean> {
  const host = normalizeDomain(domain)?.replace(/^www\./, "").toLowerCase();
  if (!host) return false;

  const cached = mxCache.get(host);
  if (cached && cached.expiresAt > Date.now()) return cached.valid;

  try {
    const records = await resolveMx(host);
    const valid = records.length > 0;
    mxCache.set(host, { valid, expiresAt: Date.now() + MX_CACHE_MS });
    return valid;
  } catch {
    mxCache.set(host, { valid: false, expiresAt: Date.now() + MX_CACHE_MS });
    return false;
  }
}

export function scoreEmailConfidenceSync(input: {
  email: string;
  businessDomain?: string | null;
  source?: string | null;
  occurrenceCount?: number;
}): Omit<EmailConfidenceResult, "mxValid"> & { mxValid?: boolean } {
  const email = normalizeEmail(input.email);
  const reasons: string[] = [];
  if (!email || !isPlausibleEmail(email)) {
    return {
      score: 0,
      level: "skip",
      reasons: ["Ongeldig e-mailformaat"],
      skipOutreach: true,
    };
  }

  const local = email.split("@")[0] ?? "";
  const domain = emailDomain(email);
  let score = 20;

  const localScore = localPartScore(local);
  score += localScore.points;
  if (localScore.reason) reasons.push(localScore.reason);

  if (domainsMatch(domain, input.businessDomain ?? null)) {
    score += 30;
    reasons.push("Eigen domein van de studio");
  } else if (FREE_PROVIDER.test(email)) {
    score -= 22;
    reasons.push("Gratis mailbox (gmail/hotmail)");
  }

  const src = sourceScore(input.source);
  score += src.points;
  if (src.reason) reasons.push(src.reason);

  if ((input.occurrenceCount ?? 1) >= 2) {
    score += 10;
    reasons.push("Meerdere keren op de site gevonden");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    level: levelFromScore(score, true, localScore.blocked),
    reasons,
    skipOutreach: localScore.blocked,
  };
}

export async function evaluateEmailConfidence(input: {
  email: string;
  businessDomain?: string | null;
  source?: string | null;
  occurrenceCount?: number;
}): Promise<EmailConfidenceResult> {
  const base = scoreEmailConfidenceSync(input);
  const domain = emailDomain(normalizeEmail(input.email) ?? "");
  const mxValid = domain ? await hasMxRecord(domain) : false;

  if (!mxValid) {
    const level: EmailConfidenceLevel =
      base.skipOutreach || base.score < 25 ? "skip" : "low";
    return {
      score: Math.max(0, Math.min(base.score, 45)),
      level,
      reasons: [...base.reasons, "MX record niet bevestigd"],
      mxValid: false,
      skipOutreach: level === "skip",
    };
  }

  const level = levelFromScore(base.score, mxValid, base.skipOutreach);
  return {
    score: base.score,
    level,
    reasons: base.reasons,
    mxValid: true,
    skipOutreach: level === "skip",
  };
}

export function confidenceLevelLabel(level: EmailConfidenceLevel): string {
  switch (level) {
    case "high":
      return "Hoog";
    case "medium":
      return "Middel";
    case "low":
      return "Laag";
    case "skip":
      return "Skip";
  }
}

export function confidenceLevelTone(
  level: EmailConfidenceLevel,
): "success" | "brand" | "warn" | "danger" | "neutral" {
  switch (level) {
    case "high":
      return "success";
    case "medium":
      return "brand";
    case "low":
      return "warn";
    case "skip":
      return "danger";
  }
}

export async function pickBestEmailByConfidence(
  candidates: Array<{ email: string; source: string }>,
  businessDomain: string | null,
  exclude?: ReadonlySet<string>,
): Promise<{ email: string; source: string; confidence: EmailConfidenceResult } | null> {
  const filtered = candidates.filter((c) => !exclude?.has(c.email));
  if (filtered.length === 0) return null;

  const counts = new Map<string, number>();
  for (const c of filtered) {
    counts.set(c.email, (counts.get(c.email) ?? 0) + 1);
  }

  const unique = Array.from(new Set(filtered.map((c) => c.email)));
  const scored: Array<{
    email: string;
    source: string;
    confidence: EmailConfidenceResult;
  }> = [];

  for (const email of unique) {
    const source =
      filtered.find((c) => c.email === email)?.source ??
      filtered.filter((c) => c.email === email).sort()[0]?.source ??
      "website";
    const confidence = await evaluateEmailConfidence({
      email,
      businessDomain,
      source,
      occurrenceCount: counts.get(email) ?? 1,
    });
    if (confidence.level === "skip") continue;
    scored.push({ email, source, confidence });
  }

  if (scored.length === 0) return null;

  scored.sort(
    (a, b) =>
      b.confidence.score - a.confidence.score ||
      (b.confidence.level === "high" ? 1 : 0) - (a.confidence.level === "high" ? 1 : 0),
  );

  return scored[0] ?? null;
}

export async function persistEmailConfidence(input: {
  client: import("@supabase/supabase-js").SupabaseClient;
  businessId: string;
  contactId?: string | null;
  email: string;
  confidence: EmailConfidenceResult;
}): Promise<void> {
  const payload = {
    email_confidence: input.confidence.score,
    email_confidence_level: input.confidence.level,
    email_confidence_reasons: input.confidence.reasons,
    updated_at: new Date().toISOString(),
  };

  if (input.contactId) {
    await input.client.from("contacts").update(payload).eq("id", input.contactId);
  }

  await input.client
    .from("businesses")
    .update({
      email_confidence: input.confidence.score,
      email_confidence_level: input.confidence.level,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.businessId);
}

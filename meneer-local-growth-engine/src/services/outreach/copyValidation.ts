import {
  FORBIDDEN_PERSONAL_NAMES,
  FORBIDDEN_PHRASES,
} from "./personalizationSchema";
import { getSenderDisplay, type MeneerMarketingBrandSettings } from "@/config/brandSettings";

export type ValidationStage = "draft" | "approve" | "send" | "test";

export interface CopyValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

function isLocalPreview(url: string): boolean {
  if (url.startsWith("/preview/")) return true;
  try {
    const u = new URL(url);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return true;
  }
}

function isHttpsAbsolute(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

function isApprovedHost(url: string, hosts: string[]): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return false;
    return hosts.some((h) => h !== "localhost" && (host === h || host.endsWith(`.${h}`)));
  } catch {
    return false;
  }
}

export function validateOutreachCopy(input: {
  stage: ValidationStage;
  subject: string;
  body_text: string;
  business_name: string;
  city: string;
  preview_url: string;
  primary_keyword: string | null;
  city_exclusivity_available: boolean;
  brand: MeneerMarketingBrandSettings;
}): CopyValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const body = input.body_text;
  const lower = `${input.subject}\n${body}`.toLowerCase();
  const words = body.trim().split(/\s+/).filter(Boolean).length;

  if (!body.includes(input.business_name)) errors.push("business_name_missing");
  if (!body.includes(input.city)) errors.push("city_missing");
  if (!input.preview_url || !body.includes(input.preview_url)) {
    errors.push("preview_url_missing");
  }
  if (input.primary_keyword && !body.includes(input.primary_keyword)) {
    errors.push("primary_keyword_missing");
  }

  if (input.city_exclusivity_available) {
    if (!/één pilates studio per stad|een pilates studio per stad/i.test(body)) {
      errors.push("exclusivity_missing");
    }
  } else if (/bied ik dit dus niet ook aan een directe/i.test(body)) {
    errors.push("exclusivity_should_not_appear");
  }

  for (const phrase of FORBIDDEN_PHRASES) {
    if (lower.includes(phrase.toLowerCase())) {
      errors.push(`forbidden_phrase:${phrase}`);
    }
  }

  const sender = getSenderDisplay(input.brand);
  for (const name of FORBIDDEN_PERSONAL_NAMES) {
    if (lower.includes(name)) {
      if (sender.mode === "BRAND") errors.push(`forbidden_personal_name:${name}`);
      else warnings.push(`personal_name_found:${name}`);
    }
  }

  if (/ik ben (yasmin|yasin|dhr\.?\s*ertan)/i.test(body)) {
    errors.push("forbidden_intro_identity");
  }

  if (words < 90) warnings.push("word_count_low");
  if (words > 220) warnings.push("word_count_high");
  if (input.stage !== "draft" && (words < 100 || words > 200)) {
    warnings.push("word_count_outside_guideline");
  }

  if (input.stage === "approve" && isLocalPreview(input.preview_url)) {
    warnings.push("preview_localhost_on_approve");
  }

  if (input.stage === "send" || input.stage === "test") {
    if (!isHttpsAbsolute(input.preview_url)) errors.push("preview_must_be_https_absolute");
    if (!isApprovedHost(input.preview_url, input.brand.preview_allowed_hosts)) {
      errors.push("preview_host_not_approved");
    }
    if (isLocalPreview(input.preview_url)) errors.push("preview_localhost_blocked_on_send");
  }

  return { ok: errors.length === 0, errors, warnings };
}

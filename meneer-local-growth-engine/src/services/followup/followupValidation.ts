import type { CopyValidationResult } from "@/services/outreach/copyValidation";
import { bodyIncludesPreviewCta } from "@/services/outreach/outreachCopy";

export function validateFollowupCopy(input: {
  subject: string;
  body_text: string;
  business_name: string;
}): CopyValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const body = input.body_text;
  const lower = `${input.subject}\n${body}`.toLowerCase();

  if (!input.subject.trim()) errors.push("subject_missing");
  if (!body.trim()) errors.push("body_missing");
  if (!body.includes(input.business_name)) {
    warnings.push("business_name_missing");
  }
  if (!bodyIncludesPreviewCta(body)) {
    errors.push("preview_cta_missing");
  }
  if (/[—–]|(?:\s--\s)/.test(body) || /[—–]/.test(input.subject)) {
    errors.push("dash_in_copy");
  }
  if (lower.includes("geen ")) {
    warnings.push("negative_opener");
  }

  const words = body.trim().split(/\s+/).filter(Boolean).length;
  if (words > 120) warnings.push("word_count_high");
  if (words < 20) warnings.push("word_count_low");

  return { ok: errors.length === 0, errors, warnings };
}

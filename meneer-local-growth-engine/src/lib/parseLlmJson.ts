import { jsonrepair } from "jsonrepair";

function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractJsonObject(text: string): string | null {
  const cleaned = stripCodeFences(text);
  const start = cleaned.indexOf("{");
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < cleaned.length; index += 1) {
    const char = cleaned[index]!;

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return cleaned.slice(start, index + 1);
      }
    }
  }

  const fallback = cleaned.match(/\{[\s\S]*\}/);
  return fallback?.[0] ?? null;
}

function normalizeSmartQuotes(text: string): string {
  return text
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\u00A0/g, " ");
}

export function parseLlmJsonObject(text: string): unknown | null {
  const extracted = extractJsonObject(text);
  if (!extracted) return null;

  const normalized = normalizeSmartQuotes(extracted);
  const attempts = [normalized];

  try {
    attempts.push(jsonrepair(normalized));
  } catch {
    /* repair failed, try raw parse only */
  }

  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate);
    } catch {
      /* try next */
    }
  }

  return null;
}

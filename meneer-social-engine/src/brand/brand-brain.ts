import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Volledige Brand Brain als string voor Claude system prompts. */
export function getBrandBrainPrompt(): string {
  const path = join(process.cwd(), "src/brand/BRAND-BRAIN.md");
  return readFileSync(path, "utf-8");
}

export const BRAND_TOKENS = {
  accent: "#c2410c",
  accentBold: "#FF5722",
  bg: "#f3f7fb",
  surface: "#e8f0f8",
  text: "#0f172a",
  muted: "#64748b",
  footer: "#0c1222",
  fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
  canvasFeed: { width: 1080, height: 1350 },
  canvasReel: { width: 1080, height: 1920 },
  canvasAvatar: { width: 1080, height: 1080 },
} as const;

export const FORBIDDEN_PHRASES = [
  "til naar een hoger niveau",
  "unlock",
  "digitale groei",
  "gamechanger",
  "passie voor",
  "wij geloven",
  "synergie",
  "full service",
  "360°",
] as const;

export function containsForbiddenPhrase(text: string): string | null {
  const lower = text.toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (lower.includes(phrase)) return phrase;
  }
  return null;
}

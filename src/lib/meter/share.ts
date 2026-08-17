import { absoluteUrl } from "@/lib/site";
import type { MeterScanResult } from "@/lib/meter/types";

export function buildMeterShareText(result: MeterScanResult, userGuess?: number): string {
  const guessLine =
    typeof userGuess === "number"
      ? ` (ik gokte ${userGuess}, echt was ${result.total})`
      : "";
  return `De Meneer Meter gaf ${result.siteName} een ${result.total}/100 (${result.verdict})${guessLine}. Scan jouw site: ${buildMeterShareUrl(result.url)}`;
}

export function buildMeterShareUrl(scannedUrl: string): string {
  const base = absoluteUrl("/meter");
  try {
    const host = new URL(scannedUrl).hostname.replace(/^www\./, "");
    return `${base}?url=${encodeURIComponent(host)}`;
  } catch {
    return base;
  }
}

export function buildMeterScoreCardUrl(result: MeterScanResult): string {
  const base = absoluteUrl("/meter");
  const params = new URLSearchParams({
    url: result.siteName,
    score: String(result.total),
    verdict: result.verdict,
  });
  return `${base}?${params.toString()}`;
}

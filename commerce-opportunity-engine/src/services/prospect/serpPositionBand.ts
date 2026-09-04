/**
 * Milestone 9.8 — SERP position bands for lower-visibility harvest experiment.
 */

export type SerpPositionBand = "TOP_10" | "11_20" | "21_50" | "51_PLUS" | "UNKNOWN";

export function serpPositionBand(rank: number | null): SerpPositionBand {
  if (rank == null || !Number.isFinite(rank)) return "UNKNOWN";
  if (rank <= 10) return "TOP_10";
  if (rank <= 20) return "11_20";
  if (rank <= 50) return "21_50";
  return "51_PLUS";
}

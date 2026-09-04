export type VolumeTier =
  | "HIGH_VOLUME"
  | "MEDIUM_VOLUME"
  | "LOW_VOLUME"
  | "VERY_LOW_VOLUME"
  | "UNKNOWN";

export function classifyVolumeTier(searchVolume: number | null | undefined): VolumeTier {
  if (searchVolume === null || searchVolume === undefined) {
    return "UNKNOWN";
  }
  if (searchVolume >= 5000) return "HIGH_VOLUME";
  if (searchVolume >= 500) return "MEDIUM_VOLUME";
  if (searchVolume >= 50) return "LOW_VOLUME";
  return "VERY_LOW_VOLUME";
}

/** Soft volume contribution 0-100 for quality scoring (never hard-filters). */
export function volumeScoreContribution(searchVolume: number | null | undefined): number {
  if (searchVolume === null || searchVolume === undefined) return 35;
  if (searchVolume <= 0) return 20;
  if (searchVolume < 20) return 40;
  if (searchVolume < 100) return 55;
  if (searchVolume < 500) return 70;
  if (searchVolume < 2000) return 82;
  if (searchVolume < 10000) return 90;
  return 78; // ultra-broad high volume slightly less valuable alone
}

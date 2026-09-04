/**
 * Alle cuts liggen op een 120 BPM raster. Bij 30 fps is dat 15 frames per beat,
 * waardoor vrijwel elke Instagram-audio synchroon loopt met de montage.
 */
export const FPS = 30;
export const BEAT = 15;
export const BAR = BEAT * 4;

export const beat = (n: number) => Math.round(n * BEAT);
export const bar = (n: number) => Math.round(n * BAR);

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_SLAM = [0.34, 1.56, 0.64, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const nl = new Intl.NumberFormat("nl-NL");
export const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

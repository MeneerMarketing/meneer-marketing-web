/** Meneer Marketing brand tokens for Remotion compositions */

export const brand = {
  colors: {
    accent: "#FF5722",
    text: "#0f172a",
    textMuted: "rgba(15, 23, 42, 0.62)",
    background: "#f8fafc",
    grid: "rgba(15, 23, 42, 0.055)",
    accentSoft: "rgba(255, 87, 34, 0.12)",
  },
  spacing: {
    /** Safe area at 1080px reference width */
    safeHorizontal: 80,
    safeVertical: 100,
    gridSize: 48,
    sceneGap: 24,
    accentBarHeight: 6,
  },
  motion: {
    fadeFrames: 18,
    enterOffset: 28,
  },
  /** Reference width for typography scale (video-layout rule) */
  typeBaseWidth: 1080,
  typography: {
    headline: 84,
    supporting: 44,
    label: 32,
    cta: 40,
  },
  fps: 30,
  durationSeconds: 15,
} as const;

export const getDurationInFrames = (): number =>
  brand.fps * brand.durationSeconds;

export const scaleForWidth = (width: number, basePx: number): number =>
  Math.round(basePx * (width / brand.typeBaseWidth));

export const getSafeArea = (width: number, height: number) => {
  const hScale = width / brand.typeBaseWidth;
  const vScale = height / brand.typeBaseWidth;

  return {
    paddingLeft: Math.round(brand.spacing.safeHorizontal * hScale),
    paddingRight: Math.round(brand.spacing.safeHorizontal * hScale),
    paddingTop: Math.round(brand.spacing.safeVertical * vScale),
    paddingBottom: Math.round(brand.spacing.safeVertical * vScale),
  };
};

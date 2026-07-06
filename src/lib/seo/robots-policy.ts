import type { Metadata } from "next";

/** Standaard indexeerbare pagina's. */
export const INDEXABLE_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

/** Formulieren en conversion flows: volg links, indexeer niet. */
export const NOINDEX_FOLLOW_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
};

/** 404 en foutpagina's. */
export const NOINDEX_NOFOLLOW_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

/** Paden die crawlers niet moeten indexeren (ook in robots.txt). */
export const ROBOTS_DISALLOW_PATHS = [
  "/api/",
  "/intake",
  "/samenwerken",
  "/project-starten",
  "/schaal-op",
  "/groeiscan",
] as const;

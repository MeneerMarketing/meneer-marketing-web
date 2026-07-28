/**
 * Top-6 verzekeraars voor vergoedingen-hub.
 * Pagina-inhoud per verzekeraar: [COPY-NODIG] tot Okan/Rojda feiten levert.
 * Namen zijn publieke feiten, geen medische claims.
 */

export type Insurer = {
  readonly slug: string;
  readonly name: string;
};

export const INSURERS: readonly Insurer[] = [
  { slug: "cz", name: "CZ" },
  { slug: "vgz", name: "VGZ" },
  { slug: "menzis", name: "Menzis" },
  { slug: "zilveren-kruis", name: "Zilveren Kruis" },
  { slug: "onvz", name: "ONVZ" },
  { slug: "asr", name: "ASR" },
] as const;

export function insurerBySlug(slug: string): Insurer | undefined {
  return INSURERS.find((i) => i.slug === slug);
}

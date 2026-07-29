/** Officiële Diba Clinics merkassets (transparante PNG). */

/** Donkere tekst — lichte achtergronden (header homepage, inner pages). */
export const DIBA_LOGO_DARK = "/images/diba-logo-dark.png";

/** Witte tekst — donkere achtergronden (huidscan, CTA, footer op den). */
export const DIBA_LOGO_WHITE = "/images/diba-logo-white.png";

/**
 * Het DC-merkicoon zit niet meer hier maar in `components/ui/DibaIcon.tsx`, als SVG
 * met de paden uit het merkbestand. De PNG-varianten hadden de D in bijna-zwart
 * (#383734), wat hard oogde naast het groen van de site; de merkmap heeft daar een
 * groene variant voor. De favicon komt uit `src/app/icon.svg`.
 */

/** Officieel blad-icoon (los van het logo-wordmark). */
export const DIBA_LEAF_OFFICIAL = "/images/diba-leaf-official.png";

/** Logo-wordmark 1024×152 */
export const DIBA_LOGO_ASPECT = 1024 / 152;

export type DibaLogoVariant = "dark" | "white";

export function dibaLogoSrc(variant: DibaLogoVariant): string {
  return variant === "white" ? DIBA_LOGO_WHITE : DIBA_LOGO_DARK;
}


/** Officiële Diba Clinics merkassets (transparante PNG). */

/** Donkere tekst — lichte achtergronden (header homepage, inner pages). */
export const DIBA_LOGO_DARK = "/images/diba-logo-dark.png";

/** Witte tekst — donkere achtergronden (huidscan, CTA, footer op den). */
export const DIBA_LOGO_WHITE = "/images/diba-logo-white.png";

/** DC-rond merkicoon — lichte achtergronden. */
export const DIBA_ICON_DARK = "/images/diba-icon-dark.png";

/** DC-rond merkicoon — donkere achtergronden. */
export const DIBA_ICON_WHITE = "/images/diba-icon-white.png";

/** Officieel blad-icoon (los van het logo-wordmark). */
export const DIBA_LEAF_OFFICIAL = "/images/diba-leaf-official.png";

/** Logo-wordmark 1024×152 */
export const DIBA_LOGO_ASPECT = 1024 / 152;

export type DibaLogoVariant = "dark" | "white";

export function dibaLogoSrc(variant: DibaLogoVariant): string {
  return variant === "white" ? DIBA_LOGO_WHITE : DIBA_LOGO_DARK;
}

export function dibaIconSrc(variant: DibaLogoVariant): string {
  return variant === "white" ? DIBA_ICON_WHITE : DIBA_ICON_DARK;
}

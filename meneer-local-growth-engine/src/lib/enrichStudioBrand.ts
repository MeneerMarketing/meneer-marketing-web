import { cache } from "react";
import { mergeBrandWithLogo, shouldPreferLogoColors } from "@/lib/brandPalette";
import { pickBrandGoldAccent, pickVividAccent } from "@/lib/color";
import { extractLogoPalette } from "@/lib/logoColorExtractor";
import { isGoogleBusinessProfilePhoto, resolveStudioLogoUrl } from "@/lib/studioLogo";
import type { StudioData } from "@/types/studio";

const getLogoPaletteCached = cache(async (logoUrl: string) => {
  return extractLogoPalette(logoUrl);
});

/** Vult studio-kleuren aan vanuit het logo wanneer die nog generiek zijn. */
export const enrichStudioBrandColors = cache(
  async (studio: StudioData): Promise<StudioData> => {
    const logoUrl = resolveStudioLogoUrl(studio.logo);
    if (!logoUrl) return studio;
    if (isGoogleBusinessProfilePhoto(studio.logo ?? "")) return studio;

    const logoPalette = await getLogoPaletteCached(logoUrl);
    if (!logoPalette) return studio;

    const hasScrapedBrand = !shouldPreferLogoColors(studio);
    if (hasScrapedBrand) {
      const accent =
        pickBrandGoldAccent(
          studio.accent_color,
          studio.accent_color,
          logoPalette.accent,
          ...logoPalette.samples,
        ) ?? studio.accent_color;
      if (accent === studio.accent_color) return studio;
      return { ...studio, accent_color: accent };
    }

    const merged = mergeBrandWithLogo(studio, logoPalette);
    const accent =
      pickBrandGoldAccent(
        studio.accent_color,
        merged.accent,
        logoPalette.accent,
        ...logoPalette.samples,
      ) ?? pickVividAccent(merged.accent, logoPalette.accent);
    if (
      merged.primary === studio.primary_color &&
      merged.secondary === studio.secondary_color &&
      accent === studio.accent_color
    ) {
      return studio;
    }

    return {
      ...studio,
      primary_color: merged.primary,
      secondary_color: merged.secondary,
      accent_color: accent,
    };
  }
);

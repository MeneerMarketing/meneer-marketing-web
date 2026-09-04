import { cache } from "react";
import { analyzeLogoAppearance, stripLogoLightBackground } from "@/lib/logoColorExtractor";
import {
  fetchWebsiteLogoUrl,
  isGoogleBusinessProfilePhoto,
  resolveStudioLogoUrl,
} from "@/lib/studioLogo";
import type { StudioData } from "@/types/studio";

/** Vervangt Google-profielfoto's door het echte sitelogo en bepaalt hero-weergave. */
export const enrichStudioLogo = cache(
  async (studio: StudioData, websiteUrl?: string | null): Promise<StudioData> => {
    const rawLogo = studio.logo?.trim() ?? "";
    let logo = resolveStudioLogoUrl(rawLogo);

    if ((!logo || isGoogleBusinessProfilePhoto(rawLogo)) && websiteUrl?.trim()) {
      const fromSite = await fetchWebsiteLogoUrl(websiteUrl.trim());
      if (fromSite) logo = fromSite;
    }

    if (!logo) {
      if (rawLogo && !studio.logo_light) return studio;
      return { ...studio, logo: null, logo_light: undefined, logo_on_light_background: undefined };
    }

    const appearance = await analyzeLogoAppearance(logo);
    let logoLight = appearance?.isLight ?? studio.logo_light;
    let logoOnLightBackground =
      appearance?.hasOpaqueLightBackground ?? studio.logo_on_light_background;

    if (logoOnLightBackground && !logo.startsWith("data:")) {
      const stripped = await stripLogoLightBackground(logo);
      if (stripped) {
        logo = stripped;
        logoOnLightBackground = false;
        logoLight = false;
      }
    }

    if (
      logo === studio.logo &&
      logoLight === studio.logo_light &&
      logoOnLightBackground === studio.logo_on_light_background
    ) {
      return studio;
    }

    return {
      ...studio,
      logo,
      logo_light: logoLight,
      logo_on_light_background: logoOnLightBackground,
    };
  }
);

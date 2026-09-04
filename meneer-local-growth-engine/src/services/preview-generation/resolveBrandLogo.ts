import {
  fetchWebsiteLogoUrl,
  isGoogleBusinessProfilePhoto,
  pickWebsiteLogoFromHtml,
  upgradeLogoUrl,
} from "@/lib/studioLogo";
import { createRenderedHtmlSession } from "@/services/enrichment/renderedHtmlFetch";
import type { BrandProfile, WebsiteIntelligence } from "@/services/preview-generation/types";

export async function resolveBrandLogoFromWebsite(
  brand: BrandProfile,
  websiteUrl: string,
  intelligence: WebsiteIntelligence,
): Promise<BrandProfile> {
  if (brand.logo_url && !isGoogleBusinessProfilePhoto(brand.logo_url)) {
    return {
      ...brand,
      logo_url: upgradeLogoUrl(brand.logo_url),
    };
  }

  for (const page of intelligence.pages) {
    const fromHtml = pickWebsiteLogoFromHtml(page.html, page.url);
    if (fromHtml) {
      return {
        ...brand,
        logo_url: fromHtml,
        logo_source: "website_html",
        confidence: Math.max(brand.confidence, 0.55),
        sources: [...brand.sources, "website_html_logo"],
      };
    }
  }

  const fetched = await fetchWebsiteLogoUrl(websiteUrl);
  if (fetched) {
    return {
      ...brand,
      logo_url: fetched,
      logo_source: "website_fetch",
      confidence: Math.max(brand.confidence, 0.5),
      sources: [...brand.sources, "website_fetch_logo"],
    };
  }

  const session = await createRenderedHtmlSession();
  if (session) {
    try {
      const html = await session.fetch(websiteUrl);
      if (html) {
        const rendered = pickWebsiteLogoFromHtml(html, websiteUrl);
        if (rendered) {
          return {
            ...brand,
            logo_url: rendered,
            logo_source: "website_rendered",
            confidence: Math.max(brand.confidence, 0.6),
            sources: [...brand.sources, "website_rendered_logo"],
          };
        }
      }
    } finally {
      await session.close();
    }
  }

  return {
    ...brand,
    logo_url: null,
    logo_source: brand.logo_source ?? "none",
  };
}

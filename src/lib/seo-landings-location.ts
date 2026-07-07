import type { SeoLandingPage } from "@/data/seo-landings/types";
import { pick } from "@/lib/seo-landings-voice";

/** Basis voor stad-varianten: pas slug, keyword en locatie aan. */
export function withSeoLandingLocation(
  page: SeoLandingPage,
  location: SeoLandingPage["location"],
  slugSuffix: string,
): SeoLandingPage {
  if (!location) return page;

  const city = location.city;
  const cityLower = city.toLowerCase();
  const keyword = `${page.primaryKeyword} ${cityLower}`;
  const baseTitle = page.metaTitle.split("·")[0]?.trim() ?? page.metaTitle;
  const isApeldoorn = city === "Apeldoorn";

  const localSubTemplates = isApeldoorn
    ? [
        `${page.subheadline} Ik zit in Apeldoorn. Geen bureau op afstand dat de Veluwe alleen van de A1 kent. ${page.primaryKeyword} pak ik aan met lokale context én dezelfde custom build en campagnes als voor SkinComplete en BestRest.`,
        `${page.subheadline} Thuisbasis Apeldoorn, Veluwe, Gelderland. ${page.primaryKeyword} met cijfers open en een plan dat je begrijpt.`,
        `${page.subheadline} Vanuit Apeldoorn werk ik met MKB dat resultaat wil zien, geen maandrapport met groene pijltjes. ${page.primaryKeyword} included.`,
      ]
    : [
        `${page.subheadline} Ik help ondernemers in ${city}${location.region ? ` en ${location.region}` : ""} met ${page.primaryKeyword} dat rankt én converteert.`,
        `${page.subheadline} In ${city} win je online op vertrouwen en snelheid. ${page.primaryKeyword} zonder template-copy.`,
        `${page.subheadline} Ondernemers in ${city} ruiken generieke bureau-praat. ${page.primaryKeyword} schrijf ik voor jouw regio, niet voor 'Nederland generiek'.`,
      ];

  const localSub = pick(`${page.slug}-${slugSuffix}`, localSubTemplates, "local-sub");

  const eyebrowTwists = isApeldoorn
    ? [`${page.eyebrow} · Apeldoorn · thuisbasis`, `${page.eyebrow} · Veluwe · HQ`, `${page.eyebrow} · Apeldoorn`]
    : [`${page.eyebrow} · ${city}`, `${page.eyebrow} · ${city}${location.region ? ` · ${location.region}` : ""}`, `${page.eyebrow} · lokaal ${city}`];

  return {
    ...page,
    slug: `${page.slug}-${slugSuffix}`,
    primaryKeyword: keyword,
    location,
    metaTitle: isApeldoorn
      ? `${baseTitle} Apeldoorn · thuisbasis Meneer Marketing`
      : `${baseTitle} ${city} · Meneer Marketing`,
    metaDescription: page.metaDescription,
    eyebrow: pick(`${page.slug}-${slugSuffix}`, eyebrowTwists, "eyebrow"),
    headline: page.headline,
    headlineAccent: page.headlineAccent,
    subheadline: localSub,
    keywords: [
      ...page.keywords,
      keyword,
      `${page.primaryKeyword} ${cityLower}`,
      `${cityLower} ${page.category === "google-ads" ? "google ads" : page.primaryKeyword}`,
    ],
    visualCaption:
      page.visualCaption ??
      `Zo pakken we ${page.primaryKeyword} aan voor ondernemers rond ${city}.`,
  };
}

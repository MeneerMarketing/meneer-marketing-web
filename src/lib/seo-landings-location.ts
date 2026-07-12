import type { SeoLandingPage } from "@/data/seo-landings/types";
import type { SeoLandingCategory } from "@/data/seo-landings/types";
import { pick } from "@/lib/seo-landings-voice";

/** Categorie-specifieke lokale subheadlines (niet generiek voor elke stad). */
const LOCAL_SUB_BY_CATEGORY: Record<
  SeoLandingCategory,
  readonly string[]
> = {
  "google-ads": [
    "{base} In {city} adverteren Randstad-bureaus vaak op jouw regio. {kw} met landings die lokaal vertrouwen wekken wint van generieke campagnes.",
    "{base} Zoektermen in {city} zijn soms goedkoper dan in Amsterdam. Maar message match en snelheid moeten wél kloppen.",
    "{base} Ik beheer accounts voor MKB in {city}{region}. Geen white-label agency die je stad alleen als targeting ziet.",
  ],
  seo: [
    "{base} Lokaal ranken in {city} vraagt meer dan je adres in de footer. GBP, reviews en pagina's die {kw} echt beantwoorden.",
    "{base} Ondernemers in {city} zoeken '{kw}' steeds vaker op mobiel. Dan telt snelheid en een antwoord dat direct klopt.",
    "{base} Je concurreert in {region} met iedereen die dezelfde stad-keywords target. Unieke copy wint van template-SEO.",
  ],
  website: [
    "{base} Een site voor {city} moet op mobiel net zo overtuigen als op desktop. {kw} begint bij snelheid en duidelijke CTA.",
    "{base} Ondernemers in {city} vergelijken drie offertes online voordat ze bellen. Jouw site is die vergelijking.",
    "{base} {kw} in {region}: custom build die meegroeit, geen theme dat na een jaar knijpt.",
  ],
  shopify: [
    "{base} Webshops in {city} verkopen vaak ook buiten de regio. {kw} moet feed, checkout en mail in één lijn hebben.",
    "{base} Shopify in {region}: B2B, retail of beide. Ik bouw wat je shop vraagt, niet wat de theme store toevallig heeft.",
    "{base} {kw} voor ondernemers in {city} die willen schalen zonder elke week een nieuwe app te installeren.",
  ],
  content: [
    "{base} Content voor {city} moet vragen beantwoorden die mensen echt stellen, niet blogs voor Google van 2018.",
    "{base} {kw} in {region}: pagina's die ranken én in AI-antwoorden geciteerd kunnen worden.",
    "{base} Ondernemers in {city} hebben geen tijd voor vijf blogs per maand die niemand leest. Wel antwoorden die converteren.",
  ],
  "b2b-portal": [
    "{base} B2B in {city} loopt vaak via mail, Excel en telefoon. {kw} automatiseert wat nu uren kost.",
    "{base} Zakelijke klanten in {region} willen self-service. {kw} met portalen en koppelingen die kloppen.",
    "{base} {kw} voor MKB in {city} dat groeit zonder elke order handmatig te typen.",
  ],
};

function buildLocalSub(
  page: SeoLandingPage,
  city: string,
  region: string | undefined,
  slugKey: string,
): string {
  const regionSuffix = region ? ` en ${region}` : "";
  const templates = LOCAL_SUB_BY_CATEGORY[page.category];
  const template = pick(slugKey, templates, "local-sub-cat");
  return template
    .replaceAll("{base}", page.subheadline)
    .replaceAll("{city}", city)
    .replaceAll("{region}", regionSuffix)
    .replaceAll("{kw}", page.primaryKeyword);
}

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
  const slugKey = `${page.slug}-${slugSuffix}`;

  const localSubTemplates = isApeldoorn
    ? [
        `${page.subheadline} Ik zit in Apeldoorn. Geen bureau op afstand dat de Veluwe alleen van de A1 kent. ${page.primaryKeyword} pak ik aan met lokale context én dezelfde custom build en campagnes als voor SkinComplete en BestRest.`,
        `${page.subheadline} Thuisbasis Apeldoorn, Veluwe, Gelderland. ${page.primaryKeyword} met cijfers open en een plan dat je begrijpt.`,
        `${page.subheadline} Vanuit Apeldoorn werk ik met MKB dat resultaat wil zien, geen maandrapport met groene pijltjes. ${page.primaryKeyword} included.`,
      ]
    : [
        buildLocalSub(page, city, location.region, slugKey),
        `${page.subheadline} In ${city} win je online op vertrouwen en snelheid. ${keyword} zonder template-copy uit de Randstad.`,
        `${page.subheadline} Ondernemers in ${city}${location.region ? ` (${location.region})` : ""} merken binnen seconden of je ${page.primaryKeyword} serieus neemt of alleen je stadnaam invult.`,
      ];

  const localSub = pick(slugKey, localSubTemplates, "local-sub");

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
    eyebrow: pick(slugKey, eyebrowTwists, "eyebrow"),
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
      pick(slugKey, [
        `Zo pakken we ${page.primaryKeyword} aan voor ondernemers rond ${city}.`,
        `${page.primaryKeyword} in ${city}: plan op maat, geen template.`,
        `Illustratie bij ${keyword}. Lokaal vertrouwen, technisch scherp.`,
      ], "visual-cap-city"),
    layoutProfile: "city",
    skipSections: [
      ...(page.skipSections ?? []),
      "confession",
      "nightmare",
      "innerVoice",
    ],
  };
}

/**
 * Local Growth Engine branche-landings op meneermarketing.nl.
 * Live verticals hebben een volledige config + route onder src/app/.
 * Planned verticals staan klaar voor discovery + landingsbuild (zelfde architectuur als pilates).
 */

export type VerticalLandingStatus = "live" | "planned";

export interface VerticalRoadmapEntry {
  /** URL-segment, bv. pilates-studios */
  slug: string;
  /** Pad op meneermarketing.nl */
  path: `/${string}`;
  /** Key in LGE verticalLauncherCatalog / verticalOffers */
  lgeSlug: string;
  status: VerticalLandingStatus;
  verticalName: string;
  verticalNamePlural: string;
  /** Korte interne motivatie: waarom deze vertical past bij LGE */
  fitNote: string;
  /** 1 = eerst bouwen na live pilates + huidklinieken */
  buildPriority: 1 | 2 | 3;
  /** Draft SEO-focus (voor copy bij page build) */
  seoFocus: readonly string[];
}

export const VERTICAL_ROADMAP: readonly VerticalRoadmapEntry[] = [
  {
    slug: "pilates-studios",
    path: "/pilates-studios",
    lgeSlug: "pilates",
    status: "live",
    verticalName: "Pilates studio",
    verticalNamePlural: "Pilates studio's",
    fitNote: "Boeking, lokale SEO, premium positioning. Referentie-vertical.",
    buildPriority: 1,
    seoFocus: [
      "pilates website laten maken",
      "seo pilates studio",
      "pilates marketing",
    ],
  },
  {
    slug: "huidklinieken",
    path: "/huidklinieken",
    lgeSlug: "skin-clinics",
    status: "live",
    verticalName: "Huidkliniek",
    verticalNamePlural: "Huidklinieken",
    fitNote: "Hoge marge, behandelintent, Maps + vertrouwen. Skin Complete-case als proof.",
    buildPriority: 1,
    seoFocus: [
      "website huidkliniek",
      "lokale seo huidkliniek",
      "marketing huidkliniek",
    ],
  },
  {
    slug: "tandartsen",
    path: "/tandartsen",
    lgeSlug: "dentists",
    status: "planned",
    verticalName: "Tandartspraktijk",
    verticalNamePlural: "Tandartsen",
    fitNote:
      "Extreem lokale zoekintent, vaste patiëntenstroom, strenge trust-eisen. Hoge lifetime value.",
    buildPriority: 1,
    seoFocus: [
      "website tandarts",
      "tandarts seo",
      "nieuwe patiënten tandartspraktijk",
    ],
  },
  {
    slug: "fysiotherapie",
    path: "/fysiotherapie",
    lgeSlug: "physio",
    status: "planned",
    verticalName: "Fysiotherapiepraktijk",
    verticalNamePlural: "Fysiotherapeuten",
    fitNote:
      "Zoekvolume op klacht + plaats, verwijzingen, agenda-koppeling. Veel zwakke concurrent-sites.",
    buildPriority: 2,
    seoFocus: [
      "website fysiotherapeut",
      "fysiotherapie marketing",
      "lokale seo fysio",
    ],
  },
  {
    slug: "yoga-studios",
    path: "/yoga-studios",
    lgeSlug: "yoga",
    status: "planned",
    verticalName: "Yoga studio",
    verticalNamePlural: "Yoga studio's",
    fitNote:
      "Zelfde playbook als pilates: lessen, agenda, community. Snel te templaten na pilates.",
    buildPriority: 2,
    seoFocus: [
      "yoga studio website",
      "yoga marketing",
      "seo yoga studio",
    ],
  },
  {
    slug: "personal-trainers",
    path: "/personal-trainers",
    lgeSlug: "personal-training",
    status: "planned",
    verticalName: "Personal trainer",
    verticalNamePlural: "Personal trainers",
    fitNote:
      "1-op-1 en kleine groep, sterk op Instagram + Maps. Vaak ondergefinancierde sites.",
    buildPriority: 3,
    seoFocus: [
      "website personal trainer",
      "personal trainer marketing",
      "personal training seo",
    ],
  },
] as const;

export function getVerticalBySlug(slug: string): VerticalRoadmapEntry | undefined {
  return VERTICAL_ROADMAP.find((v) => v.slug === slug);
}

export function getVerticalByLgeSlug(lgeSlug: string): VerticalRoadmapEntry | undefined {
  return VERTICAL_ROADMAP.find((v) => v.lgeSlug === lgeSlug);
}

export function getLiveVerticals(): VerticalRoadmapEntry[] {
  return VERTICAL_ROADMAP.filter((v) => v.status === "live");
}

export function getPlannedVerticals(): VerticalRoadmapEntry[] {
  return [...VERTICAL_ROADMAP.filter((v) => v.status === "planned")].sort(
    (a, b) => a.buildPriority - b.buildPriority,
  );
}

export function isVerticalPathLive(path: string): boolean {
  return VERTICAL_ROADMAP.some((v) => v.status === "live" && v.path === path);
}

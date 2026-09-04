export type VerticalLauncherCatalogStatus = "ACTIVE" | "COMING_SOON";

/** Alias used in registry / launcher UI */
export type VerticalPackStatus = VerticalLauncherCatalogStatus;

export const verticalLauncherCatalog: Array<{
  slug: string;
  name: string;
  status: VerticalLauncherCatalogStatus;
  landingLive?: boolean;
}> = [
  { slug: "pilates", name: "Pilates", status: "ACTIVE", landingLive: true },
  {
    slug: "skin-clinics",
    name: "Huidklinieken",
    status: "ACTIVE",
    landingLive: true,
  },
  { slug: "dentists", name: "Tandartsen", status: "COMING_SOON" },
  { slug: "physio", name: "Fysiotherapie", status: "COMING_SOON" },
  { slug: "yoga", name: "Yoga studio's", status: "COMING_SOON" },
  {
    slug: "personal-training",
    name: "Personal training",
    status: "COMING_SOON",
  },
];

import type { MetadataRoute } from "next";
import { INSURERS } from "@/data/insurers";
import { PILLARS } from "@/data/pillars";
import { TREATMENTS } from "@/data/treatments";
import { DIBA_SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/huidproblemen",
  "/behandelingen",
  "/team",
  "/ons-verbond",
  "/is-het-nodig",
  "/intake",
  "/over-ons",
  "/ons-verhaal",
  "/contact",
  "/prijzen",
  "/vergoedingen",
  "/reviews",
  "/resultaten",
  "/nazorg",
  "/laserontharing",
  "/laserontharing/configurator",
  "/dit-behandelen-wij-niet",
  "/doelgroep",
  "/werken-bij",
  "/privacybeleid",
  "/cookiebeleid",
  "/algemene-voorwaarden",
  "/pcos",
  "/gentlemax-pro",
  "/doelgroep/jongeren",
  "/doelgroep/mannen",
  "/doelgroep/huid-van-kleur",
  "/doelgroep/bruiden",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${DIBA_SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/huidproblemen" ? 0.9 : 0.7,
  }));

  const pillarEntries: MetadataRoute.Sitemap = PILLARS.map((p) => ({
    url: `${DIBA_SITE_URL}/huidproblemen/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const treatmentEntries: MetadataRoute.Sitemap = TREATMENTS.map((t) => ({
    url: `${DIBA_SITE_URL}/behandelingen/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const insurerEntries: MetadataRoute.Sitemap = INSURERS.map((i) => ({
    url: `${DIBA_SITE_URL}/vergoedingen/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...pillarEntries, ...treatmentEntries, ...insurerEntries];
}

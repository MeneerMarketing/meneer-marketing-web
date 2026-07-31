import type { MetadataRoute } from "next";
import { INSURERS } from "@/data/insurers";
import { PILLARS } from "@/data/pillars";
import { TREATMENTS } from "@/data/treatments";
import { isPaginaAf, poortjeActief } from "@/lib/pagina-af";
import { DIBA_SITE_URL } from "@/lib/site";

/**
 * Alleen afgeronde pagina's worden bij Google aangemeld (DIBA-RULES §2 en §15).
 *
 * De sitemap meldde eerder alle ~66 routes aan, waarvan het grootste deel nog uit
 * placeholders bestond. Voor een nieuw domein is dat de slechtst mogelijke start.
 *
 * Twee mechanismen, allebei nodig:
 * - Datagedreven routes (huidproblemen, behandelingen, vergoedingen) worden
 *   automatisch gefilterd op redactievlaggen. Die controleren zichzelf.
 * - Statische routes staan hieronder met de hand, want hun inhoud zit verspreid over
 *   template, data en pagina. Standaard staat een route dus NIET in de sitemap.
 *   Zet hem er pas bij als de pagina echt af is; dat is een bewuste handeling.
 */
const STATISCH_GEREED: readonly string[] = [
  "", // homepage
];

/**
 * Routes die bestaan maar nog niet af zijn. Hier alleen genoteerd zodat zichtbaar is
 * wat er nog wacht. Zolang het poortje uit staat (zie lib/pagina-af.ts) dragen ze géén
 * noindex; deze lijst is dan puur de werkvoorraad.
 */
const STATISCH_IN_AANBOUW: readonly string[] = [
  "/huidproblemen",
  // Huidproblemen met een eigen, uitgebouwde pagina. Ze staan hier los genoteerd
  // omdat ze niet meer via PILLARS lopen: die filter kijkt naar de data, en deze
  // pagina's hebben hun eigen inhoud. Ze blijven uit de sitemap tot Rojda de
  // medische inhoud heeft nagelopen en de prijzen erin staan.
  "/huidproblemen/acne",
  "/huidproblemen/pigmentvlekken",
  "/huidproblemen/rosacea",
  "/huidproblemen/littekens",
  "/huidproblemen/huidveroudering",
  "/huidproblemen/porien",
  "/huidproblemen/donkere-kringen",
  "/huidproblemen/moedervlekken",
  "/huidproblemen/melasma",
  "/huidproblemen/droge-huid",
  "/huidproblemen/gevoelige-huid",
  "/huidproblemen/eczeem",
  "/huidproblemen/psoriasis",
  "/huidproblemen/huiduitslag",
  "/huidproblemen/cellulitis",
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

/** Voor gebruik in tests en in de dev-overzichten. */
export const SITEMAP_STATUS = {
  gereed: STATISCH_GEREED,
  inAanbouw: STATISCH_IN_AANBOUW,
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Dezelfde schakelaar als bij de metadata (zie lib/pagina-af.ts). Met het poortje uit
  // meldt de sitemap alles aan; staat hij aan, dan blijven onafgeronde routes eruit.
  const gereed = (content: unknown) => !poortjeActief() || isPaginaAf(content);

  const statisch: MetadataRoute.Sitemap = STATISCH_GEREED.map((path) => ({
    url: `${DIBA_SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const pillars: MetadataRoute.Sitemap = PILLARS.filter(gereed).map((p) => ({
    url: `${DIBA_SITE_URL}/huidproblemen/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const behandelingen: MetadataRoute.Sitemap = TREATMENTS.filter(gereed).map((t) => ({
    url: `${DIBA_SITE_URL}/behandelingen/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // Vergoedingen staan bewust op de handrem. De automatische check keek ze door,
  // want een record `{slug, name}` bevat geen redactievlaggen — maar de pagina's
  // renderden 37 woorden met lege kopjes ("Wat vergoed wordt" zonder inhoud).
  // Zet dit op true zodra insurers.ts per verzekeraar echte tekst bevat.
  const VERGOEDINGEN_GEREED = false;

  const vergoedingen: MetadataRoute.Sitemap = VERGOEDINGEN_GEREED
    ? INSURERS.filter(gereed).map((i) => ({
        url: `${DIBA_SITE_URL}/vergoedingen/${i.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    : [];

  return [...statisch, ...pillars, ...behandelingen, ...vergoedingen];
}

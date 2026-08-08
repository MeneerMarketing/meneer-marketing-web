/**
 * SEO growth freeze (P0.1, MAX-SEO plan, 2 aug 2026)
 *
 * Doel: stoppen met meer `/zoeken/`-landings tot consolidatie klaar is.
 * Prunen / noindex / 301 (aantal omlaag) mag wél.
 * Ceiling verhogen = freeze bewust opheffen (alleen na P0 consolidatie).
 *
 * Planstatus:
 * [x] P0.1 Freeze nieuwe landings
 * [x] P0.2 Page weight money-pages (inlineCss uit → ~254KB HTML)
 * [x] P0.3 Cannibal-clusters (slice 1+2: 31 nationale 301s)
 * [x] P0.4 City prune + Apeldoorn 45→8
 * [x] P0.5 Interne links naar top hubs (footer, home, pillars)
 * [~] P1 Hub-verdieping (slice-2 hubs editorial) · kennisbank spokes nog open
 */

/** Zet op false alleen als consolidatie klaar is en groei weer mag. */
export const SEO_LANDING_GROWTH_FROZEN = true;

/**
 * Maximum aantal `/zoeken/`-pagina’s tijdens freeze.
 * Was 316 → 294 → 163 → 154 (cannibal slice 2).
 * Na prune: verlaag dit getal mee (niet omhoog).
 */
export const SEO_LANDING_COUNT_CEILING = 154;

export function assertSeoLandingGrowthFreeze(pageCount: number): void {
  if (!SEO_LANDING_GROWTH_FROZEN) return;

  if (pageCount > SEO_LANDING_COUNT_CEILING) {
    throw new Error(
      [
        `SEO landing growth freeze actief: ${pageCount} pagina's > ceiling ${SEO_LANDING_COUNT_CEILING}.`,
        "Freeze actief: nieuwe /zoeken-landings, city-trio fills en national batches gepauzeerd tot consolidatie klaar is.",
        "Prunen mag (ceiling in growth-freeze.ts verlagen).",
        "Freeze opheffen: SEO_LANDING_GROWTH_FROZEN = false ná P0 (page weight, cannibal, city prune).",
      ].join(" "),
    );
  }
}

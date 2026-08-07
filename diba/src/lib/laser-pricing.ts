import {
  LASER_ZONES,
  type LaserGeslacht,
  type LaserZone,
} from "@/data/laser-zones";

/**
 * De rekenkern van de laserconfigurator.
 *
 * Deze module bepaalt welke regels je betaalt, en dat is de moeilijke helft. De bedragen
 * zelf komen uit `laser-zones.ts` en zijn inmiddels de echte gepubliceerde tarieven van
 * de kliniek; toen ze er nog niet waren rekende dit al correct met nullen.
 *
 * Een prijs van nul betekent "nog niet bekend" en nooit "gratis". Dat verschil staat in
 * `formatLaserPrice`, en het is belangrijker dan het lijkt: wie € 0 ziet staan denkt aan
 * een aanbieding, en dat is precies het soort verwachting dat §7 verbiedt.
 */

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const PRIJS_ONBEKEND = "Nog niet bekend";

/**
 * Gaf eerder letterlijk "[PRIJS-NODIG]" terug, en dat stond dus als vlag op het scherm bij
 * iedereen die de configurator opende. Vlaggen horen in de broncode, niet in beeld.
 */
export function formatLaserPrice(value: number): string {
  if (value === 0) return PRIJS_ONBEKEND;
  return euro.format(value);
}

export type LaserPriceLine = {
  zoneId: string;
  label: string;
  amount: number;
  formatted: string;
};

export type LaserPriceSummary = {
  lines: LaserPriceLine[];
  subtotal: number;
  formattedSubtotal: string;
  /** Minstens één gekozen zone heeft nog geen tarief. */
  hasMissingPrices: boolean;
  zoneCount: number;
};

function zoneById(id: string): LaserZone | undefined {
  return LASER_ZONES.find((z) => z.id === id);
}

/**
 * Berekent de opbouw voor de gekozen zones. Een pakket vervangt de losse zones die het
 * dekt, zodat er nooit twee keer voor hetzelfde stuk huid wordt gerekend.
 */
export function calculateLaserPrice(
  selectedZoneIds: readonly string[],
): LaserPriceSummary {
  const packages = selectedZoneIds.filter(
    (id) => zoneById(id)?.area === "pakket",
  );

  const gedekt = new Set<string>();
  for (const pkgId of packages) {
    zoneById(pkgId)?.includesZones?.forEach((z) => gedekt.add(z));
  }

  /* Ook een pakket kan door een groter pakket gedekt worden: full body bevat de drie
     andere. Zonder die uitzondering betaal je bij "full body plus bovenlichaam" twee keer
     voor hetzelfde bovenlichaam. */
  const zichtbaar = [...new Set(selectedZoneIds)].filter(
    (id) => !gedekt.has(id),
  );

  const lines: LaserPriceLine[] = zichtbaar
    .map((id) => {
      const z = zoneById(id);
      if (!z) return null;
      return {
        zoneId: id,
        label: z.label,
        amount: z.singlePrice,
        formatted: formatLaserPrice(z.singlePrice),
      };
    })
    .filter((l): l is LaserPriceLine => l !== null);

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  return {
    lines,
    subtotal,
    formattedSubtotal: formatLaserPrice(subtotal),
    hasMissingPrices: lines.some((l) => l.amount === 0),
    zoneCount: lines.length,
  };
}

/**
 * Zones die wél gekozen zijn maar door een pakket worden gedekt. Die verdwijnen uit de
 * opbouw, en zonder deze lijst zou dat lijken op iets wat de configurator kwijt is.
 */
export function gedekteZones(selectedZoneIds: readonly string[]): string[] {
  const packages = selectedZoneIds.filter(
    (id) => zoneById(id)?.area === "pakket",
  );
  const gedekt = new Set<string>();
  for (const pkgId of packages) {
    zoneById(pkgId)?.includesZones?.forEach((z) => gedekt.add(z));
  }
  return selectedZoneIds.filter((id) => gedekt.has(id));
}

export type PakketAdvies = {
  readonly pakketId: string;
  readonly label: string;
  /** Hoeveel van de zones in dit pakket al gekozen zijn. */
  readonly gekozen: number;
  readonly totaal: number;
  /** Welke zones er nog bij zouden komen. */
  readonly erbij: readonly string[];
};

/**
 * Kijkt of de gekozen zones dicht tegen een pakket aan zitten.
 *
 * Dit is bewust geen verkooptruc met een afteller of een "nog maar één zone te gaan". Het
 * is een constatering: je hebt vier van de vijf delen van een pakket aangewezen, dus dat
 * is het vermelden waard. Of het goedkoper uitkomt kunnen we pas zeggen als de tarieven er
 * zijn, en daarom staat dat er nu niet bij.
 *
 * De drempel ligt op de helft. Lager dan dat is het geen constatering meer maar duwen.
 */
export function pakketAdvies(
  selectedZoneIds: readonly string[],
): PakketAdvies | null {
  const gekozenSet = new Set(selectedZoneIds);
  /* Een pakket dat al in een groter pakket zit hoeft niet meer aangeraden te worden. */
  const alGedekt = new Set(gedekteZones(selectedZoneIds));

  return (
    LASER_ZONES.filter(
      (z) =>
        z.area === "pakket" &&
        z.includesZones &&
        !gekozenSet.has(z.id) &&
        !alGedekt.has(z.id),
    )
      .map((pkg) => {
        /* Pakketten die andere pakketten bevatten (full body) tellen alleen hun losse
           zones mee, anders is de teller niet uit te leggen. */
        const delen = (pkg.includesZones ?? []).filter(
          (id) => zoneById(id)?.area !== "pakket",
        );
        const gekozen = delen.filter((id) => gekozenSet.has(id));
        return {
          pakketId: pkg.id,
          label: pkg.label,
          gekozen: gekozen.length,
          totaal: delen.length,
          erbij: delen.filter((id) => !gekozenSet.has(id)),
        };
      })
      .filter(
        (k) =>
          k.totaal > 0 &&
          k.gekozen >= Math.ceil(k.totaal / 2) &&
          k.erbij.length > 0,
      )
      /* Het pakket waar je het dichtst bij zit, en bij gelijke stand het kleinste. */
      .sort(
        (a, b) =>
          b.gekozen / b.totaal - a.gekozen / a.totaal || a.totaal - b.totaal,
      )[0] ?? null
  );
}

export function toggleZoneSelection(
  current: readonly string[],
  zoneId: string,
): string[] {
  const zone = zoneById(zoneId);
  if (!zone) return [...current];

  if (current.includes(zoneId)) return current.filter((id) => id !== zoneId);

  /*
   * De zones die een pakket dekt blijven in de keuze staan, ze verdwijnen alleen uit de
   * opbouw. Dat is bewust: wie eerst borst, buik en oksel aanwijst en dan het pakket kiest,
   * ziet zijn drie zones aangewezen blijven op de tekening in plaats van ze te zien
   * verdampen. Zet hij het pakket weer uit, dan staat zijn oorspronkelijke keuze er nog.
   *
   * Het niet dubbel rekenen gebeurt in `calculateLaserPrice`, waar het hoort.
   */
  return [...new Set([...current, zoneId])];
}

/** De keuze in de URL, zodat je hem kunt bewaren of doorsturen. */
export function zonesNaarQuery(
  zones: readonly string[],
  huidtype: string | null,
  geslacht: LaserGeslacht,
): string {
  const p = new URLSearchParams();
  /* De prijslijst staat er altijd in, ook bij een lege keuze. Zonder dat opent een
     gedeelde link bij de ander op de andere lijst, met dezelfde zonenamen en andere
     bedragen ernaast. Dat is het soort fout dat niemand ziet gebeuren. */
  p.set("lijst", geslacht);
  if (zones.length) p.set("zones", zones.join(","));
  if (huidtype) p.set("type", huidtype);
  return `?${p.toString()}`;
}

export function zonesUitQuery(zoek: string): {
  zones: string[];
  huidtype: string | null;
  geslacht: LaserGeslacht;
} {
  const p = new URLSearchParams(zoek);
  const lijst = p.get("lijst");
  const geslacht: LaserGeslacht = lijst === "heren" ? "heren" : "dames";
  const zones = (p.get("zones") ?? "")
    .split(",")
    .map((s) => s.trim())
    /* Ook op geslacht filteren: een oude link kan zones van de andere lijst bevatten,
       en die zouden hier stilletjes meetellen in een opbouw die ze niet toont. */
    .filter((id) =>
      LASER_ZONES.some((z) => z.id === id && z.geslacht === geslacht),
    );
  return { zones, huidtype: p.get("type"), geslacht };
}

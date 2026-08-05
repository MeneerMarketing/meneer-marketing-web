/**
 * De prijslijst.
 *
 * Deze module verzint niets en typt niets over. Elke regel komt uit de bron waar die
 * hoort: behandelingen uit `behandelingen.ts`, laserzones uit `laser-zones.ts`. Dat is
 * niet uit netheid maar omdat het anders gegarandeerd misgaat: een prijs die op twee
 * plekken staat, staat binnen een maand twee keer verschillend.
 *
 * De vorige versie bouwde de laserlijst met een hulpfunctie die elke prijs op nul zette.
 * De tarieven stonden er toen niet, dus dat viel niet op; sinds ze er wel staan zou de
 * prijzenpagina overal € 0 hebben laten zien terwijl de configurator ernaast de juiste
 * bedragen toonde.
 *
 * De bedragen zijn voorlopig zolang `VOORLOPIGE_PRIJZEN` aan staat. Zie `laser-zones.ts`.
 */

import type { PriceRow } from "@/components/ui/PriceTable";
import { BEHANDELINGEN } from "@/data/behandelingen";
import { LASER_ZONES, VOORLOPIGE_PRIJZEN, type LaserZoneArea } from "@/data/laser-zones";
import { publicCopy } from "@/lib/copy-flags";

export { VOORLOPIGE_PRIJZEN };

export type PriceCategory = "alle" | "huid" | "laser" | "meting";

export type PriceCategoryMeta = {
  readonly id: PriceCategory;
  readonly label: string;
};

export const PRICE_CATEGORIES: readonly PriceCategoryMeta[] = [
  { id: "alle", label: "Alles" },
  { id: "huid", label: "Huidbehandelingen" },
  { id: "laser", label: "Laserontharing" },
  { id: "meting", label: "Metingen" },
] as const;

export type PriceSection = {
  readonly id: string;
  readonly category: Exclude<PriceCategory, "alle">;
  readonly caption: string;
  /** Eén regel context onder de kop. Wat je krijgt voor dat bedrag. */
  readonly zin?: string;
  readonly rows: readonly PriceRow[];
};

function laserRijen(area: LaserZoneArea): PriceRow[] {
  return LASER_ZONES.filter((z) => z.area === area).map((z) => ({
    name: z.label,
    single: z.singlePrice,
    ...(z.traject ? { traject: z.traject } : {}),
  }));
}

const huidbehandelingen = BEHANDELINGEN.filter((b) => b.slug !== "huidanalyse");
const huidanalyse = BEHANDELINGEN.find((b) => b.slug === "huidanalyse");

export const PRICE_SECTIONS: readonly PriceSection[] = [
  {
    id: "huid",
    category: "huid",
    caption: "Huidbehandelingen",
    zin: "Prijs per sessie. Hoeveel sessies je nodig hebt hangt af van je huid en hoor je in de intake.",
    rows: huidbehandelingen.map((b) => ({ name: b.naam, single: b.prijs })),
  },
  {
    id: "meting",
    category: "meting",
    caption: "Metingen",
    zin: publicCopy(
      huidanalyse?.kort ?? "",
      "Meten onder vast licht, zonder dat er iets aan je huid gebeurt.",
    ),
    rows: huidanalyse ? [{ name: huidanalyse.naam, single: huidanalyse.prijs }] : [],
  },
  {
    id: "laser-gelaat",
    category: "laser",
    caption: "Laserontharing, gelaat",
    rows: laserRijen("gelaat"),
  },
  {
    id: "laser-boven",
    category: "laser",
    caption: "Laserontharing, bovenlichaam",
    rows: laserRijen("bovenlichaam"),
  },
  {
    id: "laser-onder",
    category: "laser",
    caption: "Laserontharing, onderlichaam",
    rows: laserRijen("onderlichaam"),
  },
  {
    id: "laser-pakketten",
    category: "laser",
    caption: "Laserontharing, pakketten",
    zin: "Een pakket vervangt de losse zones die erin zitten; die tellen dan niet nog een keer mee.",
    rows: laserRijen("pakket"),
  },
] as const;

export function sectionsForCategory(
  category: PriceCategory,
): readonly PriceSection[] {
  if (category === "alle") return PRICE_SECTIONS;
  return PRICE_SECTIONS.filter((s) => s.category === category);
}

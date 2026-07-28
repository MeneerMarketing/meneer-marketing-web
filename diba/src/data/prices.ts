import type { PriceRow } from "@/components/ui/PriceTable";
import { LASER_ZONES } from "@/data/laser-zones";
import { TREATMENTS } from "@/data/treatments";

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

const prijsRij = (name: string): PriceRow => ({
  name,
  single: 0,
  traject: { price: 0, sessions: "[COPY-NODIG]", perMonth: 0 },
});

export type PriceSection = {
  readonly id: string;
  readonly category: Exclude<PriceCategory, "alle">;
  readonly caption: string;
  readonly rows: readonly PriceRow[];
};

export const PRICE_SECTIONS: readonly PriceSection[] = [
  ...TREATMENTS.filter((t) => t.slug !== "huidanalyse").map((t) => ({
    id: t.slug,
    category: "huid" as const,
    caption: t.titel.replace(/\*/g, ""),
    rows: t.prijzen.rows,
  })),
  {
    id: "huidanalyse",
    category: "meting",
    caption: "De Nulmeting met Eve-M",
    rows: TREATMENTS.find((t) => t.slug === "huidanalyse")?.prijzen.rows ?? [prijsRij("[COPY-NODIG]")],
  },
  {
    id: "laser-gelaat",
    category: "laser",
    caption: "Laserontharing · gelaat",
    rows: LASER_ZONES.filter((z) => z.area === "gelaat").map((z) =>
      prijsRij(z.label),
    ),
  },
  {
    id: "laser-boven",
    category: "laser",
    caption: "Laserontharing · bovenlichaam",
    rows: LASER_ZONES.filter((z) => z.area === "bovenlichaam").map((z) =>
      prijsRij(z.label),
    ),
  },
  {
    id: "laser-onder",
    category: "laser",
    caption: "Laserontharing · onderlichaam",
    rows: LASER_ZONES.filter((z) => z.area === "onderlichaam").map((z) =>
      prijsRij(z.label),
    ),
  },
  {
    id: "laser-pakketten",
    category: "laser",
    caption: "Laserontharing · pakketten",
    rows: LASER_ZONES.filter((z) => z.area === "pakket").map((z) =>
      prijsRij(z.label),
    ),
  },
] as const;

export function sectionsForCategory(category: PriceCategory): readonly PriceSection[] {
  if (category === "alle") return PRICE_SECTIONS;
  return PRICE_SECTIONS.filter((s) => s.category === category);
}

import { maakPillarSkelet } from "@/lib/pillar-factory";
import type { PillarContent } from "@/components/templates/PillarTemplate";

export const PILLARS: PillarContent[] = [
  maakPillarSkelet({
    slug: "acne",
    titel: "Acne: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Acneplan",
    nazorgSlug: "acne",
  }),
  maakPillarSkelet({
    slug: "pigmentvlekken",
    titel: "Pigmentvlekken: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Pigmentplan",
    nazorgSlug: "pigmentvlekken",
  }),
  maakPillarSkelet({
    slug: "rosacea",
    titel: "Rosacea en couperose: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Rosaceaplan",
    nazorgSlug: "rosacea",
  }),
  maakPillarSkelet({
    slug: "huidveroudering",
    titel: "Huidveroudering: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Anti-agingplan",
    nazorgSlug: "huidveroudering",
  }),
  maakPillarSkelet({
    slug: "littekens",
    titel: "Littekens en striae: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Littekenplan",
  }),
  maakPillarSkelet({
    slug: "striae",
    titel: "Striae: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Striaeplan",
  }),
  maakPillarSkelet({
    slug: "porien",
    titel: "Grove poriën: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Poriënplan",
  }),
  maakPillarSkelet({
    slug: "droge-huid",
    titel: "Droge huid: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Hydratieplan",
  }),
  maakPillarSkelet({
    slug: "gevoelige-huid",
    titel: "Gevoelige huid: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Gevoeligheidsplan",
  }),
  maakPillarSkelet({
    slug: "melasma",
    titel: "Melasma: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Melasmaplan",
  }),
  maakPillarSkelet({
    slug: "donkere-kringen",
    titel: "Donkere kringen: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Oogplan",
  }),
  maakPillarSkelet({
    slug: "huiduitslag",
    titel: "Huiduitslag: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Uitslagplan",
  }),
  maakPillarSkelet({
    slug: "eczeem",
    titel: "Eczeem: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Eczeemplan",
  }),
  maakPillarSkelet({
    slug: "psoriasis",
    titel: "Psoriasis: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Psoriasisplan",
  }),
  maakPillarSkelet({
    slug: "keloiden",
    titel: "Keloiden: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Keloidenplan",
  }),
  maakPillarSkelet({
    slug: "huidkanker-naevi",
    titel: "Moedervlekken controleren: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Controleplan",
  }),
  maakPillarSkelet({
    slug: "cellulitis",
    titel: "Cellulitis: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Cellulitisplan",
  }),
  maakPillarSkelet({
    slug: "huidverkleuring",
    titel: "Huidverkleuring: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Verkleuringsplan",
  }),
  maakPillarSkelet({
    slug: "symptoomzoeker",
    titel: "Iets anders aan je huid: eerst begrijpen, dan *behandelen*",
    planNaam: "Het Startplan",
  }),
];

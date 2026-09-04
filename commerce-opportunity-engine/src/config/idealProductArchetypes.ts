/**
 * Milestone 9.3.1 — IDEAL_PRODUCT_ARCHETYPES_V1.
 *
 * Prospect-first discovery starts at the product archetype, not at buyer intent.
 * A keyword only enters discovery when it belongs to an enabled branch and to a
 * product family that can carry a deep-dive PDP.
 */

export const IDEAL_PRODUCT_ARCHETYPES_VERSION = "IDEAL_PRODUCT_ARCHETYPES_V1" as const;

export type ProductArchetypeId =
  | "BEAUTY_DEVICES"
  | "SKINCARE_DEVICES"
  | "HAIR_SCALP_TECH"
  | "WELLNESS_DEVICES"
  | "RECOVERY_PRODUCTS"
  | "PERSONAL_CARE_TECH"
  | "HOME_WELLNESS_TECH"
  | "NICHE_CONSUMER_TECH"
  | "SLEEP_COMFORT"
  | "PET_TECH"
  | "PREMIUM_PET"
  | "NICHE_HOME_COMFORT"
  | "FITNESS_SPECIALIST";

/** Traits that make a product type suitable for a personalized deep-dive PDP. */
export interface ArchetypeDeepDiveTraits {
  highConsideration: number;
  visualStorytelling: number;
  featureRich: number;
  heroProductPotential: number;
  premiumPrice: number;
  brandDifferentiation: number;
}

/** Traits that make a product type unsuitable, no matter the buyer intent. */
export interface ArchetypeCommodityTraits {
  commodity: number;
  priceOnlyCompetition: number;
  massRetailCategory: number;
  marketplaceDominated: number;
  simpleStandardized: number;
}

export interface ProductFamily {
  /** Stable id used as keyword lineage source. */
  id: string;
  label: string;
  /** Seed queries used for controlled keyword expansion. Never random. */
  seeds: string[];
  /** Tokens that mark a keyword as belonging to this family. */
  matchTokens: string[];
  /** Tokens that disqualify a keyword even inside this family. */
  rejectTokens: string[];
  /** Family-level adjustment on top of the archetype baseline (-30..+20). */
  fitModifier: number;
}

export interface ProductArchetype {
  id: ProductArchetypeId;
  label: string;
  enabled: boolean;
  /** Maps to the existing keyword category taxonomy. */
  keywordCategory: string;
  /** Share of the discovery budget when enabled. Normalized at runtime. */
  budgetShare: number;
  deepDive: ArchetypeDeepDiveTraits;
  commodity: ArchetypeCommodityTraits;
  families: ProductFamily[];
  notes: string;
}

const NEUTRAL_COMMODITY: ArchetypeCommodityTraits = {
  commodity: 10,
  priceOnlyCompetition: 15,
  massRetailCategory: 15,
  marketplaceDominated: 15,
  simpleStandardized: 10,
};

export const IDEAL_PRODUCT_ARCHETYPES_V1: ProductArchetype[] = [
  {
    id: "BEAUTY_DEVICES",
    label: "Beauty Devices",
    enabled: true,
    keywordCategory: "BEAUTY_SKINCARE",
    budgetShare: 0.18,
    deepDive: {
      highConsideration: 95,
      visualStorytelling: 92,
      featureRich: 95,
      heroProductPotential: 95,
      premiumPrice: 92,
      brandDifferentiation: 90,
    },
    commodity: { ...NEUTRAL_COMMODITY, commodity: 5, massRetailCategory: 25 },
    families: [
      {
        id: "led_masks",
        label: "LED-maskers",
        seeds: ["led masker gezicht", "led lichttherapie masker", "rood licht masker huid"],
        matchTokens: ["led masker", "ledmasker", "lichttherapie", "rood licht", "roodlicht"],
        rejectTokens: ["kruidvat", "douglas", "action"],
        fitModifier: 12,
      },
      {
        id: "microneedling_devices",
        label: "Microneedling & derma devices",
        seeds: ["microneedling pen thuis", "dermapen apparaat", "derma roller professioneel"],
        matchTokens: ["microneedling", "dermapen", "derma pen", "derma roller", "dermaroller"],
        rejectTokens: [],
        fitModifier: 10,
      },
      {
        id: "ipl_hair_removal",
        label: "IPL ontharing",
        seeds: ["ipl apparaat ontharen", "ipl ontharing thuis", "laser ontharing apparaat"],
        matchTokens: ["ipl", "laserontharing", "laser ontharing", "ontharingsapparaat"],
        rejectTokens: [],
        fitModifier: 8,
      },
    ],
    notes: "Hoge uitleg-behoefte, veel techniek, sterke hero-product logica.",
  },
  {
    id: "SKINCARE_DEVICES",
    label: "Skincare Devices",
    enabled: true,
    keywordCategory: "BEAUTY_SKINCARE",
    budgetShare: 0.12,
    deepDive: {
      highConsideration: 88,
      visualStorytelling: 88,
      featureRich: 85,
      heroProductPotential: 88,
      premiumPrice: 82,
      brandDifferentiation: 85,
    },
    commodity: { ...NEUTRAL_COMMODITY, massRetailCategory: 30 },
    families: [
      {
        id: "microcurrent",
        label: "Microcurrent & lifting devices",
        seeds: ["microcurrent apparaat gezicht", "lifting apparaat huid", "radiofrequentie apparaat gezicht"],
        matchTokens: ["microcurrent", "radiofrequentie", "rf apparaat", "lifting apparaat", "ems gezicht"],
        rejectTokens: [],
        fitModifier: 10,
      },
      {
        id: "cleansing_devices",
        label: "Reinigings- en huidverzorgingsapparaten",
        seeds: ["reinigingsapparaat gezicht", "ultrasoon spatel huid", "hydradermabrasie apparaat thuis"],
        matchTokens: ["ultrasoon spatel", "hydradermabrasie", "dermabrasie", "gezichtsborstel", "reinigingsapparaat"],
        rejectTokens: [],
        fitModifier: 4,
      },
    ],
    notes: "Alleen devices. Losse serums en crèmes zijn reseller-terrein.",
  },
  {
    id: "HAIR_SCALP_TECH",
    label: "Hair & Scalp Tech",
    enabled: true,
    keywordCategory: "HAIRCARE",
    budgetShare: 0.12,
    deepDive: {
      highConsideration: 92,
      visualStorytelling: 82,
      featureRich: 88,
      heroProductPotential: 92,
      premiumPrice: 88,
      brandDifferentiation: 85,
    },
    commodity: { ...NEUTRAL_COMMODITY, massRetailCategory: 25 },
    families: [
      {
        id: "laser_hair_growth",
        label: "Laser- en LED-haargroei",
        seeds: [
          "laserhelm haargroei",
          "led haargroei helm thuis",
          "laserkam haaruitval apparaat",
        ],
        matchTokens: [
          "laserhelm",
          "laser helm",
          "haargroei helm",
          "haargroei laser",
          "laserkam",
          "haargroei apparaat",
        ],
        rejectTokens: ["shampoo", "supplement", "pillen", "transplantatie", "kliniek"],
        fitModifier: 12,
      },
      {
        id: "scalp_treatment_devices",
        label: "Hoofdhuidbehandeling apparaten",
        seeds: [
          "hoofdhuid apparaat behandeling thuis",
          "microneedling hoofdhuid apparaat",
        ],
        matchTokens: ["hoofdhuid apparaat", "hoofdhuid laser", "scalp device", "hoofdhuidmassage apparaat"],
        rejectTokens: ["shampoo", "serum", "kliniek"],
        fitModifier: 8,
      },
    ],
    notes:
      "Haargroeitechniek: hoge prijs, veel uitleg, sterke voor/na logica. Shampoos en supplementen horen er niet bij.",
  },
  {
    id: "PERSONAL_CARE_TECH",
    label: "Personal Care Tech",
    enabled: true,
    keywordCategory: "PERSONAL_CARE",
    budgetShare: 0.1,
    deepDive: {
      highConsideration: 84,
      visualStorytelling: 80,
      featureRich: 88,
      heroProductPotential: 85,
      premiumPrice: 80,
      brandDifferentiation: 78,
    },
    commodity: { ...NEUTRAL_COMMODITY, massRetailCategory: 35, marketplaceDominated: 30 },
    families: [
      {
        id: "oral_care_devices",
        label: "Premium mondverzorging",
        seeds: [
          "monddouche waterflosser professioneel",
          "tandsteen verwijderaar ultrasoon apparaat",
        ],
        matchTokens: ["monddouche", "waterflosser", "tandsteen verwijderaar", "ultrasone tandenreiniger"],
        rejectTokens: ["tandpasta", "mondwater", "tandarts", "beugel"],
        fitModifier: 6,
      },
    ],
    notes:
      "Alleen devices die uitleg vragen. Verbruiksartikelen en drogisterij-assortiment blijven buiten.",
  },
  {
    id: "HOME_WELLNESS_TECH",
    label: "Home Wellness Tech",
    enabled: true,
    keywordCategory: "HOME_LIVING",
    budgetShare: 0.12,
    deepDive: {
      highConsideration: 88,
      visualStorytelling: 84,
      featureRich: 86,
      heroProductPotential: 88,
      premiumPrice: 88,
      brandDifferentiation: 80,
    },
    commodity: { ...NEUTRAL_COMMODITY, massRetailCategory: 30, marketplaceDominated: 25 },
    families: [
      {
        id: "home_spa_systems",
        label: "Thuis spa- en wellnesssystemen",
        seeds: [
          "infrarood cabine thuis specialist",
          "stoomcabine thuis systeem",
          "hottub op maat systeem",
        ],
        matchTokens: ["infrarood cabine", "stoomcabine", "hottub", "wellness cabine", "sauna cabine"],
        rejectTokens: ["tweedehands", "marktplaats", "outlet", "aanbieding"],
        fitModifier: 12,
      },
      {
        id: "water_air_treatment",
        label: "Water- en luchtbehandeling specialist",
        seeds: [
          "waterontharder zonder zout systeem",
          "osmose waterfilter systeem huis",
        ],
        matchTokens: ["waterontharder", "osmose systeem", "waterfilter systeem", "luchtreiniger hepa medisch"],
        rejectTokens: ["coolblue", "mediamarkt", "bol", "filterpatroon", "navulling"],
        fitModifier: 6,
      },
    ],
    notes:
      "Alleen specialist-brand driven installaties met echte uitleg. Losse filters en retailer-elektronica blijven buiten.",
  },
  {
    id: "NICHE_CONSUMER_TECH",
    label: "Niche Consumer Tech",
    enabled: true,
    keywordCategory: "CONSUMER_TECH",
    budgetShare: 0.1,
    deepDive: {
      highConsideration: 86,
      visualStorytelling: 82,
      featureRich: 90,
      heroProductPotential: 88,
      premiumPrice: 82,
      brandDifferentiation: 80,
    },
    commodity: { ...NEUTRAL_COMMODITY, massRetailCategory: 40, marketplaceDominated: 35 },
    families: [
      {
        id: "single_purpose_devices",
        label: "Specialistische single-purpose devices",
        seeds: [
          "vacumeermachine professioneel thuisgebruik",
          "vacuum sealer professioneel thuisgebruik",
          "sous vide systeem professioneel thuis",
        ],
        matchTokens: ["vacuum sealer", "sous vide", "vacumeermachine", "fermentatie apparaat"],
        rejectTokens: ["coolblue", "mediamarkt", "bol", "amazon", "zakken", "navulling"],
        fitModifier: 4,
      },
    ],
    notes:
      "Eén product dat uitleg vraagt, verkocht door een merk in plaats van een elektronicaketen.",
  },
  {
    id: "WELLNESS_DEVICES",
    label: "Wellness Devices",
    enabled: true,
    keywordCategory: "WELLNESS",
    budgetShare: 0.14,
    deepDive: {
      highConsideration: 85,
      visualStorytelling: 80,
      featureRich: 88,
      heroProductPotential: 85,
      premiumPrice: 80,
      brandDifferentiation: 78,
    },
    commodity: { ...NEUTRAL_COMMODITY, massRetailCategory: 40, marketplaceDominated: 35 },
    families: [
      {
        id: "compression_therapy",
        label: "Compressietherapie",
        seeds: ["compressie laarzen herstel", "compressietherapie benen apparaat", "lymfedrainage apparaat thuis"],
        matchTokens: ["compressielaarzen", "compressie laarzen", "compressietherapie", "lymfedrainage", "pressotherapie"],
        rejectTokens: [],
        fitModifier: 12,
      },
      {
        id: "red_light_therapy",
        label: "Rood licht therapie panelen",
        seeds: ["rood licht therapie paneel", "infrarood paneel herstel", "red light therapy lamp"],
        matchTokens: ["rood licht therapie", "red light therapy", "infrarood paneel", "lichttherapie paneel"],
        rejectTokens: [],
        fitModifier: 12,
      },
      {
        id: "sauna_ice_bath",
        label: "Infraroodsauna & ijsbad",
        seeds: ["infrarood sauna thuis", "ijsbad kopen herstel", "sauna blanket kopen"],
        matchTokens: ["infrarood sauna", "ijsbad", "ice bath", "sauna blanket", "dompelbad"],
        rejectTokens: [],
        fitModifier: 14,
      },
    ],
    notes: "Massagekussens en losse massage-apparaten zijn retailer-terrein, niet opnemen.",
  },
  {
    id: "RECOVERY_PRODUCTS",
    label: "Recovery Products",
    enabled: true,
    keywordCategory: "WELLNESS",
    budgetShare: 0.1,
    deepDive: {
      highConsideration: 82,
      visualStorytelling: 78,
      featureRich: 82,
      heroProductPotential: 82,
      premiumPrice: 75,
      brandDifferentiation: 78,
    },
    commodity: { ...NEUTRAL_COMMODITY, massRetailCategory: 35 },
    families: [
      {
        id: "percussion_therapy",
        label: "Massage guns & percussion",
        seeds: ["massage gun professioneel", "percussie massage apparaat sporters"],
        matchTokens: ["massage gun", "massagegun", "percussie", "theragun"],
        rejectTokens: ["action", "lidl", "aldi"],
        fitModifier: 2,
      },
      {
        id: "recovery_wearables",
        label: "Herstel wearables",
        seeds: ["herstel wearable slaap", "ems apparaat spieren herstel"],
        matchTokens: ["ems apparaat", "tens apparaat", "herstel wearable", "spierstimulator"],
        rejectTokens: [],
        fitModifier: 6,
      },
    ],
    notes: "Alleen premium/specialistische recovery, geen commodity massagekussens.",
  },
  {
    id: "SLEEP_COMFORT",
    label: "Sleep & Comfort",
    // M9.4: geparkeerd, niet verwijderd. De data en de families blijven staan,
    // maar een eerste design target in deze branche zou een directe BestRest-
    // concurrent zijn. Zet terug op true zodra dat geen bezwaar meer is.
    enabled: false,
    keywordCategory: "SLEEP",
    budgetShare: 0.14,
    deepDive: {
      highConsideration: 88,
      visualStorytelling: 82,
      featureRich: 85,
      heroProductPotential: 88,
      premiumPrice: 85,
      brandDifferentiation: 80,
    },
    commodity: { ...NEUTRAL_COMMODITY, massRetailCategory: 45, priceOnlyCompetition: 35 },
    families: [
      {
        id: "ergonomic_pillows",
        label: "Ergonomische kussens",
        // M9.3.3: bewezen familie, uitgebreid met high-consideration intents.
        // Nooit "kussen kopen" of "beste kussen": die SERPs zijn ketenterrein.
        seeds: [
          "ergonomisch hoofdkussen nekklachten",
          "traagschuim kussen zijslaper",
          "nekkussen bij hernia nek",
          "hoofdkussen verstelbare hoogte",
          "orthopedisch kussen schouderklachten",
          "kussen op maat slaaphouding",
        ],
        matchTokens: [
          "ergonomisch hoofdkussen",
          "ergonomisch kussen",
          "nekkussen",
          "traagschuim kussen",
          "orthopedisch kussen",
          "hoofdkussen",
        ],
        rejectTokens: ["jysk", "ikea", "lidl", "action", "hema", "kruidvat", "beste", "goedkoop"],
        fitModifier: 0,
      },
      {
        id: "premium_mattress_systems",
        label: "Premium matrassystemen",
        seeds: [
          "pocketvering matras zijslaper",
          "boxspring op maat kopen",
          "traagschuim matras rugklachten",
          "matras op maat elektrisch bed",
          "hybride matras pocketvering traagschuim",
          "matras zwaar gewicht ondersteuning",
        ],
        matchTokens: [
          "boxspring",
          "pocketvering",
          "matras op maat",
          "traagschuim matras",
          "hybride matras",
          "matras",
        ],
        rejectTokens: [
          "goedkoop",
          "aanbieding",
          "outlet",
          "lidl",
          "jysk",
          "beste",
          "vergelijk",
          "review",
        ],
        fitModifier: -4,
      },
      {
        id: "sleep_tech",
        label: "Slaaptechnologie",
        seeds: ["slaaptracker kopen", "wake up light lichtwekker", "cooling topper actief"],
        matchTokens: ["slaaptracker", "lichtwekker", "wake up light", "cooling topper", "white noise"],
        rejectTokens: [],
        fitModifier: 10,
      },
    ],
    notes: "Matras/kussen alleen met specialistische modifier, nooit generieke categorie.",
  },
  {
    id: "PET_TECH",
    label: "Pet Tech",
    // M9.4: geparkeerd na vier audits met contrast 33-46. De pagina's in deze
    // familie zijn te verzorgd voor een overtuigende before/after.
    enabled: false,
    keywordCategory: "PETS",
    budgetShare: 0.1,
    deepDive: {
      highConsideration: 85,
      visualStorytelling: 82,
      featureRich: 90,
      heroProductPotential: 88,
      premiumPrice: 78,
      brandDifferentiation: 82,
    },
    commodity: { ...NEUTRAL_COMMODITY, marketplaceDominated: 30 },
    families: [
      {
        id: "automatic_feeders",
        label: "Automatische voer- en drinksystemen",
        seeds: ["automatische voerbak kat camera", "drinkfontein kat filter"],
        matchTokens: ["automatische voerbak", "voerautomaat", "drinkfontein", "waterfontein kat"],
        rejectTokens: [],
        fitModifier: 8,
      },
      {
        id: "smart_litter_doors",
        label: "Zelfreinigende en slimme kattenbakken",
        // M9.3.3: enige pet-familie die de calibratie overleefde. Kattenluiken
        // horen er niet meer bij: alleen de kattenbak zelf staat aan.
        seeds: [
          "zelfreinigende kattenbak",
          "automatische kattenbak app",
          "zelfreinigende kattenbak grote kat",
          "slimme kattenbak gewichtsmeting",
          "zelfreinigende kattenbak stil",
        ],
        matchTokens: [
          "zelfreinigende kattenbak",
          "slimme kattenbak",
          "automatische kattenbak",
          "kattenbak",
        ],
        rejectTokens: [
          "kattenbakvulling",
          "kattenluik",
          "kattenbakmat",
          "beste",
          "vergelijk",
          "review",
          "goedkoop",
        ],
        fitModifier: 12,
      },
      {
        id: "pet_trackers",
        label: "GPS trackers voor huisdieren",
        seeds: ["gps tracker hond abonnement", "gps halsband kat"],
        matchTokens: ["gps tracker", "gps halsband", "huisdier tracker"],
        rejectTokens: [],
        fitModifier: 10,
      },
    ],
    notes: "Techniek plus uitleg, sterke deep-dive PDP logica.",
  },
  {
    id: "PREMIUM_PET",
    label: "Premium Pet",
    enabled: true,
    keywordCategory: "PETS",
    budgetShare: 0.08,
    deepDive: {
      highConsideration: 78,
      visualStorytelling: 85,
      featureRich: 72,
      heroProductPotential: 82,
      premiumPrice: 72,
      brandDifferentiation: 85,
    },
    commodity: { ...NEUTRAL_COMMODITY, massRetailCategory: 35 },
    families: [
      {
        id: "specialist_harnesses",
        label: "Specialistische tuigen",
        seeds: ["y-tuig kleine hond anti trek", "hulphonden tuig op maat"],
        matchTokens: ["y-tuig", "y tuig", "anti trek tuig", "hulphonden tuig", "tuig op maat"],
        rejectTokens: ["welkoop", "zooplus", "action", "pets place"],
        fitModifier: 6,
      },
      {
        id: "design_pet_furniture",
        label: "Design huisdiermeubels",
        seeds: ["design hondenmand hout", "kattenmeubel muurbevestiging design"],
        matchTokens: [
          "design hondenmand",
          "kattenmeubel",
          "kattenmand muurbevestiging",
          "kattenklimwand",
          "krabpaal design",
        ],
        rejectTokens: ["action", "ikea"],
        fitModifier: 4,
      },
    ],
    notes: "Alleen specialistisch en design, geen voer of commodity accessoires.",
  },
  {
    id: "NICHE_HOME_COMFORT",
    label: "Niche Home Comfort",
    enabled: true,
    keywordCategory: "HOME_LIVING",
    budgetShare: 0.08,
    deepDive: {
      highConsideration: 78,
      visualStorytelling: 80,
      featureRich: 78,
      heroProductPotential: 78,
      premiumPrice: 75,
      brandDifferentiation: 72,
    },
    commodity: { ...NEUTRAL_COMMODITY, massRetailCategory: 50, marketplaceDominated: 40 },
    families: [
      {
        id: "ergonomic_workspace",
        label: "Ergonomische werkplek",
        seeds: ["ergonomische bureaustoel rugklachten", "zit sta bureau elektrisch op maat"],
        matchTokens: ["ergonomische bureaustoel", "zit sta bureau", "zitsta bureau", "ergonomisch bureau"],
        rejectTokens: ["ikea", "action", "beter bed"],
        fitModifier: 8,
      },
    ],
    notes:
      "Luchtreiniging is bewust weggelaten: in M9.3 waren coolblue, mediamarkt en kruidvat daar dominant.",
  },
  {
    id: "FITNESS_SPECIALIST",
    label: "Fitness / Equipment",
    enabled: false,
    keywordCategory: "FITNESS",
    budgetShare: 0.06,
    deepDive: {
      highConsideration: 62,
      visualStorytelling: 58,
      featureRich: 60,
      heroProductPotential: 58,
      premiumPrice: 55,
      brandDifferentiation: 50,
    },
    commodity: {
      commodity: 65,
      priceOnlyCompetition: 70,
      massRetailCategory: 80,
      marketplaceDominated: 60,
      simpleStandardized: 70,
    },
    families: [
      {
        id: "specialist_home_gym",
        label: "Specialistische home gym systemen",
        seeds: ["smart home gym systeem", "krachtstation op maat thuis"],
        matchTokens: ["smart home gym", "krachtstation", "functional trainer", "kabelstation"],
        rejectTokens: ["decathlon", "gewichten", "dumbbell", "halterschijf", "yoga mat", "fitness mat"],
        fitModifier: 0,
      },
    ],
    notes:
      "Uit op basis van M9.3 regressie: dumbbells, gewichten en matten zijn commodity en retailer-gedomineerd.",
  },
];

export const ARCHETYPE_BY_ID = new Map<ProductArchetypeId, ProductArchetype>(
  IDEAL_PRODUCT_ARCHETYPES_V1.map((a) => [a.id, a])
);

export function enabledArchetypes(): ProductArchetype[] {
  return IDEAL_PRODUCT_ARCHETYPES_V1.filter((a) => a.enabled);
}

export function enabledArchetypeCategories(): string[] {
  return [...new Set(enabledArchetypes().map((a) => a.keywordCategory))];
}

/** Normalized budget share across enabled branches. */
export function normalizedBudgetShares(): Record<string, number> {
  const enabled = enabledArchetypes();
  const total = enabled.reduce((sum, a) => sum + a.budgetShare, 0) || 1;
  const out: Record<string, number> = {};
  for (const a of enabled) {
    out[a.id] = Math.round((a.budgetShare / total) * 1000) / 1000;
  }
  return out;
}

/** Minimum archetype fit required before a keyword may enter SERP discovery. */
export const MIN_ARCHETYPE_FIT_FOR_DISCOVERY = 62;

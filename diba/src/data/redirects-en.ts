/**
 * Van de oude Engelse adressen naar de nieuwe.
 *
 * De Engelse site draaide twee dagen op de Nederlandse adressen: /en/huidproblemen/rimpels.
 * Sinds 14 september 2026 heet dat /en/skin-concerns/wrinkles. Deze lijst houdt de oude
 * adressen in de lucht; zonder dat zou een bezoeker met een bladwijzer op een 404 komen,
 * want de Engelse routes staan op `dynamicParams = false`.
 *
 * Gemaakt door scratch/maak-en-omleidingen.py uit de routes zelf. Verander de slugtabel in
 * `lib/slugs.ts` en draai dat script opnieuw; met de hand bijwerken loopt gegarandeerd uit
 * de pas.
 */
export const EN_SLUG_REDIRECTS: readonly {
  source: string;
  destination: string;
}[] = [
  { source: "/en/afspraak", destination: "/en/book" },
  { source: "/en/algemene-voorwaarden", destination: "/en/terms" },
  { source: "/en/apparatuur", destination: "/en/equipment" },
  {
    source: "/en/apparatuur/dermapen-4",
    destination: "/en/equipment/dermapen-4",
  },
  {
    source: "/en/apparatuur/dermaplane-pro",
    destination: "/en/equipment/dermaplane-pro",
  },
  { source: "/en/apparatuur/eve-m", destination: "/en/equipment/eve-m" },
  { source: "/en/apparatuur/fotona", destination: "/en/equipment/fotona" },
  {
    source: "/en/apparatuur/gentlemax-pro",
    destination: "/en/equipment/gentlemax-pro",
  },
  {
    source: "/en/apparatuur/hydrafacial-syndeo",
    destination: "/en/equipment/hydrafacial-syndeo",
  },
  {
    source: "/en/apparatuur/nordlys-ipl",
    destination: "/en/equipment/nordlys-ipl",
  },
  { source: "/en/apparatuur/oxygeneo", destination: "/en/equipment/oxygeneo" },
  {
    source: "/en/apparatuur/peelinglijnen",
    destination: "/en/equipment/peel-lines",
  },
  {
    source: "/en/apparatuur/precision-photonic-system",
    destination: "/en/equipment/precision-photonic-system",
  },
  {
    source: "/en/apparatuur/skinpen-cit",
    destination: "/en/equipment/skinpen-cit",
  },
  { source: "/en/apparatuur/u225", destination: "/en/equipment/u225" },
  {
    source: "/en/behandeling-op-advies",
    destination: "/en/treatment-on-advice",
  },
  { source: "/en/behandelingen", destination: "/en/treatments" },
  {
    source: "/en/behandelingen/acne-traject",
    destination: "/en/treatments/acne-programme",
  },
  {
    source: "/en/behandelingen/acnebehandeling",
    destination: "/en/treatments/acne-treatment",
  },
  {
    source: "/en/behandelingen/cosmelan",
    destination: "/en/treatments/cosmelan",
  },
  {
    source: "/en/behandelingen/dermamelan",
    destination: "/en/treatments/dermamelan",
  },
  {
    source: "/en/behandelingen/dermamelan-intimate",
    destination: "/en/treatments/dermamelan-intimate",
  },
  {
    source: "/en/behandelingen/dermapen-4",
    destination: "/en/treatments/dermapen-4",
  },
  {
    source: "/en/behandelingen/dermaplaning",
    destination: "/en/treatments/dermaplaning",
  },
  {
    source: "/en/behandelingen/elektrische-epilatie",
    destination: "/en/treatments/electrolysis",
  },
  {
    source: "/en/behandelingen/eye-peel",
    destination: "/en/treatments/eye-peel",
  },
  {
    source: "/en/behandelingen/fibromen",
    destination: "/en/treatments/fibromas",
  },
  { source: "/en/behandelingen/fotona", destination: "/en/treatments/fotona" },
  {
    source: "/en/behandelingen/fotona-4d",
    destination: "/en/treatments/fotona-4d",
  },
  {
    source: "/en/behandelingen/fotona-4d-full",
    destination: "/en/treatments/fotona-4d-full",
  },
  {
    source: "/en/behandelingen/fotona-4d-men",
    destination: "/en/treatments/fotona-4d-men",
  },
  {
    source: "/en/behandelingen/fotona-acne-control",
    destination: "/en/treatments/fotona-acne-control",
  },
  {
    source: "/en/behandelingen/fotona-resurfacing",
    destination: "/en/treatments/fotona-resurfacing",
  },
  {
    source: "/en/behandelingen/fotona-scar-repair",
    destination: "/en/treatments/fotona-scar-repair",
  },
  { source: "/en/behandelingen/frac3", destination: "/en/treatments/frac3" },
  {
    source: "/en/behandelingen/full-face-brushing",
    destination: "/en/treatments/full-face-brushing",
  },
  {
    source: "/en/behandelingen/hairestart",
    destination: "/en/treatments/hairestart",
  },
  {
    source: "/en/behandelingen/happy-intim",
    destination: "/en/treatments/happy-intim",
  },
  {
    source: "/en/behandelingen/huidanalyse",
    destination: "/en/treatments/skin-analysis",
  },
  {
    source: "/en/behandelingen/hydrafacial",
    destination: "/en/treatments/hydrafacial",
  },
  {
    source: "/en/behandelingen/jongeren-acne-traject",
    destination: "/en/treatments/youth-acne-programme",
  },
  {
    source: "/en/behandelingen/kruidenpeel",
    destination: "/en/treatments/herbal-peel",
  },
  {
    source: "/en/behandelingen/laserontharing",
    destination: "/en/treatments/laser-hair-removal",
  },
  {
    source: "/en/behandelingen/led-therapie",
    destination: "/en/treatments/led-therapy",
  },
  {
    source: "/en/behandelingen/led-therapie/acne",
    destination: "/en/treatments/led-therapy/acne",
  },
  {
    source: "/en/behandelingen/liplase",
    destination: "/en/treatments/liplase",
  },
  {
    source: "/en/behandelingen/littekentherapie",
    destination: "/en/treatments/scar-therapy",
  },
  {
    source: "/en/behandelingen/nightlase",
    destination: "/en/treatments/nightlase",
  },
  {
    source: "/en/behandelingen/nordlys-pigment",
    destination: "/en/treatments/nordlys-pigmentation",
  },
  {
    source: "/en/behandelingen/nordlys-pigment/zonnevlekken",
    destination: "/en/treatments/nordlys-pigmentation/sun-spots",
  },
  {
    source: "/en/behandelingen/nordlys-roodheid",
    destination: "/en/treatments/nordlys-redness",
  },
  {
    source: "/en/behandelingen/nordlys-roodheid/couperose",
    destination: "/en/treatments/nordlys-redness/thread-veins",
  },
  {
    source: "/en/behandelingen/nordlys-roodheid/rosacea",
    destination: "/en/treatments/nordlys-redness/rosacea",
  },
  {
    source: "/en/behandelingen/oxygeneo",
    destination: "/en/treatments/oxygeneo",
  },
  { source: "/en/behandelingen/peelings", destination: "/en/treatments/peels" },
  {
    source: "/en/behandelingen/peelings/acne",
    destination: "/en/treatments/peels/acne",
  },
  {
    source: "/en/behandelingen/peelings/huidverjonging",
    destination: "/en/treatments/peels/skin-rejuvenation",
  },
  {
    source: "/en/behandelingen/peelings/pigment",
    destination: "/en/treatments/peels/pigmentation",
  },
  { source: "/en/behandelingen/piano", destination: "/en/treatments/piano" },
  {
    source: "/en/behandelingen/rrs-eyes",
    destination: "/en/treatments/rrs-eyes",
  },
  {
    source: "/en/behandelingen/rrs-hyalift",
    destination: "/en/treatments/rrs-hyalift",
  },
  {
    source: "/en/behandelingen/skinboosters",
    destination: "/en/treatments/skinboosters",
  },
  {
    source: "/en/behandelingen/skincomplete-led-consult",
    destination: "/en/treatments/skincomplete-led-consult",
  },
  {
    source: "/en/behandelingen/skinpen",
    destination: "/en/treatments/skinpen",
  },
  {
    source: "/en/behandelingen/skinpen/acnelittekens",
    destination: "/en/treatments/skinpen/acne-scarring",
  },
  {
    source: "/en/behandelingen/skinpen/chirurgische-littekens",
    destination: "/en/treatments/skinpen/surgical-scars",
  },
  {
    source: "/en/behandelingen/skinpen/fijne-lijntjes",
    destination: "/en/treatments/skinpen/fine-lines",
  },
  {
    source: "/en/behandelingen/skinpen/grove-porien",
    destination: "/en/treatments/skinpen/large-pores",
  },
  {
    source: "/en/behandelingen/skinpen/striae",
    destination: "/en/treatments/skinpen/stretch-marks",
  },
  {
    source: "/en/behandelingen/smootheye",
    destination: "/en/treatments/smootheye",
  },
  {
    source: "/en/behandelingen/smoothliftin",
    destination: "/en/treatments/smoothliftin",
  },
  {
    source: "/en/behandelingen/superficial-peel",
    destination: "/en/treatments/superficial-peel",
  },
  {
    source: "/en/behandelingen/vectorlift",
    destination: "/en/treatments/vectorlift",
  },
  {
    source: "/en/behandelingen/voedingsintolerantietest",
    destination: "/en/treatments/food-intolerance-test",
  },
  {
    source: "/en/behandelingen/xl-hair",
    destination: "/en/treatments/xl-hair",
  },
  { source: "/en/cookiebeleid", destination: "/en/cookie-policy" },
  { source: "/en/huidproblemen", destination: "/en/skin-concerns" },
  { source: "/en/huidproblemen/acne", destination: "/en/skin-concerns/acne" },
  {
    source: "/en/huidproblemen/acne-littekens",
    destination: "/en/skin-concerns/acne-scars",
  },
  {
    source: "/en/huidproblemen/couperose",
    destination: "/en/skin-concerns/thread-veins",
  },
  {
    source: "/en/huidproblemen/doffe-huid",
    destination: "/en/skin-concerns/dull-skin",
  },
  {
    source: "/en/huidproblemen/donkere-kringen",
    destination: "/en/skin-concerns/dark-circles",
  },
  {
    source: "/en/huidproblemen/droge-huid",
    destination: "/en/skin-concerns/dry-skin",
  },
  {
    source: "/en/huidproblemen/eczeem",
    destination: "/en/skin-concerns/eczema",
  },
  {
    source: "/en/huidproblemen/gerstekorrels",
    destination: "/en/skin-concerns/milia",
  },
  {
    source: "/en/huidproblemen/gevoelige-huid",
    destination: "/en/skin-concerns/sensitive-skin",
  },
  {
    source: "/en/huidproblemen/huiduitslag",
    destination: "/en/skin-concerns/skin-rash",
  },
  {
    source: "/en/huidproblemen/huidverkleuring",
    destination: "/en/skin-concerns/skin-discolouration",
  },
  {
    source: "/en/huidproblemen/huidveroudering",
    destination: "/en/skin-concerns/skin-ageing",
  },
  {
    source: "/en/huidproblemen/huidverslapping",
    destination: "/en/skin-concerns/sagging-skin",
  },
  {
    source: "/en/huidproblemen/ingegroeide-haren",
    destination: "/en/skin-concerns/ingrown-hairs",
  },
  {
    source: "/en/huidproblemen/keloiden",
    destination: "/en/skin-concerns/keloids",
  },
  {
    source: "/en/huidproblemen/keratosis-pilaris",
    destination: "/en/skin-concerns/keratosis-pilaris",
  },
  {
    source: "/en/huidproblemen/littekens",
    destination: "/en/skin-concerns/scars",
  },
  {
    source: "/en/huidproblemen/melasma",
    destination: "/en/skin-concerns/melasma",
  },
  {
    source: "/en/huidproblemen/moedervlekken",
    destination: "/en/skin-concerns/moles",
  },
  {
    source: "/en/huidproblemen/onzuivere-huid",
    destination: "/en/skin-concerns/congested-skin",
  },
  {
    source: "/en/huidproblemen/ouderdomsvlekken",
    destination: "/en/skin-concerns/age-spots",
  },
  {
    source: "/en/huidproblemen/pigmentvlekken",
    destination: "/en/skin-concerns/pigmentation-spots",
  },
  {
    source: "/en/huidproblemen/porien",
    destination: "/en/skin-concerns/pores",
  },
  {
    source: "/en/huidproblemen/psoriasis",
    destination: "/en/skin-concerns/psoriasis",
  },
  {
    source: "/en/huidproblemen/rimpels",
    destination: "/en/skin-concerns/wrinkles",
  },
  {
    source: "/en/huidproblemen/rosacea",
    destination: "/en/skin-concerns/rosacea",
  },
  {
    source: "/en/huidproblemen/steelwratjes",
    destination: "/en/skin-concerns/skin-tags",
  },
  {
    source: "/en/huidproblemen/striae",
    destination: "/en/skin-concerns/stretch-marks",
  },
  {
    source: "/en/huidproblemen/symptoomzoeker",
    destination: "/en/skin-concerns/symptom-finder",
  },
  {
    source: "/en/huidproblemen/wallen",
    destination: "/en/skin-concerns/eye-bags",
  },
  { source: "/en/huidprofiel", destination: "/en/skin-profile" },
  { source: "/en/kennisbank", destination: "/en/knowledge" },
  {
    source: "/en/kennisbank/chemische-peeling-rotterdam",
    destination: "/en/knowledge/chemical-peel-rotterdam",
  },
  {
    source: "/en/kennisbank/cosmelan-dermamelan-rotterdam",
    destination: "/en/knowledge/cosmelan-dermamelan-rotterdam",
  },
  {
    source: "/en/kennisbank/dermaplaning-rotterdam",
    destination: "/en/knowledge/dermaplaning-rotterdam",
  },
  {
    source: "/en/kennisbank/elektrische-epilatie-rotterdam",
    destination: "/en/knowledge/electrolysis-rotterdam",
  },
  {
    source: "/en/kennisbank/fitzpatrick-huidtype",
    destination: "/en/knowledge/fitzpatrick-skin-type",
  },
  {
    source: "/en/kennisbank/fotona-4d-rotterdam",
    destination: "/en/knowledge/fotona-4d-rotterdam",
  },
  {
    source: "/en/kennisbank/hoeveel-sessies",
    destination: "/en/knowledge/how-many-sessions",
  },
  {
    source: "/en/kennisbank/huidanalyse-rotterdam",
    destination: "/en/knowledge/skin-analysis-rotterdam",
  },
  {
    source: "/en/kennisbank/huidkliniek-kiezen",
    destination: "/en/knowledge/choosing-a-skin-clinic",
  },
  {
    source: "/en/kennisbank/huidtherapeut-rotterdam",
    destination: "/en/knowledge/skin-therapist-rotterdam",
  },
  {
    source: "/en/kennisbank/hydrafacial-rotterdam",
    destination: "/en/knowledge/hydrafacial-rotterdam",
  },
  {
    source: "/en/kennisbank/ipl-rotterdam",
    destination: "/en/knowledge/ipl-rotterdam",
  },
  {
    source: "/en/kennisbank/microneedling-rotterdam",
    destination: "/en/knowledge/microneedling-rotterdam",
  },
  {
    source: "/en/kennisbank/oxygeneo-rotterdam",
    destination: "/en/knowledge/oxygeneo-rotterdam",
  },
  {
    source: "/en/kennisbank/skinboosters-rotterdam",
    destination: "/en/knowledge/skinboosters-rotterdam",
  },
  {
    source: "/en/kennisbank/zon-en-je-huid",
    destination: "/en/knowledge/sun-and-your-skin",
  },
  {
    source: "/en/kennisbank/zwanger-of-borstvoeding",
    destination: "/en/knowledge/pregnant-or-breastfeeding",
  },
  {
    source: "/en/kwaliteit-en-registraties",
    destination: "/en/quality-and-registrations",
  },
  { source: "/en/laserontharing", destination: "/en/laser-hair-removal" },
  { source: "/en/nazorg", destination: "/en/aftercare" },
  { source: "/en/ons-verhaal", destination: "/en/our-story" },
  { source: "/en/over-ons", destination: "/en/about-us" },
  { source: "/en/privacybeleid", destination: "/en/privacy-policy" },
  { source: "/en/snurken", destination: "/en/snoring" },
  { source: "/en/tarieven", destination: "/en/prices" },
  {
    source: "/en/vacatures/huidtherapeut",
    destination: "/en/vacancies/skin-therapist",
  },
  { source: "/en/vergoedingen", destination: "/en/insurance" },
  { source: "/en/vergoedingen/aevitae", destination: "/en/insurance/aevitae" },
  { source: "/en/vergoedingen/asr", destination: "/en/insurance/asr" },
  { source: "/en/vergoedingen/cz", destination: "/en/insurance/cz" },
  { source: "/en/vergoedingen/dsw", destination: "/en/insurance/dsw" },
  { source: "/en/vergoedingen/menzis", destination: "/en/insurance/menzis" },
  { source: "/en/vergoedingen/onvz", destination: "/en/insurance/onvz" },
  { source: "/en/vergoedingen/salland", destination: "/en/insurance/salland" },
  { source: "/en/vergoedingen/vgz", destination: "/en/insurance/vgz" },
  {
    source: "/en/vergoedingen/zilveren-kruis",
    destination: "/en/insurance/zilveren-kruis",
  },
  {
    source: "/en/vergoedingen/zorg-en-zekerheid",
    destination: "/en/insurance/zorg-en-zekerheid",
  },
  { source: "/en/verwijzers", destination: "/en/referrers" },
  { source: "/en/werken-bij", destination: "/en/careers" },
] as const;

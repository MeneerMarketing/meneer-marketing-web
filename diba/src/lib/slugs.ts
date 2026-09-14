import type { Vreemdetaal } from "@/lib/taal";

/**
 * De adressen van de Nederlandse pagina's in de andere talen.
 *
 * WAAROM DIT BESTAAT.
 *
 * De Engelse site draaide op de Nederlandse adressen: /en/huidproblemen/rimpels. De pagina
 * was Engels, het adres niet. Dat is geen rankingprobleem — Google weegt woorden in een URL
 * nauwelijks mee — maar het is wel wat een Engelstalige in de zoekresultaten ziet staan, en
 * `dibaclinics.nl › en › huidproblemen › rimpels` leest als een pagina in een taal die hij
 * niet spreekt. Yasin, 14 september 2026: "fix die slugs enzo ook."
 *
 * Sinds 15 september 2026 staat het Spaans er als tweede vreemde taal naast, met een eigen
 * tabel en dezelfde regel: /es/problemas-de-piel/arrugas.
 *
 * WAT ER NIET IN STAAT.
 *
 * Merknamen en apparaten: hydrafacial, skinpen, fotona, nordlys, cosmelan, gentlemax-pro.
 * Die heten in elke taal hetzelfde, en een merknaam die je vertaalt is een ander apparaat.
 * Verzekeraars ook: cz, vgz, menzis. En woorden die in beide talen gelijk zijn, zoals acne,
 * melasma, psoriasis en rosacea: die staan hier niet, want er valt niets om te zetten.
 *
 * GEEN ACCENTEN IN EEN ADRES. Het Spaans schrijft "análisis" en "depilación", maar een
 * accent in een URL wordt in de adresbalk een rij procenttekens en in een e-mail vaak een
 * gebroken link. De tabel houdt daarom de kale letters aan; dat is ook wat Spaanse sites
 * zelf doen.
 *
 * HOE HET WERKT.
 *
 * Per segment, niet per heel pad. `/huidproblemen/rimpels` wordt `/skin-concerns/wrinkles`
 * doordat beide segmenten los worden opgezocht. Zo hoeft een nieuwe pagina alleen zijn
 * eigen woord toe te voegen en niet elk pad waarin dat woord voorkomt.
 */

/** Nederlands segment naar Engels. Alleen wat echt verandert. */
const NAAR_EN: Readonly<Record<string, string>> = {
  /* De hoofdstukken van de site */
  afspraak: "book",
  "algemene-voorwaarden": "terms",
  apparatuur: "equipment",
  "behandeling-op-advies": "treatment-on-advice",
  behandelingen: "treatments",
  cookiebeleid: "cookie-policy",
  huidproblemen: "skin-concerns",
  huidprofiel: "skin-profile",
  kennisbank: "knowledge",
  "kwaliteit-en-registraties": "quality-and-registrations",
  laserontharing: "laser-hair-removal",
  nazorg: "aftercare",
  "ons-verhaal": "our-story",
  "over-ons": "about-us",
  privacybeleid: "privacy-policy",
  resultaten: "results",
  snurken: "snoring",
  tarieven: "prices",
  vacatures: "vacancies",
  vergoedingen: "insurance",
  verwijzers: "referrers",
  "werken-bij": "careers",

  /* Huidproblemen */
  "acne-littekens": "acne-scars",
  couperose: "thread-veins",
  "doffe-huid": "dull-skin",
  "donkere-kringen": "dark-circles",
  "droge-huid": "dry-skin",
  eczeem: "eczema",
  gerstekorrels: "milia",
  "gevoelige-huid": "sensitive-skin",
  huiduitslag: "skin-rash",
  huidverkleuring: "skin-discolouration",
  huidveroudering: "skin-ageing",
  huidverslapping: "sagging-skin",
  "ingegroeide-haren": "ingrown-hairs",
  keloiden: "keloids",
  littekens: "scars",
  moedervlekken: "moles",
  "onzuivere-huid": "congested-skin",
  ouderdomsvlekken: "age-spots",
  pigmentvlekken: "pigmentation-spots",
  porien: "pores",
  rimpels: "wrinkles",
  steelwratjes: "skin-tags",
  striae: "stretch-marks",
  symptoomzoeker: "symptom-finder",
  wallen: "eye-bags",

  /* Behandelingen en toepassingen */
  "acne-traject": "acne-programme",
  acnebehandeling: "acne-treatment",
  /* Het Nederlands heeft twee schrijfwijzen voor hetzelfde: `acne-littekens` als
     huidprobleem en `acnelittekens` als toepassing onder een behandeling. Twee keer
     "acne-scars" zou de weg terug dubbelzinnig maken, dus draagt de toepassing een eigen
     woord. */
  acnelittekens: "acne-scarring",
  "chirurgische-littekens": "surgical-scars",
  "elektrische-epilatie": "electrolysis",
  fibromen: "fibromas",
  "fijne-lijntjes": "fine-lines",
  "grove-porien": "large-pores",
  huidanalyse: "skin-analysis",
  huidverjonging: "skin-rejuvenation",
  "jongeren-acne-traject": "youth-acne-programme",
  kruidenpeel: "herbal-peel",
  "led-therapie": "led-therapy",
  littekentherapie: "scar-therapy",
  "nordlys-pigment": "nordlys-pigmentation",
  "nordlys-roodheid": "nordlys-redness",
  peelinglijnen: "peel-lines",
  peelings: "peels",
  pigment: "pigmentation",
  voedingsintolerantietest: "food-intolerance-test",
  zonnevlekken: "sun-spots",

  /* Kennisbank */
  "chemische-peeling-rotterdam": "chemical-peel-rotterdam",
  "elektrische-epilatie-rotterdam": "electrolysis-rotterdam",
  "fitzpatrick-huidtype": "fitzpatrick-skin-type",
  "hoeveel-sessies": "how-many-sessions",
  "huidanalyse-rotterdam": "skin-analysis-rotterdam",
  "huidkliniek-kiezen": "choosing-a-skin-clinic",
  "huidtherapeut-rotterdam": "skin-therapist-rotterdam",
  "zon-en-je-huid": "sun-and-your-skin",
  "zwanger-of-borstvoeding": "pregnant-or-breastfeeding",

  /* Vacatures */
  huidtherapeut: "skin-therapist",

  /* Werkroutes die geen Engelse versie hebben maar wel een naam nodig hebben */
  configurator: "configurator",
};

/**
 * Nederlands segment naar Spaans.
 *
 * Dezelfde sleutels als de Engelse tabel, zodat een nieuw hoofdstuk in beide talen een
 * adres krijgt of in geen van beide. `scratch/slugdekking.py` meldt het als er een sleutel
 * ontbreekt.
 *
 * "huidtherapeut" is een beschermde Nederlandse titel zonder Spaanse tegenhanger; het is
 * geen schoonheidsspecialiste (esteticista) en geen dermatoloog. "terapeuta-de-piel" is
 * een leenvertaling, en dat is hier de eerlijkste: hij belooft niets wat er niet is.
 */
const NAAR_ES: Readonly<Record<string, string>> = {
  /* De hoofdstukken van de site */
  afspraak: "cita",
  "algemene-voorwaarden": "condiciones",
  apparatuur: "equipos",
  "behandeling-op-advies": "tratamiento-con-asesoramiento",
  behandelingen: "tratamientos",
  cookiebeleid: "politica-de-cookies",
  huidproblemen: "problemas-de-piel",
  huidprofiel: "perfil-de-piel",
  kennisbank: "guias",
  "kwaliteit-en-registraties": "calidad-y-registros",
  laserontharing: "depilacion-laser",
  nazorg: "cuidados-posteriores",
  "ons-verhaal": "nuestra-historia",
  "over-ons": "sobre-nosotros",
  privacybeleid: "politica-de-privacidad",
  resultaten: "resultados",
  snurken: "ronquidos",
  tarieven: "precios",
  vacatures: "vacantes",
  vergoedingen: "reembolso",
  verwijzers: "derivaciones",
  "werken-bij": "trabaja-con-nosotros",

  /* Huidproblemen */
  "acne-littekens": "cicatrices-de-acne",
  couperose: "cuperosis",
  "doffe-huid": "piel-apagada",
  "donkere-kringen": "ojeras",
  "droge-huid": "piel-seca",
  eczeem: "eccema",
  gerstekorrels: "milium",
  "gevoelige-huid": "piel-sensible",
  huiduitslag: "erupcion-cutanea",
  huidverkleuring: "decoloracion-de-la-piel",
  huidveroudering: "envejecimiento-cutaneo",
  huidverslapping: "flacidez-cutanea",
  "ingegroeide-haren": "pelos-encarnados",
  keloiden: "queloides",
  littekens: "cicatrices",
  moedervlekken: "lunares",
  "onzuivere-huid": "piel-con-imperfecciones",
  ouderdomsvlekken: "manchas-de-la-edad",
  pigmentvlekken: "manchas-de-pigmentacion",
  porien: "poros",
  rimpels: "arrugas",
  steelwratjes: "acrocordones",
  striae: "estrias",
  symptoomzoeker: "buscador-de-sintomas",
  wallen: "bolsas-en-los-ojos",

  /* Behandelingen en toepassingen */
  "acne-traject": "programa-de-acne",
  acnebehandeling: "tratamiento-de-acne",
  /* Zie de Engelse tabel: het huidprobleem en de toepassing dragen elk een eigen woord,
     anders is de weg terug dubbelzinnig. */
  acnelittekens: "cicatrices-acneicas",
  "chirurgische-littekens": "cicatrices-quirurgicas",
  "elektrische-epilatie": "electrolisis",
  fibromen: "fibromas",
  "fijne-lijntjes": "lineas-finas",
  "grove-porien": "poros-dilatados",
  huidanalyse: "analisis-de-piel",
  huidverjonging: "rejuvenecimiento-facial",
  "jongeren-acne-traject": "programa-de-acne-juvenil",
  kruidenpeel: "peeling-de-hierbas",
  "led-therapie": "terapia-led",
  littekentherapie: "terapia-de-cicatrices",
  "nordlys-pigment": "nordlys-pigmentacion",
  "nordlys-roodheid": "nordlys-rojeces",
  peelinglijnen: "lineas-de-peeling",
  peelings: "peelings",
  pigment: "pigmentacion",
  voedingsintolerantietest: "test-de-intolerancia-alimentaria",
  zonnevlekken: "manchas-solares",

  /* Kennisbank */
  "chemische-peeling-rotterdam": "peeling-quimico-rotterdam",
  "elektrische-epilatie-rotterdam": "electrolisis-rotterdam",
  "fitzpatrick-huidtype": "fototipo-fitzpatrick",
  "hoeveel-sessies": "cuantas-sesiones",
  "huidanalyse-rotterdam": "analisis-de-piel-rotterdam",
  "huidkliniek-kiezen": "elegir-clinica-de-piel",
  "huidtherapeut-rotterdam": "terapeuta-de-piel-rotterdam",
  "zon-en-je-huid": "el-sol-y-tu-piel",
  "zwanger-of-borstvoeding": "embarazo-o-lactancia",

  /* Vacatures */
  huidtherapeut: "terapeuta-de-piel",

  /* Werkroutes die geen vertaalde versie hebben maar wel een naam nodig hebben */
  configurator: "configurador",
};

const HEEN: Readonly<Record<Vreemdetaal, Readonly<Record<string, string>>>> = {
  en: NAAR_EN,
  es: NAAR_ES,
};

/** De weg terug, per taal. Eén keer opgebouwd bij het laden van de module. */
const TERUG: Readonly<Record<Vreemdetaal, Readonly<Record<string, string>>>> = {
  en: Object.freeze(
    Object.fromEntries(Object.entries(NAAR_EN).map(([nl, v]) => [v, nl])),
  ),
  es: Object.freeze(
    Object.fromEntries(Object.entries(NAAR_ES).map(([nl, v]) => [v, nl])),
  ),
};

/** Eén segment. Staat het er niet in, dan blijft het zoals het is. */
export function segmentNaarTaal(segment: string, taal: Vreemdetaal): string {
  return HEEN[taal][segment] ?? segment;
}

/** Terug. Voor de route die de Nederlandse pagina met dezelfde gegevens rendert. */
export function segmentNaarNederlands(
  segment: string,
  taal: Vreemdetaal,
): string {
  return TERUG[taal][segment] ?? segment;
}

/** Een heel pad, segment voor segment. Zonder de /en of /es ervoor. */
export function padNaarTaal(pad: string, taal: Vreemdetaal): string {
  const delen = pad
    .split("/")
    .filter(Boolean)
    .map((d) => segmentNaarTaal(d, taal));
  return delen.length ? `/${delen.join("/")}` : "/";
}

export function padNaarNederlands(pad: string, taal: Vreemdetaal): string {
  const delen = pad
    .split("/")
    .filter(Boolean)
    .map((d) => segmentNaarNederlands(d, taal));
  return delen.length ? `/${delen.join("/")}` : "/";
}

/**
 * De routeparameters van een dynamische pagina, heen en terug.
 *
 * De Engelse route heet /en/treatments/[slug] en krijgt dus een Engelse slug binnen; de
 * Nederlandse pagina eronder kent alleen `hydrafacial` of `rimpels`. Deze twee zetten dat
 * om, zodat de wrapper zelf kort blijft.
 */
export function paramsNaarTaal<T extends Record<string, string>>(
  p: T,
  taal: Vreemdetaal,
): T {
  return Object.fromEntries(
    Object.entries(p).map(([k, v]) => [k, segmentNaarTaal(v, taal)]),
  ) as T;
}

export function paramsNaarNederlands<T extends Record<string, string>>(
  params: Promise<T>,
  taal: Vreemdetaal,
): Promise<T> {
  return params.then(
    (p) =>
      Object.fromEntries(
        Object.entries(p).map(([k, v]) => [k, segmentNaarNederlands(v, taal)]),
      ) as T,
  );
}

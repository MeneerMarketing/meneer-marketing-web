/**
 * De halve regel achter de naam in de tabbladtitel.
 *
 * WAT HET PROBLEEM WAS.
 *
 * Google toont ongeveer zestig tekens van een titel. Gemeten over de 156 Nederlandse
 * pagina's stonden er 79 onder de veertig, waarvan 46 behandelpagina's; gemiddeld veertig
 * tekens tegen de zestig die er zijn. "FRAC3 | Diba Clinics" is twintig tekens, en wie niet
 * weet wat FRAC3 is, weet het na het zoekresultaat nog steeds niet. Uit het SEO-rapport van
 * Okan, 15 september 2026.
 *
 * WAAROM ER GEEN PLAATSNAAM IN STAAT.
 *
 * Okans advies was: zoekterm en plaats erbij. Dat tweede niet. Over laserontharing gaan hier
 * drie pagina's — /behandelingen/laserontharing, /laserontharing en de klachtpagina — en op
 * dit moment draagt alleen de pillarpagina de plaats ("Laserontharing Rotterdam | GentleMax
 * Pro"). Zet je Rotterdam ook op de behandelpagina, dan dingen drie eigen pagina's naar
 * dezelfde zoekvraag en kiest Google zelf welke hij toont. De ruimte gaat daarom naar wát
 * het is, niet naar wáár het is.
 *
 * WAAROM DIT MET DE HAND GESCHREVEN IS EN NIET AFGELEID.
 *
 * Twee afleidingen geprobeerd en allebei gemeten (scratch/titelvoorstel.mjs en -2):
 *
 *   - De eerste zin van `kort`. Van de 46 paste er vijf; de rest liep tot 126 tekens.
 *   - Het label van de huidwens. Netjes kort en al vertaald, maar dan heten tien pagina's
 *     "X: huidverjonging en versteviging" en staat er bij de Nordlys twee keer hetzelfde
 *     ("Nordlys IPL bij roodheid en vaatjes: pigment, roodheid en vaatjes"). Tien pagina's
 *     met dezelfde titel is precies de kwaal die we wilden verhelpen.
 *
 * WAT EEN CLAIM MOET ZIJN.
 *
 *   - Een inkorting van de eigen `kort`-zin van die behandeling. Geen nieuwe belofte: de
 *     woorden komen uit tekst die Rojda en Okan al hebben nagekeken.
 *   - Kleine letter vooraan, want hij volgt op een dubbele punt.
 *   - Kort genoeg dat `naam: claim` onder de tweeënvijftig blijft. De titelsjabloon plakt er
 *     " | Diba Clinics" achter; boven die maat valt er een stuk van de merknaam weg, en dat
 *     kost niets. De afweging achter dat getal staat bij de ladder in
 *     `app/(nl)/behandelingen/[slug]/page.tsx`.
 *   - Anders dan die van de buren. Twee pagina's met dezelfde halve regel helpen niemand.
 *
 * Staat een behandeling hier niet in, dan blijft de titel gewoon de naam. Dat is de veilige
 * uitkomst en geen storing; `npm run titels` laat zien welke pagina's ruimte laten liggen.
 * Twee staan er met opzet niet in, want hun naam is zelf al lang genoeg en zegt het al:
 * "Nordlys IPL bij roodheid en vaatjes" (35 tekens) en "Consult SkinComplete LED-masker"
 * (31).
 */
export const TITELCLAIM: Readonly<Record<string, string>> = {
  huidanalyse: "je huid in kaart",
  hydrafacial: "reinigen, exfoliëren, hydrateren",
  oxygeneo: "exfoliëren en zuurstof",
  dermaplaning: "donshaartjes weg met een mesje",
  peelings: "van licht tot stevig",
  kruidenpeel: "fijngemalen kruiden, zonder zuur",
  skinpen: "medisch gecertificeerd",
  "dermapen-4": "needling met trillende naaldjes",
  skinboosters: "ín de huid, niet erop",
  "rrs-eyes": "werkzame stoffen rond het oog",
  fotona: "vijftien laserbehandelingen",
  "fotona-4d": "vier laserbehandelingen, één sessie",
  "fotona-4d-men": "het 4D-protocol voor mannenhuid",
  smoothliftin: "collageen van binnenuit",
  frac3: "fractionele laser voor structuur",
  piano: "verstevigt kaaklijn en hals",
  "superficial-peel": "oppervlakkige laserpeeling",
  smootheye: "laser rond de oogcontour",
  liplase: "vollere lippen zonder filler",
  vectorlift: "wenkbrauwlift zonder naalden",
  "fotona-acne-control": "laser bij actieve acne",
  "fotona-scar-repair": "laser op littekens en striae",
  "fotona-resurfacing": "huidvernieuwing met laser",
  hairestart: "laser bij haarverdunning",
  nightlase: "laser tegen snurken",
  "nordlys-pigment": "licht op pigmentvlekken",
  "led-therapie": "licht dat de huid rustiger maakt",
  cosmelan: "traject tegen hyperpigmentatie",
  dermamelan: "de intensievere pigmentaanpak",
  "dermamelan-intimate": "pigment in de intieme zone",
  "happy-intim": "peelings voor de intieme zone",
  "elektrische-epilatie": "ook grijs en blond haar",
  laserontharing: "de haarwortel uitschakelen",
  "xl-hair": "tegen haaruitval",
  acnebehandeling: "reinigen, verstoppingen weghalen",
  "acne-traject": "begeleid traject voor acne",
  "jongeren-acne-traject": "drie maanden voor jongeren",
  littekentherapie: "na een operatie of keizersnede",
  "rrs-hyalift": "hyaluronzuur en vitamines",
  "fotona-4d-full": "met hals en kaaklijn erbij",
  "full-face-brushing": "een lichte laserpas",
  "eye-peel": "een peeling die op de oogcontour mag",
  fibromen: "steelwratjes weghalen",
  voedingsintolerantietest: "bloedtest op voeding",
};

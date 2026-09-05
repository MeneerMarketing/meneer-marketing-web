/**
 * De merken en systemen waarmee Diba werkt.
 *
 * OKAN, 5 SEPTEMBER 2026, en dit is de belangrijkste regel van dit bestand: niet ieder merk
 * waarvan we apparatuur gebruiken is automatisch een officiële partner. Daarom staat er
 * "wij werken met apparatuur en producten van". Alleen bij een echte overeenkomst mag er
 * "officiële partner" staan, en dat woord komt hier dus nergens voor.
 *
 * Dat is geen slag om de arm maar een feitelijke keuze: "partner van Candela" is een claim
 * over een contract, en die kunnen we niet doen zolang niemand dat contract heeft gezien.
 * "Wij werken met twee GentleMax Pro-systemen" is controleerbaar en zegt de bezoeker
 * precies evenveel.
 *
 * `relatie` staat daarom op elk merk. Zodra er per merk bevestigd is wat de relatie is,
 * verandert alleen dat veld en niet de tekst eromheen.
 * [GEGEVEN-NODIG: per merk bevestigen of het een officiële partner, een leverancier of een
 * gebruikt systeem is, Okan]
 */
export type Relatie = "gebruikt" | "leverancier" | "partner";

export type Merk = {
  readonly naam: string;
  readonly relatie: Relatie;
  /** Wat er bij Diba van dit merk staat of gebruikt wordt. */
  readonly bijDiba: string;
  /** Waarvoor. Eén tot twee zinnen, in gewone taal. */
  readonly waarvoor: string;
  /** Waar je heen gaat als dit je interesseert. */
  readonly link: { readonly label: string; readonly href: string };
};

export const APPARATUUR_MERKEN: readonly Merk[] = [
  {
    naam: "Candela Medical",
    relatie: "gebruikt",
    bijDiba: "Twee GentleMax Pro-systemen en de Nordlys",
    waarvoor:
      "Laserontharing op alle huidtypes, en licht op pigmentvlekken, roodheid en zichtbare vaatjes. Welke van de twee golflengtes of welke filter er past, bepaalt de behandelaar op basis van je huid.",
    link: { label: "Onze laserbehandelingen", href: "/laserontharing" },
  },
  {
    naam: "Fotona",
    relatie: "gebruikt",
    bijDiba: "TimeWalker, met Fotona 4D en NightLase",
    waarvoor:
      "Eén apparaat waarop een reeks behandelingen draait: verstrakking van binnenuit, fractionele huidvernieuwing, laserpeelings en NightLase tegen snurken.",
    link: { label: "Alles op de Fotona", href: "/apparatuur/fotona" },
  },
  {
    naam: "HydraFacial",
    relatie: "gebruikt",
    bijDiba: "Twee HydraFacial Syndeo-systemen",
    waarvoor:
      "Reinigen, exfoliëren en hydrateren in één sessie, met een vacuümkop die de bovenlaag leegtrekt in plaats van dichtsmeert.",
    link: { label: "HydraFacial", href: "/behandelingen/hydrafacial" },
  },
  {
    naam: "SkinPen Precision",
    relatie: "gebruikt",
    bijDiba: "SkinPen voor medische microneedling",
    waarvoor:
      "Microneedling met een vaste diepte per zone, gericht op acnelittekens, grove poriën en de structuur van de huid.",
    link: { label: "SkinPen Microneedling", href: "/behandelingen/skinpen" },
  },
  {
    naam: "DermapenWorld",
    relatie: "gebruikt",
    bijDiba: "Dermapen 4",
    waarvoor:
      "Het tweede needling-apparaat. Welke van de twee er wordt gebruikt hangt af van wat er met je huid moet gebeuren en niet van wat er vrij is.",
    link: { label: "Dermapen 4", href: "/behandelingen/dermapen-4" },
  },
  {
    naam: "Skin Complete",
    relatie: "gebruikt",
    bijDiba: "Precision Photonic System en LED-maskers",
    waarvoor:
      "LED-lichttherapie op vaste golflengtes, onder andere bij actieve acne en als rustige stap na een intensievere behandeling.",
    link: { label: "LED-therapie", href: "/behandelingen/led-therapie" },
  },
  {
    naam: "OxyGeneo",
    relatie: "gebruikt",
    bijDiba: "Het OxyGeneo-systeem",
    waarvoor:
      "Exfoliëren, zuurstof aan de huid aanbieden en werkstoffen inbrengen, in dezelfde behandeling.",
    link: { label: "Oxygeneo glow", href: "/behandelingen/oxygeneo" },
  },
  {
    naam: "U225 van Needle Concept",
    relatie: "gebruikt",
    bijDiba: "De U225 mesotherapiepen",
    waarvoor:
      "Werkzame stoffen op een vaste diepte in de huid brengen, met dezelfde hoeveelheid per prik over het hele vlak.",
    link: { label: "Skinboosters", href: "/behandelingen/skinboosters" },
  },
  {
    naam: "Zimmer MedizinSysteme",
    relatie: "gebruikt",
    bijDiba: "Luchtkoeling bij laserbehandelingen",
    waarvoor:
      "Koude lucht op de huid tijdens het laseren. Dat is niet alleen comfort: een gekoelde opperhuid verdraagt meer energie, en dat maakt de behandeling effectiever.",
    link: { label: "Laserontharing", href: "/laserontharing" },
  },
];

export const PRODUCT_MERKEN: readonly Merk[] = [
  {
    naam: "SkinCeuticals",
    relatie: "gebruikt",
    bijDiba: "Professionele huidverzorging",
    waarvoor:
      "Verzorging tijdens de behandeling en voor thuis, vooral rond antioxidanten en zonbescherming.",
    link: { label: "Nazorg per behandeling", href: "/nazorg" },
  },
  {
    naam: "Mesoestetic",
    relatie: "gebruikt",
    bijDiba: "Peelings en de pigmenttrajecten Cosmelan en Dermamelan",
    waarvoor:
      "Medische peelings in verschillende sterktes, en de trajecten van maanden tegen hyperpigmentatie en melasma.",
    link: { label: "Cosmelan", href: "/behandelingen/cosmelan" },
  },
  {
    naam: "RRS",
    relatie: "gebruikt",
    bijDiba: "Onder andere RRS Hyalift en RRS Eyes",
    waarvoor:
      "Mengsels met hyaluronzuur, vitamines en aminozuren die met een fijne naald in de huid worden gebracht.",
    link: { label: "RRS Eyes", href: "/behandelingen/rrs-eyes" },
  },
  {
    naam: "XL Hair",
    relatie: "gebruikt",
    bijDiba: "Behandelingen voor haar en hoofdhuid",
    waarvoor:
      "Gericht op haaruitval en op de conditie van de hoofdhuid waar dat haar in groeit.",
    link: { label: "XL Hair", href: "/behandelingen/xl-hair" },
  },
];

/**
 * Wat er nog uitgezocht wordt.
 *
 * Okan noemt deze los, met de opmerking dat eerst gecontroleerd moet worden onder welk merk
 * of welke leverancier ze vallen. Ze staan hier en niet in de lijst hierboven, want een merk
 * noemen dat je niet kunt thuisbrengen is precies waar deze pagina tegen bedoeld is.
 *
 * De Cryo T-Elephant staat er bewust niet bij: dat apparaat is uit de kliniek (Yasin,
 * 5 september 2026) en hoort dus nergens meer op de site.
 */
export const NOG_UITZOEKEN: readonly string[] = [
  "De EVE-M huidscanner",
  "De eye peel",
  "Aanvullende peelings en injectables",
  "De producten die we voor thuis meegeven",
];

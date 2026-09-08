import type { SalonizedReviewTopic } from "@/data/salonized-reviews";

/**
 * De onderwerpen waarop je reviews kunt filteren, in twee groepen.
 *
 * WAAROM "ALGEMEEN" IS OPGEDEELD.
 *
 * Van de 2.472 reviews met tekst hadden er 2.133 alleen de tag "algemeen". Dat is geen
 * onderwerp maar een restbak, en een filterknop met 2.133 erop zegt niets. Rojda, 8
 * september 2026: "dat kopje algemeen moet nog onderverdeeld worden".
 *
 * De reviews gaan over het bezoek en niet over de klacht (zie `salonized-reviews.ts`), dus
 * de onderverdeling volgt wat mensen over dat bezoek schrijven: de uitleg, hoe ze zijn
 * behandeld, de sfeer, of ze terugkomen. Dat zijn de vragen die iemand heeft die nog nooit
 * binnen is geweest.
 *
 * DE TAGS ZIJN GEEN SMAAK, OOK HIER NIET. Elke tag hangt aan een woord in de review zelf,
 * en de woordenlijst staat hieronder als patroon. "Op je gemak" alleen als er gemak, tijd,
 * geduld of iets in die trant staat; "Resultaat" alleen als er resultaat, verschil of een
 * verandering aan de huid wordt genoemd. Een review kan meerdere tags dragen, en een review
 * die geen van de woorden bevat blijft "Kort en goed": dat zijn de "Top!" en "Super
 * tevreden, bedankt!" waar niets uit af te leiden valt behalve dat iemand tevreden was.
 *
 * De patronen zijn Nederlands met een paar Engelse uitwijkers ("as always"), en ze zijn
 * bewust ruim in spelling: reviews worden op een telefoon getypt.
 *
 * Dit bestand is bewust vrij van data: het wordt ook in client components geladen.
 */

export type OnderwerpGroep = "klacht" | "bezoek";

export type OnderwerpMeta = {
  readonly id: SalonizedReviewTopic;
  readonly label: string;
  readonly groep: OnderwerpGroep;
  /** Hoe de teller onder de filter het zegt: "412 reviews {zin}". */
  readonly zin: string;
  /** Alleen bij de bezoek-onderwerpen: het woord in de tekst waar de tag aan hangt. */
  readonly patroon?: RegExp;
};

export const ONDERWERPEN: readonly OnderwerpMeta[] = [
  /* Over de klacht of de behandeling. Deze tags zitten al in de brondata; zie de
     toelichting in `salonized-reviews.ts`. */
  { id: "acne", label: "Acne", groep: "klacht", zin: "waarin acne voorkomt" },
  {
    id: "littekens",
    label: "Littekens",
    groep: "klacht",
    zin: "waarin littekens voorkomen",
  },
  {
    id: "pigment",
    label: "Pigment",
    groep: "klacht",
    zin: "waarin pigment voorkomt",
  },
  {
    id: "rosacea",
    label: "Roodheid",
    groep: "klacht",
    zin: "waarin roodheid voorkomt",
  },
  {
    id: "laser",
    label: "Laserontharing",
    groep: "klacht",
    zin: "waarin laserontharing voorkomt",
  },
  {
    id: "huidveroudering",
    label: "Huidveroudering",
    groep: "klacht",
    zin: "waarin huidveroudering voorkomt",
  },
  {
    id: "gezichtsbehandeling",
    label: "Gezichtsbehandeling",
    groep: "klacht",
    zin: "waarin een gezichtsbehandeling voorkomt",
  },
  {
    id: "intake",
    label: "Huidconsult",
    groep: "klacht",
    zin: "waarin het huidconsult voorkomt",
  },

  /* Over het bezoek. Deze tags worden uit de tekst afgeleid met het patroon ernaast. */
  {
    id: "uitleg",
    label: "Uitleg en advies",
    groep: "bezoek",
    zin: "waarin de uitleg of het advies wordt genoemd",
    patroon:
      /\buitleg|\buitgelegd|\blegt\b[^.]{0,40}\buit\b|\blegde\b[^.]{0,40}\buit\b|\bstap voor stap\b|\bstappen\b|\badvies|\badviezen|\badviseer|\bgeadviseerd|\binformatie|\bge[iï]nformeerd|\bingelicht|\bvragen\b|\bvraag\b|\bmeedenk|\bmeegedacht|\beerlijk|\bduidelijk|\btips?\b|\bverteld|\bvertelt|\bvertelde|\bantwoord/i,
  },
  {
    id: "vriendelijk",
    label: "Vriendelijk",
    groep: "bezoek",
    zin: "die noemen hoe vriendelijk het personeel was",
    patroon:
      /\bvriendelijk|\blief\b|\blieve\b|\blieverd|\baardig|\bsympathiek|\bhartelijk|\bgastvrij|\bwelkom|\bbehulpzaam|\bleuke? (personeel|mensen|dame|dames|meiden|meid|medewerk\w*|team|vrouw|man)|\bgoudhanden|\bgouden handen|\bwarme? (welkom|ontvangst|onthaal)|\bgezellig/i,
  },
  {
    id: "aandacht",
    label: "Op je gemak",
    groep: "bezoek",
    zin: "over tijd, geduld en je op je gemak voelen",
    patroon:
      /\bgemak\b|\baandacht|\bde tijd\b|\btijd (genomen|voor|nemen|neemt|nam)|\bgeduld|\bvoorzichtig|\brustig|\bluister|\bgeluisterd|\bpersoonlijk|\bbetrokken|\bzorgzaam|\bgerust|\bpijnloos|\bgeen pijn|\bcomfortabel|\bontspannen|\bveilig|\bvertrouw|\bbegrip|\bempathi|\bmeelevend|\btot rust|\bbegeleid/i,
  },
  {
    id: "vakkundig",
    label: "Vakkundig",
    groep: "bezoek",
    zin: "die het vakmanschap of de zorgvuldigheid noemen",
    patroon:
      /\bprofession|\bproffesion|\bprofesion|\bdeskundig|\bkundig|\bvakkundig|\bvakvrouw|\bvakman|\bsecuur|\bzorgvuldig|\bnauwkeurig|\bprecies\b|\bhygi[eë]n|\bervaren\b|\bkennis|\bexpert|\bbekwaam|\bkwaliteit|\bgoed opgeleid|\bweet waar|\bweten waar|\bverstand van|\buitstekend/i,
  },
  {
    id: "service",
    label: "Service en planning",
    groep: "bezoek",
    zin: "over de service en het plannen van afspraken",
    patroon:
      /\bverzet|\bverplaats|\bop tijd\b|\bwachttijd|\bwachten\b|\bplanning|\bflexib|\bbereikbaar|\bbellen\b|\bgebeld|\bwhatsapp|\bmail\b|\bservice\b|\bklantvriendelijk|\bsnel (geholpen|terecht|een afspraak|een plek)|\bcommunicatie|\bherinnering|\bafzeggen|\blater kwam|\bte laat|\bafspraak (maken|gemaakt|verzetten|verplaatsen)|\blast[- ]?minute|\blaatste moment/i,
  },
  {
    id: "sfeer",
    label: "Sfeer en kliniek",
    groep: "bezoek",
    zin: "over de sfeer, de ruimte en de kliniek zelf",
    patroon:
      /\bsfeer|\bpand\b|\blocatie|\bkliniek\b|\bsalon\b|\bpraktijk\b|\bkoffie|\bthee\b|\binterieur|\bruimte\b|\bontvangst|\bparkeer|\bmuziek|\bschoon\b|\bnetjes|\bmodern|\bingericht|\bmooie? (zaak|plek|ruimte|kliniek|salon)|\bfijne plek|\brelaxt|\bhuiselijk|\bluxe|\bomgeving/i,
  },
  {
    id: "resultaat",
    label: "Resultaat",
    groep: "bezoek",
    zin: "die een resultaat op de huid noemen",
    patroon:
      /\bresultaat|\bresultaten|\bverbeter|\bverschil\b|\beffect\b|\bgladder|\bzachter|\bstraal|\bstralend|\bglow\b|\bopgeknapt|\bverdwenen|\bvooruitgang|\bhuid (is|voelt|ziet er|word|wordt)|\bwerkt (echt|goed|super|top)|\bminder (puist|vlek|rood|haar|haren|rimpel|acne|littek)|\bmooie huid|\bmooier|\bhelpt\b|\bherboren/i,
  },
  {
    id: "terug",
    label: "Komt terug",
    groep: "bezoek",
    zin: "van mensen die al vaker kwamen of terugkomen",
    patroon:
      /\bal jaren\b|\bjaren\b|\bvaste klant|\bvaste? cli[eë]nt|\bvaste\b|\bwederom|\bweer\b|\belke keer|\biedere keer|\bkeer op keer|\bterugkom|\bterug kom|\bkom terug|\bkomen (zeker )?terug|\bterug te komen|\bopnieuw|\bvolgende (afspraak|keer|behandeling)|\btot (de )?volgende|\bzoals (altijd|gewoonlijk)|\baltijd\b|\bas always|\blike always|\bnog steeds|\bsinds\b|\bjaar\b|\binmiddels|\bvaker\b|\bvaak\b|\bblijf\b|\belke maand/i,
  },
  {
    id: "aanrader",
    label: "Aanrader",
    groep: "bezoek",
    zin: "die Diba aanraden aan anderen",
    patroon:
      /\baanrader|\baanbevelen|\baanbevolen|\braad (het |dit |ze |haar |hem )?(iedereen |zeker |echt )?aan|\brecommend|\baanraden|\bmoet je (echt )?(naartoe|heen|proberen)|\btip voor/i,
  },
  {
    id: "algemeen",
    label: "Kort en goed",
    groep: "bezoek",
    zin: "die tevreden zijn zonder een onderwerp te noemen",
  },
];

const PER_ID = new Map(ONDERWERPEN.map((o) => [o.id, o]));

export function onderwerp(id: SalonizedReviewTopic): OnderwerpMeta {
  const meta = PER_ID.get(id);
  if (!meta) throw new Error(`Onbekend reviewonderwerp: ${id}`);
  return meta;
}

export function isOnderwerp(waarde: unknown): waarde is SalonizedReviewTopic {
  return (
    typeof waarde === "string" && PER_ID.has(waarde as SalonizedReviewTopic)
  );
}

/**
 * De tags van een review, met "algemeen" vervangen door wat er in de tekst staat.
 *
 * De klacht-tags uit de bron blijven staan. Daarachter komen de bezoek-tags die in de
 * tekst voorkomen, voor elke review en niet alleen voor de reviews die "algemeen" waren:
 * wie over acne schrijft en over de uitleg, hoort onder beide. Staat er niets in de tekst
 * dat past, dan blijft "algemeen" over, en dat is dan ook wat het zegt: kort en goed.
 */
export function verfijnOnderwerpen(
  ruw: readonly SalonizedReviewTopic[],
  tekst: string,
): SalonizedReviewTopic[] {
  const klacht = ruw.filter((t) => t !== "algemeen");
  const bezoek = ONDERWERPEN.filter((o) => o.patroon?.test(tekst)).map(
    (o) => o.id,
  );
  const alles = [...klacht, ...bezoek];
  return alles.length > 0 ? alles : ["algemeen"];
}

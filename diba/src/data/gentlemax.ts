import type { FitzpatrickId } from "@/data/laser-zones";

/**
 * De GentleMax Pro: twee golflengtes in één apparaat.
 *
 * WAAROM DIT EEN EIGEN BESTAND IS EN NIET NOG EEN APPARATUURKAART.
 *
 * /laserontharing vertelt wat de behandeling is en wat hij kost. Deze pagina moet iets
 * anders vertellen, anders mag ze niet bestaan. Wat dit apparaat eigen is, is dat er twee
 * lasers in zitten en dat jouw huidtype bepaalt welke van de twee je krijgt. Dat is de
 * enige technische keuze op deze site die direct over veiligheid gaat, en hij wordt in
 * folders standaard weggelaten.
 *
 * DE NATUURKUNDE, KORT.
 *
 * Een haarlaser mikt op het pigment in de haarwortel: het pigment neemt het licht op, wordt
 * warm en beschadigt de wortel. Dat werkt alleen als de wortel meer licht opneemt dan de
 * huid eromheen, en precies dáár zit het verschil tussen de twee golflengtes.
 *
 * 755 nanometer wordt zeer sterk door pigment opgenomen. Op een lichte huid is dat ideaal:
 * de wortel neemt op, de huid nauwelijks. Op een donkere huid zit er ook pigment in de
 * bovenlaag, en die neemt dan mee op. Dat is geen kleine nuance maar het verschil tussen
 * een goede behandeling en een brandwond.
 *
 * 1064 nanometer wordt veel minder door pigment opgenomen en komt dieper. Daardoor gaat het
 * grootste deel van de energie langs de bovenlaag heen naar de wortel. Minder krachtig per
 * puls, en daarom de golflengte van keuze bij een donkere huid.
 *
 * [MEDISCHE-CHECK-ROJDA] elk getal en elke toewijzing hieronder. De koppeling huidtype naar
 * golflengte is de belangrijkste: dit is wat er in de behandelkamer daadwerkelijk gekozen
 * wordt en de tekst mag daar niet van afwijken.
 */

export type GolflengteId = "755" | "1064";

export type Golflengte = {
  readonly id: GolflengteId;
  readonly naam: string;
  readonly nm: number;
  /** Hoe diep, als percentage van de doorsnede in het venster. */
  readonly diepte: number;
  readonly opname: string;
  readonly sterk: string;
  readonly zwak: string;
};

export const GOLFLENGTES: readonly Golflengte[] = [
  {
    id: "755",
    naam: "Alexandriet",
    nm: 755,
    diepte: 45,
    opname: "Wordt zeer sterk door pigment opgenomen",
    sterk:
      "Op een lichte huid is dit de krachtigste van de twee. De haarwortel neemt bijna alles op en de huid eromheen nauwelijks, dus er is minder energie nodig voor hetzelfde effect.",
    zwak: "Zit er ook pigment in de bovenlaag van de huid, dan neemt die mee op. Daarom is deze golflengte niet de juiste keuze bij een donkere huid.",
  },
  {
    id: "1064",
    naam: "Nd:YAG",
    nm: 1064,
    diepte: 72,
    opname: "Wordt veel minder door pigment opgenomen",
    sterk:
      "Het licht gaat grotendeels langs de bovenlaag heen en komt dieper. Daardoor is dit de veilige keuze bij een huid met veel eigen pigment, en meteen ook de betere bij diepliggende haarwortels.",
    zwak: "Minder opname betekent minder rendement per puls. Er is meer energie nodig, en dat voelt steviger dan de alexandriet.",
  },
];

export function golflengte(id: GolflengteId): Golflengte {
  const g = GOLFLENGTES.find((x) => x.id === id);
  if (!g) throw new Error(`Onbekende golflengte: ${id}`);
  return g;
}

/**
 * Welke golflengte bij welk huidtype, en waarom.
 *
 * I tot III krijgen de alexandriet, V en VI de Nd:YAG. IV ligt op de grens en dat is geen
 * slap compromis maar de eerlijke stand van zaken: daar hangt het af van hoe je huid op de
 * proefplek reageert. Dat staat er dus ook zo.
 */
export type Toewijzing = {
  readonly type: FitzpatrickId;
  readonly kies: GolflengteId | "beide";
  readonly waarom: string;
};

export const TOEWIJZING: readonly Toewijzing[] = [
  {
    type: "I",
    kies: "755",
    waarom:
      "Nauwelijks pigment in de bovenlaag, dus vrijwel alles gaat naar de haarwortel. Dit is de gunstigste uitgangspositie die er is.",
  },
  {
    type: "II",
    kies: "755",
    waarom:
      "Weinig pigment in de bovenlaag. De alexandriet werkt hier efficiënt en op een rustige energie.",
  },
  {
    type: "III",
    kies: "755",
    waarom:
      "Nog steeds voldoende verschil tussen huid en haarwortel. Wel wordt er voorzichtiger ingesteld dan bij type I, en de proefplek is hier geen formaliteit.",
  },
  {
    type: "IV",
    kies: "beide",
    waarom:
      "Dit is de grens. Reageert je huid rustig op de proefplek, dan kan de alexandriet op een lagere energie; is er twijfel, dan gaat het naar de Nd:YAG. Die keuze wordt in de kamer gemaakt en niet vooraf op een website.",
  },
  {
    type: "V",
    kies: "1064",
    waarom:
      "Te veel pigment in de bovenlaag om die veilig over te slaan met de alexandriet. De Nd:YAG gaat er grotendeels langs en komt bij de wortel uit.",
  },
  {
    type: "VI",
    kies: "1064",
    waarom:
      "Hier is de Nd:YAG niet de voorkeur maar de enige juiste keuze. Een sterk door pigment opgenomen golflengte hoort op deze huid niet thuis.",
  },
];

export function toewijzing(type: FitzpatrickId): Toewijzing {
  const t = TOEWIJZING.find((x) => x.type === type);
  if (!t) throw new Error(`Onbekend huidtype: ${type}`);
  return t;
}

/**
 * De koeling.
 *
 * Candela zet vlak voor elke puls een koelmiddel op de huid. Dat beschermt de bovenlaag en
 * maakt het draaglijker. Het is geen extraatje: zonder koeling zou de energie die de wortel
 * nodig heeft de huid erboven te zwaar belasten.
 */
export const KOELING = {
  kop: "De koeling hoort bij de puls",
  zin: "Vlak voor elke laserpuls gaat er een koelmiddel op de huid. Dat beschermt de bovenlaag op het moment dat de energie erdoorheen gaat, en het maakt de behandeling draaglijker.",
  detail:
    "Daarom voelt laserontharing als een korte tik met iets kouds eromheen en niet als een brandende punt. Zonder die koeling zou de energie die de wortel nodig heeft de huid erboven te zwaar belasten.",
} as const;

/**
 * Wat dit apparaat niet kan.
 *
 * Regel vier van /ons-verhaal, en op een apparaatpagina is dit het stuk dat je nergens
 * anders leest. De eerste is de belangrijkste en wordt zelden ergens vermeld, terwijl hij
 * voor een deel van de mensen betekent dat de hele behandeling zinloos is.
 */
export const GRENZEN: readonly { kop: string; zin: string }[] = [
  {
    kop: "Grijs, wit en rood haar",
    zin: "De laser mikt op pigment. Zit er geen pigment in de haar, dan is er niets om op aan te grijpen en gebeurt er niets. Dat geldt ook voor heel licht blond. Geen instelling ter wereld verandert daar iets aan.",
  },
  {
    kop: "Haar dat op dit moment niet groeit",
    zin: "Alleen haren in hun groeifase zitten vast aan de wortel die geraakt moet worden. Op elk moment is dat een deel van je haren en niet allemaal. Daarom zijn er meerdere sessies met weken ertussen nodig, en niet omdat het per sessie niet hard genoeg staat.",
  },
  {
    kop: "Een huid die net bruin is geworden",
    zin: "Verse kleur in de bovenlaag verandert hoeveel licht die opneemt, en daarmee de veilige instelling. Daarom wordt er bij een pas gebruinde huid uitgesteld in plaats van voorzichtiger ingesteld.",
  },
  {
    kop: "Wat definitief hier wel en niet betekent",
    zin: "Wat er is, wordt sterk verminderd. Wat er later nog bij komt, bijvoorbeeld door hormonale verandering, valt daar niet onder. Onderhoud hoort erbij en dat zeggen we liever vooraf dan achteraf.",
  },
];

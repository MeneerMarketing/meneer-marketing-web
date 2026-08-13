import { SALONIZED_REVIEWS } from "@/data/salonized-reviews";

/**
 * Reviews die een teamlid bij naam noemen.
 *
 * WAAROM DIT OP DE TEAMPAGINA HOORT.
 *
 * Die pagina had acht namen met acht functies eronder en verder niets, en dat is voor een
 * bezoeker weinig: de vraag is niet wie er werkt maar bij wie je terechtkomt en of dat
 * uitmaakt. Biografieën verzinnen kan niet, want dit zijn echte mensen en dan zou ik
 * uitspraken doen over personen die ik niet ken.
 *
 * Wat wel kan: er zijn klanten die uit zichzelf een naam noemen. Die quotes bestaan al, ze
 * staan op de openbare Salonized-pagina, en ze zeggen precies wat een bezoeker wil weten.
 *
 * DE KOPPELING IS OP DE BEHANDELNAAM EN NIET OP DE TEKST.
 *
 * Salonized zet bij een review welke behandeling het was, en daar staat soms "bij Iris" of
 * "bij Andres" in. Dat veld is het criterium. Zoeken in de quote zelf zou betekenen dat een
 * review waarin iemand toevallig een naam noemt bij de verkeerde persoon belandt, en dat is
 * precies het soort stille fout dat niemand meer terugvindt.
 *
 * WAT DIT AAN HET LICHT BRACHT.
 *
 * Er wordt in de reviews een naam genoemd die niet op de teampagina staat. Zie
 * `ONBEKENDE_NAMEN` onderaan; dat is geen bug in deze functie maar iets voor Okan.
 */

/** Voornaam uit "Behandeling bij Iris". Null als er geen naam bij staat. */
function naamUitBehandeling(behandeling: string): string | null {
  const m = behandeling.match(/\bbij ([A-Z][a-zà-ÿ]+)\b/);
  return m ? m[1] : null;
}

export type TeamReview = {
  readonly id: string;
  readonly quote: string;
  readonly name: string;
  readonly treatment: string;
  readonly relativeDate?: string;
};

/**
 * De reviews die deze persoon bij naam noemen, nieuwste eerst zoals de bron ze gaf.
 *
 * `teamNaam` is de volledige naam uit `TEAM`; er wordt op de voornaam vergeleken omdat
 * klanten die schrijven.
 */
export function reviewsVoorTeamlid(teamNaam: string): readonly TeamReview[] {
  const voornaam = teamNaam.split(" ")[0].toLowerCase();
  return SALONIZED_REVIEWS.filter((r) => {
    const genoemd = naamUitBehandeling(r.treatment);
    return genoemd !== null && genoemd.toLowerCase() === voornaam;
  }).map((r) => ({
    id: r.id,
    quote: r.quote,
    name: r.name,
    treatment: r.treatment,
    relativeDate: r.relativeDate,
  }));
}

/**
 * Namen die klanten noemen en die niet op de teampagina staan.
 *
 * Op dit moment is dat er één: Grissel, genoemd bij "Consult bij Grissel". Dat kan iemand
 * zijn die er niet meer werkt, een schrijfwijze, of een teamlid dat gewoon vergeten is.
 *
 * [BESLUIT-OKAN] uitzoeken welke van de drie het is. Zolang dat niet duidelijk is, staat de
 * naam nergens op het scherm: iemand toevoegen die ik niet ken is erger dan iemand missen.
 */
export function onbekendeNamen(
  teamNamen: readonly string[],
): readonly string[] {
  const voornamen = new Set(
    teamNamen.map((n) => n.split(" ")[0].toLowerCase()),
  );
  const gevonden = new Set<string>();
  for (const r of SALONIZED_REVIEWS) {
    const n = naamUitBehandeling(r.treatment);
    if (n && !voornamen.has(n.toLowerCase())) gevonden.add(n);
  }
  return [...gevonden];
}

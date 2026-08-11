/**
 * Nazorg: wat mag wanneer weer.
 *
 * WAAROM DIT EEN ROOSTER IS EN GEEN TIJDLIJN.
 *
 * Hier stonden vijf trajecten met elk vier placeholders, twintig in totaal. Een tijdlijn
 * ("direct na, eerste week, eerste maand") leest prettig en beantwoordt de vraag niet die
 * mensen thuis op de bank stellen. Die vraag is altijd hetzelfde en altijd concreet: mag
 * ik morgen sporten, mag ik make-up op, wanneer mag die retinol weer.
 *
 * Dus is het een rooster geworden: per behandeling staat per bezigheid vanaf wanneer die
 * weer mag. Dat is de vorm die je op je telefoon opzoekt terwijl je huid nog nagloeit, en
 * die staat nergens anders op deze site.
 *
 * DE GETALLEN ZIJN RICHTLIJNEN EN GEEN GARANTIES.
 *
 * Hoe snel jouw huid herstelt hangt af van de instelling die gekozen is, van je huidtype
 * en van hoe je erop reageert. Wat je in de kliniek te horen krijgt gaat altijd voor op
 * wat hier staat. Dat staat ook op de pagina zelf, en niet in kleine letters.
 *
 * [MEDISCHE-CHECK-ROJDA] elke regel in dit bestand, zonder uitzondering. Dit zijn de
 * instructies waar iemand thuis naar handelt.
 */

/** De bezigheden waar het thuis altijd over gaat. */
export const BEZIGHEDEN = [
  {
    id: "zon",
    label: "De zon in",
    zin: "Onbeschermd buiten zijn, of de zonnebank.",
  },
  {
    id: "sport",
    label: "Sporten",
    zin: "Alles waar je warm en bezweet van wordt.",
  },
  {
    id: "sauna",
    label: "Sauna en heet douchen",
    zin: "Hitte verwijdt de vaten en dat verlengt de roodheid.",
  },
  {
    id: "makeup",
    label: "Make-up",
    zin: "Foundation, concealer, alles wat je erop legt.",
  },
  {
    id: "actief",
    label: "Retinol en zuren",
    zin: "De werkstoffen uit je eigen routine.",
  },
  {
    id: "scrub",
    label: "Scrubben en borstelen",
    zin: "Mechanisch schuren, ook met een washandje.",
  },
  {
    id: "zwemmen",
    label: "Zwemmen",
    zin: "Chloor en zout, allebei prikkelend op een verse huid.",
  },
] as const;

export type BezigheidId = (typeof BEZIGHEDEN)[number]["id"];

/**
 * Hoe lang je moet wachten, in uren.
 *
 * Nul betekent: meteen weer. Een hoog getal is geen strengheid maar de tijd die de huid
 * nodig heeft; bij zon staat er bewust een lange termijn omdat daar de meeste schade
 * ontstaat en het gevolg (pigment) maanden blijft.
 */
export type Wachttijd = {
  readonly uren: number;
  /** Waarom, in één zin. Zonder reden is een regel een verbod. */
  readonly reden: string;
};

export type NazorgBehandeling = {
  readonly slug: string;
  readonly naam: string;
  /** Wat je de eerste uren merkt. Geen verrassingen. */
  readonly meteenNa: string;
  /** De enige regel die er echt toe doet bij deze behandeling. */
  readonly hoofdregel: string;
  readonly wachten: Readonly<Record<BezigheidId, Wachttijd>>;
  /** Wanneer je moet bellen. Dit is geen bijzaak. */
  readonly belOns: readonly string[];
};

const dagen = (n: number) => n * 24;

export const NAZORG: readonly NazorgBehandeling[] = [
  {
    slug: "hydrafacial",
    naam: "HydraFacial en gezichtsbehandeling",
    meteenNa:
      "Je huid voelt schoon en kan licht roze zijn. Bij de meeste mensen is dat binnen een uur weg.",
    hoofdregel:
      "Dit is de behandeling met de kortste nazorg van de lijst. Je kunt er direct mee de deur uit.",
    wachten: {
      zon: {
        uren: 24,
        reden: "Je huid is net gereinigd en tijdelijk gevoeliger.",
      },
      sport: { uren: 12, reden: "Zweet op een net geopende porie prikkelt." },
      sauna: { uren: 24, reden: "Hitte houdt de roodheid langer aan." },
      makeup: {
        uren: 6,
        reden: "Geef de werkstoffen even de tijd om in te trekken.",
      },
      actief: {
        uren: 24,
        reden: "Retinol en zuren bovenop een net behandelde huid is dubbelop.",
      },
      scrub: {
        uren: dagen(3),
        reden: "Er is net geëxfolieerd; nog een keer is te veel.",
      },
      zwemmen: { uren: 24, reden: "Chloor droogt uit op een verse huid." },
    },
    belOns: [
      "Als de roodheid na een dag niet minder wordt",
      "Als er bultjes ontstaan die er voor de behandeling niet waren",
    ],
  },
  {
    slug: "peeling",
    naam: "Medische peeling",
    meteenNa:
      "Strak en warm gevoel, en een rode gloed. Het vervellen begint meestal pas na twee tot drie dagen.",
    hoofdregel:
      "Trek er niets af. Wat loslaat, laat je loslaten. Er aan plukken is de snelste manier om een vlek over te houden.",
    wachten: {
      zon: {
        uren: dagen(14),
        reden: "Een vervellende huid is onbeschermd; hier ontstaat pigment.",
      },
      sport: {
        uren: dagen(2),
        reden: "Zweet prikt op een huid die aan het vervellen is.",
      },
      sauna: {
        uren: dagen(7),
        reden: "Hitte en vocht maken het vervellen onvoorspelbaar.",
      },
      makeup: {
        uren: dagen(2),
        reden: "Laat de bovenlaag eerst rustig loskomen.",
      },
      actief: {
        uren: dagen(7),
        reden: "Je hebt net een zuur gehad; nog een is te veel.",
      },
      scrub: {
        uren: dagen(14),
        reden: "Schuren op een vervellende huid geeft schade en vlekken.",
      },
      zwemmen: { uren: dagen(7), reden: "Chloor op een open bovenlaag." },
    },
    belOns: [
      "Bij blaren, of bij pijn die erger wordt in plaats van minder",
      "Als er na een week nog steeds niets is losgekomen en de huid strak blijft",
      "Bij een koortslip die opkomt; daar is iets aan te doen als je er op tijd bij bent",
    ],
  },
  {
    slug: "microneedling",
    naam: "Microneedling",
    meteenNa:
      "Rood en warm, als een stevige zonnegloed. Dat zakt in één tot drie dagen weg. De huid kan daarna een paar dagen droog aanvoelen.",
    hoofdregel:
      "De eerste vierentwintig uur staan de kanaaltjes nog open. Alles wat je er dan op legt gaat dieper dan je wil, dus houd het bij wat je meekrijgt.",
    wachten: {
      zon: {
        uren: dagen(14),
        reden: "Een huid in herstel pigmenteert sneller.",
      },
      sport: {
        uren: dagen(2),
        reden: "Zweet en warmte in open kanaaltjes geven ontsteking.",
      },
      sauna: {
        uren: dagen(7),
        reden: "Hitte verlengt de roodheid en het risico.",
      },
      makeup: {
        uren: dagen(1),
        reden: "Pigment in een open kanaaltje wil je niet.",
      },
      actief: {
        uren: dagen(5),
        reden:
          "Retinol en zuren op een herstellende huid prikken en vertragen.",
      },
      scrub: {
        uren: dagen(14),
        reden: "De huid bouwt op; schuren breekt dat af.",
      },
      zwemmen: {
        uren: dagen(5),
        reden: "Chloor en bacteriën in een open huid.",
      },
    },
    belOns: [
      "Bij zwelling die na twee dagen toeneemt",
      "Bij plekken die geel worden of gaan lekken",
      "Bij koorts, hoe licht ook",
    ],
  },
  {
    slug: "laserontharing",
    naam: "Laserontharing",
    meteenNa:
      "Rode bultjes rond de haarzakjes, alsof je kippenvel hebt. Meestal binnen een dag weg. Na een tot drie weken vallen de behandelde haren uit; dat lijkt op groei maar dat is het niet.",
    hoofdregel:
      "Niet scheren tussendoor is niet nodig: scheren mag en moet zelfs. Wat niet mag is epileren, harsen of pincetten, want dan haal je de wortel weg die de volgende sessie moet raken.",
    wachten: {
      zon: {
        uren: dagen(14),
        reden: "Verse kleur in de huid maakt de volgende sessie onveilig.",
      },
      sport: {
        uren: dagen(1),
        reden: "Zweet in geprikkelde haarzakjes geeft bultjes.",
      },
      sauna: { uren: dagen(2), reden: "Hitte op een net verwarmde huid." },
      makeup: {
        uren: dagen(1),
        reden: "Alleen bij het gezicht; laat de zakjes eerst sluiten.",
      },
      actief: { uren: dagen(2), reden: "Zuren op een geprikkelde huid." },
      scrub: {
        uren: dagen(7),
        reden: "Wacht met scrubben tot de haren zijn uitgevallen.",
      },
      zwemmen: { uren: dagen(2), reden: "Chloor in geprikkelde haarzakjes." },
    },
    belOns: [
      "Bij blaren of korstjes; dat hoort niet bij een goed ingestelde behandeling",
      "Als de roodheid na twee dagen niet weg is",
      "Als je merkt dat je huid donkerder wordt op de behandelde plek",
    ],
  },
  {
    slug: "pigmenttraject",
    naam: "Pigmenttraject",
    meteenNa:
      "Afhankelijk van wat er gedaan is: roodheid, donkerder wordende vlekjes die later loslaten, of vervelling.",
    hoofdregel:
      "Zonbescherming is hier geen advies maar onderdeel van de behandeling. Zonder dat komt het pigment terug, ook na een traject dat verder perfect is verlopen.",
    wachten: {
      zon: {
        uren: dagen(90),
        reden:
          "Bij pigment is dit geen wachttijd maar een gewoonte voor de hele periode en daarna.",
      },
      sport: { uren: dagen(2), reden: "Warmte kan pigment aanjagen." },
      sauna: {
        uren: dagen(14),
        reden: "Hitte is bij pigment een bekende aanjager.",
      },
      makeup: { uren: dagen(1), reden: "Mag weer zodra de huid gesloten is." },
      actief: {
        uren: dagen(7),
        reden:
          "Volg wat je in de kliniek meekrijgt; het schema is onderdeel van het traject.",
      },
      scrub: {
        uren: dagen(30),
        reden: "Schuren op pigment maakt het meestal erger.",
      },
      zwemmen: {
        uren: dagen(7),
        reden: "Chloor en zon in combinatie zijn hier de slechtste.",
      },
    },
    belOns: [
      "Als de vlekken donkerder worden in plaats van lichter",
      "Bij nieuwe vlekken op plekken die niet behandeld zijn",
      "Als je onverwacht toch in de volle zon bent geweest",
    ],
  },
];

export function nazorgVoorSlug(slug: string): NazorgBehandeling | undefined {
  return NAZORG.find((n) => n.slug === slug);
}

/** "Meteen weer", "Na 12 uur", "Na 3 dagen", "Na 3 maanden". */
export function wachttijdTekst(uren: number): string {
  if (uren === 0) return "Meteen weer";
  if (uren < 24) return `Na ${uren} uur`;
  const d = Math.round(uren / 24);
  if (d < 14) return `Na ${d} ${d === 1 ? "dag" : "dagen"}`;
  if (d < 60) return `Na ${Math.round(d / 7)} weken`;
  return `Na ${Math.round(d / 30)} maanden`;
}

/** Hoe zwaar de beperking weegt, voor de kleur in het rooster. */
export function wachtNiveau(uren: number): "kort" | "middel" | "lang" {
  if (uren <= 24) return "kort";
  if (uren <= dagen(7)) return "middel";
  return "lang";
}

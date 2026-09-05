import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * De video's uit de eigen social media, per pagina.
 *
 * YASIN, 5 SEPTEMBER 2026: reels op sommige pagina's, als rechterkolom naast een even hoge
 * tekstkolom. Twee soorten, en die moeten zich anders gedragen:
 *
 *   "sfeer"  — geen uitleg, geen gesproken tekst. Speelt vanzelf, geluidloos, in herhaling.
 *              Dit is beeld naast tekst, zoals een foto die beweegt.
 *   "uitleg" — met stem en ondertiteling. Speelt niet vanzelf: je drukt zelf op play, en
 *              dan mét geluid. Een pratende video die vanzelf begint is een reclameblok.
 *
 * WAAROM ER LOKALE BESTANDEN STAAN EN GEEN INSTAGRAM-INSLUITING. Instagram geeft het
 * videobestand niet vrij aan een andere site; alleen een posterafbeelding. Hun insluiting is
 * een iframe met hun eigen speler: geen autoplay, hun knoppen eroverheen, en het zet
 * trackingcookies van Meta op een kliniekwebsite bij iemand die alleen een behandeling
 * bekijkt. Dat laatste is voor deze site het doorslaggevende bezwaar.
 *
 * Dus: de reel wordt geëxporteerd als mp4 en komt in `public/videos/`. De bron staat er per
 * video bij, zodat te controleren is welke reel het is.
 *
 * ZOLANG `bestand` LEEG IS RENDERT HET BLOK NIETS. Geen kapotte videospeler, geen "video
 * volgt". De sectie verschijnt op het moment dat het bestand er staat.
 */
export type VideoSoort = "sfeer" | "uitleg";

export type Videoblok = {
  /** Pad onder /public. Leeg zolang het bestand er nog niet is. */
  readonly bestand?: string;
  /** Stilstaand beeld voor het afspelen. Verplicht bij "uitleg". */
  readonly poster?: string;
  /** Ondertitelbestand (.vtt). Alleen bij "uitleg", en alleen als het er is. */
  readonly ondertiteling?: string;
  readonly soort: VideoSoort;
  readonly kop: string;
  readonly accent: string;
  readonly intro: string;
  /** Korte punten naast de video. Drie tot vijf. */
  readonly punten: readonly string[];
  /** Waar de opname vandaan komt, om te kunnen controleren welke reel het is. */
  readonly bron: string;
  /** Wat er te zien is, voor wie de video niet kan zien. */
  readonly beschrijving: string;
};

export const VIDEOS: Record<string, Videoblok> = {
  "rrs-eyes": {
    soort: "sfeer",
    bestand: "/videos/rrs-eyes.mp4",
    bron: "https://www.instagram.com/reel/DYnF7bGAc91/",
    kop: "Wat je ziet",
    accent: "als het gebeurt",
    intro:
      "De behandeling duurt korter dan de uitleg erover. Dit is de oogzone tijdens een sessie, zonder montage en zonder muziek.",
    punten: [
      "Een fijne naald, vlak onder de huid rond de oogkas",
      "Kleine bultjes die binnen een dag wegtrekken",
      "Ongeveer twintig minuten in de stoel",
    ],
    beschrijving:
      "Een behandelaar zet met een fijne naald het mengsel rond de oogkas van een client.",
  },

  skinpen: {
    soort: "sfeer",
    bestand: "/videos/skinpen.mp4",
    bron: "https://www.instagram.com/reel/DYP6xCkAwn7/",
    kop: "Microneedling",
    accent: "van dichtbij",
    intro:
      "Het handstuk gaat in banen over de huid. Wat je hoort is het apparaat; wat je ziet is de roodheid die er meteen na de sessie bij hoort en binnen een dag wegtrekt.",
    punten: [
      "Vaste diepte per zone, ingesteld door de behandelaar",
      "Rood en warm direct erna, de dag erop meestal weg",
      "Een reeks van drie tot zes, met weken ertussen",
    ],
    beschrijving:
      "Het SkinPen-handstuk beweegt in banen over de wang van een client.",
  },

  liplase: {
    soort: "sfeer",
    bestand: "/videos/liplase.mp4",
    bron: "https://www.instagram.com/reel/DUq8hEHjddr/",
    kop: "LipLase",
    accent: "in de stoel",
    intro:
      "Er komt geen naald aan te pas. Het handstuk werkt van binnenuit tegen de binnenkant van de lip en daarna aan de buitenzijde.",
    punten: [
      "Warm, en te doen zonder verdoving",
      "Geen filler en geen volume dat je erin spuit",
      "Meteen erna weer de deur uit",
    ],
    beschrijving:
      "Het laserhandstuk wordt tegen de binnen- en buitenzijde van de lippen gehouden.",
  },

  "eve-m": {
    soort: "uitleg",
    bestand: "/videos/eve-m.mp4",
    poster: "/images/shoot/eve-m-in-gebruik.jpg",
    bron: "https://www.instagram.com/reel/DWEA6ysAI0s/",
    kop: "Wat de EVE-M",
    accent: "laat zien",
    intro:
      "In deze video legt de behandelaar uit wat er op het scherm verschijnt en wat je eraan hebt. Zet het geluid aan, want het is de uitleg die het punt maakt.",
    punten: [
      "Wat de drie soorten licht ieder zichtbaar maken",
      "Waarom de foto's alleen naast elkaar iets zeggen",
      "Wat het apparaat níet doet: kiezen",
    ],
    beschrijving:
      "Een behandelaar legt bij het scherm van de EVE-M uit wat de opnames laten zien.",
  },

  "jongeren-acne-traject": {
    soort: "uitleg",
    bestand: "/videos/jongeren-acne-traject.mp4",
    poster: "/images/shoot/beh-jongeren-acne.jpg",
    bron: "https://www.instagram.com/reel/DVwYaBNgA6w/",
    kop: "Hoe een traject",
    accent: "er echt uitziet",
    intro:
      "Gesproken uitleg over hoe een acnetraject bij jongeren loopt: wat er in de eerste weken gebeurt, en waarom de huid soms eerst onrustiger wordt.",
    punten: [
      "Wat er in de eerste weken verandert",
      "Waarom geduld hier het grootste deel van het werk is",
      "Wat er tussen de afspraken door gebeurt",
    ],
    beschrijving:
      "Een behandelaar vertelt hoe een acnetraject bij jongeren verloopt.",
  },
};

/**
 * De video bij een pagina, of niets als het bestand er nog niet staat.
 *
 * De paden hierboven staan al ingevuld. Deze functie kijkt op de schijf of het bestand er
 * werkelijk is, zodat er nooit een kapotte speler op de pagina komt en er ook geen regel
 * omgezet hoeft te worden zodra een reel wordt aangeleverd: neerzetten in `public/videos/`
 * en opnieuw bouwen is genoeg.
 *
 * Dit bestand wordt alleen op de server gelezen. VideoKolom importeert er uitsluitend het
 * type uit, en dat verdwijnt bij het compileren; `fs` komt dus niet in de browser terecht.
 */
export function videoVoor(slug: string): Videoblok | undefined {
  const v = VIDEOS[slug];
  if (!v?.bestand) return undefined;
  const pad = join(process.cwd(), "public", v.bestand);
  return existsSync(pad) ? v : undefined;
}

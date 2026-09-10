import type { HuidIconNaam } from "@/components/ui/HuidIcon";
import type { HuidwensId } from "@/data/behandelingen";

/**
 * Wat de homepage per huidwens toevoegt aan de data: een icoon en een foto.
 *
 * De zeven keuzes zelf staan in HUIDWENSEN (data/behandelingen), dezelfde zeven als op
 * /behandelingen. Hier stond een eigen lijstje met eigen namen ("Pigment & melasma" waar
 * de rest van de site "Pigment, roodheid en vaatjes" zegt), en dat liep uit elkaar zodra
 * iemand één van de twee aanpaste. Nu is dit alleen nog het beeld bij de wens.
 *
 * "overig" heeft geen tegel op de homepage: dat zijn NightLase en fibromen, geen
 * huidwens waarmee iemand binnenkomt.
 */
/**
 * De foto per wens. Yasin, 8 september 2026: "doe bijpassende foto's". De zes
 * intent-beelden waren bijsnijdsels die per wens weinig zeiden (bij huidverjonging een
 * lachende behandelaar met een pen, bij glow een laser op een been). Nu per wens de
 * behandeling die er het meest bij hoort, uit dezelfde eigen shoot.
 *
 * HET BRANDPUNT, EN WAAROM DAT NODIG IS.
 *
 * De shoot is staand (2:3), de kaart is liggend. Het midden van een staande foto is bijna
 * nooit het onderwerp: bij de acnefoto stond daar de muur, met het gezicht en de
 * peelingflesjes net buiten beeld. Yasin, 10 september 2026: "foto recht zetten, peelings
 * niet in beeld." Daarom staat per foto in `brandpunt` op welke hoogte het onderwerp zit,
 * als percentage van boven. 50 is het midden en is de terugval.
 */
export const HOME_WENS_BEELD: Record<
  Exclude<HuidwensId, "overig">,
  {
    readonly icoon: HuidIconNaam;
    readonly image: string;
    readonly imageAlt: string;
    /** Op welke hoogte het onderwerp zit, in procenten van boven. */
    readonly brandpunt: number;
  }
> = {
  acne: {
    icoon: "verstopte-porie",
    image: "/images/shoot/beh-jongeren-acne.jpg",
    imageAlt:
      "Behandelaar houdt twee peelings vast naast een jongere met acne in de behandelstoel",
    /* Het gezicht zit op tweevijfde en de flesjes eronder; op het midden gericht zag je
       alleen de muur erboven. */
    brandpunt: 63,
  },
  pigment: {
    icoon: "huid-glans",
    /* Yasin, 10 september 2026: bij pigment, roodheid en vaatjes hoort de Nordlys. Deze
       opname is liggend, dus hij past zonder bijsnijden in de kaart, en het apparaat staat
       er met naam en al op. */
    image: "/images/shoot/kliniek-nordlys-behandeling.jpg",
    imageAlt:
      "Behandeling met de Nordlys in de behandelkamer, met het apparaat ernaast",
    brandpunt: 50,
  },
  littekens: {
    icoon: "huid-bultje",
    /* De foto die hier stond heet stoel-skinpen maar toont een laserarm met een SkinPen-doos
       op de plank; geen microneedling dus. Deze toont de pen zelf in de hand (Yasin,
       10 september 2026: "andere foto van skinpen, maar een betere"). */
    image: "/images/shoot/beh-dermapen.jpg",
    imageAlt: "Microneedling met de SkinPen bij een cliënt in de behandelstoel",
    /* Laag genoeg om de pen en de cliënt te tonen. Op de helft sneed het kader de
       behandelaar door haar ogen, en een gezicht dat op de oogleden ophoudt is erger dan
       een gezicht dat er niet op staat. Yasin, 10 september 2026: nog wat verder omlaag
       gericht, zodat het gezicht van de cliënt er helemaal op staat. */
    brandpunt: 74,
  },
  verjonging: {
    icoon: "huid-strakker",
    image: "/images/shoot/beh-fotona.jpg",
    imageAlt:
      "Fotona-laserbehandeling met oogbescherming voor cliënt en behandelaar",
    /* Op het midden gericht zag je alleen een wit stuk arm van het apparaat, en op
       tweederde alleen een handschoen. Hier staat het handstuk op de huid, met de bril van
       de cliënt en de behandelaar erachter. */
    brandpunt: 78,
  },
  glow: {
    icoon: "porie-vocht",
    image: "/images/shoot/beh-hydrafacial-syndeo.jpg",
    imageAlt: "HydraFacial-behandeling met de Syndeo in de behandelkamer",
    brandpunt: 50,
  },
  ontharing: {
    icoon: "haarzakje",
    image: "/images/shoot/laser-met-bril.jpg",
    imageAlt: "Laserontharing: behandelaar en cliënt dragen een beschermbril",
    brandpunt: 50,
  },
  haaruitval: {
    icoon: "pincet-haar",
    image: "/images/shoot/beh-xl-hair.jpg",
    imageAlt: "XL Hair-behandeling voor haar en hoofdhuid",
    brandpunt: 50,
  },
};

/** Eén behandeling in het paneel: genoeg om te kiezen, niet meer. */
export type HomeWensBehandeling = {
  readonly slug: string;
  readonly naam: string;
  readonly apparaat?: string;
  /** Al opgemaakt op de server ("vanaf € 140" of "Op aanvraag"), zodat de client de
   *  prijslogica en daarmee de hele behandelingendata niet hoeft mee te laden. */
  readonly prijsLabel: string;
};

/**
 * Wat de kiezer op de homepage per wens nodig heeft. Wordt op de server samengesteld
 * (lib/home-wensen) en als gewone props aan de client gegeven: geen behandelingendata en
 * geen redactievlaggen in de browser.
 */
export type HomeWens = {
  readonly id: string;
  readonly label: string;
  readonly knop: string;
  readonly kort: string;
  readonly pad: string;
  readonly icoon: HuidIconNaam;
  readonly image: string;
  readonly imageAlt: string;
  /** Op welke hoogte het onderwerp in de foto zit, in procenten van boven. */
  readonly brandpunt: number;
  /** De eerste paar behandelingen, met prijs eerst. */
  readonly behandelingen: readonly HomeWensBehandeling[];
  /** Hoeveel er in totaal onder deze wens vallen. */
  readonly totaal: number;
};

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
 */
export const HOME_WENS_BEELD: Record<
  Exclude<HuidwensId, "overig">,
  {
    readonly icoon: HuidIconNaam;
    readonly image: string;
    readonly imageAlt: string;
  }
> = {
  acne: {
    icoon: "verstopte-porie",
    image: "/images/shoot/beh-jongeren-acne.jpg",
    imageAlt: "Acnebehandeling bij een jongere in de behandelkamer",
  },
  pigment: {
    icoon: "huid-glans",
    image: "/images/shoot/beh-cosmelan-masker.jpg",
    imageAlt: "Cosmelan-masker wordt aangebracht bij een pigmentbehandeling",
  },
  littekens: {
    icoon: "huid-bultje",
    image: "/images/shoot/stoel-skinpen.jpg",
    imageAlt: "Microneedling met de SkinPen in de behandelstoel",
  },
  verjonging: {
    icoon: "huid-strakker",
    image: "/images/shoot/beh-fotona.jpg",
    imageAlt:
      "Fotona-laserbehandeling met oogbescherming voor cliënt en behandelaar",
  },
  glow: {
    icoon: "porie-vocht",
    image: "/images/shoot/beh-hydrafacial-syndeo.jpg",
    imageAlt: "HydraFacial-behandeling met de Syndeo in de behandelkamer",
  },
  ontharing: {
    icoon: "haarzakje",
    image: "/images/shoot/laser-met-bril.jpg",
    imageAlt: "Laserontharing: behandelaar en cliënt dragen een beschermbril",
  },
  haaruitval: {
    icoon: "pincet-haar",
    image: "/images/shoot/beh-xl-hair.jpg",
    imageAlt: "XL Hair-behandeling voor haar en hoofdhuid",
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
  /** De eerste paar behandelingen, met prijs eerst. */
  readonly behandelingen: readonly HomeWensBehandeling[];
  /** Hoeveel er in totaal onder deze wens vallen. */
  readonly totaal: number;
};

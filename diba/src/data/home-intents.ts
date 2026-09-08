import type { HuidIconNaam } from "@/components/ui/HuidIcon";
import type { HuidwensId } from "@/data/behandelingen";
import {
  FIGMA_INTENT_ACNE,
  FIGMA_INTENT_LASER,
  FIGMA_INTENT_LICHAAM,
  FIGMA_INTENT_LITTEKENS,
  FIGMA_INTENT_PIGMENT,
  FIGMA_INTENT_VEROUDERING,
} from "@/data/figma-home-images";

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
    image: FIGMA_INTENT_ACNE.src,
    imageAlt: FIGMA_INTENT_ACNE.alt,
  },
  pigment: {
    icoon: "huid-glans",
    image: FIGMA_INTENT_PIGMENT.src,
    imageAlt: FIGMA_INTENT_PIGMENT.alt,
  },
  littekens: {
    icoon: "huid-bultje",
    image: FIGMA_INTENT_LITTEKENS.src,
    imageAlt: FIGMA_INTENT_LITTEKENS.alt,
  },
  verjonging: {
    icoon: "huid-strakker",
    image: FIGMA_INTENT_VEROUDERING.src,
    imageAlt: FIGMA_INTENT_VEROUDERING.alt,
  },
  glow: {
    icoon: "porie-vocht",
    image: FIGMA_INTENT_LICHAAM.src,
    imageAlt: FIGMA_INTENT_LICHAAM.alt,
  },
  ontharing: {
    icoon: "haarzakje",
    image: FIGMA_INTENT_LASER.src,
    imageAlt: FIGMA_INTENT_LASER.alt,
  },
  /* [BEELD-NODIG: eigen foto voor haaruitval; nu de laserfoto als tijdelijke vulling] */
  haaruitval: {
    icoon: "pincet-haar",
    image: FIGMA_INTENT_LASER.src,
    imageAlt: FIGMA_INTENT_LASER.alt,
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

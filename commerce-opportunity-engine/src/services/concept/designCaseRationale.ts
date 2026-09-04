/**
 * Milestone 9.3.4 — internal rationale per design case.
 *
 * Composed from measured audit data, not from a second Claude call. Every line
 * has to be traceable to a score, a leak or a discovery signal, because this is
 * what we use to decide where the design effort goes.
 */

import type { ConversionLeak } from "../../types/audit.js";

export interface DesignCaseInput {
  domain: string;
  branchLabel: string;
  familyLabel: string;
  businessType: string | null;
  platform: string | null;
  commerceModel: string;
  estimatedCatalogSize: number | null;
  catalogFocus: number | null;
  ownBrandSignal: number | null;
  businessMaturity: number | null;
  adKeywords: string[];
  heroProduct: string | null;
  heroPrice: number | null;
  heroCurrency: string | null;
  reviewCount: number | null;
  rating: number | null;
  currentPdpQuality: number | null;
  subScores: {
    buyblock: number | null;
    visual: number | null;
    storytelling: number | null;
    media: number | null;
    deepDive: number | null;
    mobile: number | null;
  };
  assetReadiness: number | null;
  transformation: number | null;
  contrastRoom: number | null;
  contrastCapability: number | null;
  conceptContrast: number | null;
  deepDiveFit: number | null;
  economicFit: number | null;
  salesFit: number | null;
  leaks: ConversionLeak[];
  strengths: Array<{ title: string }>;
}

export interface DesignCaseRationale {
  business: string[];
  product: string[];
  pdpProblems: string[];
  ourImprovements: string[];
  beforeAfter: string[];
}

function labelFor(score: number | null): string {
  if (score == null) return "niet gemeten";
  if (score >= 75) return "sterk";
  if (score >= 60) return "redelijk";
  if (score >= 45) return "matig";
  if (score >= 30) return "zwak";
  return "zeer zwak";
}

const SUBSCORE_LABELS: Record<keyof DesignCaseInput["subScores"], string> = {
  buyblock: "koopblok",
  visual: "visueel ontwerp",
  storytelling: "productverhaal",
  media: "beeldgebruik",
  deepDive: "verdieping",
  mobile: "mobiel kopen",
};

/** What the premium version would add, per weak subcomponent. */
const IMPROVEMENT_BY_SUBSCORE: Record<keyof DesignCaseInput["subScores"], string> = {
  buyblock:
    "koopblok opnieuw opbouwen: duidelijke propositie boven de vouw, prijs en varianten zonder zoeken, één dominante CTA met trust ernaast",
  visual:
    "eigen visuele taal in plaats van themastandaard: typografie met hiërarchie, rustige vlakken, merkkleur die het product laat spreken",
  storytelling:
    "productverhaal in lagen: waarom dit product bestaat, voor wie het is, welke bezwaren het wegneemt",
  media:
    "beeld buiten de galerij inzetten: lifestyle, detailshots bij features, beeld dat de claim bewijst in plaats van herhaalt",
  deepDive:
    "verdiepingsblok: hoe het werkt, specificaties, materialen, vergelijking en FAQ met herhaalde koopmomenten",
  mobile:
    "mobiel als hoofdscherm: prijs en CTA in het eerste beeld, sticky koopbalk, informatiedichtheid teruggebracht",
};

export function buildDesignCaseRationale(input: DesignCaseInput): DesignCaseRationale {
  const business: string[] = [];
  const product: string[] = [];
  const pdpProblems: string[] = [];
  const ourImprovements: string[] = [];
  const beforeAfter: string[] = [];

  // --- business -----------------------------------------------------------
  business.push(
    `${input.branchLabel} · ${input.familyLabel}, gevonden via betaalde plaatsingen op ${input.adKeywords.slice(0, 3).join(", ") || "commerciële zoektermen"}.`
  );
  business.push(
    `${input.businessType ?? "onbekend type"} op ${input.platform ?? "onbekend platform"}, commerce model ${input.commerceModel.toLowerCase().replace(/_/g, " ")}, eigen-merksignaal ${input.ownBrandSignal ?? "?"}.`
  );
  business.push(
    `Catalogus ${input.estimatedCatalogSize ?? "?"} producten met focus ${input.catalogFocus ?? "?"}: klein genoeg om één hero product het werk te laten doen.`
  );
  if (input.businessMaturity != null) {
    business.push(`Volwassenheid ${input.businessMaturity}, dus dit is een draaiende winkel en geen zijproject.`);
  }
  if (input.adKeywords.length > 0) {
    business.push(
      `Ze betalen zelf voor verkeer naar deze categorie, dus elke procent conversie op de productpagina is direct geld.`
    );
  }

  // --- product ------------------------------------------------------------
  if (input.heroProduct) {
    product.push(
      `Hero product: ${input.heroProduct}${input.heroPrice != null ? ` (${input.heroCurrency ?? "EUR"} ${input.heroPrice})` : ""}.`
    );
  }
  if (input.heroPrice != null) {
    product.push(
      input.heroPrice >= 150
        ? `Prijspunt ${input.heroPrice} vraagt om uitleg en bewijs, precies waar een deep-dive pagina rendeert.`
        : `Prijspunt ${input.heroPrice}: haalbaar, maar de marge moet uit volume komen.`
    );
  }
  if (input.reviewCount != null && input.reviewCount > 0) {
    product.push(
      `${input.reviewCount} reviews${input.rating != null ? ` met gemiddelde ${input.rating}` : ""} als bestaand bewijsmateriaal.`
    );
  }
  product.push(
    `Materiaal om mee te bouwen: asset readiness ${input.assetReadiness ?? "?"}, deep-dive fit ${input.deepDiveFit ?? "?"}.`
  );

  // --- what is wrong today ------------------------------------------------
  pdpProblems.push(
    `Huidige PDP-kwaliteit ${input.currentPdpQuality ?? "?"} (${labelFor(input.currentPdpQuality)}).`
  );
  const weakSubs = (
    Object.keys(input.subScores) as Array<keyof DesignCaseInput["subScores"]>
  )
    .filter((key) => (input.subScores[key] ?? 100) < 60)
    .sort((a, b) => (input.subScores[a] ?? 100) - (input.subScores[b] ?? 100));

  for (const key of weakSubs) {
    pdpProblems.push(
      `${SUBSCORE_LABELS[key]} ${input.subScores[key]} (${labelFor(input.subScores[key])}).`
    );
  }
  for (const leak of input.leaks.slice(0, 4)) {
    pdpProblems.push(`${leak.severity}: ${leak.title} — ${leak.evidence}`);
  }

  // --- what we would do ---------------------------------------------------
  for (const key of weakSubs.slice(0, 4)) {
    ourImprovements.push(IMPROVEMENT_BY_SUBSCORE[key]);
  }
  if (ourImprovements.length === 0) {
    ourImprovements.push(
      "geen enkel subonderdeel valt onder de 60: hier is de winst marginaal en de case zwak"
    );
  }
  if (input.strengths.length > 0) {
    ourImprovements.push(
      `Behouden wat al werkt: ${input.strengths.map((s) => s.title).join(", ")}.`
    );
  }

  // --- size of the before/after -------------------------------------------
  beforeAfter.push(
    `Ruimte ${input.contrastRoom ?? "?"} · materiaal ${input.contrastCapability ?? "?"} · concept contrast ${input.conceptContrast ?? "?"}.`
  );
  beforeAfter.push(
    `Transformatiepotentieel ${input.transformation ?? "?"}, sales fit ${input.salesFit ?? "?"}, economische fit ${input.economicFit ?? "?"}.`
  );
  if ((input.contrastRoom ?? 0) >= 60 && (input.contrastCapability ?? 0) >= 60) {
    beforeAfter.push(
      "Ruimte en materiaal zijn allebei hoog: het verschil tussen huidige pagina en onze versie is direct zichtbaar in een screenshot naast elkaar."
    );
  } else if ((input.contrastCapability ?? 0) < 60) {
    beforeAfter.push(
      "Materiaal is de beperkende factor: zonder extra beeld of content blijft de nieuwe pagina dichter bij de huidige dan we willen laten zien."
    );
  } else {
    beforeAfter.push(
      "Ruimte is de beperkende factor: de huidige pagina doet al te veel goed om een verrassende before/after te maken."
    );
  }

  return { business, product, pdpProblems, ourImprovements, beforeAfter };
}

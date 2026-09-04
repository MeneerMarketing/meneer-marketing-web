import Anthropic from "@anthropic-ai/sdk";
import type { Env } from "../../config/env.js";
import { OUTREACH_PROMPT_VERSION } from "../../config/outreach.js";
import {
  OutreachDraftAiSchema,
  type CopyStyle,
  type OutreachDraftAi,
  validateOutreachDraft,
} from "./claimValidation.js";
import {
  type AllowedClaim,
  pickPrimaryObservation,
  pickPrimaryStrength,
} from "./allowedClaims.js";
import {
  MM_COMPANY,
  appendTextSignature,
  renderOutreachHtml,
} from "./emailRender.js";
import { countWords } from "./contentHash.js";
import { logger } from "../../utils/logger.js";

const INPUT_COST = 3.0;
const OUTPUT_COST = 15.0;

export type OutreachGeneratorInput = {
  brandDomain: string;
  brandName: string | null;
  contactFirstName: string | null;
  contactEmail: string;
  productName: string | null;
  category: string | null;
  platform: string | null;
  auditType: string | null;
  keyword: string | null;
  pageUrl: string | null;
  confirmedGoogleAdvertiser: boolean;
  recommendedProjectType: string;
  salesAngle: string | null;
  copyStyle: CopyStyle;
  allowedClaims: AllowedClaim[];
  /** @deprecated use allowedClaims — kept for older call sites */
  supportedFindings?: Array<{
    id: string;
    title: string;
    severity: string;
    evidence: string;
  }>;
  strengths?: Array<{ title: string; evidence: string }>;
};

export type OutreachGeneratorResult = {
  draft: OutreachDraftAi;
  validation: ReturnType<typeof validateOutreachDraft>;
  estimatedCost: number;
  model: string;
  promptVersion: string;
  copyStyle: CopyStyle;
  bodyHtml: string;
  wordCount: number;
  rawText: string;
  allowedClaims: AllowedClaim[];
  observation: AllowedClaim | null;
  strength: AllowedClaim | null;
};

function humanCategoryLabel(
  category: string | null,
  _domain: string
): string {
  const raw = (category ?? "").trim();
  if (!raw) return "dit segment";
  const upper = raw.toUpperCase();
  const map: Record<string, string> = {
    PETS: "huisdierenbranche",
    PET: "huisdierenbranche",
    HOME: "woonbranche",
    BEAUTY: "beautybranche",
    FASHION: "modebranche",
    SPORT: "sportbranche",
    ELECTRONICS: "elektronica",
  };
  if (map[upper]) return map[upper];
  // Avoid shouting category codes in copy
  if (/^[A-Z0-9_\-]{2,20}$/.test(raw)) {
    return "dit segment";
  }
  return raw.toLowerCase();
}

function styleInstructions(style: CopyStyle): string {
  if (style === "DIRECT_IDEA") {
    return `STIJL: DIRECT_IDEA
- Iets directer: één concrete waarneming + dat je daar een idee voor hebt.
- Nog steeds kort, menselijk, geen druk.
- CTA: "Als het interessant klinkt kan ik laten zien wat ik bedoel."`;
  }
  return `STIJL: SOFT_OBSERVATION
- Laagdrempelig. Doel = reactie.
- Eén rustige, exact begrensde waarneming.
- CTA: "Als je wilt, stuur ik mijn ideeën graag even door."`;
}

function humanObservationLine(
  observation: AllowedClaim,
  productName: string | null
): string {
  const product =
    productName ||
    observation.product_name ||
    "dit product";
  if (/price|prijs/i.test(observation.subject)) {
    return `Op de productpagina van ${product} viel me op dat de prijs op mobiel niet direct duidelijk in beeld staat.`;
  }
  if (/review|social/i.test(observation.subject)) {
    return `Op die productpagina zag ik geen reviews of beoordelingen terug.`;
  }
  return `Op die productpagina viel me dit op: ${observation.allowed_fact}`;
}

function humanStrengthLine(strength: AllowedClaim): string {
  if (/variant|color|kleur/i.test(strength.subject)) {
    return "De variantkeuze op die pagina vond ik juist netjes opgelost.";
  }
  if (/trust|service/i.test(strength.subject)) {
    return "De service-informatie op die pagina staat duidelijk.";
  }
  return `Op die pagina viel me positief op: ${strength.allowed_fact}`;
}

export async function generateOutreachDraft(input: {
  env: Env;
  data: OutreachGeneratorInput;
}): Promise<OutreachGeneratorResult> {
  const observation = pickPrimaryObservation(input.data.allowedClaims);
  if (!observation) {
    throw new Error("No allowed OBSERVATION claim for outreach draft");
  }
  const strength = pickPrimaryStrength(input.data.allowedClaims);

  const brandLabel =
    input.data.brandName?.replace(/\.(nl|com|be|eu)$/i, "") ??
    input.data.brandDomain.replace(/\.(nl|com|be|eu)$/i, "");

  const categoryLabel = humanCategoryLabel(
    input.data.category,
    input.data.brandDomain
  );

  const sourceRules =
    input.data.auditType === "EXACT_PAID_FUNNEL"
      ? `SOURCE: EXACT_PAID_FUNNEL
Opening mag: je kwam ze tegen toen je op "${input.data.keyword ?? "een zoekterm"}" zocht en hebt daarna de website even bekeken.`
      : `SOURCE: HIGH_CONFIDENCE_PRODUCT_TARGET
Opening mag: "Ik kwam ${brandLabel} tegen toen ik naar webshops in de ${categoryLabel} keek en heb jullie shop even bekeken."
Zeg NIET dat Google Ads naar deze productpagina gaan.
Claim geen advertentieverkeer naar deze pagina.`;

  const exampleObservation = humanObservationLine(
    observation,
    input.data.productName
  );
  const exampleStrength = strength ? humanStrengthLine(strength) : null;

  const payload = {
    brandLabel,
    productName: input.data.productName,
    pageUrl: input.data.pageUrl,
    copyStyle: input.data.copyStyle,
    allowed_claims_only: input.data.allowedClaims.map((c) => ({
      id: c.id,
      type: c.type,
      scope: c.scope,
      page_url: c.page_url,
      product_name: c.product_name,
      subject: c.subject,
      allowed_fact: c.allowed_fact,
      forbidden_expansions: c.forbidden_expansions,
    })),
    primary_observation: {
      id: observation.id,
      scope: observation.scope,
      allowed_fact: observation.allowed_fact,
      example_nl: exampleObservation,
    },
    primary_strength: strength
      ? {
          id: strength.id,
          scope: strength.scope,
          allowed_fact: strength.allowed_fact,
          example_nl: exampleStrength,
        }
      : null,
  };

  const prompt = `Je schrijft één koude zakelijke e-mail als Meneer Marketing (NL).
Menselijk, rustig, kort. Alsof je écht één pagina hebt bekeken.

${sourceRules}

${styleInstructions(input.data.copyStyle)}

STRUCTUUR (verplicht, niet meer):
1. Hoe je het bedrijf tegenkwam (natuurlijke opening)
2. Exact ÉÉN concrete waarneming (alleen primary_observation)
3. Optioneel exact ÉÉN echte strength (alleen primary_strength, page-specific taal)
4. Heel kort wat Meneer Marketing doet
5. Zachte CTA
6. Handtekening: Groet, / Meneer Marketing

LENGTE: 70-120 woorden. Hard max 150.

ONDERWERP (menselijk):
- "Even iets over ${brandLabel}"
- "Een idee voor ${brandLabel}"
- "Iets opgevallen bij ${brandLabel}"

CLAIM FIDELITY (hard):
- Gebruik ALLEEN allowed_claims_only. Niets erbuiten.
- Observation scope is ${observation.scope}. Breid NIET uit.
- Bij PAGE_SPECIFIC: spreek over DÉZE productpagina / dit product.
- VERBODEN: "meerdere producten", "productpagina's", "overal", "de hele webshop",
  "ook als je verder scrollt", "bezoekers", "klanten haken af", "omzet", "conversies",
  "advertenties sturen hier verkeer heen", causaliteit over voorraad tenzij als apart allowed claim.
- Strength: zeg "op die pagina", niet "jullie kleurenselectie werkt overal".
- Geen CRO/audit/score/opportunity/MM Fit/funnel jargon.
- Geen fake urgency.

Voorbeeld-observatie (mag parafraseren, niet verbreden):
${JSON.stringify(exampleObservation)}

${
  exampleStrength
    ? `Voorbeeld-strength (mag parafraseren, niet verbreden):\n${JSON.stringify(exampleStrength)}`
    : "Geen strength gebruiken."
}

Positionering (kies één korte zin):
"Ik help vanuit Meneer Marketing webshops met webdesign en Shopify."
of
"Ik help vanuit Meneer Marketing bedrijven met websites en online vindbaarheid."

ALLOWED CLAIMS JSON:
${JSON.stringify(payload, null, 2)}

Return ONLY valid JSON:
{
  "subject": "...",
  "body": "...",
  "selected_finding_id": ${JSON.stringify(observation.id)},
  "selected_finding_title": ${JSON.stringify(observation.source_title)},
  "selected_strength_title": ${strength ? JSON.stringify(strength.source_title) : "null"},
  "strategy": ${JSON.stringify(input.data.recommendedProjectType)},
  "copy_style": "${input.data.copyStyle}",
  "personalization_used": {
    "first_name": false,
    "brand": true,
    "product": true,
    "category": true,
    "platform": false
  },
  "claims_used": ["observation:${observation.id}"${strength ? `, "strength:${strength.id}"` : ""}]
}`;

  const client = new Anthropic({ apiKey: input.env.ANTHROPIC_API_KEY });
  const model = input.env.CRO_AUDIT_MODEL;

  const response = await client.messages.create({
    model,
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const rawText = textBlock && textBlock.type === "text" ? textBlock.text : "";
  const parsed = parseJson(rawText);
  const validated = OutreachDraftAiSchema.safeParse(parsed);
  if (!validated.success) {
    logger.error("Outreach draft Zod failed", {
      issues: validated.error.issues.slice(0, 5),
    });
    throw new Error(`Invalid outreach draft JSON: ${validated.error.message}`);
  }

  const draft = validated.data;
  draft.selected_finding_id = observation.id;
  draft.selected_finding_title = observation.source_title;
  draft.strategy = input.data.recommendedProjectType;
  draft.copy_style = input.data.copyStyle;
  if (strength) {
    draft.selected_strength_title = strength.source_title;
  } else {
    draft.selected_strength_title = null;
  }

  draft.body = appendTextSignature(draft.body, {
    fromName: MM_COMPANY.fromDisplayName,
    websiteLabel: MM_COMPANY.websiteLabel,
    kvkNumber: MM_COMPANY.kvkNumber,
  });

  draft.body = draft.body
    .replace(/\s*[\u2014\u2013]\s*/g, ". ")
    .replace(/\s{2,}/g, " ");
  draft.subject = draft.subject
    .replace(/\s*[\u2014\u2013]\s*/g, ". ")
    .replace(/\s{2,}/g, " ");

  const findingTitles = input.data.allowedClaims
    .filter((c) => c.type === "OBSERVATION")
    .map((c) => c.source_title);
  const strengthTitles = input.data.allowedClaims
    .filter((c) => c.type === "STRENGTH")
    .map((c) => c.source_title);

  const availabilityProven = input.data.allowedClaims.some(
    (c) =>
      c.type === "OBSERVATION" &&
      /stock|voorraad|availability|fulfillment/i.test(c.subject)
  );

  const validation = validateOutreachDraft({
    draft,
    auditType: input.data.auditType,
    contactFirstName: input.data.contactFirstName,
    productName: input.data.productName,
    brandDomain: input.data.brandDomain,
    findingTitles,
    strengthTitles,
    confirmedGoogleAdvertiser: input.data.confirmedGoogleAdvertiser,
    allowedClaims: input.data.allowedClaims,
    observationScope: observation.scope,
    availabilityProven,
  });

  const bodyHtml = renderOutreachHtml({
    bodyText: draft.body,
    fromName: MM_COMPANY.fromDisplayName,
    websiteUrl: MM_COMPANY.websiteUrl,
    websiteLabel: MM_COMPANY.websiteLabel,
    kvkNumber: MM_COMPANY.kvkNumber,
  });

  const estimatedCost =
    (response.usage.input_tokens / 1_000_000) * INPUT_COST +
    (response.usage.output_tokens / 1_000_000) * OUTPUT_COST;

  return {
    draft,
    validation,
    estimatedCost,
    model,
    promptVersion: OUTREACH_PROMPT_VERSION,
    copyStyle: input.data.copyStyle,
    bodyHtml,
    wordCount: countWords(draft.body),
    rawText,
    allowedClaims: input.data.allowedClaims,
    observation,
    strength,
  };
}

function parseJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced?.[1] ?? text.match(/\{[\s\S]*\}/)?.[0];
  if (!candidate) throw new Error("No JSON in outreach response");
  return JSON.parse(candidate);
}

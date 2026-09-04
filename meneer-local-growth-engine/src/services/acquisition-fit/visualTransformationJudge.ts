import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { pilatesAcquisitionFitConfig, type VisualTransformationFit } from "@/verticals/pilates";
import type { Screenshot } from "@/services/acquisition-fit/screenshotCapture";
import type { WebsiteSignalReport } from "@/services/acquisition-fit/websiteSignals";

/**
 * Claude Vision as a design judge (M8.3).
 *
 * Runs only on serious candidates that already passed the cheap deterministic
 * gates. It answers one question: would a high-end redesign be a visible
 * commercial and visual step up for this specific studio? It never infers
 * revenue, budget, customer counts or company size.
 */

/** LLMs occasionally return a single string or a numeric string. Coerce, then validate. */
const scoreField = z.preprocess(
  (value) => (typeof value === "string" ? Number(value) : value),
  z.number().min(0).max(100)
);

const reasonList = z.preprocess(
  (value) => {
    if (Array.isArray(value)) return value.map(String).slice(0, 6);
    if (typeof value === "string" && value.trim()) {
      return value
        .split(/\n|(?<=\.)\s+(?=[A-Z])|·|;/)
        .map((part) => part.replace(/^[-*\d.\s]+/, "").trim())
        .filter(Boolean)
        .slice(0, 6);
    }
    return [];
  },
  z.array(z.string()).max(6)
);

export const visualAssessmentSchema = z.object({
  visual_quality_score: scoreField,
  modernity_score: scoreField,
  mobile_presentation_score: scoreField,
  brand_potential_score: scoreField,
  booking_ux_score: scoreField,
  business_presentation_gap_score: scoreField,
  redesign_impact_score: scoreField,
  visual_transformation_fit: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toUpperCase().replace(/\s+/g, "_") : value),
    z.enum(["VERY_HIGH", "HIGH", "MEDIUM", "LOW"])
  ),
  reason_positive: reasonList,
  reason_negative: reasonList,
  confidence: scoreField,
});

export type VisualAssessment = z.infer<typeof visualAssessmentSchema>;

export type VisualAssessmentSource = "CLAUDE_VISION" | "DETERMINISTIC_FALLBACK";

export interface VisualJudgeResult {
  assessment: VisualAssessment;
  source: VisualAssessmentSource;
  model: string | null;
  cost_usd: number;
  error: string | null;
  screenshots_used: number;
}

export interface VisualJudgeInput {
  businessName: string;
  city: string;
  primaryServices: string[];
  reviewSummary: string;
  signals: WebsiteSignalReport;
  screenshots: Screenshot[];
}

const SYSTEM_PROMPT = `Je bent een senior webdesigner en conversie-specialist die voor een Nederlands
marketingbureau beoordeelt of een bestaande website van een boutique Pilates studio baat zou
hebben bij een volledig nieuw, high-end ontwerp.

Je krijgt screenshots van de huidige website (desktop en mobiel) plus feitelijke signalen.
De screenshots lopen door tot ver onder de fold. Beoordeel de HELE pagina, niet alleen de
bovenkant: een verzorgde hero boven een halflege pagina is geen goede website.

Beoordeel UITSLUITEND wat je kunt waarnemen op het gebied van:
typografie, spacing, visuele hiërarchie, layout, moderniteit, mobiele presentatie,
beeldgebruik en beeldkwaliteit, visuele consistentie, duidelijkheid van call-to-actions,
informatiedichtheid en premium uitstraling.

Weeg zwaar mee, want dit is wat een bezoeker als kapot ervaart:
- lege of witte vlakken waar inhoud hoort te staan
- secties die halverwege ophouden, of koppen zonder de bijbehorende inhoud of icoon
- navigatie die buiten het beeld valt of afgekapt wordt
- een pagina die na de hero nauwelijks verder komt
- beeld dat ontbreekt, rekt of in de verkeerde verhouding staat
- dezelfde foto meerdere keren, of voorraadbeeld in plaats van de eigen studio
Zulke gebreken horen visual_quality_score en mobile_presentation_score omlaag te halen,
ook als de typografie en het kleurgebruik op zichzelf smaakvol zijn.

VERBODEN:
- omzet, budget, winst, aantal klanten, conversieratio of bedrijfsgrootte afleiden
- uitspraken over wat de eigenaar kan betalen
- een puur subjectief "mooi/lelijk" oordeel zonder waarneembare onderbouwing
- claims over informatie die niet op de screenshots of in de signalen staat

Scoreschalen (0-100):
- visual_quality_score: hoe goed is het huidige ontwerp uitgevoerd (hoog = goed ontwerp)
- modernity_score: hoe eigentijds oogt het (hoog = modern)
- mobile_presentation_score: kwaliteit van de mobiele presentatie (hoog = goed)
- brand_potential_score: hoeveel bruikbaar merkmateriaal is zichtbaar, denk aan logo,
  eigen fotografie, studiobeeld, kleurgebruik (hoog = veel bruikbaar materiaal)
- booking_ux_score: hoe duidelijk is het boekings- en proeflespad (hoog = duidelijk)
- business_presentation_gap_score: het verschil tussen hoe professioneel de studio zelf
  oogt en hoe de website dat overbrengt (hoog = website blijft duidelijk achter bij de studio)
- redesign_impact_score: hoeveel visuele en commerciële winst een high-end redesign oplevert
  (hoog = grote sprong mogelijk)

visual_transformation_fit vat samen hoe geschikt deze studio is voor een redesign-voorstel.
Een moderne, goed uitgevoerde site hoort LOW te krijgen, ook als het bedrijf sterk is.

Antwoord ALLEEN met geldige JSON volgens het schema. Redenen in het Nederlands, kort en concreet.`;

function estimateCost(
  model: string,
  usage: { input_tokens?: number; output_tokens?: number }
): number {
  const inTokens = usage.input_tokens ?? 0;
  const outTokens = usage.output_tokens ?? 0;
  // Haiku-class pricing; Sonnet-class models are ~3x input / ~3x output.
  const sonnet = /sonnet|opus/i.test(model);
  const inputRate = sonnet ? 3.0 : 1.0;
  const outputRate = sonnet ? 15.0 : 5.0;
  return (inTokens / 1_000_000) * inputRate + (outTokens / 1_000_000) * outputRate;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Deterministic stand-in when Claude is unavailable or invalid. Derived purely
 * from the HTML signals, with an explicitly lower confidence so downstream
 * scoring can treat it as weaker evidence.
 */
export function deterministicVisualAssessment(
  signals: WebsiteSignalReport,
  businessQuality: number
): VisualAssessment {
  const quality = signals.website_quality_score;
  const modernity = signals.modernity_score;
  const mobile = clamp(
    signals.technical.viewport
      ? modernity * 0.7 + (signals.technical.responsive_images ? 20 : 5) + 10
      : 20
  );
  const bookingUx = clamp(100 - signals.booking_opportunity_score);
  const gap = clamp(businessQuality - quality + 40);
  const impact = clamp((100 - quality) * 0.6 + gap * 0.25 + signals.brand_asset_usability_score * 0.15);

  const fit: VisualTransformationFit =
    impact >= 70 ? "HIGH" : impact >= 55 ? "MEDIUM" : "LOW";

  return {
    visual_quality_score: quality,
    modernity_score: modernity,
    mobile_presentation_score: mobile,
    brand_potential_score: signals.brand_asset_usability_score,
    booking_ux_score: bookingUx,
    business_presentation_gap_score: gap,
    redesign_impact_score: impact,
    visual_transformation_fit: fit,
    reason_positive: signals.positives.slice(0, 4),
    reason_negative: signals.negatives.slice(0, 4),
    confidence: pilatesAcquisitionFitConfig.visualJudge.fallbackConfidence,
  };
}

export async function judgeVisualTransformation(
  input: VisualJudgeInput,
  options: { businessQuality: number; costBudgetRemaining: number }
): Promise<VisualJudgeResult> {
  const config = pilatesAcquisitionFitConfig.visualJudge;
  const fallback = (error: string | null): VisualJudgeResult => ({
    assessment: deterministicVisualAssessment(input.signals, options.businessQuality),
    source: "DETERMINISTIC_FALLBACK",
    model: null,
    cost_usd: 0,
    error,
    screenshots_used: 0,
  });

  if (!config.enabled) return fallback("visual_judge_disabled");
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallback("no_anthropic_key");
  if (options.costBudgetRemaining <= 0.005) return fallback("cost_budget_exhausted");
  if (!input.screenshots.length) return fallback("no_screenshots");

  const model = config.model;
  const facts = {
    business_name: input.businessName,
    city: input.city,
    services: input.primaryServices.slice(0, 6),
    reputation: input.reviewSummary,
    detected_platform: input.signals.platform
      ? `${input.signals.platform.name} (${input.signals.platform.era})`
      : "onbekend",
    deterministic_website_quality: input.signals.website_quality_score,
    deterministic_modernity: input.signals.modernity_score,
    responsive_meta: input.signals.technical.viewport,
    responsive_images: input.signals.technical.responsive_images,
    modern_layout_css: input.signals.technical.modern_layout_css,
    legacy_markup: input.signals.technical.legacy_html || input.signals.technical.table_layout,
    booking_platforms: input.signals.booking.platforms,
    booking_in_navigation: input.signals.booking.booking_link_in_nav,
    trial_class_cta: input.signals.booking.trial_class_cta,
    schedule_visible: input.signals.booking.schedule_visible,
    brand_assets: input.signals.brand,
  };

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model,
      max_tokens: 1100,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            ...input.screenshots.map((shot) => ({
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: "image/jpeg" as const,
                data: shot.buffer.toString("base64"),
              },
            })),
            {
              type: "text" as const,
              text: `Screenshots hierboven in deze volgorde: ${input.screenshots
                .map((s) => s.variant)
                .join(", ")}.

Feitelijke signalen:
${JSON.stringify(facts, null, 2)}

Geef het JSON-oordeel met exact deze velden:
visual_quality_score (getal), modernity_score (getal), mobile_presentation_score (getal),
brand_potential_score (getal), booking_ux_score (getal),
business_presentation_gap_score (getal), redesign_impact_score (getal),
visual_transformation_fit (VERY_HIGH, HIGH, MEDIUM of LOW),
reason_positive (array van korte strings), reason_negative (array van korte strings),
confidence (getal).

reason_positive en reason_negative moeten JSON-arrays zijn, dus ["...", "..."], nooit één string.`,
            },
          ],
        },
      ],
    });

    const cost = estimateCost(model, response.usage ?? {});
    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { ...fallback("no_json_in_response"), cost_usd: cost, model };
    }

    let raw: unknown;
    try {
      raw = JSON.parse(jsonMatch[0]);
    } catch {
      return { ...fallback("invalid_json"), cost_usd: cost, model };
    }

    const parsed = visualAssessmentSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ...fallback(`schema_invalid: ${parsed.error.issues[0]?.message ?? "unknown"}`),
        cost_usd: cost,
        model,
      };
    }

    return {
      assessment: parsed.data,
      source: "CLAUDE_VISION",
      model,
      cost_usd: cost,
      error: null,
      screenshots_used: input.screenshots.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fallback(`claude_error: ${message}`);
  }
}

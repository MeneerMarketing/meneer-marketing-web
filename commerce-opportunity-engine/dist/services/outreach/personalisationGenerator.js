/**
 * Milestone 8.2 — tiny personalisation snippet generator.
 * Claude writes ONLY observation (+ optional strength). Never the full mail.
 */
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { CONSERVATIVE_PERSONALISATION_CALL_COST, assertAnthropicBudgetOrThrow, estimateAnthropicCostFromUsage, } from "./anthropicBudget.js";
import { validateOutreachDraft } from "./claimValidation.js";
import { logger } from "../../utils/logger.js";
const SnippetSchema = z.object({
    observation: z.string().min(20).max(220),
    strength: z.string().max(220).nullable().optional(),
});
export const PERSONALISATION_PROMPT_VERSION = "m8.2-personalisation-v1";
export async function generatePersonalisationSnippets(input) {
    const gate = (() => {
        try {
            assertAnthropicBudgetOrThrow({
                currentRunCost: input.currentRunCost,
                configuredCap: input.costCap,
                conservativeNextCallCost: CONSERVATIVE_PERSONALISATION_CALL_COST,
                label: "personalisation_snippets",
            });
            return null;
        }
        catch (err) {
            const e = err;
            if (e.code === "BUDGET_BLOCKED") {
                return {
                    budgetBlocked: true,
                    status: "BUDGET_BLOCKED",
                    reason: e.gate?.reason ?? e.message,
                    estimatedCost: 0,
                };
            }
            throw err;
        }
    })();
    if (gate)
        return gate;
    const payload = {
        brand: input.brandLabel,
        product: input.productName,
        observation_claim: {
            id: input.observation.id,
            scope: input.observation.scope,
            allowed_fact: input.observation.allowed_fact,
            hint_nl: input.observation.external_sentence_nl,
            forbidden: input.observation.forbidden_expansions,
        },
        strength_claim: input.strength
            ? {
                id: input.strength.id,
                scope: input.strength.scope,
                allowed_fact: input.strength.allowed_fact,
                hint_nl: input.strength.external_sentence_nl,
            }
            : null,
    };
    const prompt = `Schrijf ALLEEN 1 of 2 Nederlandse zinnen voor cold outreach personalisatie.
Geen volledige mail. Geen begroeting. Geen CTA. Geen handtekening.

REGELS:
- observation: exact 1 zin, PAGE_SPECIFIC, menselijk
- strength: optioneel 1 zin, ook PAGE_SPECIFIC, of null
- Gebruik ALLEEN allowed_fact / hint_nl. Breid scope niet uit.
- Verboden: meerdere producten, hele webshop, omzet, conversies, scroll-claims, Ads→PDP, CRO/audit/score jargon
- Geen em-dash

JSON:
${JSON.stringify(payload)}

Return ONLY:
{"observation":"...","strength":"..."|null}`;
    const client = new Anthropic({ apiKey: input.env.ANTHROPIC_API_KEY });
    const model = input.env.CRO_AUDIT_MODEL;
    const response = await client.messages.create({
        model,
        max_tokens: 220,
        messages: [{ role: "user", content: prompt }],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    const rawText = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const parsed = parseJson(rawText);
    const validated = SnippetSchema.safeParse(parsed);
    if (!validated.success) {
        logger.error("Personalisation snippet Zod failed", {
            issues: validated.error.issues.slice(0, 4),
        });
        throw new Error(`Invalid personalisation JSON: ${validated.error.message}`);
    }
    let observation = validated.data.observation
        .replace(/\s*[\u2014\u2013]\s*/g, ". ")
        .trim();
    let strength = validated.data.strength?.replace(/\s*[\u2014\u2013]\s*/g, ". ").trim() ||
        null;
    if (!input.strength)
        strength = null;
    // Fidelity gate via existing validator on a synthetic mini-body
    const miniDraft = {
        subject: `Even iets over ${input.brandLabel}`,
        body: `${observation}${strength ? ` ${strength}` : ""} Ik help vanuit Meneer Marketing webshops met webdesign en Shopify. Als je wilt, laat ik graag even zien wat ik bedoel. Groet, Meneer Marketing meneermarketing.nl KVK 42095913`,
        selected_finding_id: input.observation.id,
        selected_finding_title: input.observation.source_title,
        selected_strength_title: input.strength?.source_title ?? null,
        strategy: "HUMAN_FIRST",
        copy_style: "SOFT_OBSERVATION",
        personalization_used: {
            first_name: false,
            brand: true,
            product: true,
            category: false,
            platform: false,
        },
        claims_used: [`observation:${input.observation.id}`],
    };
    const validation = validateOutreachDraft({
        draft: miniDraft,
        auditType: "HIGH_CONFIDENCE_PRODUCT_TARGET",
        contactFirstName: null,
        productName: input.productName,
        brandDomain: "example.nl",
        findingTitles: [input.observation.source_title],
        strengthTitles: input.strength ? [input.strength.source_title] : [],
        confirmedGoogleAdvertiser: true,
        allowedClaims: input.strength
            ? [input.observation, input.strength]
            : [input.observation],
        observationScope: input.observation.scope,
        availabilityProven: false,
    });
    if (validation.status === "FAILED") {
        // Fall back to deterministic NL sentences rather than shipping invalid AI copy
        logger.warn("AI personalisation failed fidelity; falling back to deterministic", {
            errors: validation.errors.slice(0, 5),
        });
        observation = input.observation.external_sentence_nl;
        strength = input.strength?.external_sentence_nl ?? null;
    }
    const estimatedCost = estimateAnthropicCostFromUsage({
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
    });
    return {
        observation,
        strength,
        estimatedCost,
        model,
        promptVersion: PERSONALISATION_PROMPT_VERSION,
        rawText,
        budgetBlocked: false,
    };
}
function parseJson(text) {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const candidate = fenced?.[1] ?? text.match(/\{[\s\S]*\}/)?.[0];
    if (!candidate)
        throw new Error("No JSON in personalisation response");
    return JSON.parse(candidate);
}
//# sourceMappingURL=personalisationGenerator.js.map
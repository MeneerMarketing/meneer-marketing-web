import Anthropic from "@anthropic-ai/sdk";
import { CRO_AUDIT_VERSION, CRO_PROMPT_VERSION, } from "../../config/scoringWeights.js";
import { CroAuditAiResponseSchema, } from "../../types/audit.js";
import { logger } from "../../utils/logger.js";
const INPUT_COST_PER_M_SONNET = 3.0;
const OUTPUT_COST_PER_M_SONNET = 15.0;
export async function runCroAuditWithClaude(input) {
    const client = new Anthropic({ apiKey: input.env.ANTHROPIC_API_KEY });
    const model = input.env.CRO_AUDIT_MODEL;
    const content = [
        {
            type: "text",
            text: buildPrompt(input.auditType, input.representation),
        },
    ];
    if (input.screenshots.mobilePng) {
        content.push({
            type: "text",
            text: "MOBILE SCREENSHOT (390x844 viewport, first screen after cookies dismissed):",
        });
        content.push({
            type: "image",
            source: {
                type: "base64",
                media_type: "image/png",
                data: input.screenshots.mobilePng.toString("base64"),
            },
        });
    }
    if (input.screenshots.desktopPng) {
        content.push({
            type: "text",
            text: "DESKTOP SCREENSHOT (1440x1000 viewport):",
        });
        content.push({
            type: "image",
            source: {
                type: "base64",
                media_type: "image/png",
                data: input.screenshots.desktopPng.toString("base64"),
            },
        });
    }
    const response = await client.messages.create({
        model,
        max_tokens: 4096,
        messages: [{ role: "user", content }],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    const rawText = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const parsed = normalizeAiPayload(input.auditType, parseAiJson(rawText));
    const validated = CroAuditAiResponseSchema.safeParse(parsed);
    if (!validated.success) {
        logger.error("CRO audit Zod validation failed", {
            issues: validated.error.issues.slice(0, 5),
        });
        throw new Error(`Invalid CRO audit JSON: ${validated.error.message}`);
    }
    const estimatedCost = (response.usage.input_tokens / 1_000_000) * INPUT_COST_PER_M_SONNET +
        (response.usage.output_tokens / 1_000_000) * OUTPUT_COST_PER_M_SONNET;
    return {
        ai: validated.data,
        estimatedCost,
        model,
        auditVersion: CRO_AUDIT_VERSION,
        promptVersion: CRO_PROMPT_VERSION,
        rawText,
    };
}
function buildPrompt(auditType, rep) {
    if (auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET") {
        return buildHighConfidencePrompt(rep);
    }
    return buildExactPaidPrompt(rep);
}
function buildExactPaidPrompt(rep) {
    return `You are a senior ecommerce CRO strategist for Meneer Marketing (NL).

AUDIT TYPE: EXACT_PAID_FUNNEL
You MAY analyze the proven chain: keyword → advertisement → landing page → message match → conversion quality.

Audit ONLY what is visible in the screenshots or present in the structured extraction below.
Do NOT invent problems. Every conversion leak MUST cite specific observed evidence.
List up to 3 genuine strengths. A strong page can have a low commercial rebuild case.

SCORING:
- Each quality score is 0-100 (100 = excellent).
- ad_landing_match_quality MUST be 0-100 based on keyword + ad copy vs first viewport.
- Judge mobile and desktop independently.

STRUCTURED PAGE DATA (JSON):
${JSON.stringify(compactRep(rep), null, 2)}

Return ONLY valid JSON:
{
  "scores": {
    "mobile_cro_quality": 0-100,
    "desktop_cro_quality": 0-100,
    "above_fold_quality": 0-100,
    "product_presentation_quality": 0-100,
    "trust_quality": 0-100,
    "offer_clarity_quality": 0-100,
    "cta_quality": 0-100,
    "social_proof_quality": 0-100,
    "objection_handling_quality": 0-100,
    "product_storytelling_quality": 0-100,
    "ad_landing_match_quality": 0-100,
    "visual_design_quality": 0-100
  },
  "conversion_leaks": [{"title":"...","severity":"LOW|MEDIUM|HIGH|CRITICAL","evidence":"...","why_it_matters":"...","recommended_fix":"..."}],
  "strengths": [{"title":"...","evidence":"..."}],
  "ad_landing_analysis": {
    "message_continuity": 0-100,
    "keyword_relevance": 0-100,
    "product_relevance": 0-100,
    "offer_continuity": 0-100,
    "primary_benefit_continuity": 0-100,
    "expectation_match": 0-100,
    "summary": "..."
  },
  "sales_angle": "2-3 sentences internal commercial insight",
  "custom_shopify_rebuild_potential": 0-100,
  "pdp_improvement_potential": 0-100,
  "evidence_notes": "optional"
}

Max 5 conversion_leaks. Max 3 strengths. sales_angle max 600 chars.
custom_shopify_rebuild_potential = full theme/rebuild case.
pdp_improvement_potential = product-page CRO upside only (can be high while rebuild is medium).`;
}
function buildHighConfidencePrompt(rep) {
    return `You are a senior ecommerce CRO strategist for Meneer Marketing (NL).

AUDIT TYPE: HIGH_CONFIDENCE_PRODUCT_TARGET
The brand is a confirmed Google advertiser and we have an exact relevant product page.
The SPECIFIC paid keyword → Google ad → this landing page relationship is NOT proven.

You MAY analyze:
- product page CRO, mobile UX, design, trust, product presentation
- offer clarity, storytelling, CTA, social proof
- commercial rebuild potential

You must NOT claim:
- "the ad promise is missing on the page"
- keyword → specific Google ad → this page continuity
- any invented ad-landing mismatch

Set ad_landing_match_quality to null.
Set ad_landing_analysis to null.

CONCEPT-FIRST PDP FOCUS (score each 0-100 in concept_first_signals):
- buyblock_quality: title/subheadline, price, CTA, variants, trust, social proof, delivery/payment
- product_storytelling_depth: benefits, use cases, education, objection handling
- media_usage_quality: product/lifestyle/feature graphics, hierarchy beyond gallery
- deep_dive_quality: how it works, specs, FAQ, proof, repeated purchase moments
- mobile_purchase_quality: first viewport, price/CTA visibility, hierarchy, density
- premium_design_perception: premium feel, coherence, generic theme vs brand distinctiveness

Audit ONLY screenshots + structured extraction. Do NOT invent problems.
If the page is already excellent, say so in strengths and keep rebuild potential low.

STRUCTURED PAGE DATA (JSON):
${JSON.stringify(compactRep(rep), null, 2)}

Return ONLY valid JSON:
{
  "scores": {
    "mobile_cro_quality": 0-100,
    "desktop_cro_quality": 0-100,
    "above_fold_quality": 0-100,
    "product_presentation_quality": 0-100,
    "trust_quality": 0-100,
    "offer_clarity_quality": 0-100,
    "cta_quality": 0-100,
    "social_proof_quality": 0-100,
    "objection_handling_quality": 0-100,
    "product_storytelling_quality": 0-100,
    "ad_landing_match_quality": null,
    "visual_design_quality": 0-100
  },
  "conversion_leaks": [{"title":"...","severity":"LOW|MEDIUM|HIGH|CRITICAL","evidence":"...","why_it_matters":"...","recommended_fix":"..."}],
  "strengths": [{"title":"...","evidence":"..."}],
  "ad_landing_analysis": null,
  "sales_angle": "2-3 sentences internal commercial insight",
  "custom_shopify_rebuild_potential": 0-100,
  "pdp_improvement_potential": 0-100,
  "concept_first_signals": {
    "buyblock_quality": 0-100,
    "product_storytelling_depth": 0-100,
    "media_usage_quality": 0-100,
    "deep_dive_quality": 0-100,
    "mobile_purchase_quality": 0-100,
    "premium_design_perception": 0-100
  },
  "evidence_notes": "optional"
}

Max 5 conversion_leaks. Max 3 strengths. sales_angle max 600 chars.
custom_shopify_rebuild_potential = full custom Shopify rebuild case for this shop.
pdp_improvement_potential = product-page CRO upside only (reseller PDPs can score high here while full rebuild stays medium).
Forbidden finding themes: ad promise missing, paid message mismatch, keyword-ad-landing continuity.`;
}
function compactRep(rep) {
    return {
        url: rep.url,
        ABOVE_THE_FOLD: rep.aboveTheFold,
        PAGE: rep.page,
        BUSINESS: rep.business,
        SOURCE: rep.source,
        ADVERTISEMENT: rep.source.auditType === "EXACT_PAID_FUNNEL"
            ? rep.advertisement
            : {
                note: "Specific paid ad→landing not proven; ad fields informational only",
                keyword: rep.advertisement.keyword,
                paidSignalType: rep.advertisement.paidSignalType,
            },
    };
}
function parseAiJson(text) {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const candidate = fenced?.[1] ?? text.match(/\{[\s\S]*\}/)?.[0];
    if (!candidate) {
        throw new Error("No JSON object found in Claude response");
    }
    return JSON.parse(candidate);
}
function clip(value, max) {
    if (typeof value !== "string")
        return value;
    return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;
}
function normalizeAiPayload(auditType, parsed) {
    if (!parsed || typeof parsed !== "object")
        return parsed;
    const obj = parsed;
    const scores = obj.scores && typeof obj.scores === "object"
        ? { ...obj.scores }
        : {};
    if (auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET") {
        scores.ad_landing_match_quality = null;
    }
    let leaks = Array.isArray(obj.conversion_leaks) ? obj.conversion_leaks : [];
    if (auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET") {
        leaks = leaks.filter((leak) => {
            if (!leak || typeof leak !== "object")
                return false;
            const row = leak;
            const blob = `${row.title ?? ""} ${row.evidence ?? ""} ${row.why_it_matters ?? ""}`.toLowerCase();
            if (blob.includes("advertentiebelofte") ||
                blob.includes("ad promise") ||
                blob.includes("ad-landing") ||
                blob.includes("ad →") ||
                blob.includes("advertentie komt niet") ||
                blob.includes("message match") ||
                blob.includes("paid landing")) {
                return false;
            }
            return true;
        });
    }
    const rebuild = typeof obj.custom_shopify_rebuild_potential === "number"
        ? obj.custom_shopify_rebuild_potential
        : 50;
    const pdp = typeof obj.pdp_improvement_potential === "number"
        ? obj.pdp_improvement_potential
        : Math.min(100, Math.round(rebuild + 15));
    return {
        ...obj,
        scores,
        ad_landing_analysis: auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET" ? null : obj.ad_landing_analysis,
        sales_angle: clip(obj.sales_angle, 1100),
        custom_shopify_rebuild_potential: rebuild,
        pdp_improvement_potential: pdp,
        evidence_notes: obj.evidence_notes == null ? obj.evidence_notes : clip(obj.evidence_notes, 800),
        conversion_leaks: leaks.slice(0, 5).map((leak) => {
            if (!leak || typeof leak !== "object")
                return leak;
            const row = leak;
            return {
                ...row,
                evidence: clip(row.evidence, 800),
                why_it_matters: clip(row.why_it_matters, 800),
                recommended_fix: clip(row.recommended_fix, 800),
            };
        }),
        strengths: Array.isArray(obj.strengths)
            ? obj.strengths.slice(0, 3).map((s) => {
                if (!s || typeof s !== "object")
                    return s;
                const row = s;
                return {
                    ...row,
                    evidence: clip(row.evidence, 500),
                };
            })
            : obj.strengths,
    };
}
//# sourceMappingURL=croAuditor.js.map
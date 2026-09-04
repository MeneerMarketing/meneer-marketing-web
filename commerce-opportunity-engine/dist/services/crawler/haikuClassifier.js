import Anthropic from "@anthropic-ai/sdk";
import { logger } from "../../utils/logger.js";
import { computeBreadthSignals } from "./breadthSignals.js";
const HAIKU_INPUT_COST_PER_M = 0.25;
const HAIKU_OUTPUT_COST_PER_M = 1.25;
const VALID_BUSINESS_TYPES = new Set([
    "BRAND",
    "SPECIALIST_WEBSHOP",
    "GENERAL_RETAILER",
    "MARKETPLACE",
    "COMPARISON_SITE",
    "SERVICE_BUSINESS",
    "NON_ECOMMERCE",
    "UNKNOWN",
]);
export async function classifyBusinessWithHaiku(env, domain, signals) {
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const prompt = `Classify this Dutch website for B2B lead qualification.
Domain: ${domain}
Title: ${signals.title ?? "unknown"}
Meta: ${signals.metaDescription ?? "none"}
Product links estimate: ${signals.estimatedProductLinks}
Category links estimate: ${signals.estimatedCategoryLinks}
Compare mentions: ${signals.compareMentions}
Seller mentions: ${signals.sellerMentions}
Store locator mentions: ${signals.storeLocatorMentions}
Insurance/service mentions: ${signals.insuranceServiceMentions}
Has cart: ${signals.hasCartLink}
Has checkout: ${signals.hasCheckoutLink}
Sample text: ${signals.bodyTextSample.slice(0, 1200)}

Reply ONLY with JSON:
{"businessType":"BRAND|SPECIALIST_WEBSHOP|GENERAL_RETAILER|MARKETPLACE|COMPARISON_SITE|SERVICE_BUSINESS|NON_ECOMMERCE|UNKNOWN","confidence":0.0-1.0,"reasoning":"short"}`;
    const response = await client.messages.create({
        model: env.CLAUDE_MODEL,
        max_tokens: 120,
        messages: [{ role: "user", content: prompt }],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
    let parsed = {};
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
        }
    }
    catch {
        logger.warn("Haiku classification JSON parse failed", { domain });
    }
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const estimatedCost = (inputTokens / 1_000_000) * HAIKU_INPUT_COST_PER_M +
        (outputTokens / 1_000_000) * HAIKU_OUTPUT_COST_PER_M;
    let businessType = parsed.businessType ?? "UNKNOWN";
    if (!VALID_BUSINESS_TYPES.has(businessType)) {
        businessType = "UNKNOWN";
    }
    let confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0.5;
    if (businessType === "UNKNOWN" &&
        (signals.hasCartLink || signals.hasCheckoutLink) &&
        signals.estimatedProductLinks >= 5) {
        businessType = "SPECIALIST_WEBSHOP";
        confidence = Math.max(confidence, 0.58);
    }
    const breadth = computeBreadthSignals(signals);
    return {
        classification: {
            businessType,
            businessTypeConfidence: confidence,
            businessTypeReasoning: parsed.reasoning ?? "Haiku fallback classification",
            usedHaikuFallback: true,
            internationalPresenceScore: breadth.internationalPresenceScore,
            categoryBreadthScore: breadth.categoryBreadthScore,
            retailerBreadthScore: breadth.retailerBreadthScore,
            breadthEvidence: breadth.evidence,
        },
        estimatedCost,
    };
}
//# sourceMappingURL=haikuClassifier.js.map
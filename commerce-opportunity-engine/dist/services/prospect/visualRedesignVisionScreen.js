/**
 * Milestone 9.9.2 — strict cheap vision for visual underdesign detection.
 */
import { readFile } from "node:fs/promises";
import Anthropic from "@anthropic-ai/sdk";
import { logger } from "../../utils/logger.js";
const HAIKU_INPUT_COST_PER_M = 0.25;
const HAIKU_OUTPUT_COST_PER_M = 1.25;
export async function screenPdpVisualRedesignWithVision(env, domain, desktopScreenshotPath) {
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const imageBytes = await readFile(desktopScreenshotPath);
    const base64 = imageBytes.toString("base64");
    const response = await client.messages.create({
        model: env.CLAUDE_MODEL,
        max_tokens: 220,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: "image/png",
                            data: base64,
                        },
                    },
                    {
                        type: "text",
                        text: `You are a senior ecommerce/webdesign expert reviewing a Dutch product page (desktop first viewport).
Domain: ${domain}

Question: Would you describe this PDP as visually basic, dated, template-driven, or clearly below the level of a modern premium custom PDP?

Score CURRENT visual quality (how polished/premium the design already looks):
0-29 = very weak/outdated
30-44 = weak/basic
45-59 = moderate/generic
60-74 = good/professional
75+ = strong/premium editorial

Do NOT give high visual quality just because the page functions or has content.
Penalize: plain Shopify/Woo templates, weak typography, basic gallery, generic buyblock, no art direction, boring sections.

Reply ONLY JSON:
{
  "currentVisualQuality": 0..100,
  "visualAdjustment": -15..15,
  "purchaseAdjustment": -15..15,
  "mobileAdjustment": -10..10,
  "templateDriven": true|false,
  "artDirectionWeak": true|false,
  "reasoning": "short"
}

Positive adjustment = more room to improve visually. Negative = already premium.`,
                    },
                ],
            },
        ],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
    let parsed = {};
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch)
            parsed = JSON.parse(jsonMatch[0]);
    }
    catch {
        logger.warn("Visual redesign vision JSON parse failed", { domain });
    }
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const estimatedCost = (inputTokens / 1_000_000) * HAIKU_INPUT_COST_PER_M +
        (outputTokens / 1_000_000) * HAIKU_OUTPUT_COST_PER_M;
    const clampAdj = (n, min, max) => {
        if (typeof n !== "number" || !Number.isFinite(n))
            return 0;
        return Math.max(min, Math.min(max, Math.round(n)));
    };
    const currentVisualQuality = typeof parsed.currentVisualQuality === "number"
        ? Math.max(0, Math.min(100, Math.round(parsed.currentVisualQuality)))
        : null;
    return {
        currentVisualQuality,
        visualAdjustment: clampAdj(parsed.visualAdjustment, -15, 15),
        purchaseAdjustment: clampAdj(parsed.purchaseAdjustment, -15, 15),
        mobileAdjustment: clampAdj(parsed.mobileAdjustment, -10, 10),
        templateDriven: parsed.templateDriven === true,
        artDirectionWeak: parsed.artDirectionWeak === true,
        reasoning: typeof parsed.reasoning === "string" ? parsed.reasoning.slice(0, 240) : "",
        estimatedCost,
    };
}
//# sourceMappingURL=visualRedesignVisionScreen.js.map
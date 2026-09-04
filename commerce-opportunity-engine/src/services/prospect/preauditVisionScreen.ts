/**
 * Milestone 9.5 — optional cheap Haiku vision adjustment for prequalified PDPs.
 *
 * Only runs after economic pre-screen. Never screens raw domains.
 */

import { readFile } from "node:fs/promises";
import Anthropic from "@anthropic-ai/sdk";
import type { Env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

const HAIKU_INPUT_COST_PER_M = 0.25;
const HAIKU_OUTPUT_COST_PER_M = 1.25;

export type VisionScreenResult = {
  visualAdjustment: number;
  purchaseAdjustment: number;
  mobileAdjustment: number;
  presentationQuality: number | null;
  reasoning: string;
  estimatedCost: number;
};

export async function screenPdpViewportWithVision(
  env: Env,
  domain: string,
  desktopScreenshotPath: string
): Promise<VisionScreenResult> {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const imageBytes = await readFile(desktopScreenshotPath);
  const base64 = imageBytes.toString("base64");

  const response = await client.messages.create({
    model: env.CLAUDE_MODEL,
    max_tokens: 180,
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
            text: `You judge a Dutch ecommerce product page first viewport (desktop).
Domain: ${domain}

Estimate design opportunity for a premium DTC redesign.
Reply ONLY JSON:
{"visualAdjustment":-15..15,"purchaseAdjustment":-15..15,"mobileAdjustment":-10..10,"presentationQuality":0..100,"reasoning":"short"}

Positive adjustment = more room to improve (generic/template/weak buyblock).
Negative adjustment = already premium/editorial/strong commerce design.`,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

  let parsed: Partial<VisionScreenResult> & { presentationQuality?: number } = {};
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    logger.warn("Vision screen JSON parse failed", { domain });
  }

  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const estimatedCost =
    (inputTokens / 1_000_000) * HAIKU_INPUT_COST_PER_M +
    (outputTokens / 1_000_000) * HAIKU_OUTPUT_COST_PER_M;

  const clampAdj = (n: unknown, min: number, max: number): number => {
    if (typeof n !== "number" || !Number.isFinite(n)) return 0;
    return Math.max(min, Math.min(max, Math.round(n)));
  };

  return {
    visualAdjustment: clampAdj(parsed.visualAdjustment, -15, 15),
    purchaseAdjustment: clampAdj(parsed.purchaseAdjustment, -15, 15),
    mobileAdjustment: clampAdj(parsed.mobileAdjustment, -10, 10),
    presentationQuality:
      typeof parsed.presentationQuality === "number"
        ? Math.max(0, Math.min(100, Math.round(parsed.presentationQuality)))
        : null,
    reasoning: typeof parsed.reasoning === "string" ? parsed.reasoning.slice(0, 200) : "",
    estimatedCost,
  };
}

import Anthropic from "@anthropic-ai/sdk";
import type { Env } from "../../config/env.js";

export interface AnthropicConnectionResult {
  ok: boolean;
  message: string;
}

export function createAnthropicClient(env: Env): Anthropic {
  return new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
  });
}

/**
 * Sends a minimal message to verify API key and model availability.
 */
export async function testAnthropicConnection(
  client: Anthropic,
  model: string
): Promise<AnthropicConnectionResult> {
  try {
    const response = await client.messages.create({
      model,
      max_tokens: 8,
      messages: [{ role: "user", content: "Reply with only: ok" }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { ok: false, message: "Anthropic returned an empty response." };
    }

    return { ok: true, message: "CONNECTED" };
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return {
          ok: false,
          message: "Authentication failed. Check ANTHROPIC_API_KEY.",
        };
      }

      if (error.status === 404) {
        return {
          ok: false,
          message: `Model not found: ${model}. Check CLAUDE_MODEL.`,
        };
      }

      return { ok: false, message: error.message };
    }

    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown Anthropic error",
    };
  }
}

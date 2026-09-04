import Anthropic from "@anthropic-ai/sdk";
import type { Env } from "../../config/env.js";
export interface AnthropicConnectionResult {
    ok: boolean;
    message: string;
}
export declare function createAnthropicClient(env: Env): Anthropic;
/**
 * Sends a minimal message to verify API key and model availability.
 */
export declare function testAnthropicConnection(client: Anthropic, model: string): Promise<AnthropicConnectionResult>;
//# sourceMappingURL=client.d.ts.map
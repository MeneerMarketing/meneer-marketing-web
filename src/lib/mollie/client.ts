import createMollieClient, { type MollieClient } from "@mollie/api-client";

import { getMollieApiKey } from "./config";

let cachedClient: MollieClient | null = null;

export function getMollieClient(): MollieClient {
  const apiKey = getMollieApiKey();
  if (!apiKey) {
    throw new Error("MOLLIE_API_KEY is niet geconfigureerd.");
  }

  if (!cachedClient) {
    cachedClient = createMollieClient({ apiKey });
  }

  return cachedClient;
}

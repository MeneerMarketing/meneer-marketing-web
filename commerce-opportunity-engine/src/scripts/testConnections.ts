import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import {
  createDataForSeoClient,
  testDataForSeoConnection,
} from "../services/dataforseo/client.js";
import {
  createSupabaseServerClient,
  testSupabaseConnection,
} from "../services/supabase/client.js";
import {
  createAnthropicClient,
  testAnthropicConnection,
} from "../services/anthropic/client.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");

config({ path: resolve(projectRoot, ".env"), quiet: true });

interface ConnectionTestRow {
  service: string;
  ok: boolean;
  message: string;
}

async function runDataForSeoTest(env: ReturnType<typeof loadEnv>): Promise<ConnectionTestRow> {
  const client = createDataForSeoClient(env);
  const result = await testDataForSeoConnection(client);

  if (result.ok) {
    console.log("DataForSEO: CONNECTED");
  } else {
    console.log(`DataForSEO: FAILED — ${result.message}`);
  }

  return { service: "DataForSEO", ok: result.ok, message: result.message };
}

async function runSupabaseTest(env: ReturnType<typeof loadEnv>): Promise<ConnectionTestRow> {
  const client = createSupabaseServerClient(env);
  const result = await testSupabaseConnection(client);

  if (result.ok) {
    console.log("Supabase: CONNECTED");
  } else {
    console.log(`Supabase: FAILED — ${result.message}`);
  }

  return { service: "Supabase", ok: result.ok, message: result.message };
}

async function runAnthropicTest(env: ReturnType<typeof loadEnv>): Promise<ConnectionTestRow> {
  const client = createAnthropicClient(env);
  const result = await testAnthropicConnection(client, env.CLAUDE_MODEL);

  if (result.ok) {
    console.log("Anthropic: CONNECTED");
  } else {
    console.log(`Anthropic: FAILED — ${result.message}`);
  }

  return { service: "Anthropic", ok: result.ok, message: result.message };
}

function printSummary(results: ConnectionTestRow[]): void {
  console.log("");
  console.log("CONNECTION TEST");
  console.log("---------------------------");

  for (const row of results) {
    const status = row.ok ? "✅ CONNECTED" : `❌ ${row.message}`;
    const label = row.service.padEnd(12, " ");
    console.log(`${label} ${status}`);
  }

  console.log("---------------------------");
}

async function main(): Promise<void> {
  let env: ReturnType<typeof loadEnv>;

  try {
    env = loadEnv();
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Failed to load environment.");
    process.exit(1);
  }

  const results: ConnectionTestRow[] = [];

  results.push(await runDataForSeoTest(env));
  results.push(await runSupabaseTest(env));
  results.push(await runAnthropicTest(env));

  printSummary(results);

  const allOk = results.every((row) => row.ok);
  process.exit(allOk ? 0 : 1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Connection test crashed.");
  process.exit(1);
});

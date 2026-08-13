/**
 * Apply Milestone 8 SQL via Supabase SQL HTTP (requires DATABASE_URL or SUPABASE_DB_URL).
 * Fallback: print path for manual SQL editor paste.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}

async function main() {
  loadEnvLocal();
  const sqlPath = resolve(
    process.cwd(),
    "supabase/migrations/20260812220000_milestone8_campaign_bridge.sql"
  );
  const sql = readFileSync(sqlPath, "utf8");
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

  if (!dbUrl) {
    console.log(
      JSON.stringify(
        {
          applied: false,
          reason: "DATABASE_URL / SUPABASE_DB_URL ontbreekt",
          action:
            "Plak de SQL uit supabase/migrations/20260812220000_milestone8_campaign_bridge.sql in de Supabase SQL Editor",
          file: sqlPath,
        },
        null,
        2
      )
    );
    process.exit(0);
  }

  const pg = await import("pg");
  const client = new pg.default.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
    console.log(JSON.stringify({ applied: true, file: sqlPath }, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

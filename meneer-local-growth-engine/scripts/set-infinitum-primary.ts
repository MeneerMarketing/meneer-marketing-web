import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  maybeMarkReadyForOutreach,
  setPrimaryCandidateManual,
} from "../src/services/scoring/rankCity";
import { createAdminClient } from "../src/lib/supabase/admin";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

async function main() {
  loadEnvLocal();
  const id = "a562dd0b-3e17-45c0-8935-358dede447c8";
  await setPrimaryCandidateManual({
    businessId: id,
    note: "Manual override: #1 score 72, READY preview",
  });
  const ready = await maybeMarkReadyForOutreach(id);
  const client = createAdminClient();
  const { data } = await client
    .from("businesses")
    .select("studio_name, primary_candidate, lead_status, preview_status, lead_score")
    .eq("id", id)
    .single();
  console.log(JSON.stringify({ ready, business: data }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

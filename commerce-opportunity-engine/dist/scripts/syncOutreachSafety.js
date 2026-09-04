import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { syncAllUnsafeOutreachMessages } from "../services/outreach/outreachStateSync.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const results = await syncAllUnsafeOutreachMessages(supabase);
    console.log("OUTREACH STATE SAFETY SYNC");
    console.log("==========================");
    if (!results.length) {
        console.log("Geen messages gewijzigd.");
    }
    for (const r of results) {
        console.log(`${r.messageId}: ${r.previousStatus} → ${r.nextStatus} · ${r.reasons.join(", ")}`);
    }
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=syncOutreachSafety.js.map
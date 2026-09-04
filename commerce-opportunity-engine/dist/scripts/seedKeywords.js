import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { seedDevelopmentKeywords } from "../services/supabase/keywordsRepository.js";
import { logger } from "../utils/logger.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const count = await seedDevelopmentKeywords(supabase);
    logger.info("Seed keywords completed", { count });
    console.log(`Seeded ${count} development keywords (upsert, duplicates ignored).`);
}
main().catch((error) => {
    console.error(error instanceof Error ? error.message : "Seed failed");
    process.exit(1);
});
//# sourceMappingURL=seedKeywords.js.map
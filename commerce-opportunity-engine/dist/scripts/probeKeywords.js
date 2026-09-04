import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";
import { loadEnv } from "../config/env.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const env = loadEnv();
const client = createDataForSeoClient(env);
const keywords = ["matras kopen", "orthopedisch kussen"];
for (const keyword of keywords) {
    const response = await client.post("/serp/google/organic/live/advanced", [
        {
            keyword,
            location_code: env.GOOGLE_SERP_LOCATION_CODE,
            language_code: env.GOOGLE_SERP_LANGUAGE_CODE,
            device: "mobile",
            os: "android",
            se_domain: "google.nl",
            depth: 20,
        },
    ]);
    const data = response.data;
    const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
    const paid = items.filter((i) => i.type === "paid");
    console.log(keyword, {
        cost: data.tasks?.[0]?.cost,
        paidCount: paid.length,
        item_types: data.tasks?.[0]?.result?.[0]?.item_types,
    });
    if (paid.length > 0) {
        console.log("sample paid:", {
            title: paid[0].title,
            domain: paid[0].domain,
            url: paid[0].url,
        });
        await writeFile(resolve(projectRoot, `fixtures/${keyword.replace(/\s+/g, "-")}-paid.json`), JSON.stringify(data, null, 2));
        break;
    }
}
//# sourceMappingURL=probeKeywords.js.map
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
const keyword = "verzekering afsluiten";
const endpoints = [
    "/serp/google/organic/live/regular",
    "/serp/google/organic/live/advanced",
];
for (const endpoint of endpoints) {
    const response = await client.post(endpoint, [
        {
            keyword,
            location_name: "Netherlands",
            language_code: "nl",
            device: "desktop",
            os: "windows",
            se_domain: "google.nl",
            depth: 30,
        },
    ]);
    const data = response.data;
    const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
    const paid = items.filter((i) => i.type === "paid");
    console.log(endpoint, {
        cost: data.tasks?.[0]?.cost,
        paidCount: paid.length,
        totalItems: items.length,
        item_types: data.tasks?.[0]?.result?.[0]?.item_types,
    });
    if (paid.length > 0 || endpoint.includes("advanced")) {
        const slug = endpoint.split("/").slice(-2).join("-");
        await writeFile(resolve(projectRoot, `fixtures/probe-${slug}-${keyword.replace(/\s+/g, "-")}.json`), JSON.stringify(data, null, 2));
    }
}
//# sourceMappingURL=probeEndpoint.js.map
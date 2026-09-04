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
const response = await client.post("/serp/google/organic/live/advanced", [
    {
        keyword: "buy running shoes",
        location_code: 2840,
        language_code: "en",
        device: "desktop",
        os: "windows",
        depth: 20,
    },
]);
const data = response.data;
const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
const paid = items.filter((i) => i.type === "paid");
console.log({
    cost: data.tasks?.[0]?.cost,
    paidCount: paid.length,
    item_types: data.tasks?.[0]?.result?.[0]?.item_types,
});
if (paid[0]) {
    console.log("sample:", {
        title: paid[0].title,
        domain: paid[0].domain,
        url: paid[0].url,
    });
}
await writeFile(resolve(projectRoot, "fixtures/us-running-shoes.json"), JSON.stringify(data, null, 2));
//# sourceMappingURL=probeUsPaid.js.map
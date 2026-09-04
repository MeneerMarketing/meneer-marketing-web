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
const keyword = "led masker kopen";
const devices = [
    { device: "desktop", os: "windows" },
    { device: "mobile", os: "android" },
];
for (const combo of devices) {
    const response = await client.post("/serp/google/organic/live/advanced", [
        {
            keyword,
            location_code: env.GOOGLE_SERP_LOCATION_CODE,
            language_code: env.GOOGLE_SERP_LANGUAGE_CODE,
            device: combo.device,
            os: combo.os,
            depth: 20,
        },
    ]);
    const data = response.data;
    const items = data.tasks?.[0]?.result?.[0]?.items ?? [];
    const types = items.map((i) => i.type);
    const paidCount = items.filter((i) => i.type === "paid").length;
    console.log(combo.device, {
        cost: data.tasks?.[0]?.cost,
        item_types: data.tasks?.[0]?.result?.[0]?.item_types,
        paidCount,
        types: [...new Set(types)],
    });
    if (paidCount > 0) {
        const path = resolve(projectRoot, `fixtures/led-masker-kopen-${combo.device}.json`);
        await writeFile(path, JSON.stringify(data, null, 2));
    }
}
//# sourceMappingURL=probeDevices.js.map
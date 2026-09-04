import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const env = loadEnv();
const client = createDataForSeoClient(env);
const response = await client.get("/serp/google/locations/nl");
const locations = response.data.tasks?.[0]?.result ?? [];
const nl = locations.filter((l) => l.location_name?.toLowerCase().includes("netherlands"));
console.log(nl.slice(0, 5));
//# sourceMappingURL=probeLocations.js.map
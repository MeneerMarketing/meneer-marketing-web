import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(scriptDir, "../../fixtures/led-masker-kopen.json");
const raw = JSON.parse(await readFile(fixturePath, "utf8"));
const items = raw.tasks?.[0]?.result?.[0]?.items ?? [];
const types = items.map((i) => i.type);
console.log("item_types:", raw.tasks?.[0]?.result?.[0]?.item_types);
console.log("types in items:", [...new Set(types)]);
console.log("count by type:", types.reduce((acc, t) => {
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
}, {}));
for (const item of items) {
    if (item.type === "paid" || item.is_paid) {
        console.log("PAID-LIKE:", JSON.stringify({
            type: item.type,
            title: item.title,
            domain: item.domain,
            url: item.url,
            is_paid: item.is_paid,
        }));
    }
}
//# sourceMappingURL=inspectFixture.js.map
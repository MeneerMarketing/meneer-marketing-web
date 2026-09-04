/**
 * Internal visual audit — section-level screenshots for the M9.1.2 quality gate.
 * Usage: node dist/scripts/auditSections.js  (dashboard must be running)
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../..", "m9.1-screenshots/audit");
const CONCEPT_ID = "42cc76e8-9e57-48e9-ac27-7533bc09a2a0";
const BASE = process.env.M91_PREVIEW_BASE || "http://localhost:3002";
const TARGETS = [
    { name: "header", selector: ".pdtc-header" },
    { name: "trustline", selector: ".pdtc-trustline" },
    { name: "intro", selector: ".pdtc-intro" },
    { name: "signature", selector: ".pdtc-fx" },
    { name: "story", selector: ".pdtc-story" },
    { name: "sequence", selector: ".pdtc-seq" },
    { name: "immersive", selector: ".pdtc-immersive" },
    { name: "faq", selector: ".pdtc-faq" },
    { name: "final", selector: ".pdtc-final" },
    { name: "footer", selector: ".pdtc-footer" },
];
async function main() {
    await mkdir(outDir, { recursive: true });
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(`${BASE}/preview/concept/${CONCEPT_ID}`, {
        waitUntil: "networkidle",
        timeout: 60000,
    });
    await page.waitForTimeout(900);
    for (const t of TARGETS) {
        const el = page.locator(t.selector).first();
        if ((await el.count()) === 0) {
            console.warn(`missing: ${t.name}`);
            continue;
        }
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(350);
        await el.screenshot({ path: path.join(outDir, `${t.name}.png`) });
    }
    // Sticky purchase bar state after scrolling past the primary CTA
    await page.mouse.wheel(0, 2200);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, "sticky-desktop.png") });
    const mobile = await browser.newPage({
        viewport: { width: 430, height: 932 },
        isMobile: true,
        hasTouch: true,
    });
    await mobile.goto(`${BASE}/preview/concept/${CONCEPT_ID}`, {
        waitUntil: "networkidle",
        timeout: 60000,
    });
    await mobile.waitForTimeout(800);
    await mobile.screenshot({ path: path.join(outDir, "mobile-430x932.png") });
    await mobile.mouse.wheel(0, 1800);
    await mobile.waitForTimeout(700);
    await mobile.screenshot({ path: path.join(outDir, "mobile-sticky.png") });
    await browser.close();
    console.log("Audit shots in", outDir);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=auditSections.js.map
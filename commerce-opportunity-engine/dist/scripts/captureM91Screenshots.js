/**
 * Milestone 9.1 — capture INTERNAL_PREVIEW screenshots (desktop + mobile).
 * Usage (dashboard must be running): node dist/scripts/captureM91Screenshots.js
 * Or: npx tsx ... after build.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const outDir = path.resolve(root, "m9.1-screenshots");
const CONCEPT_ID = "42cc76e8-9e57-48e9-ac27-7533bc09a2a0";
const BASE = process.env.M91_PREVIEW_BASE || "http://localhost:3002";
const PRODUCT_URL = "https://tensfact.com/products/tensfact-automatische-voerbak-voor-kat-of-hond-met-hd-camera";
async function shot(page, url, file, fullPage) {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(800);
    await page.screenshot({
        path: path.join(outDir, file),
        fullPage,
    });
}
async function main() {
    await mkdir(outDir, { recursive: true });
    const browser = await chromium.launch({ headless: true });
    const desktop = await browser.newPage({
        viewport: { width: 1440, height: 1000 },
    });
    await shot(desktop, `${BASE}/preview/concept/${CONCEPT_ID}`, "concept-desktop-1440x1000.png", false);
    await shot(desktop, `${BASE}/preview/concept/${CONCEPT_ID}`, "concept-desktop-full.png", true);
    try {
        await shot(desktop, PRODUCT_URL, "current-pdp-desktop-1440x1000.png", false);
        await shot(desktop, PRODUCT_URL, "current-pdp-desktop-full.png", true);
    }
    catch (e) {
        console.warn("Current PDP desktop shot failed", e);
    }
    const mobile = await browser.newPage({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
    });
    await shot(mobile, `${BASE}/preview/concept/${CONCEPT_ID}`, "concept-mobile-390x844.png", false);
    await shot(mobile, `${BASE}/preview/concept/${CONCEPT_ID}`, "concept-mobile-full.png", true);
    try {
        await shot(mobile, PRODUCT_URL, "current-pdp-mobile-390x844.png", false);
    }
    catch (e) {
        console.warn("Current PDP mobile shot failed", e);
    }
    await browser.close();
    console.log("Screenshots written to", outDir);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=captureM91Screenshots.js.map
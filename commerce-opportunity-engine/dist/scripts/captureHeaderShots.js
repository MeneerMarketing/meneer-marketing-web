/**
 * Header-only approval shots (M9.1.2 section review).
 * Usage: node dist/scripts/captureHeaderShots.js  (dashboard must be running)
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../..", "m9.1-screenshots/header");
const CONCEPT_ID = "42cc76e8-9e57-48e9-ac27-7533bc09a2a0";
const BASE = process.env.M91_PREVIEW_BASE || "http://localhost:3002";
const URL = `${BASE}/preview/concept/${CONCEPT_ID}`;
const SHOTS = [
    { file: "header-desktop-1440x220.png", width: 1440, height: 220 },
    { file: "header-desktop-scrolled-1440x120.png", width: 1440, height: 120, scrolled: true },
    { file: "header-mobile-390x170.png", width: 390, height: 170, mobile: true },
    { file: "header-mobile-430x170.png", width: 430, height: 170, mobile: true },
];
async function main() {
    await mkdir(outDir, { recursive: true });
    const browser = await chromium.launch({ headless: true });
    for (const shot of SHOTS) {
        const page = await browser.newPage({
            viewport: { width: shot.width, height: Math.max(shot.height, 700) },
            isMobile: shot.mobile ?? false,
            hasTouch: shot.mobile ?? false,
        });
        await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
        await page.waitForTimeout(700);
        if (shot.scrolled) {
            await page.mouse.wheel(0, 260);
            await page.waitForTimeout(700);
        }
        await page.screenshot({
            path: path.join(outDir, shot.file),
            clip: { x: 0, y: 0, width: shot.width, height: shot.height },
        });
        await page.close();
    }
    await browser.close();
    console.log("Header shots in", outDir);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=captureHeaderShots.js.map
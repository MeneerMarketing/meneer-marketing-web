import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const url =
  "http://localhost:3002/preview/concept/42cc76e8-9e57-48e9-ac27-7533bc09a2a0";
const outDir = path.resolve("m9.1.3-screenshots");

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(1500);

await page.screenshot({ path: path.join(outDir, "header-hero-desktop.png"), fullPage: false });

await page.locator("#pdtc-features-title").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, "signature-features.png"), fullPage: false });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "networkidle", timeout: 120000 });
await mobile.waitForTimeout(1500);
await mobile.screenshot({ path: path.join(outDir, "hero-mobile.png"), fullPage: false });

await browser.close();
console.log(`Screenshots saved to ${outDir}`);

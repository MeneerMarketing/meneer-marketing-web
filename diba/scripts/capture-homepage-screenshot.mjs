import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "screenshots");
const url = "http://localhost:3010/";

async function capture() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(outDir, "homepage-clinical-1440.png"),
    fullPage: true,
  });
  await page.close();

  await browser.close();
  console.log("Saved homepage-clinical-1440.png");
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});

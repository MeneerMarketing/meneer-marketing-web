import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "screenshots");
const base = "http://localhost:3010";

const pages = [
  { name: "home", path: "/" },
  { name: "acne-pillar", path: "/huidproblemen/acne" },
];

async function capture() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();

  for (const { name, path: pagePath } of pages) {
    {
      const page = await browser.newPage({ viewport: { width: 380, height: 812 } });
      await page.goto(`${base}${pagePath}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      if (name === "acne-pillar") {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(400);
      }
      await page.screenshot({
        path: path.join(outDir, `sprint2a-${name}-380px.png`),
        fullPage: true,
      });
      await page.close();
    }

    {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.goto(`${base}${pagePath}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(outDir, `sprint2a-${name}-desktop.png`),
        fullPage: true,
      });
      await page.close();
    }
  }

  await browser.close();
  console.log("Screenshots saved to", outDir);
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});

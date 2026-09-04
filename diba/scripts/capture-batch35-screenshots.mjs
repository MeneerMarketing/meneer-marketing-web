import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "screenshots");
const url = "http://localhost:3010/dev/components";

async function capture() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();

  {
    const page = await browser.newPage({
      viewport: { width: 380, height: 812 },
    });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(outDir, "batch35-dev-380px.png"),
      fullPage: true,
    });
    await page.close();
  }

  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(outDir, "batch35-dev-desktop.png"),
      fullPage: true,
    });
    await page.close();
  }

  await browser.close();
  console.log("Screenshots saved to", outDir);
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});

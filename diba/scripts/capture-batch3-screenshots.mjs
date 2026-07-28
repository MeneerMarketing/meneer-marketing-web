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

  // 380px menu dicht
  {
    const page = await browser.newPage({ viewport: { width: 380, height: 812 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(outDir, "batch3-dev-380px-menu-dicht.png"),
      fullPage: true,
    });
    await page.close();
  }

  // 380px menu open
  {
    const page = await browser.newPage({ viewport: { width: 380, height: 812 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, "batch3-dev-380px-menu-open.png"),
      fullPage: false,
    });
    await page.close();
  }

  // Desktop
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(outDir, "batch3-dev-desktop.png"),
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

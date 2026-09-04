import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const out = "dashboard/screenshots";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const routes = [
  ["/", "01-overview"],
  ["/opportunities", "02-opportunities"],
  ["/discovery", "03-discovery"],
  ["/brands", "04-brands"],
  ["/runs", "05-runs"],
  ["/api-usage", "07-api-usage"],
];

for (const [path, name] of routes) {
  await page.goto(`http://127.0.0.1:3040${path}`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  console.log("shot", name);
}

await page.goto("http://127.0.0.1:3040/opportunities", {
  waitUntil: "networkidle",
  timeout: 60000,
});
const link = page.locator('a[href^="/opportunities/"]').first();
if ((await link.count()) > 0) {
  await link.click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(700);
  await page.screenshot({
    path: `${out}/06-opportunity-detail.png`,
    fullPage: true,
  });
  console.log("shot detail");
}

await browser.close();
console.log("done");

#!/usr/bin/env tsx
/**
 * Exporteert carousel-slides als PNG op 1080x1350.
 *
 * Vereist een draaiende dev- of productieserver op poort 3030.
 *   npm run dev
 *   npm run export:slides -- DE_REKENING
 *
 * Zonder argument exporteert hij alle formats die een template hebben.
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { TEMPLATE_REGISTRY } from "../src/lib/templates/registry";
import type { ContentFormatId } from "../src/services/types";

const BASE_URL = process.env.SOCIAL_ENGINE_URL ?? "http://localhost:3030";
const OUT_DIR = join(process.cwd(), "out", "slides");

async function main() {
  const requested = process.argv[2] as ContentFormatId | undefined;
  const formats = (
    requested ? [requested] : (Object.keys(TEMPLATE_REGISTRY) as ContentFormatId[])
  ).filter((f) => TEMPLATE_REGISTRY[f]);

  if (formats.length === 0) {
    console.error("Geen bekend format opgegeven.");
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  });

  for (const formatId of formats) {
    const slides = TEMPLATE_REGISTRY[formatId]?.slides ?? 1;

    for (let i = 0; i < slides; i++) {
      const url = `${BASE_URL}/render/${formatId}/${i}`;
      await page.goto(url, { waitUntil: "networkidle" });

      const element = await page.$("#slide-root");
      if (!element) {
        console.warn(`Slide niet gevonden: ${url}`);
        continue;
      }

      const suffix = slides > 1 ? `-${i + 1}` : "";
      const file = join(OUT_DIR, `${formatId.toLowerCase()}${suffix}.png`);
      await element.screenshot({ path: file });
      console.log(`✓ ${file}`);
    }
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { createAdminClient } from "@/lib/supabase/admin";
import { pilatesAcquisitionFitConfig } from "@/verticals/pilates";

/**
 * Desktop + mobile homepage screenshots for serious transformation candidates.
 *
 * Two shots per business, JPEG, viewport-sized (not full page) so the file
 * stays small and Claude sees what a visitor sees first. Playwright is loaded
 * dynamically: without it the pipeline degrades to a deterministic assessment
 * instead of failing.
 */

export interface Screenshot {
  variant: "desktop" | "mobile";
  buffer: Buffer;
  bytes: number;
  width: number;
  height: number;
  url: string;
  storage_url: string | null;
}

export interface ScreenshotCaptureResult {
  ok: boolean;
  url: string | null;
  final_url: string | null;
  shots: Screenshot[];
  error: string | null;
  duration_ms: number;
}

type PlaywrightModule = typeof import("playwright");

/**
 * Hoeveel schermhoogtes we vastleggen. Genoeg om het hele verhaal van een
 * studiopagina te zien, kort genoeg om de afbeelding binnen de limieten van de
 * vision-API te houden.
 */
const MAX_VIEWPORTS_CAPTURED = 5;

/** Als string: een functiereferentie levert getranspileerde helpers op die de pagina niet kent. */
const SCROLL_THROUGH = `(async () => {
  const step = window.innerHeight;
  const total = document.body.scrollHeight;
  for (let y = 0; y < total; y += step) {
    window.scrollTo(0, y);
    await new Promise((done) => setTimeout(done, 280));
  }
  window.scrollTo(0, 0);
  await new Promise((done) => setTimeout(done, 300));
})()`;

let playwrightPromise: Promise<PlaywrightModule | null> | null = null;

async function loadPlaywright(): Promise<PlaywrightModule | null> {
  if (!playwrightPromise) {
    playwrightPromise = import("playwright").catch(() => null);
  }
  return playwrightPromise;
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 64) || "business";
}

export async function captureBusinessScreenshots(input: {
  businessId: string;
  websiteUrl: string | null;
}): Promise<ScreenshotCaptureResult> {
  const started = Date.now();
  const config = pilatesAcquisitionFitConfig.screenshots;

  const base: ScreenshotCaptureResult = {
    ok: false,
    url: input.websiteUrl,
    final_url: null,
    shots: [],
    error: null,
    duration_ms: 0,
  };

  if (!config.enabled) {
    return { ...base, error: "screenshots_disabled", duration_ms: Date.now() - started };
  }
  if (!input.websiteUrl) {
    return { ...base, error: "no_website", duration_ms: Date.now() - started };
  }

  const playwright = await loadPlaywright();
  if (!playwright) {
    return {
      ...base,
      error: "playwright_unavailable",
      duration_ms: Date.now() - started,
    };
  }

  const target = input.websiteUrl.startsWith("http")
    ? input.websiteUrl
    : `https://${input.websiteUrl}`;

  let browser: Awaited<ReturnType<PlaywrightModule["chromium"]["launch"]>> | null = null;
  const shots: Screenshot[] = [];
  let finalUrl: string | null = null;

  try {
    browser = await playwright.chromium.launch({ headless: true });

    const variants: Array<{
      variant: "desktop" | "mobile";
      width: number;
      height: number;
      mobile: boolean;
    }> = [
      {
        variant: "desktop",
        width: config.desktopWidth,
        height: config.desktopHeight,
        mobile: false,
      },
      {
        variant: "mobile",
        width: config.mobileWidth,
        height: config.mobileHeight,
        mobile: true,
      },
    ];

    for (const spec of variants) {
      const context = await browser.newContext({
        viewport: { width: spec.width, height: spec.height },
        deviceScaleFactor: 1,
        isMobile: spec.mobile,
        hasTouch: spec.mobile,
        userAgent: spec.mobile
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
          : undefined,
        locale: "nl-NL",
      });
      const page = await context.newPage();
      try {
        const response = await page.goto(target, {
          waitUntil: "domcontentloaded",
          timeout: config.timeoutMs,
        });
        finalUrl = page.url() || response?.url() || target;

        // Give lazy heroes, webfonts and cookie walls a moment to settle.
        await page.waitForTimeout(2200);
        await dismissCookieWalls(page);
        await page.waitForTimeout(400);

        // Page builders load sections on scroll. Without walking the page the
        // shot shows a polished hero above empty white blocks, and the judge
        // then grades the hero instead of the site.
        await page.evaluate(SCROLL_THROUGH);
        await page.waitForTimeout(900);

        // Full page, capped: a broken layout almost always sits below the fold.
        // Judging only the viewport is how a collapsing Wix page scores as
        // "clean and minimal".
        const fullHeight = await page.evaluate(
          () => document.documentElement.scrollHeight || document.body.scrollHeight
        );
        const captureHeight = Math.min(
          Math.max(fullHeight, spec.height),
          spec.height * MAX_VIEWPORTS_CAPTURED
        );

        const buffer = await page.screenshot({
          type: "jpeg",
          quality: config.quality,
          fullPage: false,
          clip: { x: 0, y: 0, width: spec.width, height: captureHeight },
        });

        shots.push({
          variant: spec.variant,
          buffer: Buffer.from(buffer),
          bytes: buffer.length,
          width: spec.width,
          height: captureHeight,
          url: finalUrl,
          storage_url: null,
        });
      } finally {
        await context.close();
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ...base,
      shots,
      final_url: finalUrl,
      ok: shots.length > 0,
      error: message,
      duration_ms: Date.now() - started,
    };
  } finally {
    await browser?.close().catch(() => undefined);
  }

  if (config.uploadToStorage) {
    await uploadShots(input.businessId, shots, config.storageBucket);
  }

  return {
    ok: shots.length > 0,
    url: input.websiteUrl,
    final_url: finalUrl,
    shots,
    error: null,
    duration_ms: Date.now() - started,
  };
}

async function dismissCookieWalls(page: {
  locator: (selector: string) => {
    first: () => { click: (opts: { timeout: number }) => Promise<void> };
  };
}): Promise<void> {
  const selectors = [
    "button:has-text('Accepteer')",
    "button:has-text('Accepteren')",
    "button:has-text('Akkoord')",
    "button:has-text('Accept all')",
    "button:has-text('Alles accepteren')",
    "#onetrust-accept-btn-handler",
    ".cc-allow",
  ];
  for (const selector of selectors) {
    try {
      await page.locator(selector).first().click({ timeout: 900 });
      return;
    } catch {
      // No matching cookie wall for this selector.
    }
  }
}

async function uploadShots(
  businessId: string,
  shots: Screenshot[],
  bucket: string
): Promise<void> {
  if (!shots.length) return;
  const client = createAdminClient();
  const folder = safeSegment(businessId);
  const stamp = Date.now();

  for (const shot of shots) {
    const path = `${folder}/${shot.variant}-${stamp}.jpg`;
    const { error } = await client.storage.from(bucket).upload(path, shot.buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });
    if (error) continue;
    const { data } = client.storage.from(bucket).getPublicUrl(path);
    shot.storage_url = data.publicUrl ?? null;
  }
}

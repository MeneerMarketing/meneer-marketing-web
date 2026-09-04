type PlaywrightModule = typeof import("playwright");

let playwrightPromise: Promise<PlaywrightModule | null> | null = null;

async function loadPlaywright(): Promise<PlaywrightModule | null> {
  if (!playwrightPromise) {
    playwrightPromise = import("playwright").catch(() => null);
  }
  return playwrightPromise;
}

export interface RenderedHtmlSession {
  fetch: (url: string) => Promise<string | null>;
  close: () => Promise<void>;
}

export async function createRenderedHtmlSession(): Promise<RenderedHtmlSession | null> {
  const playwright = await loadPlaywright();
  if (!playwright) return null;

  const browser = await playwright.chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({
    locale: "nl-NL",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });

  return {
    async fetch(url: string): Promise<string | null> {
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 22000 });
        await page.waitForTimeout(900);
        await page
          .evaluate(() => {
            const labels = ["accepteren", "akkoord", "accept", "agree", "toestaan"];
            const buttons = Array.from(document.querySelectorAll("button, a[role='button']"));
            for (const button of buttons) {
              const text = (button.textContent ?? "").trim().toLowerCase();
              if (labels.some((label) => text.includes(label))) {
                (button as HTMLElement).click();
                break;
              }
            }
          })
          .catch(() => undefined);
        await page.waitForTimeout(400);
        return await page.content();
      } catch {
        return null;
      } finally {
        await page.close().catch(() => undefined);
      }
    },
    async close() {
      await context.close().catch(() => undefined);
      await browser.close().catch(() => undefined);
    },
  };
}

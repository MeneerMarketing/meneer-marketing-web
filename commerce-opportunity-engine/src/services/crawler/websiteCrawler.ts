import axios from "axios";
import { chromium, type Browser } from "playwright";
import type { CrawlResult } from "../../types/crawler.js";
import { logger } from "../../utils/logger.js";
import { withRetry } from "../../utils/retry.js";
import { normalizeUrl } from "../../utils/urlHelpers.js";

const COOKIE_SELECTORS = [
  "button:has-text('Accept')",
  "button:has-text('Akkoord')",
  "button:has-text('Accepteer')",
  "button:has-text('Alles accepteren')",
  "button:has-text('Ik ga akkoord')",
  "[id*='accept']",
  "[class*='cookie'] button",
];

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    browserInstance = await chromium.launch({ headless: true });
  }
  return browserInstance;
}

export async function closeCrawlerBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

async function fetchWithAxios(url: string, timeoutMs: number): Promise<CrawlResult> {
  const response = await axios.get(url, {
    timeout: timeoutMs,
    maxRedirects: 5,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CommerceOpportunityEngine/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
    validateStatus: (status) => status < 500,
  });

  if (response.status === 403 || response.status === 401) {
    return {
      startUrl: url,
      finalUrl: response.request?.res?.responseUrl ?? url,
      html: "",
      status: "blocked",
      errorMessage: `HTTP ${response.status}`,
      usedPlaywright: false,
    };
  }

  const html = typeof response.data === "string" ? response.data : "";
  return {
    startUrl: url,
    finalUrl: response.request?.res?.responseUrl ?? url,
    html,
    status: html.length > 200 ? "success" : "failed",
    errorMessage: html.length > 200 ? null : "Empty HTML response",
    usedPlaywright: false,
  };
}

async function fetchWithPlaywright(url: string, timeoutMs: number): Promise<CrawlResult> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    locale: "nl-NL",
  });
  const page = await context.newPage();

  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: timeoutMs,
    });

    for (const selector of COOKIE_SELECTORS) {
      try {
        const button = page.locator(selector).first();
        if (await button.isVisible({ timeout: 800 })) {
          await button.click({ timeout: 1000 });
          await page.waitForTimeout(500);
          break;
        }
      } catch {
        // continue
      }
    }

    const html = await page.content();
    const finalUrl = page.url();
    const statusCode = response?.status() ?? 0;

    await context.close();

    if (statusCode === 403 || statusCode === 401) {
      return {
        startUrl: url,
        finalUrl,
        html: "",
        status: "blocked",
        errorMessage: `HTTP ${statusCode}`,
        usedPlaywright: true,
      };
    }

    return {
      startUrl: url,
      finalUrl,
      html,
      status: html.length > 200 ? "success" : "failed",
      errorMessage: html.length > 200 ? null : "Empty rendered HTML",
      usedPlaywright: true,
    };
  } catch (error) {
    await context.close();
    const message = error instanceof Error ? error.message : "Playwright crawl failed";
    const isTimeout = message.toLowerCase().includes("timeout");
    return {
      startUrl: url,
      finalUrl: url,
      html: "",
      status: isTimeout ? "timeout" : "failed",
      errorMessage: message,
      usedPlaywright: true,
    };
  }
}

export async function crawlWebsite(
  url: string,
  timeoutMs: number
): Promise<CrawlResult> {
  const normalized = normalizeUrl(url);

  try {
    const axiosResult = await withRetry(
      () => fetchWithAxios(normalized, timeoutMs),
      { maxAttempts: 2, delayMs: 500, backoffFactor: 2 }
    );

    if (axiosResult.status === "success" && axiosResult.html.length > 1000) {
      return axiosResult;
    }

    logger.debug("Falling back to Playwright", {
      url: normalized,
      axiosStatus: axiosResult.status,
    });

    return await fetchWithPlaywright(normalized, timeoutMs);
  } catch (error) {
    logger.warn("Axios crawl failed, trying Playwright", {
      url: normalized,
      error: error instanceof Error ? error.message : "unknown",
    });

    try {
      return await fetchWithPlaywright(normalized, timeoutMs);
    } catch (playwrightError) {
      return {
        startUrl: normalized,
        finalUrl: normalized,
        html: "",
        status: "failed",
        errorMessage:
          playwrightError instanceof Error ? playwrightError.message : "Crawl failed",
        usedPlaywright: true,
      };
    }
  }
}

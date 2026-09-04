/**
 * Milestone 9.5 — PDP viewport capture for manual review.
 */
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
async function withTimeout(promise, ms, label) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    });
    try {
        return await Promise.race([promise, timeout]);
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
export async function dismissOverlays(page) {
    const closeSelectors = [
        '[aria-label*="close" i]',
        '[aria-label*="sluit" i]',
        ".klaviyo-close-form",
        '[class*="close" i][role="button"]',
        'button[class*="close" i]',
        'button[id*="close" i]',
        '[data-testid*="close" i]',
        "#onetrust-accept-btn-handler",
        'button:has-text("Nee bedankt")',
        'button:has-text("Nee dankje")',
        'button:has-text("Alles accepteren")',
        'button:has-text("Accepteren")',
    ];
    const deadline = Date.now() + 3_500;
    for (let attempt = 0; attempt < 2 && Date.now() < deadline; attempt += 1) {
        await page.keyboard.press("Escape").catch(() => undefined);
        const frames = page.frames().slice(0, 6);
        for (const frame of frames) {
            if (Date.now() >= deadline)
                break;
            for (const selector of closeSelectors.slice(0, 8)) {
                if (Date.now() >= deadline)
                    break;
                const target = frame.locator(selector).first();
                if (await target.isVisible({ timeout: 400 }).catch(() => false)) {
                    await target.click({ timeout: 800 }).catch(() => undefined);
                }
            }
        }
        await page.waitForTimeout(600).catch(() => undefined);
    }
}
async function captureSingleShot(browser, input) {
    const slug = input.domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const page = await browser.newPage({ viewport: input.shot.viewport });
    page.setDefaultTimeout(Math.min(input.timeoutMs, 12_000));
    page.setDefaultNavigationTimeout(input.timeoutMs);
    try {
        return await withTimeout((async () => {
            await page.goto(input.shot.url, {
                waitUntil: "domcontentloaded",
                timeout: input.timeoutMs,
            });
            await page.waitForTimeout(1_500);
            await dismissOverlays(page);
            const file = resolve(input.outputDir, `${slug}-${input.shot.key}.png`);
            await page.screenshot({ path: file, timeout: 8_000 });
            return file;
        })(), input.timeoutMs + 6_000, `screenshot ${input.domain}`);
    }
    catch {
        return null;
    }
    finally {
        await page.close({ runBeforeUnload: false }).catch(() => undefined);
    }
}
export async function captureViewportScreenshots(input) {
    const paths = {};
    if (input.shots.length === 0)
        return paths;
    await mkdir(input.outputDir, { recursive: true });
    const { chromium } = await import("playwright");
    let browser = null;
    try {
        browser = await chromium.launch({ headless: true });
        for (const shot of input.shots) {
            const file = await captureSingleShot(browser, {
                outputDir: input.outputDir,
                domain: input.domain,
                shot,
                timeoutMs: input.timeoutMs,
            });
            if (file)
                paths[shot.key] = file;
        }
    }
    catch {
        // Domain-level capture failure should not abort the batch.
    }
    finally {
        if (browser) {
            await withTimeout(browser.close(), 5_000, "browser close").catch(() => undefined);
        }
    }
    return paths;
}
//# sourceMappingURL=pdpViewportCapture.js.map
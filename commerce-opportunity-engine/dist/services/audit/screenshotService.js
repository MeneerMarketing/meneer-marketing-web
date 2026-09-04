import { createHash } from "node:crypto";
import { chromium, devices } from "playwright";
import { logger } from "../../utils/logger.js";
const COOKIE_SELECTORS = [
    "button:has-text('Accept')",
    "button:has-text('Akkoord')",
    "button:has-text('Accepteer')",
    "button:has-text('Alles accepteren')",
    "button:has-text('Ik ga akkoord')",
    "button:has-text('Allow all')",
    "button:has-text('OK')",
    "button:has-text('Ok')",
    "button:has-text('Toestaan')",
    "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
    "#CybotCookiebotDialogBodyButtonAccept",
    "[id*='Cookiebot'] button",
    "[id*='accept' i]",
    "[class*='cookie'] button",
];
const POPUP_CLOSE_SELECTORS = [
    "button:has-text('Nee bedankt')",
    "button:has-text('No thanks')",
    "button:has-text('Sluiten')",
    "button[aria-label='Close']",
    "button[aria-label='Sluiten']",
    ".modal button.close",
    "[data-testid='close']",
];
export async function captureOpportunityScreenshots(input) {
    const maxRetries = input.maxRetries ?? 2;
    const retryDelayMs = input.retryDelayMs ?? 1500;
    let last = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const useFreshContext = attempt > 0;
        const longerWait = attempt > 0;
        last = await captureOnce({
            ...input,
            attempt,
            useFreshContext,
            longerWait,
        });
        const looksBroken = /error\s*52[0-4]|checking your browser|just a moment|cf-error-details|challenge-platform/i.test(last.html) ||
            (last.httpStatus != null &&
                (last.httpStatus === 403 ||
                    last.httpStatus === 429 ||
                    last.httpStatus >= 500)) ||
            (!last.paths.mobile && !last.paths.desktop);
        if (!looksBroken) {
            return { ...last, attempts: attempt + 1 };
        }
        if (attempt < maxRetries) {
            logger.warn("Screenshot capture looks blocked/error; retrying", {
                url: input.url,
                attempt: attempt + 1,
                httpStatus: last.httpStatus,
            });
            await sleep(retryDelayMs * (attempt + 1));
        }
    }
    return { ...last, attempts: maxRetries + 1 };
}
async function captureOnce(input) {
    const errors = [];
    const timeoutMs = (input.timeoutMs ?? 45000) + (input.longerWait ? 15000 : 0);
    let browser = null;
    const paths = {
        mobile: null,
        desktop: null,
        fullMobile: null,
        fullDesktop: null,
    };
    let html = "";
    let finalUrl = input.url;
    let httpStatus = null;
    try {
        browser = await chromium.launch({
            headless: true,
            args: input.useFreshContext ? ["--disable-blink-features=AutomationControlled"] : undefined,
        });
        // Mobile
        try {
            const mobile = await preparePage(browser, "mobile", timeoutMs, input.useFreshContext);
            const response = await mobile.goto(input.url, {
                waitUntil: input.longerWait ? "networkidle" : "domcontentloaded",
                timeout: timeoutMs,
            });
            httpStatus = response?.status() ?? null;
            if (input.longerWait) {
                await mobile.waitForTimeout(1200);
            }
            await dismissOverlays(mobile);
            await lazyScroll(mobile);
            await mobile.evaluate("window.scrollTo(0, 0)");
            await mobile.waitForTimeout(input.longerWait ? 800 : 400);
            html = await mobile.content();
            finalUrl = mobile.url();
            const mobileViewport = await mobile.screenshot({ type: "png" });
            const mobileFull = await mobile.screenshot({ type: "png", fullPage: true });
            const suffix = input.attempt > 0 ? `.r${input.attempt}` : "";
            paths.mobile = await uploadPng(input.supabase, input.bucket, `${input.brandId}/${input.opportunityId}/mobile${suffix}.png`, mobileViewport);
            paths.fullMobile = await uploadPng(input.supabase, input.bucket, `${input.brandId}/${input.opportunityId}/full-mobile${suffix}.png`, mobileFull);
            // Stable paths without suffix for dashboard
            if (input.attempt === 0 || !looksLikeErrorHtml(html)) {
                paths.mobile = await uploadPng(input.supabase, input.bucket, `${input.brandId}/${input.opportunityId}/mobile.png`, mobileViewport);
                paths.fullMobile = await uploadPng(input.supabase, input.bucket, `${input.brandId}/${input.opportunityId}/full-mobile.png`, mobileFull);
            }
            await mobile.context().close();
        }
        catch (error) {
            errors.push(`mobile: ${error instanceof Error ? error.message : "failed"}`);
        }
        // Desktop
        try {
            const desktop = await preparePage(browser, "desktop", timeoutMs, input.useFreshContext);
            const response = await desktop.goto(input.url, {
                waitUntil: input.longerWait ? "networkidle" : "domcontentloaded",
                timeout: timeoutMs,
            });
            if (httpStatus == null) {
                httpStatus = response?.status() ?? null;
            }
            if (input.longerWait) {
                await desktop.waitForTimeout(1200);
            }
            await dismissOverlays(desktop);
            await lazyScroll(desktop);
            await desktop.evaluate("window.scrollTo(0, 0)");
            await desktop.waitForTimeout(input.longerWait ? 800 : 400);
            if (!html || looksLikeErrorHtml(html)) {
                html = await desktop.content();
                finalUrl = desktop.url();
            }
            const desktopViewport = await desktop.screenshot({ type: "png" });
            const desktopFull = await desktop.screenshot({ type: "png", fullPage: true });
            paths.desktop = await uploadPng(input.supabase, input.bucket, `${input.brandId}/${input.opportunityId}/desktop.png`, desktopViewport);
            paths.fullDesktop = await uploadPng(input.supabase, input.bucket, `${input.brandId}/${input.opportunityId}/full-desktop.png`, desktopFull);
            await desktop.context().close();
        }
        catch (error) {
            errors.push(`desktop: ${error instanceof Error ? error.message : "failed"}`);
        }
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
    if (!paths.mobile && !paths.desktop) {
        logger.warn("Screenshot capture failed completely", {
            url: input.url,
            errors,
        });
    }
    return { paths, html, finalUrl, httpStatus, errors, attempts: 1 };
}
function looksLikeErrorHtml(html) {
    return /error\s*52[0-4]|checking your browser|just a moment|cf-error-details|challenge-platform/i.test(html);
}
async function preparePage(browser, mode, timeoutMs, fresh) {
    if (mode === "mobile") {
        const device = devices["iPhone 13"];
        const context = await browser.newContext({
            ...device,
            locale: "nl-NL",
            viewport: { width: 390, height: 844 },
            ...(fresh
                ? {
                    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
                }
                : {}),
        });
        const page = await context.newPage();
        page.setDefaultTimeout(timeoutMs);
        return page;
    }
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        locale: "nl-NL",
        userAgent: fresh
            ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(timeoutMs);
    return page;
}
async function dismissOverlays(page) {
    for (const selector of [...COOKIE_SELECTORS, ...POPUP_CLOSE_SELECTORS]) {
        try {
            const button = page.locator(selector).first();
            if (await button.isVisible({ timeout: 600 })) {
                await button.click({ timeout: 1000 });
                await page.waitForTimeout(300);
            }
        }
        catch {
            // continue
        }
    }
}
async function lazyScroll(page) {
    await page.evaluate(`(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const height = Math.max(document.body.scrollHeight, 2000);
    for (let y = 0; y < height; y += 500) {
      window.scrollTo(0, y);
      await delay(120);
    }
  })()`);
}
async function uploadPng(supabase, bucket, path, bytes) {
    const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
        contentType: "image/png",
        upsert: true,
    });
    if (error) {
        throw new Error(`Storage upload failed (${path}): ${error.message}`);
    }
    return path;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function hashPageContent(html, representationJson) {
    return createHash("sha256")
        .update(html.slice(0, 50000))
        .update(representationJson)
        .digest("hex");
}
export async function createSignedScreenshotUrls(supabase, bucket, paths, expiresInSeconds = 3600) {
    const entries = Object.entries(paths);
    const result = {};
    for (const [key, path] of entries) {
        if (!path) {
            result[key] = null;
            continue;
        }
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresInSeconds);
        result[key] = error ? null : data.signedUrl;
    }
    return result;
}
export async function downloadScreenshotBuffers(supabase, bucket, paths) {
    const result = {};
    if (paths.mobile) {
        const { data, error } = await supabase.storage.from(bucket).download(paths.mobile);
        if (!error && data) {
            result.mobilePng = Buffer.from(await data.arrayBuffer());
        }
    }
    if (paths.desktop) {
        const { data, error } = await supabase.storage.from(bucket).download(paths.desktop);
        if (!error && data) {
            result.desktopPng = Buffer.from(await data.arrayBuffer());
        }
    }
    return result;
}
//# sourceMappingURL=screenshotService.js.map
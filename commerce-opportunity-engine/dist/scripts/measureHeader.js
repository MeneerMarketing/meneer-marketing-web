/** Quick metric check for the header approval step. */
import { chromium } from "playwright";
const BASE = process.env.M91_PREVIEW_BASE || "http://localhost:3002";
const URL = `${BASE}/preview/concept/42cc76e8-9e57-48e9-ac27-7533bc09a2a0`;
async function measure(width, height, mobile, scroll = 0) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
        viewport: { width, height },
        isMobile: mobile,
        hasTouch: mobile,
    });
    await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
    if (scroll) {
        await page.mouse.wheel(0, scroll);
        await page.waitForTimeout(700);
    }
    await page.waitForTimeout(400);
    const data = await page.evaluate(() => {
        const q = (sel) => document.querySelector(sel);
        const box = (sel) => {
            const el = q(sel);
            if (!el)
                return null;
            const r = el.getBoundingClientRect();
            return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x) };
        };
        const inner = q(".pdtc-nav-inner");
        const logo = q(".pdtc-brand img");
        const innerRect = inner?.getBoundingClientRect();
        const logoRect = logo?.getBoundingClientRect();
        return {
            rail: box(".pdtc-servicerail"),
            navRow: box(".pdtc-nav-inner"),
            logo: box(".pdtc-brand img"),
            contentWidth: innerRect ? Math.round(innerRect.width) : null,
            logoCenterOffset: innerRect && logoRect
                ? Math.round(logoRect.x + logoRect.width / 2 - (innerRect.x + innerRect.width / 2))
                : null,
        };
    });
    await browser.close();
    return data;
}
async function main() {
    console.log("desktop 1440 top   ", JSON.stringify(await measure(1440, 900, false)));
    console.log("desktop 1440 scroll", JSON.stringify(await measure(1440, 900, false, 300)));
    console.log("mobile 390         ", JSON.stringify(await measure(390, 844, true)));
    console.log("mobile 430         ", JSON.stringify(await measure(430, 932, true)));
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=measureHeader.js.map
/** Header metric check (geometry only, via bounding boxes). */
import { chromium } from "playwright";
const BASE = process.env.M91_PREVIEW_BASE || "http://localhost:3002";
const URL = `${BASE}/preview/concept/42cc76e8-9e57-48e9-ac27-7533bc09a2a0`;
async function box(page, selector, nth = 0) {
    const el = page.locator(selector).nth(nth);
    if ((await el.count()) === 0)
        return null;
    return el.boundingBox();
}
async function run(width, height, mobile, scroll = 0) {
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
    const bar = await box(page, ".pdtc-nav-inner");
    const logo = await box(page, ".pdtc-brand img");
    const link1 = await box(page, ".pdtc-nav-link", 0);
    const link2 = await box(page, ".pdtc-nav-link", 1);
    const gallery = await box(page, ".pdtc-gallery");
    const out = {
        headerHeight: bar ? Math.round(bar.height) : null,
        logoWidth: logo ? Math.round(logo.width) : null,
        logoLeft: logo ? Math.round(logo.x) : null,
        heroContentLeft: gallery ? Math.round(gallery.x) : null,
        logoToFirstNav: logo && link1 ? Math.round(link1.x - (logo.x + logo.width)) : null,
        navGap: link1 && link2 ? Math.round(link2.x - (link1.x + link1.width)) : null,
        logoCenterVsViewport: logo
            ? Math.round(logo.x + logo.width / 2 - width / 2)
            : null,
    };
    await browser.close();
    return out;
}
async function main() {
    console.log("desktop 1440       ", JSON.stringify(await run(1440, 900, false)));
    console.log("desktop 1440 scroll", JSON.stringify(await run(1440, 900, false, 300)));
    console.log("mobile 390         ", JSON.stringify(await run(390, 844, true)));
    console.log("mobile 430         ", JSON.stringify(await run(430, 932, true)));
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=measureHeaderShots.js.map
/** One-off probe: is there DOM evidence linking PDP images to feature text? */
import * as cheerio from "cheerio";
import { crawlWebsite, closeCrawlerBrowser } from "../services/crawler/websiteCrawler.js";
const URL = "https://tensfact.com/products/tensfact-automatische-voerbak-voor-kat-of-hond-met-hd-camera";
async function main() {
    const res = await crawlWebsite(URL, 30000);
    const $ = cheerio.load(res.html);
    const rows = [];
    $("img").each((_, el) => {
        const $el = $(el);
        const src = $el.attr("src") || $el.attr("data-src") || "";
        if (!/cdn\.shopify/.test(src))
            return;
        const file = src.split("/").pop()?.split("?")[0] ?? "";
        let ctx = "";
        let node = $el;
        for (let depth = 0; depth < 4; depth += 1) {
            const prev = node.prevAll("h1,h2,h3,h4,h5,p,strong,li,span").first().text();
            const clean = prev.replace(/\s+/g, " ").trim();
            if (clean.length > 10) {
                ctx = clean.slice(0, 140);
                break;
            }
            const parent = node.parent();
            if (!parent || parent.length === 0)
                break;
            node = parent;
        }
        rows.push(`${file}\n   alt: ${($el.attr("alt") || "").slice(0, 70)}\n   ctx: ${ctx}`);
    });
    console.log(rows.slice(0, 24).join("\n"));
    await closeCrawlerBrowser();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=probeImageContext.js.map
/**
 * Milestone 9.8.3 — completion pass for remaining high-ticket product families.
 */
import { runM982HighTicketPdpGapFirst } from "./runM982HighTicketPdpGapFirst.js";
import { closeCrawlerBrowser } from "../services/crawler/websiteCrawler.js";
const invokedDirectly = process.argv[1]?.includes("runM983HighTicketGapCompletion");
if (invokedDirectly) {
    runM982HighTicketPdpGapFirst({
        dryRun: process.argv.includes("--dry-run"),
        completionPass: true,
    })
        .then(async () => {
        await closeCrawlerBrowser();
        process.exit(0);
    })
        .catch(async (error) => {
        console.error(error);
        await closeCrawlerBrowser().catch(() => undefined);
        process.exit(1);
    });
}
//# sourceMappingURL=runM983HighTicketGapCompletion.js.map
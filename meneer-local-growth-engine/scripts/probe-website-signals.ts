/**
 * Deterministic website signal probe (M8.3 calibration tool).
 * Run: npx --yes tsx scripts/probe-website-signals.ts <url> [url...]
 */
import { analyzeWebsiteSignals } from "../src/services/acquisition-fit/websiteSignals";

const DEFAULT_URLS = [
  "https://www.pilates-studio-arnhem.nl/",
  "https://www.pitonyasa.com/",
  "https://www.houseofsomatics.nl/",
  "https://www.infinitumpilates.nl/",
  "https://www.pilatesbloom.nl/",
  "https://www.mindandbodyplan.nl/",
  "https://serchmaa.my.canva.site/coaching",
];

async function main() {
  const urls = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_URLS;
  for (const url of urls) {
    const report = await analyzeWebsiteSignals(url);
    console.log("\n=================================================");
    console.log(url);
    console.log("platform      ", report.platform ? `${report.platform.name} (${report.platform.era})` : "onbekend");
    console.log("quality       ", report.website_quality_score);
    console.log("opportunity   ", report.website_opportunity_score);
    console.log("modernity     ", report.modernity_score);
    console.log("booking opp   ", report.booking_opportunity_score);
    console.log("brand assets  ", report.brand_asset_usability_score);
    console.log("tech          ", JSON.stringify(report.technical));
    console.log("booking       ", JSON.stringify(report.booking));
    console.log("brand         ", JSON.stringify(report.brand));
    console.log("+", report.positives.join(" | "));
    console.log("-", report.negatives.join(" | "));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

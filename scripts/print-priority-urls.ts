import { getAllDienstSlugs } from "@/lib/diensten";
import { getAllSeoLandingSlugs } from "@/data/seo-landings/registry";
import { getKennisbankSlugs } from "@/lib/kennisbank";
import { getAllCaseSlugs } from "@/data/cases-detail";

const origin = "https://www.meneermarketing.nl";
const urls: string[] = [];
const add = (path: string) => {
  const u = path === "/" ? origin : `${origin}${path}`;
  if (!urls.includes(u)) urls.push(u);
};

[
  "/",
  "/diensten",
  "/strategie",
  "/bouwen",
  "/vindbaarheid",
  "/campagnes",
  "/behoud",
].forEach((p) => add(p));

getAllDienstSlugs().forEach((s) => add(`/diensten/${s}`));

[
  "/cases",
  "/over",
  "/contact",
  "/werkwijze",
  "/faq",
  "/zoeken",
  "/kennisbank",
  "/weetjes",
].forEach((p) => add(p));

getAllCaseSlugs().forEach((s) => add(`/cases/${s}`));

const cityPattern =
  /-(apeldoorn|amsterdam|rotterdam|utrecht|den-haag|eindhoven|tilburg|groningen|almere|breda|nijmegen|enschede|haarlem|arnhem|zaanstad|amersfoort|haarlemmermeer|s-hertogenbosch|zoetermeer|zwolle|leeuwarden|maastricht|leiden|dordrecht|ede|emmen|venlo|deventer|delft|alkmaar|helmond|hengelo|roosendaal|oss|schiedam|spijkenisse|purmerend|almelo|zaandam|lelystad|hilversum|amstelveen)$/;
const allSeo = getAllSeoLandingSlugs();
const nationalSeo = allSeo.filter((s) => !cityPattern.test(s));

const priorityNational = [
  "google-ads-bureau",
  "google-ads-beheer",
  "google-ads-specialist",
  "meta-ads-bureau",
  "seo-specialist",
  "hoger-in-google",
  "website-laten-maken",
  "website-laten-bouwen",
  "webshop-laten-maken",
  "shopify-expert",
  "shopify-webshop-laten-maken",
  "online-marketing-bureau",
  "marketing-bureau",
  "seo-bureau",
  "webdesign-bureau",
  "email-marketing",
  "e-mailmarketing-bureau",
  "website-specialist",
  "internetmarketing-bureau",
  "online-marketing-specialist",
  "website-ontwikkelaar",
  "social-media-marketing-bureau",
  "webdesign-specialist",
  "vindbaarheid-ai",
  "chatgpt-vindbaarheid",
  "lokale-seo",
  "google-shopping-ads",
  "shopify-seo",
  "landing-page-laten-maken",
  "conversie-optimalisatie",
  "cro-bureau",
  "marketing-automatisering",
  "klaviyo-specialist",
  "google-ads-uitbesteden",
  "seo-uitbesteden",
  "performance-marketing-bureau",
  "digital-marketing-bureau",
  "nextjs-website-laten-maken",
  "google-ads-of-seo",
  "meta-ads-of-google-ads",
  "shopify-of-woocommerce",
  "bureau-of-freelancer-marketing",
];

for (const s of priorityNational) {
  if (nationalSeo.includes(s)) add(`/zoeken/${s}`);
}
for (const s of nationalSeo) {
  if (urls.length >= 85) break;
  add(`/zoeken/${s}`);
}

const topCities = [
  "amsterdam",
  "rotterdam",
  "utrecht",
  "den-haag",
  "eindhoven",
  "apeldoorn",
];
const topKeywords = [
  "google-ads-bureau",
  "seo-specialist",
  "website-laten-maken",
  "marketing-bureau",
  "online-marketing-bureau",
  "shopify-expert",
  "hoger-in-google",
];

for (const city of topCities) {
  for (const kw of topKeywords) {
    const slug = `${kw}-${city}`;
    if (allSeo.includes(slug)) add(`/zoeken/${slug}`);
    if (urls.length >= 95) break;
  }
  if (urls.length >= 95) break;
}

for (const s of getKennisbankSlugs()) {
  if (urls.length >= 100) break;
  add(`/kennisbank/${s}`);
}

const list = urls.slice(0, 100);
console.log(`count: ${list.length} (built ${urls.length})`);
for (let i = 0; i < list.length; i += 10) {
  console.log(`\n--- Batch ${Math.floor(i / 10) + 1} ---`);
  list.slice(i, i + 10).forEach((u) => console.log(u));
}
